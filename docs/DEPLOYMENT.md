# Static deployment

The browser requires no Python server, database, API key or paid mapping token. It consumes the committed validated JSON export. Node 24 and pnpm 11.19.0 are the reference frontend runtime. Map tiles and fonts are external requests with graceful fallbacks; charts and data work without them after the local assets load.

## GitHub Pages (recommended after review)

1. Review and merge the final implementation PR yourself. The agent does not merge it.
2. In repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. The `Publish static analysis to GitHub Pages` workflow runs on `main`. If the first run preceded Pages setup, rerun it from Actions, or use **Run workflow** on `main`.
4. Read the URL from the workflow's deployment output. Expected project URL (not a claim of current availability): `https://thizisfranklin.github.io/Anfield-Stadium-Ticket-Value-Revenue/`.
5. Open the page, enter analysis, change season and fixture, select a stand, and verify the scenario slider.

Vite uses relative asset paths, so the GitHub project subpath is supported. There are no server routes to rewrite. The frontend export includes the full validated artifact; a deployment does not need to fetch the source PDFs.

## Vercel alternative

Import the GitHub repository, choose the implementation branch for a preview or main after merge. Root directory: `app`. Framework: Vite. Node: 24.x. Install: `pnpm install --frozen-lockfile`. Build: `pnpm build`. Output: `dist`. No environment variables. Authentication and project connection belong to the repository owner.

## Netlify alternative

Import the repository using the included `netlify.toml` (base `app`, publish `dist`, build `pnpm build`, Node 24). No functions or runtime database. Alternatively upload the contents of a locally built `app/dist` through the authenticated Netlify dashboard.

## Preview locally

```sh
cd app
pnpm install --frozen-lockfile
pnpm build
pnpm preview --port 4173
```

Open `http://127.0.0.1:4173`. Do not open `index.html` with `file://`; the data loader requires HTTP.

## Operational caveats

MapLibre is lazy loaded and its bundle is the largest dependency (~286 KB gzip in the verified build). Standard OSM tiles are suitable for a low-traffic portfolio, subject to their usage policy; choose a supported provider if traffic grows. The map is contextual, not required for analytical functions. The JSON export is versioned and schema validated before publication. No secrets should be added to Vite environment variables or committed files.
