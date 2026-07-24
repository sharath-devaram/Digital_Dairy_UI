# Digital Diary — Frontend

React + Vite. Talks to the FastAPI backend over plain fetch (see `src/api.js`).

## Local setup

```bash
cd frontend
npm install
cp .env.example .env      # point VITE_API_URL at your backend
npm run dev                # http://localhost:5173
```

Make sure the backend's `CORS_ORIGINS` in its `.env` includes whatever origin
this dev server (or your deployed frontend) runs on.

## Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # sanity-check the production build locally
```

`dist/` is plain static HTML/CSS/JS — serve it with nginx/Caddy, or any
static host. It is **not** a Node server, so it doesn't need Node in
production, only at build time.

## Structure

- `src/api.js` — all backend calls + JWT token storage (localStorage)
- `src/context/AuthContext.jsx` — admin login state
- `src/components/` — shared UI: layout, post cards, comments, image uploader,
  the garland divider (site's signature visual)
- `src/pages/` — one file per route:
  - `Home.jsx` — public feed
  - `PostDetail.jsx` — a single entry + comments
  - `Login.jsx` — admin login
  - `Dashboard.jsx` — admin: all posts including drafts
  - `PostEditor.jsx` — admin: create/edit/publish/delete a post, manage images
  - `Settings.jsx` — admin: change username/password

## Notes

- Written and tested with Telugu content throughout — fonts (`Anek Telugu`),
  date formatting (`te-IN` locale), and all UI copy assume Telugu is the
  primary language. Swap `lang="te"` in `index.html` and the UI strings if
  you want a different language.
- Defaults chosen for you: comments appear immediately (toggle
  visibility/delete anytime from the entry page while logged in), and
  entries are plain text with line breaks preserved (no markdown syntax).
