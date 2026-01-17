import type { FC, PropsWithChildren } from 'hono/jsx'

interface PageProps {
    title:string
    signals?:Record<string, unknown>
}

export const Page:FC<PropsWithChildren<PageProps>> = ({
    title,
    signals = {},
    children
}) => (
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title}</title>
            <link rel="stylesheet" href="/src/style.css" />
        </head>
        <body>
            <div id="root" data-signals={JSON.stringify(signals)}>
                {children}
            </div>

            <script
                type="module"
                src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.7/bundles/datastar.js"
            ></script>
            <script type="module" src="/src/client/index.ts"></script>
        </body>
    </html>
)
