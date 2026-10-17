import React from 'react';
import { Map, Layers, Navigation, Compass } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';

export default function DisasterMapPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-electric font-semibold uppercase tracking-wider">
              Module 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-cool-white flex items-center gap-2.5">
            <Map className="w-7 h-7 text-electric shrink-0" aria-hidden="true" />
            Interactive Disaster Map
          </h1>
          <p className="text-sm text-cool-muted mt-1 max-w-3xl leading-relaxed">
            Geospatial intelligence module for visualizing regional vulnerability zones, verified
            citizen observations, and environmental risk overlays using OpenStreetMap and GeoJSON.
          </p>
        </div>
      </div>

      {/* Planned GIS Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <Layers className="w-4 h-4 text-electric" />
            <span>GeoJSON Risk Overlays</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Polygons depicting regional flood inundation basins and elevated urban heat islands.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <Navigation className="w-4 h-4 text-teal-400" />
            <span>Field Observation Pins</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Geospatial markers indicating verified citizen hazard reports with coordinate clustering.
          </p>
        </div>

        <div className="bg-navy-surface border border-navy-border rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cool-white text-sm font-semibold">
            <Compass className="w-4 h-4 text-amber-accent" />
            <span>OpenStreetMap Tiles</span>
          </div>
          <p className="text-xs text-cool-muted leading-relaxed">
            Raster tile basemaps with responsive zoom, panning, and coordinate-bounds bounding.
          </p>
        </div>
      </div>

      {/* Strict Empty State */}
      <EmptyState
        icon={Map}
        title="GIS Map Engine Unmounted (Phase 1)"
        description="The interactive Leaflet mapping container and geospatial tile servers have not been initialized yet. Spatial coordinates and hazard polygons will be loaded once GIS packages and backend layers are integrated."
        badgeText="No Synthetic Markers"
        badgeVariant="offline"
        details={[
          'Data Integrity: No fake pins, dummy disaster coordinates, or artificial clusters are shown.',
          'Planned Library: Leaflet.js integration via modular React wrapper.',
          'Tile Source: OpenStreetMap raster tiles with GeoJSON boundary layer parsing.',
        ]}
      />
    </div>
  );
}
