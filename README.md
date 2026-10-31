# Kalluri Portfolio

React portfolio built with Vite.

## Local development

Run `npm ci`, then `npm run dev`.

Run `npm run build` to generate the production site in `dist`.

Add a portrait at `public/photo.jpg` to replace the NK monogram.

## Theme and navigation

Use the header toggle or command palette to switch between dark and light.
The initial theme follows the system preference; manual choices are saved locally.
On smaller screens, the header menu button opens all six section links. Selecting
a link, tapping outside, or pressing Escape closes the menu.

## Vercel

Import this GitHub repository into Vercel and use these settings:

- Framework preset: **Vite**
- Root directory: repository root (`.`)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Vercel builds and publishes the site on each push. No GitHub Pages workflow
or custom Vercel configuration file is required.

## Contact form

The form posts to `https://formspree.io/f/mzeejekv` rather than opening the
visitor's email app. In Formspree, verify your email and ensure this form's
notification recipient is your intended inbox. Provider quotas and spam
filtering apply.

The form shows submission feedback and retains input on failure. A successful
submission confirms provider acceptance, not inbox delivery. After deployment,
send a real test message and check both Formspree submissions and your inbox
(including spam) to verify end-to-end delivery.
