import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/gallery?tag=${encodeURIComponent(galleryTag)}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => {
                setImages(data.images ?? []);
                setNextCursor(data.next_cursor ?? null);
            })
            .catch(() => setImages([]))
            .finally(() => setLoading(false));
    }, [galleryTag]);

    const loadMore = () => {
        if (!nextCursor || loadingMore) return;
        setLoadingMore(true);
        fetch(`/api/gallery?tag=${encodeURIComponent(galleryTag)}&next_cursor=${encodeURIComponent(nextCursor)}`)
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => {
                setImages((prev) => [...prev, ...(data.images ?? [])]);
                setNextCursor(data.next_cursor ?? null);
            })
            .catch(console.error)
            .finally(() => setLoadingMore(false));
    };

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

    const displayedImages = isExpanded ? images : images.slice(0, 20);

    return (
        <div className="w-full">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
                {displayedImages.map((img) => (
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

            <div className="flex justify-center mt-6 gap-4">
                {(!isExpanded && (nextCursor || images.length > 20)) || (isExpanded && nextCursor) ? (
                    <Button
                        onClick={() => {
                            if (!isExpanded) {
                                setIsExpanded(true);
                                if (images.length <= 20 && nextCursor) loadMore();
                            } else {
                                loadMore();
                            }
                        }}
                        disabled={loadingMore}
                        className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </Button>
                ) : null}

                {(isExpanded && images.length > 20) && (
                    <Button
                        onClick={() => setIsExpanded(false)}
                        className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all"
                    >
                        Show Less
                    </Button>
                )}
            </div>
        </div>
    );
}
