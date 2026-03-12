import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (not just VITE_-prefixed) so the dev middleware
  // can access CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), galleryDevPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})

// Replicates api/gallery.ts as a Vite dev-server middleware so
// `bun dev` works without needing `vercel dev`.
function galleryDevPlugin(env: Record<string, string>) {
  return {
    name: 'gallery-dev',
    configureServer(server: any) {
      server.middlewares.use('/api/gallery', async (req: any, res: any) => {
        const qs = (req.url ?? '').split('?')[1] ?? ''
        const tag = new URLSearchParams(qs).get('tag') ?? ''

        if (!/^[\w-]+$/.test(tag)) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid tag' }))
          return
        }

        const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME
        const apiKey = env.CLOUDINARY_API_KEY
        const apiSecret = env.CLOUDINARY_API_SECRET

        if (!cloudName || !apiKey || !apiSecret) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env' }))
          return
        }

        try {
          const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
          const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/tags/${encodeURIComponent(tag)}?max_results=500`
          const cldRes = await fetch(apiUrl, { headers: { Authorization: `Basic ${credentials}` } })
          if (!cldRes.ok) {
            const body = await cldRes.text()
            console.error(`[gallery-dev] Cloudinary error body:`, body)
            res.setHeader('Content-Type', 'application/json')
            // 404 = tag doesn't exist yet; return empty rather than error
            res.statusCode = cldRes.status === 404 ? 200 : 502
            res.end(JSON.stringify(cldRes.status === 404 ? { images: [] } : { error: body }))
            return
          }
          const data = await cldRes.json() as { resources?: Array<{ public_id: string; width: number; height: number }> }
          console.log(`[gallery-dev] resources returned: ${data.resources?.length ?? 0}`)
          const images = (data.resources ?? []).map(r => ({
            publicId: r.public_id,
            url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${r.public_id}`,
            thumbUrl: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_600/${r.public_id}`,
            width: r.width,
            height: r.height,
          }))
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ images }))
        } catch (err) {
          console.error('[gallery-dev] fetch error:', err)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Failed to fetch gallery' }))
        }
      })
    },
  }
}
