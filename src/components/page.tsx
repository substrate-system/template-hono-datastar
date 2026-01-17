import type { FC, PropsWithChildren } from 'hono/jsx'

interface PageProps {
    title:string
    signals?:Record<string, unknown>
    isDev?:boolean
}

export const Page:FC<PropsWithChildren<PageProps>> = ({
    title,
    signals = {},
    isDev = false,
    children
}) => {
    // In dev, Vite serves the source file directly
    // In production, use the built assets
    const cssPath = isDev ? '/src/client/index.ts' : '/client/assets/index.css'
    const jsPath = isDev ? '/src/client/index.ts' : '/client/assets/index.js'

    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                {!isDev && <link rel="stylesheet" href={cssPath} />}
            </head>
            <body>
                <div id="root" data-signals={JSON.stringify(signals)}>
                    {children}
                </div>

                <script
                    type="module"
                    src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.7/bundles/datastar.js"
                ></script>
                <script type="module" src={jsPath}></script>
            </body>
        </html>
    )
}
