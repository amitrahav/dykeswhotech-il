import type { VercelRequest, VercelResponse } from "@vercel/node";

// Only allow safe tag strings (letters, numbers, hyphens, underscores)
const SAFE_TAG_RE = /^[\w-]+$/;

interface CloudinaryResource {
    public_id: string;
    width: number;
    height: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { tag } = req.query;
    if (!tag || typeof tag !== "string" || !SAFE_TAG_RE.test(tag)) {
        return res.status(400).json({ error: "Invalid tag parameter" });
    }

    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Missing Cloudinary env vars");
        return res.status(500).json({ error: "Gallery not configured" });
    }

    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const cldRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_tag/${encodeURIComponent(tag)}?resource_type=image&max_results=500`,
        { headers: { Authorization: `Basic ${credentials}` } }
    );

    if (!cldRes.ok) {
        const body = await cldRes.text();
        console.error("Cloudinary Admin API error:", cldRes.status, body);
        // 404 = tag doesn't exist yet; return empty rather than error
        if (cldRes.status === 404) {
            res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
            return res.status(200).json({ images: [] });
        }
        return res.status(502).json({ error: "Failed to fetch gallery" });
    }

    const data = await cldRes.json() as { resources?: CloudinaryResource[] };

    const images = (data.resources ?? []).map((r) => ({
        publicId: r.public_id,
        // Full-res optimised URL for lightbox / download
        url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${r.public_id}`,
        // Thumbnail for the grid (600px wide, auto crop)
        thumbUrl: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_600/${r.public_id}`,
        width: r.width,
        height: r.height,
    }));

    // Served from Vercel edge cache for 1 h; stale-while-revalidate for 24 h.
    // Cloudinary's CDN caches the actual image delivery independently.
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ images });
}
