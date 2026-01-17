import type { FC, PropsWithChildren } from 'hono/jsx'

interface CardProps {
    title:string
    description?:string
}

export const Card:FC<PropsWithChildren<CardProps>> = ({
    title,
    description,
    children
}) => (
    <section class="card">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {children}
    </section>
)
