import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://product-gallery.cloudinary.com/all.js";

export function CloudinaryGallery({ galleryTag }: { galleryTag: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<any>(null);

    useEffect(() => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        let cancelled = false;

        const initGallery = () => {
            if (cancelled || !containerRef.current) return;
            if (typeof (window as any).cloudinary === "undefined") return;
            galleryRef.current = (window as any).cloudinary.galleryWidget({
                container: containerRef.current,
                cloudName,
                mediaAssets: [{ tag: galleryTag }],
            });
            galleryRef.current.render();
        };

        if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
            const s = document.createElement("script");
            s.src = SCRIPT_SRC;
            s.onload = initGallery;
            document.body.appendChild(s);
        } else {
            initGallery();
        }

        return () => {
            cancelled = true;
            galleryRef.current?.destroy();
            galleryRef.current = null;
        };
    }, [galleryTag]);

    return <div ref={containerRef} className="w-full" />;
}
