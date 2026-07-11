# OmniDrone — AI Drone Command Center (Starter)

This repository contains a starter Next.js project for the OmniDrone AI Drone Command Center UI.

Features included:

- Dark, futuristic premium theme with daffodil accent
- 3D drone visualization (three.js)
- Map (Mapbox) with drone marker
- Live camera placeholder
- Simulated telemetry and AI-detections
- PDF report generation (jsPDF)

Run locally

1. Install dependencies

   npm install

2. Provide a Mapbox token (optional for map):

   export NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

3. Run dev server

   npm run dev

Notes

- This is a starter scaffold. For production, integrate real telemetry (WebSocket/MQTT), live video (WebRTC/HLS), and a backend for auth & data storage.
- If you want a static HTML fallback, open `public/index.html`.
