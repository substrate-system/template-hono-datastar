import { type FC } from 'hono/jsx'
import { Page } from './components/page.js'
import { TimestampCard } from './components/timestamp-card.js'
import { GreetingCard } from './components/greeting-card.js'
import { CounterCard } from './components/counter-card.js'

const signals = {
    count: 0,
    name: '',
    greeting: '',
    timestamp: ''
}

interface HomePageProps {
    isDev?:boolean
    assets?:{ css:string, js:string }
}

export const HomePage:FC<HomePageProps> = ({ isDev, assets }) => (
    <Page title="Datastar Demo" signals={signals} isDev={isDev} assets={assets}>
        <header class="hero">
            <h1>Datastar Demo</h1>
            <p class="subtitle">
                Server-rendered HTML with SSE updates
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
        </main>
    </Page>
)
