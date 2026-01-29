import { type FC } from 'hono/jsx'
import { Card } from './card'

export const CounterCard: FC = () => (
    <Card
        title="Server-Synced Counter"
        description="This counter syncs with the server on each click:"
    >
        <p>
            On each click, this sends a request to the server. The server
            updates its state, and returns the new value as a&nbsp;
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events">
                SSE
            </a>, by calling&nbsp;
            <code>ServerSentEventGenerator.stream</code>.
        </p>
        <p>
            Each click calls the Cloudflare backend, <code>
                https://template-hono-datastar.nichoth.workers.dev/api/counter/increment
            </code>.
        </p>

        <div class="counter-display" {...{ 'data-text': '$count' }}></div>
        <div class="counter-buttons">
            {/* Need to use spread syntax here b/c `:` is not allowed in JSX */}
            <button
                class="btn"
                {...{ 'data-on:click': "@post('/api/counter/decrement')" }}
            >&ndash;</button>
            <button
                class="btn"
                {...{ 'data-on:click': "@post('/api/counter/reset')" }}
            >
                Reset
            </button>
            <button
                class="btn"
                {...{ 'data-on:click': "@post('/api/counter/increment')" }}
            >
                +
            </button>
        </div>
    </Card>
)
