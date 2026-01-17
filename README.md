# template hono datastar

A template for [datastar apps](https://data-star.dev/).

There is no client-side JS here, except for the data-star library.
This uses [Hono](https://hono.dev/) to keep any application state
(it uses in-memory state only), and clicks result in a request to the server,
which sends back the updated data.

## Develop

Start a server at `localhost:8888`:

```sh
npm start
```

### Local Dev

Locally we are using [Vite](https://vite.dev/) as server. In the
[vite config](./vite.config.js) we use a plugin, `@cloudflare/vite-plugin`.
It integrates the cloudflare worker (the Hono app) with the vite server.
The `@cloudflare/vite-plugin` embeds a Cloudflare Worker runtime inside Vite's  
dev server. 

Vite gives us HMR and bundling. The Vite plugin runs the worker code, which
is why the worker server works locally.

Vite build to `public/`, but we do not use that folder during development.

In the worker file, it checks if we are in local dev or production.
In dev, `ASSETS` doesn't exist; it returns notFound() and Vite handles it.
In production, ASSETS does exist, so it serves the static asset.
