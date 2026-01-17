import { FC } from 'hono/jsx'

export const CounterCard: FC = () => (
    <section class="card">
        <h2>Server-Synced Counter</h2>
        <p>This counter syncs with the server on each click:</p>
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
    </section>
)
