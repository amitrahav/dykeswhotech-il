import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

const vertexShader = `
  varying vec2 vUv;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 newPosition = position;
    
    float dist = distance(newPosition.xy, uMouse);
    
    if (dist < uRadius) {
      // Magnetic effect: pull vertices towards mouse
      float force = pow(1.0 - dist / uRadius, 2.0) * uStrength;
      vec2 dir = normalize(uMouse - newPosition.xy);
      
      newPosition.xy += dir * force * uRadius;
      
      // Liquid mercury jiggle
      newPosition.z += sin(uTime * 5.0 + dist * 10.0) * force * (uRadius * 0.5);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTextTexture;
  
  void main() {
    vec4 color = texture2D(uTextTexture, vUv);
    if (color.a < 0.5) discard;
    gl_FragColor = vec4(0.22, 0.22, 0.22, 1.0); // #383838
  }
`;

const LiquidPlane = ({ texture, width, height }: { texture: THREE.Texture, width: number, height: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Smooth transition springs
    const springX = useSpring(0, { stiffness: 120, damping: 15 });
    const springY = useSpring(0, { stiffness: 120, damping: 15 });
    const strengthSpring = useSpring(0, { stiffness: 100, damping: 20 });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uRadius: { value: height * 0.6 }, // Slightly smaller radius for better control
        uStrength: { value: 0 },
        uTextTexture: { value: texture },
    }), [texture, height]);

    useFrame((state) => {
        if (!meshRef.current) return;

        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uTime.value = state.clock.getElapsedTime();

        // Fade strength based on hover state
        strengthSpring.set(isHovered ? 0.4 : 0);
        material.uniforms.uStrength.value = strengthSpring.get();

        if (isHovered) {
            // Map mouse from (-1, 1) to mesh space (width x height)
            const targetX = (state.mouse.x * width) / 2;
            const targetY = (state.mouse.y * height) / 2;

            springX.set(targetX);
            springY.set(targetY);
        }

        material.uniforms.uMouse.value.set(springX.get(), springY.get());
    });

    return (
        <mesh
            ref={meshRef}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <planeGeometry args={[width, height, 256, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export const LiquidText = ({ height }: { height: number }) => {
    const { content } = useContent();
    const { hero } = content.home;
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [fontLoaded, setFontLoaded] = useState(false);
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Ensure font is loaded before drawing to canvas
        document.fonts.load('400 115px "Tel Aviv"').then(() => {
            setFontLoaded(true);
        }).catch(() => {
            // Fallback if loading fails
            setFontLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (!fontLoaded) return;

        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 3; // Increase DPR for extra sharpness
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, width, height);

            const text = hero.title;
            ctx.fillStyle = "#383838";

            // Match SVG layout: 3 rows with 10px gaps
            const totalGaps = 20; // two 10px gaps
            const lineHeight = (height - totalGaps) / 3;

            // In the SVG, fontSize: '115px' was used for a viewBox height of 100.
            // This means font size is ~1.15x the line height.
            const fontSize = lineHeight * 1.15;

            ctx.font = `400 ${fontSize}px "Tel Aviv"`;
            ctx.textAlign = "start";
            ctx.textBaseline = "middle";

            [0, 1, 2].forEach((i) => {
                const y = i * (lineHeight + 10) + lineHeight / 2;
                const targetWidth = width * 0.99;

                ctx.save();
                const metrics = ctx.measureText(text);
                const scaleX = targetWidth / metrics.width;

                // Translate to start position, scale, and draw
                ctx.translate(0, y);
                ctx.scale(scaleX, 1);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            });

            const tex = new THREE.CanvasTexture(canvas);
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = 16; // Add anisotropy for better quality at angles
            tex.needsUpdate = true;
            setTexture(tex);
        }
    }, [height, width, fontLoaded, hero.title]);

    if (!texture) return <div style={{ height: `${height}px` }} />;

    return (
        <div style={{ width: '100%', height: `${height}px`, overflow: 'hidden', pointerEvents: 'auto' }}>
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
                style={{ pointerEvents: 'auto' }}
            >
                <SceneWrapper key={`${width}-${height}`} texture={texture} height={height} width={width} />
            </Canvas>
        </div>
    );
};

const SceneWrapper = ({ texture, height, width }: { texture: THREE.Texture, height: number, width: number }) => {
    const { viewport } = useThree();
    // Adjust plane to fit viewport
    const aspect = width / height;
    return <LiquidPlane texture={texture} width={viewport.width} height={viewport.width / aspect} />;
};
