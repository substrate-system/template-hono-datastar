import { FC } from 'hono/jsx'
import { Card } from './card'

export const QuoteCard: FC = () => (
    <Card
        title="Random Quote"
        description="Fetch a random quote from the server:"
    >
        <button class="btn" {...{ 'data-on:click': "@post('/api/quote')" }}>
            Get Quote
        </button>
        <div class="quote-box" {...{ 'data-text': "$quote || '-'" }}></div>
    </Card>
)
