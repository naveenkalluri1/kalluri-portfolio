# Kalluri Portfolio

React portfolio built with Vite.

## Local development

Run `npm ci`, then `npm run dev`.

Run `npm run build` to generate the production site in `dist`.

Add a portrait at `public/photo.jpg` to replace the NK monogram.

## GitHub Pages

In repository **Settings > Pages > Build and deployment**, select
**GitHub Actions** as the source. Do not select **Deploy from a branch**:
the source HTML references JSX that must first be compiled by Vite.

Push to `main` or run **Deploy to GitHub Pages** from the Actions tab.
The workflow builds and deploys `dist`, including the resume and assets.

Site: https://naveenkalluri1.github.io/kalluri-portfolio/
