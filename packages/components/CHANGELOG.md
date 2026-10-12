# @lambdacurry/forms

## 0.23.0

### Minor Changes

- 478e597: Support React Router v8. `react-router` is now a peer dependency (`^7.0.0 || ^8.0.0`) instead of a bundled dependency, so the library resolves the router your application installs (keep the Vite `resolve.dedupe` / `ssr.noExternal` setup from the consumer guide so only one runtime instance is bundled), and the unused `react-router-dom` dependency/peer was dropped (that package no longer exists in React Router v8). React Router v8 requires Node 22.22 or newer.

## 0.22.7

### Patch Changes

- 034ad60: Fix phone input cursor positioning and text selection.

## 0.22.6

### Patch Changes

- 39156a7: Enable typing to open and search select dropdowns. When focused on a select trigger, typing any printable character will open the dropdown, focus the search input, and pre-populate the search with the typed character.
- 6921b25: Fix cursor positioning when focusing search input in select dropdowns. Prevents text selection when opening select dropdown via typing, allowing users to continue typing without overwriting the first character.
- 1860649: Fix circular dependency in DataTableFilter import by importing directly from component file instead of index.
- bca6619: Add uncontrolled mode to FormError component via a manual `message` prop.

## 0.22.2

### Patch Changes

- 8886fe6: Allow Select popover content alignment overrides through `contentProps` and document right-aligned usage.

## 0.14.2

### Patch Changes

- Updated remix-hook-form to v7.0.0 for React Router 7 compatibility
- Added example files demonstrating middleware usage

## 0.14.1

### Patch Changes

- 381cd02: Another attempt at a fix, this should do it

## 0.13.4

### Patch Changes
