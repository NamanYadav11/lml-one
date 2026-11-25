# LML One

Owner app prototype for LML Industrial Park, served at https://one.lmlrealty.com. It runs on sample data, and every change resets on reload.

Built with React and Vite, and deployed on Vercel. Every push to `main` deploys to production.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Code map

| File | What it holds |
|---|---|
| `src/App.jsx` | App shell: header, bottom nav, navigation stack, bottom sheet, toast |
| `src/views.jsx` | One component per screen (`V.home`, `V.bills`, `V.gate` …) |
| `src/sheets.jsx` | One component per bottom sheet (`SH.pay`, `SH.newPass` …) |
| `src/actions.js` | Everything a button does (`A.payAll`, `A.createPass` …) |
| `src/ui.jsx` | Shared pieces: `Row`, `Chips`, `Fld`, `Pill`, icons, charts |
| `src/state.js` | Sample data the app starts with |
| `src/data.js` | Reference data: modules and roles, services, vendors, Hindi strings |
| `src/paths.js` | SVG path data for icons, the logo and sub-brand lockups |
| `src/styles.css` | All styles, including light and dark themes |

State is one mutable object, `S`. Actions change it and the app re-renders. Screens read their form fields from `S.vf`, and sheets read theirs from `S.sf`.

## The wordmark rule

The name is always shown as the wordmark, never as typed text. JSX is compiled through `src/brand` (see `vite.config.js`), which swaps every "LML" in visible text for the logo SVG. Write "LML" as plain text and it renders as the logo.
