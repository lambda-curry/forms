---
"@lambdacurry/forms": minor
---

Publish one file per source module so subpath imports stay small. `ui/checkbox`, `ui/dialog` and `ui/tabs` no longer load the shared `filter-selector-<hash>.js` chunk with the data-table filter, calendar, `react-day-picker`, `date-fns` and `input-otp`; each now loads only its own Radix primitive and `cn`. The package also declares `"sideEffects": false` so barrel imports tree-shake, and every declared dependency is left external instead of being partially inlined (previously `cmdk`, several Radix packages and a copy of `react-dom` ended up in the bundle). Public exports and subpath imports are unchanged.
