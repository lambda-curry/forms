---
"@lambdacurry/forms": minor
---

Support React Router v8. `react-router` is now a peer dependency (`^7.0.0 || ^8.0.0`) instead of a bundled dependency, so the library resolves the router your application installs (keep the Vite `resolve.dedupe` / `ssr.noExternal` setup from the consumer guide so only one runtime instance is bundled), and the unused `react-router-dom` dependency/peer was dropped (that package no longer exists in React Router v8). React Router v8 requires Node 22.22 or newer.
