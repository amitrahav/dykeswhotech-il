import { useEffect, useState } from "react";

interface GalleryImage {
    publicId: string;
    url: string;
    thumbUrl: string;
    width: number;
    height: number;
}

export function CloudinaryGallery({ galleryTag }: { galleryTag: string }) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/gallery?tag=${encodeURIComponent(galleryTag)}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => setImages(data.images ?? []))
            .catch(() => setImages([]))
            .finally(() => setLoading(false));
    }, [galleryTag]);

    if (loading) {
        return (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="mb-3 break-inside-avoid bg-gray-200 animate-pulse rounded-lg"
                        style={{ height: `${160 + (i % 3) * 60}px` }}
                    />
                ))}
            </div>
        );
    }

    if (images.length === 0) return null;

    return (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
            {images.map((img) => (
                <a
                    key={img.publicId}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-3 break-inside-avoid block overflow-hidden rounded-lg"
                >
                    <img
                        src={img.thumbUrl}
                        alt=""
                        width={img.width}
                        height={img.height}
                        loading="lazy"
                        className="w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </a>
            ))}
        </div>
    );
}
