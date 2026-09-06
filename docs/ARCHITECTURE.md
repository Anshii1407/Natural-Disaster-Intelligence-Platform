# System Architecture

## Overview
The **National Disaster Intelligence Platform** follows a decoupled micro-service / modular architecture separating client visualization, business logic & persistence, and analytical computation.

```
+-------------------------------------------------------------+
|                     Client (Browser)                        |
|   React.js + Tailwind CSS + Leaflet.js (GIS) + Chart.js     |
+------------------------------+------------------------------+
                               |
                               | REST / JSON
                               v
+-------------------------------------------------------------+
|                 Main Backend (Node.js/Express)              |
|   - Authentication (JWT, bcryptjs)                          |
|   - Citizen Ground Reports API                              |
|   - Disaster Event Management API                           |
|   - Government Action Dashboard API                         |
+---------------+-----------------------------+---------------+
                |                             |
                | Driver                      | Internal HTTP
                v                             v
+-------------------------------+   +-------------------------+
|     MongoDB Atlas (Cloud)     |   | AI Service (FastAPI)    |
|   - GeoJSON Geospatial Indexes|   | - Random Forest Model   |
|   - User & Report Collections |   | - Environmental Inputs  |
|   - Risk History Logs         |   | - Risk Category Output  |
+-------------------------------+   +-------------------------+
```

## Module Boundaries

1. **AI Disaster Risk Assessment Module:**
   - Evaluates multi-parameter environmental observations against historical trends using Random Forest classifier/regressor.
   - Operated independently via the FastAPI microservice to ensure compute-heavy ML tasks do not block the main Node.js I/O loop.

2. **Interactive Disaster Map Module (GIS):**
   - Leaflet.js with OpenStreetMap raster tiles.
   - GeoJSON layers depicting risk zones, reporting clusters, and affected regions.

3. **Citizen Reporting Module:**
   - Enables verified ground-truth field reporting.
   - Media storage backed by Cloudinary; report metadata stored in MongoDB Atlas with geospatial coordinates.

4. **Government Dashboard Module:**
   - Central authority management console.
   - Aggregated incident analytics, active alerts, report triage, and emergency response coordination.
