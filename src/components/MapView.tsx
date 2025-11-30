import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { loadSavedFeatures, saveFeatures } from '../utils/storage';
import CityBoundary from './CityBoundaryComponent';
import DrawingToolbar from './DrawingToolbar';
import ConfirmAreasButton from './ConfirmAreasButton';
import CustomMapControls from './CustomMapControls';
import { SearchResult } from '../utils/geocoding';

const WMS_URL = 'https://www.wms.nrw.de/geobasis/wms_nw_dop';

interface MapViewProps {
    selectedCity?: SearchResult | null;
    appliedCities?: SearchResult[];
    onConfirmAreas?: () => void;
}

function DrawControls() {
    const map = useMap();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawnLayerRef = useRef<L.FeatureGroup<any> | null>(null);

    useEffect(() => {
        if (!drawnLayerRef.current) {
            drawnLayerRef.current = new L.FeatureGroup();
            map.addLayer(drawnLayerRef.current);
        }
        const drawnItems = drawnLayerRef.current!;

        const saved = loadSavedFeatures();
        if (saved.length) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                saved.forEach((geojson: any) => {
                    const layer = L.geoJSON(geojson);
                    layer.eachLayer((l) => drawnItems.addLayer(l));
                });
            } catch (e) {
                console.warn('Failed to load saved geojson', e);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawControl = new (L as any).Control.Draw({
            edit: {
                featureGroup: drawnItems,
                remove: true,
            },
            draw: {
                circle: false,
                marker: true,
                polygon: true,
                polyline: true,
                rectangle: true,
            },
        });

        map.addControl(drawControl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).leafletDrawControl = drawControl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__REACT_LEAFLET_DRAWN_ITEMS__ = drawnItems;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const onCreated = (e: any) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            persist();
        };

        const onEdited = () => persist();
        const onDeleted = () => persist();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on((L as any).Draw.Event.CREATED, onCreated);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on((L as any).Draw.Event.EDITED, onEdited);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.on((L as any).Draw.Event.DELETED, onDeleted);

        function persist() {
            const data: any[] = [];
            drawnItems.eachLayer((layer) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const geojson = (layer as any).toGeoJSON();
                    data.push(geojson);
                } catch (err) {
                    console.warn('toGeoJSON failed', err);
                }
            });
            saveFeatures(data);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__REACT_LEAFLET_MAP__ = map;

        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.off((L as any).Draw.Event.CREATED, onCreated);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.off((L as any).Draw.Event.EDITED, onEdited);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.off((L as any).Draw.Event.DELETED, onDeleted);
            map.removeControl(drawControl);
        };
    }, [map]);

    return null;
}

export default function MapView({ selectedCity, appliedCities = [], onConfirmAreas }: MapViewProps = {}) {
    const center: [number, number] = [51.1657, 10.4515];
    const [showBaseImage, setShowBaseImage] = useState(true); // Default to satellite view

    return (
        <MapContainer
            center={center}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {showBaseImage && (
                <WMSTileLayer
                    url={WMS_URL}
                    params={{ layers: 'nw_dop_2018', format: 'image/png', transparent: false }}
                    attribution="NRW DOP"
                    opacity={1}
                    zIndex={1000}
                />
            )}

            <DrawControls />
            <CityBoundary city={selectedCity || null} appliedCities={appliedCities} />
            <CustomMapControls />
            <DrawingToolbar />
            <ConfirmAreasButton onConfirm={onConfirmAreas} />

            {/* Map View Toggle */}
            <div className="absolute bottom-24 right-6 z-[1000] bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex">
                    <button
                        onClick={() => setShowBaseImage(true)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${showBaseImage
                            ? 'bg-[#C87941] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Base Image
                    </button>
                    <button
                        onClick={() => setShowBaseImage(false)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${!showBaseImage
                            ? 'bg-[#C87941] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Map View
                    </button>
                </div>
            </div>

            <ScaleControl position="bottomright" />

            {showBaseImage && (
                <div
                    className="leaflet-bottom leaflet-right"
                    style={{ marginBottom: '2px', marginRight: '100px', pointerEvents: 'none' }}
                >
                    <div className="bg-white/80 px-2 py-1 text-[10px] text-black rounded shadow-sm backdrop-blur-sm">
                        Image Layer Source: https://www.wms.nrw.de/geobasis/wms_nw_dop
                    </div>
                </div>
            )}
        </MapContainer>
    );
}
