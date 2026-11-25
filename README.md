# LML One

Owner app prototype for LML Industrial Park, served at https://one.lmlrealty.com.

The whole app is one static file, `index.html` (inline CSS and JS, Archivo from Google Fonts). No build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Hosting

GitHub Pages serves the `main` branch root. The `CNAME` file sets the custom domain; DNS needs a CNAME record `one` → `namanyadav11.github.io`.
