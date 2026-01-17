import { FC } from 'hono/jsx'
import { Page } from './components/page.js'
import { TimestampCard } from './components/timestamp-card.js'
import { GreetingCard } from './components/greeting-card.js'
import { CounterCard } from './components/counter-card.js'
import { QuoteCard } from './components/quote-card.js'

const signals = {
    count: 0,
    name: '',
    greeting: '',
    quote: '',
    timestamp: ''
}

interface HomePageProps {
    isDev?:boolean
}

export const HomePage:FC<HomePageProps> = ({ isDev }) => (
    <Page title="Datastar Demo" signals={signals} isDev={isDev}>
        <header class="hero">
            <h1>Datastar Demo</h1>
            <p class="subtitle">
                Server-rendered HTML with reactive SSE updates
            </p>
        </header>

        <p>
            This page demonstrates using the server for all state. There is no
            client side JS at all here (except the datastar library).
        </p>

        <main class="cards">
            <TimestampCard />
            <GreetingCard />
            <CounterCard />
            <QuoteCard />
        </main>
    </Page>
)
