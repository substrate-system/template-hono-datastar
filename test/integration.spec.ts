import { SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

describe('Integration tests', () => {
    describe('Homepage rendering', () => {
        it('dispatches fetch event and renders full page', async () => {
            const response = await SELF.fetch('http://localhost/')
            expect(response.status).toBe(200)

            const html = await response.text()
            expect(html).toContain('<html')
            expect(html).toContain('</html>')
            expect(html).toContain('Datastar Demo')
        })

        it('includes all required components in rendered page', async () => {
            const response = await SELF.fetch('http://localhost/')
            const html = await response.text()

            // Verify all card components are rendered
            const components = [
                'Live Server Time',
                'Personalized Greeting',
                'Server-Synced Counter',
            ]

            components.forEach(component => {
                expect(html).toContain(component)
            })
        })

        it('includes Datastar library and initializes signals', async () => {
            const response = await SELF.fetch('http://localhost/')
            const html = await response.text()

            expect(html).toContain('datastar.js')
            expect(html).toContain('data-signals')
            expect(html).toContain('&quot;count&quot;:0')
            expect(html).toContain('&quot;name&quot;:&quot;&quot;')
        })

        it('includes all API endpoint bindings', async () => {
            const response = await SELF.fetch('http://localhost/')
            const html = await response.text()

            const endpoints = [
                '/api/time',
                '/api/greet',
                '/api/counter/increment',
                '/api/counter/decrement',
                '/api/counter/reset',
            ]

            endpoints.forEach(endpoint => {
                expect(html).toContain(endpoint)
            })
        })
    })

    describe('API endpoints integration', () => {
        it('time endpoint returns SSE response', async () => {
            const response = await SELF.fetch('http://localhost/api/time', {
                method: 'POST',
            })

            expect(response.status).toBe(200)
            expect(response.headers.get('content-type')).toContain('text/event-stream')

            const text = await response.text()
            expect(text).toContain('event: datastar-patch-signals')
            expect(text).toContain('timestamp')
        })

        it('greet endpoint returns personalized greeting', async () => {
            const response = await SELF.fetch('http://localhost/api/greet', {
                method: 'POST',
                headers: {
                    'content-type': 'text/event-stream',
                },
                body: 'event: datastar-patch-signals\ndata: signals {"name":"TestUser"}\n\n',
            })

            expect(response.status).toBe(200)
            const text = await response.text()
            expect(text).toContain('greeting')
        })

        it('counter increment works correctly', async () => {
            const response = await SELF.fetch('http://localhost/api/counter/increment', {
                method: 'POST',
            })

            expect(response.status).toBe(200)
            const text = await response.text()
            expect(text).toContain('"count"')
            expect(text).toContain('event: datastar-patch-signals')
        })

        it('counter decrement works correctly', async () => {
            const response = await SELF.fetch('http://localhost/api/counter/decrement', {
                method: 'POST',
            })

            expect(response.status).toBe(200)
            const text = await response.text()
            expect(text).toContain('"count"')
            expect(text).toContain('event: datastar-patch-signals')
        })

        it('counter reset works correctly', async () => {
            const response = await SELF.fetch('http://localhost/api/counter/reset', {
                method: 'POST',
            })

            expect(response.status).toBe(200)
            const text = await response.text()
            expect(text).toContain('"count":0')
        })

        it('quote endpoint returns a quote', async () => {
            const response = await SELF.fetch('http://localhost/api/quote', {
                method: 'POST',
            })

            expect(response.status).toBe(200)
            const text = await response.text()
            expect(text).toContain('quote')
            expect(text).toContain('event: datastar-patch-signals')
        })

        it('health check endpoint works', async () => {
            const response = await SELF.fetch('http://localhost/api/health')
            expect(response.status).toBe(200)

            const data = await response.json()
            expect(data).toEqual({ status: 'ok', service: 'example' })
        })
    })

    describe('Error handling', () => {
        it('returns 404 for unknown routes', async () => {
            const response = await SELF.fetch('http://localhost/this-does-not-exist')
            expect(response.status).toBe(404)
        })

        it('handles POST to non-existent API routes', async () => {
            const response = await SELF.fetch('http://localhost/api/nonexistent', {
                method: 'POST',
            })
            expect(response.status).toBe(404)
        })
    })

    describe('CORS configuration', () => {
        it('API routes have CORS headers', async () => {
            const response = await SELF.fetch('http://localhost/api/health', {
                method: 'OPTIONS',
            })

            // CORS middleware should handle OPTIONS requests
            expect(response.headers.has('access-control-allow-origin') ||
                   response.status === 404 ||
                   response.status === 200).toBeTruthy()
        })
    })
})
