import { type FC } from 'hono/jsx'
import { Card } from './card'

export const GreetingCard: FC = () => (
    <Card
        title="Personalized Greeting"
        description="Enter your name and get a greeting from the server:"
    >
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
    </Card>
)
