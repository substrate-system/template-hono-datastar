import { FC } from 'hono/jsx'

export const QuoteCard: FC = () => (
    <section class="card">
        <h2>Random Quote</h2>
        <p>Fetch a random quote from the server:</p>
        <button class="btn" {...{ 'data-on:click': "@post('/api/quote')" }}>
            Get Quote
        </button>
        <div class="quote-box" {...{ 'data-text': "$quote || '-'" }}></div>
    </section>
)
