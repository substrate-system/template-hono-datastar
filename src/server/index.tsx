import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'
import { HomePage } from '../home-page.js'

type Bindings = {
    ASSETS:Fetcher
    NODE_ENV?:string
}

interface ViteManifest {
    'index.html'?:{
        file:string
        css?:string[]
    }
}

// Cache the manifest in memory
let cachedAssets: { css:string, js:string } | null = null

const app = new Hono<{ Bindings:Bindings }>()

app.use('/api/*', cors())

/**
 * Main page - server-rendered JSX
 */
app.get('/', async (c) => {
    // Use Vite's built-in dev detection
    if (import.meta.env.DEV) {
        return c.html(<HomePage isDev={true} />)
    }

    const assets = await getAssetPaths(c.env.ASSETS)
    return c.html(<HomePage assets={assets} />)
})

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

/**
 * Time endpoint - returns the current server time
 */
app.post('/api/time', () => {
    return ServerSentEventGenerator.stream(async (sse) => {
        const now = new Date()
        const timestamp = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        })
        sse.patchSignals(JSON.stringify({ timestamp }))
    })
})

/**
 * Greeting endpoint - returns a personalized greeting
 */
app.post('/api/greet', async (c) => {
    const result = await ServerSentEventGenerator.readSignals(c.req.raw)
    const name = (result.success && result.signals.name) ?
        String(result.signals.name) :
        'stranger'
    return ServerSentEventGenerator.stream(async (sse) => {
        const greetings = [
            `Hello, ${name}!`,
            `Welcome, ${name}!`,
            `Greetings, ${name}!`,
            `Hey there, ${name}!`,
            `Nice to meet you, ${name}!`
        ]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        sse.patchSignals(JSON.stringify({ greeting }))
    })
})

/**
 * Counter endpoints - separate routes for each action
 */
app.post('/api/counter/increment', async (c) => {
    const result = await ServerSentEventGenerator.readSignals(c.req.raw)
    const current = result.success ? Number(result.signals.count) || 0 : 0
    return ServerSentEventGenerator.stream(async (sse) => {
        sse.patchSignals(JSON.stringify({ count: current + 1 }))
    })
})

app.post('/api/counter/decrement', async (c) => {
    const result = await ServerSentEventGenerator.readSignals(c.req.raw)
    const current = result.success ? Number(result.signals.count) || 0 : 0
    return ServerSentEventGenerator.stream(async (sse) => {
        sse.patchSignals(JSON.stringify({ count: current - 1 }))
    })
})

app.post('/api/counter/reset', () => {
    return ServerSentEventGenerator.stream(async (sse) => {
        sse.patchSignals(JSON.stringify({ count: 0 }))
    })
})

/**
 * Quote endpoint - returns a random quote
 */
app.post('/api/quote', () => {
    const quotes = [
        '"The best way to predict the future is to invent it." — Alan Kay',
        '"Simplicity is the ultimate sophistication." — Leonardo da Vinci',
        '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
        '"The only way to do great work is to love what you do." — Steve Jobs',
        '"Talk is cheap. Show me the code." — Linus Torvalds'
    ]

    return ServerSentEventGenerator.stream(async (sse) => {
        const quote = quotes[Math.floor(Math.random() * quotes.length)]
        sse.patchSignals(JSON.stringify({ quote }))
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

async function getAssetPaths (assets:Fetcher):Promise<{ css:string, js:string }> {
    if (cachedAssets) return cachedAssets

    try {
        const manifestUrl = new URL('/client/.vite/manifest.json', 'https://dummy')
        const res = await assets.fetch(manifestUrl.pathname)
        if (res.ok) {
            const manifest = await res.json() as ViteManifest
            const entry = manifest['index.html']
            if (entry) {
                cachedAssets = {
                    js: `/client/${entry.file}`,
                    css: entry.css?.[0] ? `/client/${entry.css[0]}` : ''
                }
                return cachedAssets
            }
        }
    } catch {
        // Fall back to non-hashed paths
    }

    return { css: '/client/assets/index.css', js: '/client/assets/index.js' }
}
