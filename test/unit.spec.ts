import {
    env,
    createExecutionContext,
    waitOnExecutionContext,
} from 'cloudflare:test'
import { describe, it, expect } from 'vitest'
import worker from '../src/server/index.js'

describe('Datastar worker', () => {
    describe('Homepage', () => {
        it('renders the homepage with all components', async () => {
            // The hostname in those URLs is just a placeholder to
            // construct a valid Request object.
            // The Hono router only cares about the pathname (like /api/health),
            // not the hostname.
            const request = new Request('http://example.com/')
            const ctx = createExecutionContext()
            const response = await worker.fetch(request, env, ctx)
            await waitOnExecutionContext(ctx)

            expect(response.status).toBe(200)
            const html = await response.text()

            // Check for main structure
            expect(html).toContain('<html lang="en">')
            expect(html).toContain('Datastar Demo')
            expect(html).toContain('data-signals')

            // Check for all card components
            expect(html).toContain('Live Server Time')
            expect(html).toContain('Personalized Greeting')
            expect(html).toContain('Server-Synced Counter')

            // Check for Datastar script
            expect(html).toContain('datastar.js')
        })

        it('initializes signals correctly', async () => {
            const request = new Request('http://example.com/')
            const ctx = createExecutionContext()
            const response = await worker.fetch(request, env, ctx)
            await waitOnExecutionContext(ctx)

            const html = await response.text()
            const signalsMatch = html.match(/data-signals="([^"]+)"/)
            expect(signalsMatch).toBeTruthy()

            if (signalsMatch) {
                const signalsStr = signalsMatch[1].replace(/&quot;/g, '"')
                const signals = JSON.parse(signalsStr)
                expect(signals).toHaveProperty('count', 0)
                expect(signals).toHaveProperty('name', '')
                expect(signals).toHaveProperty('greeting', '')
                expect(signals).toHaveProperty('timestamp', '')
            }
        })
    })

    describe('API Endpoints', () => {
        it('returns 404 for unknown routes', async () => {
            const request = new Request('http://example.com/404')
            const ctx = createExecutionContext()
            const response = await worker.fetch(request, env, ctx)
            await waitOnExecutionContext(ctx)

            expect(response.status).toBe(404)
        })

        it('health check returns ok', async () => {
            const request = new Request('http://example.com/api/health')
            const ctx = createExecutionContext()
            const response = await worker.fetch(request, env, ctx)
            await waitOnExecutionContext(ctx)

            expect(response.status).toBe(200)
            const data = await response.json()
            expect(data).toEqual({ status: 'ok', service: 'example' })
        })

        describe('POST /api/time', () => {
            it('returns timestamp via SSE', async () => {
                const request = new Request('http://example.com/api/time', {
                    method: 'POST',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                expect(response.headers.get('content-type')).toContain('text/event-stream')

                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('timestamp')
            })
        })

        describe('POST /api/greet', () => {
            it('returns greeting via SSE', async () => {
                const request = new Request('http://example.com/api/greet', {
                    method: 'POST',
                    headers: {
                        'content-type': 'text/event-stream',
                    },
                    body: 'event: datastar-patch-signals\ndata: signals {"name":"Alice"}\n\n',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('greeting')
            })
        })

        describe('Counter endpoints', () => {
            it('POST /api/counter/increment returns incremented count', async () => {
                const request = new Request('http://example.com/api/counter/increment', {
                    method: 'POST',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('"count"')
            })

            it('POST /api/counter/decrement returns decremented count', async () => {
                const request = new Request('http://example.com/api/counter/decrement', {
                    method: 'POST',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('"count"')
            })

            it('POST /api/counter/reset sets count to 0', async () => {
                const request = new Request('http://example.com/api/counter/reset', {
                    method: 'POST',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('"count":0')
            })
        })

        describe('POST /api/quote', () => {
            it('returns random quote via SSE', async () => {
                const request = new Request('http://example.com/api/quote', {
                    method: 'POST',
                })
                const ctx = createExecutionContext()
                const response = await worker.fetch(request, env, ctx)
                await waitOnExecutionContext(ctx)

                expect(response.status).toBe(200)
                const text = await response.text()
                expect(text).toContain('event: datastar-patch-signals')
                expect(text).toContain('quote')
            })
        })
    })
})
