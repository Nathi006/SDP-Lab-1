# Third-party code

Libraries and packages installed for this project, and why each was chosen.

## Runtime dependencies

| Package | Why it was chosen |
|---|---|
| [`next`](https://www.npmjs.com/package/next) | The framework the brief specifies. Provides the app router, API routes (used for all `/api/*` endpoints), and the dev/build/start toolchain. |
| [`react`](https://www.npmjs.com/package/react) / [`react-dom`](https://www.npmjs.com/package/react-dom) | Required peer dependencies of Next.js; used to build the task list, form, and sort controls as components. |
| [`better-sqlite3`](https://www.npmjs.com/package/better-sqlite3) | The brief specifies SQLite. This package was chosen over alternatives (e.g. `sqlite3`) because it's synchronous — no callback/promise wrapping — which keeps the data-access code in `lib/tasks.ts` simple and makes it trivial to point tests at a throwaway database file per test. |

## Development dependencies

| Package | Why it was chosen |
|---|---|
| [`typescript`](https://www.npmjs.com/package/typescript) | Static typing across the schema, API routes, and components, so a task's shape (`Status`, `Task`, `Topic`) is checked at compile time rather than discovered at runtime. |
| [`tailwindcss`](https://www.npmjs.com/package/tailwindcss) / `postcss` / `autoprefixer` | Utility-first styling used to implement the WhatsApp-inspired, neubrutalist theme (thick borders, hard offset shadows, flat colour chips) directly in component markup, without hand-writing a separate stylesheet per component. |
| [`vitest`](https://www.npmjs.com/package/vitest) | Test runner for `lib/tasks.ts`. Chosen over Jest because it needs no extra config to run TypeScript/ESM directly, and starts fast enough to run as a single documented command. |
| `@types/*` (`node`, `react`, `react-dom`, `better-sqlite3`) | Type definitions for the above packages, required for TypeScript to check code that calls into them. |

No other runtime libraries (UI kits, state managers, date libraries, etc.) were added — the task list, sorting, and form state are small enough to manage with plain React state and the Fetch API.
