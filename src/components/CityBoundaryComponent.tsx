import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { SearchResult } from '../utils/geocoding';

interface CityBoundaryProps {
  city: SearchResult | null;
  appliedCities?: SearchResult[];
}

export default function CityBoundary({ city, appliedCities = [] }: CityBoundaryProps) {
  const map = useMap();
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const appliedLayersRef = useRef<Map<number, L.GeoJSON>>(new Map());

  // Handle preview boundary (selected but not applied)
  useEffect(() => {
    if (!city) {
      if (boundaryLayerRef.current) {
        map.removeLayer(boundaryLayerRef.current);
        boundaryLayerRef.current = null;
      }
      return;
    }

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
    }

    if (city.geojson) {
      const boundaryLayer = L.geoJSON(city.geojson, {
        style: {
          color: '#C87941',
          weight: 3,
          opacity: 0.8,
          fillColor: '#C87941',
          fillOpacity: 0.1,
        },
      });

      boundaryLayer.addTo(map);
      boundaryLayerRef.current = boundaryLayer;

      const bounds = boundaryLayer.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      const lat = parseFloat(city.lat);
      const lon = parseFloat(city.lon);
      map.setView([lat, lon], 12);
    }

    return () => {
      if (boundaryLayerRef.current) {
        map.removeLayer(boundaryLayerRef.current);
      }
    };
  }, [city, map]);

  // Handle applied boundaries (persisted)
  useEffect(() => {
    const currentIds = new Set(appliedCities.map((c) => c.place_id));
    const existingIds = new Set(appliedLayersRef.current.keys());

    // Remove layers that are no longer in appliedCities
    existingIds.forEach((id) => {
      if (!currentIds.has(id)) {
        const layer = appliedLayersRef.current.get(id);
        if (layer) {
          map.removeLayer(layer);
          appliedLayersRef.current.delete(id);
        }
      }
    });

    // Add new layers for newly applied cities
    appliedCities.forEach((appliedCity) => {
      if (!existingIds.has(appliedCity.place_id) && appliedCity.geojson) {
        const layer = L.geoJSON(appliedCity.geojson, {
          style: {
            color: '#2563eb',
            weight: 2,
            opacity: 0.7,
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
          },
        });

        layer.addTo(map);
        appliedLayersRef.current.set(appliedCity.place_id, layer);
      }
    });

    return () => {
      appliedLayersRef.current.forEach((layer) => {
        map.removeLayer(layer);
      });
      appliedLayersRef.current.clear();
    };
  }, [appliedCities, map]);

  return null;
}
