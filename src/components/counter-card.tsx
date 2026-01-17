import { FC } from 'hono/jsx'
import { Card } from './card'

export const CounterCard: FC = () => (
    <Card
        title="Server-Synced Counter"
        description="This counter syncs with the server on each click:"
    >
        <div class="counter-display" {...{ 'data-text': '$count' }}></div>
        <div class="counter-buttons">
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
