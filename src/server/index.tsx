import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web'
import { HomePage } from '../home-page.js'

type Bindings = {
    ASSETS:Fetcher
}

const app = new Hono<{ Bindings:Bindings }>()

app.use('/api/*', cors())

/**
 * Main page - server-rendered JSX
 */
app.get('/', (c) => {
    return c.html(<HomePage />)
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
