# Dance DB

A personal database for documenting and reviewing dance moves across Bachata, Salsa Cubana, and Rueda de Casino.

## What it does

- Catalog dance moves with detailed technical breakdowns (steps, preparation, lead mechanics, intention)
- Color-coded tags for categorization and filtering
- Video links (YouTube embeds, Google Drive, external URLs)
- Personal notes area per move
- AI-powered technique tips via Google Gemini
- JSON export/import for backups
- Works offline as a PWA

## Setup

The app runs entirely in the browser with no backend. Data is stored in `localStorage`.

### Local development

ES modules require an HTTP server (won't work with `file://`):

```bash
# Any of these work:
python3 -m http.server 8000
npx serve .
```

Then open `http://localhost:8000`.

### Deploy to GitHub Pages

1. Push to `main`
2. Go to repo Settings > Pages > Source: "Deploy from a branch" > Branch: `main`, folder: `/ (root)`
3. The app will be live at `https://<username>.github.io/dance-database/`

### Use on phone

1. Open the GitHub Pages URL on your phone
2. Add to Home Screen (Share > Add to Home Screen on iOS, or the browser prompt on Android)
3. The app works offline after the first load

Data lives in each device's `localStorage` independently. Use the Export/Import buttons to transfer data between devices.

## Tech stack

- Vanilla JavaScript (ES modules, no build step)
- Tailwind CSS (CDN)
- Lucide Icons (CDN)
- Marked.js for AI response rendering
- Service Worker for offline caching
