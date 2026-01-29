import { type FC } from 'hono/jsx'
import { Card } from './card'

export const TimestampCard: FC = () => (
    <Card
        title="Live Server Time"
        description="Click to fetch the current server timestamp via SSE"
    >
        <button class="btn" {...{ 'data-on:click': "@post('/api/time')" }}>
            Get Server Time
        </button>
        <div class="timestamp" {...{ 'data-text': "$timestamp || '-'" }}></div>
    </Card>
)
