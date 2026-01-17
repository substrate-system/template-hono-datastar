import { FC } from 'hono/jsx'

export const GreetingCard: FC = () => (
    <section class="card">
        <h2>Personalized Greeting</h2>
        <p>Enter your name and get a greeting from the server:</p>
        <form>
            <input type="text" placeholder="Your name" {...{ 'data-bind:name': '' }} />
            <button
                class="btn"
                type="button"
                {...{ 'data-on:click': "@post('/api/greet')" }}
            >
                Say Hello
            </button>
        </form>
        <div class="greeting" {...{ 'data-text': "$greeting || '-'" }}></div>
    </section>
)
