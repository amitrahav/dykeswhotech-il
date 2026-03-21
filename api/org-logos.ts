import type { VercelRequest, VercelResponse } from "@vercel/node";

interface CloudinaryResource {
    public_id: string;
    width: number;
    height: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { ids } = req.query;
    if (!ids || typeof ids !== "string") {
        return res.status(400).json({ error: "Invalid ids parameter" });
    }

    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Missing Cloudinary env vars");
        return res.status(500).json({ error: "Cloudinary not configured" });
    }

    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    
    // Split IDs just in case they are comma-separated
    const publicIds = ids.split(",").filter(Boolean);
    
    if (publicIds.length === 0) {
        return res.status(200).json({ logos: [] });
    }

    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids=${encodeURIComponent(publicIds.join(','))}`;

    const cldRes = await fetch(apiUrl, { headers: { Authorization: `Basic ${credentials}` } });

    if (!cldRes.ok) {
        const body = await cldRes.text();
        console.error("Cloudinary Admin API error:", cldRes.status, body);
        return res.status(502).json({ error: "Failed to fetch logos" });
    }

    const data = await cldRes.json() as { resources?: CloudinaryResource[] };

    const logos = (data.resources ?? []).map((r) => ({
        publicId: r.public_id,
        url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${r.public_id}`,
        width: r.width,
        height: r.height,
    }));

    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ logos });
}
