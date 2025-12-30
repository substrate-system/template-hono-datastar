import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'

type Bindings = {
    ASSETS:Fetcher
}

const app = new Hono<{ Bindings:Bindings }>()

app.use('/api/*', cors())

/**
 * Health check
 */
app.get('/api/health', (c) => {
    return c.json({ status: 'ok', service: 'example' })
})

/**
 * Hello World endpoint - returns SSE response for Datastar
 * This demonstrates returning signal updates via SSE
 */
app.get('/api/helloworld', () => {
    return ServerSentEventGenerator.stream(async (sse) => {
        // Send a signal update to set the apiMessage
        const message = JSON.stringify({ message: 'Hello, World!' }, null, 2)
        sse.patchSignals(JSON.stringify({ apiMessage: message }))
    })
})

app.get('/health', c => {
    return c.json({ status: 'ok' })
})

/**
 * Serve static assets (frontend)
 */
app.all('*', (c) => {
    if (!(c.env?.ASSETS)) {
        // In dev mode, let Vite handle static assets
        return c.notFound()
    }

    return c.env.ASSETS.fetch(c.req.raw)
})

export default app
