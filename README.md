# Kalluri Portfolio

React portfolio built with Vite.

## Local development

Run `npm ci`, then `npm run dev`.

Run `npm run build` to generate the production site in `dist`.

Add a portrait at `public/photo.jpg` to replace the NK monogram.

## Theme and audio

Use the header toggle or command palette to switch between dark and light.
The initial theme follows the system preference; manual choices are saved locally.
On smaller screens, the header menu button opens all six section links. Selecting
a link, tapping outside, or pressing Escape closes the menu.

The bottom-right speaker button plays an original, gentle major-key piano-style
sequence generated with Web Audio. Visitors must press it to enable sound (no
autoplay). Press it again to pause; a volume slider appears during playback.
No audio file, download, or external music service is needed.

## Vercel

Import this GitHub repository into Vercel and use these settings:

- Framework preset: **Vite**
- Root directory: repository root (`.`)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Vercel builds and publishes the site on each push. No GitHub Pages workflow
or custom Vercel configuration file is required.
