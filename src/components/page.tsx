import { FC } from 'hono/jsx'
import { TimestampCard } from './timestamp-card'
import { GreetingCard } from './greeting-card'
import { CounterCard } from './counter-card'
import { QuoteCard } from './quote-card'

const signals = {
    count: 0,
    name: '',
    greeting: '',
    quote: '',
    timestamp: ''
}

export const Page: FC = () => (
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Datastar Demo</title>
            <link rel="stylesheet" href="/src/client/style.css" />
        </head>
        <body>
            <div id="root" data-signals={JSON.stringify(signals)}>
                <header class="hero">
                    <h1>Datastar Demo</h1>
                    <p class="subtitle">Server-rendered HTML with reactive SSE updates</p>
                </header>

                <main class="cards">
                    <TimestampCard />
                    <GreetingCard />
                    <CounterCard />
                    <QuoteCard />
                </main>
            </div>

            <script
                type="module"
                src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.7/bundles/datastar.js"
            ></script>
            <script type="module" src="/src/client/index.ts"></script>
        </body>
    </html>
)
