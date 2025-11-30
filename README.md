# Flowbit AOI Creator — Assignment Deliverable

This repository contains the complete AOI (Area of Interest) creation tool built using:

- React + TypeScript  
- Vite  
- Tailwind CSS  
- Leaflet + leaflet-draw  
- Playwright (E2E tests)

## 🚀 Quick Start
```bash
npm install
npm run dev
```

### 🧪 Run Tests
```bash
npx playwright test
```

## 📁 Documentation

- [docs/SETUP.md](docs/SETUP.md) — Setup instructions
- [docs/API_DOCS.md](docs/API_DOCS.md) — API documentation (future backend)
- [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md) — ER diagram (Mermaid)
- [docs/DEMO_INSTRUCTIONS.md](docs/DEMO_INSTRUCTIONS.md) — Instructions for 3–5 min demo video

## ⭐ Branches

- **main** — primary branch
- **deliverable** — final submission branch

## 🗺 Map Library Choice

**Chosen**: Leaflet + react-leaflet

**Reasons**:
- First-class WMS support
- Easiest integration for drawing tools
- Lightweight + reliable
- Perfect match for assignment

## ⚡ Architecture Decisions

- SPA layout using Header + Sidebar + MapView
- All map interaction + state handled inside Leaflet
- AOIs saved in browser localStorage
- Clean separation of concerns (components, utils, docs, tests)

## 📈 Performance for 1000s of polygons

- Recommend MapLibre + Vector Tiles for scale
- Enable clustering for huge datasets
- Use WebWorkers for heavy GeoJSON parsing
- Server-side geometry simplification (GDAL / Turf)
- Debounced map events & incremental loading

## 🧪 Testing Strategy

- Playwright E2E tests included
- Focus: map load, AOI draw, persistence
- With more time: component-level unit tests (RTL), more map interactions

## 🛠 Tradeoffs

- Chose Leaflet for speed + clarity
- No backend (as required), used localStorage
- Potential WMS CORS issues avoided for now

## 🚀 Production Enhancements (future)

- API backend for AOI storage
- Authentication + project management
- Sentry logging
- CI + Code Quality Gates
- Accessibility improvements
- Pre-render WMS tiles via proxy

## 🎥 Demo Video

Follow the demo instructions in [docs/DEMO_INSTRUCTIONS.md](docs/DEMO_INSTRUCTIONS.md)

## 📬 Submission

Send repo link + demo video to recruit@flowbitai.com.
