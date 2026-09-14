---
"@lambdacurry/forms": minor
---

Support React Router v8. `react-router` is now a peer dependency (`^7.0.0 || ^8.0.0`) instead of a bundled dependency, so consumers always share a single router instance with the library, and the unused `react-router-dom` dependency/peer was dropped (that package no longer exists in React Router v8).
