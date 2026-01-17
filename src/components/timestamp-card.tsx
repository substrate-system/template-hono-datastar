import { FC } from 'hono/jsx'

export const TimestampCard: FC = () => (
    <section class="card">
        <h2>Live Server Time</h2>
        <p>Click to fetch the current server timestamp via SSE</p>
        <button class="btn" {...{ 'data-on:click': "@post('/api/time')" }}>
            Get Server Time
        </button>
        <div class="timestamp" {...{ 'data-text': "$timestamp || '-'" }}></div>
    </section>
)
