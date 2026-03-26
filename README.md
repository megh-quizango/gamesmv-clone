# GamesMV Clone

A complete clone of [gamesmv.com](https://gamesmv.com/) built with React + Vite.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Wouter** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **TanStack React Query** - Data management

## Pages

- **Home** - Game grid with hero banner, hot games, and sidebars
- **Game Detail** (`/game/:slug`) - Full game info with screenshots, review, download links
- **Platform Pages** (`/android`, `/ios`, `/pc`) - Filtered game listings
- **Category Page** (`/category/:category`) - Games by category
- **Search** (`/search?q=query`) - Search results

## Running Locally

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Steps

1. Extract the archive and navigate to the folder:
   ```bash
   tar -xzf gamesmv-clone.tar.gz
   cd artifacts/gamesmv-clone
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or: npm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   # or: npm run dev
   ```

4. Open in browser: `http://localhost:5173`

### Build for Production

```bash
pnpm build
pnpm preview
```
