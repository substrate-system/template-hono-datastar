// components/Button.tsx
import { type FC } from 'hono/jsx'

export const Button:FC<{
    id:string;
    label:string;
    endpoint?:string
}> = ({ id, label, endpoint }) => (
    <button
        id={id}
        class="btn"
        data-on-click={endpoint ? `@post('/api/action/${endpoint}')` : null}
    >
        {label}
    </button>
)
