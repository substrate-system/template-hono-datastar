// components/Button.tsx
import { FC } from 'hono/jsx'

export const Button:FC<{ id:string; label:string }> = ({ id, label }) => (
    <button
        id={id}
        class="btn"
        data-on-click={`@post('/api/action/${id}')`}
    >
        {label}
    </button>
)
