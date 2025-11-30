import React, { useState, useEffect, useRef } from 'react';
import {
    Home,
    LayoutGrid,
    MousePointer2,
    User,
    ChevronLeft,
    Search,
    FileUp,
    Settings,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    Eye,
} from 'lucide-react';
import { searchCity, SearchResult } from '../utils/geocoding';

interface SidebarProps {
    onCitySelect?: (result: SearchResult | null) => void;
    showProjectScope?: boolean;
    selectedCity?: SearchResult | null;
    appliedCities?: SearchResult[];
    onApplyCity?: (city: SearchResult) => void;
    onRemoveCity?: (cityId: number) => void;
}

export default function Sidebar({
    onCitySelect,
    showProjectScope,
    selectedCity: propSelectedCity,
    appliedCities = [],
    onApplyCity,
    onRemoveCity
}: SidebarProps) {
    const [activePanel, setActivePanel] = useState<'tools' | 'search' | 'project' | null>('tools');
    const [activeTool, setActiveTool] = useState<'select' | null>('select');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCity, setSelectedCity] = useState<SearchResult | null>(null);
    const searchTimeoutRef = useRef<number | null>(null);

    const [expandedSections, setExpandedSections] = useState({
        baseImage: false,
        areaOfInterest: true,
        defineObjects: false,
    });

    const [areas, setAreas] = useState<Array<{ id: number; name: string; color: string }>>([]);

    // Sync areas with drawn features
    useEffect(() => {
        const updateAreas = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const drawnItems = (window as any).__REACT_LEAFLET_DRAWN_ITEMS__;
            if (drawnItems) {
                const layers = drawnItems.getLayers();
                const newAreas = layers.map((layer: any, index: number) => ({
                    id: layer._leaflet_id || index + 1,
                    name: `Area ${index + 1}`,
                    color: '#E3D5C1',
                }));
                setAreas(newAreas);
            }
        };

        // Update on mount
        updateAreas();

        // Listen for draw events
        const map = (window as any).__REACT_LEAFLET_MAP__;
        if (map) {
            map.on('draw:created draw:deleted draw:edited', updateAreas);
            return () => {
                map.off('draw:created draw:deleted draw:edited', updateAreas);
            };
        }
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [uploadedShapefile, setUploadedShapefile] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleShapefileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (result) {
                    setUploadedShapefile({
                        name: file.name,
                        data: result,
                    });
                    localStorage.setItem(
                        'uploaded_shapefile',
                        JSON.stringify({
                            name: file.name,
                            uploaded: true,
                        })
                    );
                    window.dispatchEvent(new Event('storage'));
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error uploading shapefile:', error);
        }
    };

    const handleDeleteArea = (areaId: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawnItems = (window as any).__REACT_LEAFLET_DRAWN_ITEMS__;
        if (drawnItems) {
            const layers = drawnItems.getLayers();
            // Find layer by Leaflet ID
            const layerToRemove = layers.find((layer: any) => layer._leaflet_id === areaId);
            if (layerToRemove) {
                drawnItems.removeLayer(layerToRemove);
                // Trigger update
                const map = (window as any).__REACT_LEAFLET_MAP__;
                if (map) {
                    map.fire('draw:deleted');
                }
            }
        }
    };

    const handleViewArea = (areaId: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map = (window as any).__REACT_LEAFLET_MAP__;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawnItems = (window as any).__REACT_LEAFLET_DRAWN_ITEMS__;

        if (map && drawnItems) {
            const layers = drawnItems.getLayers();
            // Find layer by Leaflet ID
            const layer = layers.find((l: any) => l._leaflet_id === areaId);

            if (layer) {
                const bounds = layer.getBounds ? layer.getBounds() : null;

                if (bounds) {
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
                }
            }
        }
    };

    useEffect(() => {
        if (showProjectScope) {
            setActivePanel('project');
        }
    }, [showProjectScope]);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchCity(searchQuery);
            setSearchResults(results);
            setIsSearching(false);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleCitySelect = (result: SearchResult) => {
        setSelectedCity(result);
        setSearchQuery(result.display_name);
        setSearchResults([]);
        if (onCitySelect) {
            onCitySelect(result);
        }
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="flex h-full z-[2000] pointer-events-auto">
            <div className="w-16 bg-[#4A4A4A] flex flex-col items-center py-6 gap-6 text-white shadow-xl z-30">
                <button
                    onClick={() => {
                        setActiveTool('select');
                        if (!activePanel) setActivePanel('tools');
                    }}
                    className={`p-2 rounded-lg transition-colors ${activeTool === 'select' ? 'text-orange-400' : 'hover:text-gray-300'}`}
                    title="Select"
                >
                    <MousePointer2 size={24} className="transform rotate-45" />
                </button>

                <button className="p-2 hover:text-gray-300 transition-colors" title="Home">
                    <Home size={24} />
                </button>

                <button
                    onClick={() => setActivePanel(activePanel === 'tools' ? null : 'tools')}
                    className={`p-2 rounded-lg transition-colors ${activePanel === 'tools' ? 'text-[#E3Cfae]' : 'hover:text-gray-300'}`}
                    title="Tools"
                >
                    <LayoutGrid size={24} />
                </button>

                <div className="flex-1" />

                <button className="p-2 hover:text-gray-300 transition-colors">
                    <div className="w-8 h-8 rounded-full border-2 border-[#E3Cfae] flex items-center justify-center text-[#E3Cfae]">
                        <User size={18} />
                    </div>
                </button>

                <button className="p-2 hover:text-gray-300 transition-colors mb-4" title="Settings">
                    <Settings size={24} className="text-[#E3Cfae]" />
                </button>
            </div>

            {activePanel === 'project' && (
                <div className="w-96 bg-[#F5F0E6] h-full shadow-2xl flex flex-col z-20">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => setActivePanel('tools')}
                                className="hover:bg-orange-50 p-1 rounded"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                            <h2 className="text-xl font-medium text-orange-500">Define Project Scope</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('baseImage')}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedSections.baseImage ? (
                                        <ChevronDown size={20} />
                                    ) : (
                                        <ChevronRight size={20} />
                                    )}
                                    <span className="text-gray-700 font-medium">Select Base Image</span>
                                </div>
                                <Plus size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('areaOfInterest')}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedSections.areaOfInterest ? (
                                        <ChevronDown size={20} />
                                    ) : (
                                        <ChevronRight size={20} />
                                    )}
                                    <span className="text-gray-700 font-medium">Define Area of Interest</span>
                                </div>
                                <Plus size={20} className="text-gray-600" />
                            </button>

                            {expandedSections.areaOfInterest && (
                                <div className="px-6 pb-4 space-y-2">
                                    {areas.map((area) => (
                                        <div
                                            key={area.id}
                                            className="flex items-center gap-3 p-3 bg-white rounded-lg group"
                                        >
                                            <ChevronRight size={16} className="text-gray-400" />
                                            <div
                                                className="w-6 h-6 rounded"
                                                style={{ backgroundColor: area.color }}
                                            ></div>
                                            <span className="flex-1 text-gray-700">{area.name}</span>
                                            <button
                                                onClick={() => handleDeleteArea(area.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                                title="Delete area"
                                            >
                                                <Trash2 size={16} className="text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => handleViewArea(area.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                                title="View area"
                                            >
                                                <Eye size={16} className="text-gray-500" />
                                            </button>
                                            <button className="p-1">
                                                <span className="text-gray-400">⋮</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => toggleSection('defineObjects')}
                                className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedSections.defineObjects ? (
                                        <ChevronDown size={20} />
                                    ) : (
                                        <ChevronRight size={20} />
                                    )}
                                    <span className="text-gray-700 font-medium">Define Objects</span>
                                </div>
                                <Plus size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activePanel === 'tools' && (
                <div className="w-80 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 z-20">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-orange-500 mb-6">
                            <button
                                onClick={() => setActivePanel(null)}
                                className="hover:bg-orange-50 p-1 rounded"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-medium text-lg">Define Area of Interest</span>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-4">
                            Define the area(s) where you will apply your object count & detection model
                        </h2>

                        <p className="text-gray-600 mb-2">Options:</p>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <button onClick={() => setActivePanel('search')} className="w-full text-left group">
                            <div className="bg-[#F5F0E6] border border-gray-300 rounded-xl p-6 hover:border-orange-400 transition-colors relative overflow-hidden">
                                <div className="flex items-start gap-4">
                                    <Search className="text-gray-500 mt-1" size={20} />
                                    <div>
                                        <div className="text-gray-600 font-medium mb-1">
                                            <span className="font-bold text-gray-800">Search</span> for a city, town...
                                        </div>
                                        <div className="text-gray-600">
                                            or <span className="font-bold text-gray-800">draw</span> area on map
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".shp,.zip,.geojson,.json"
                            onChange={handleShapefileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full text-left group"
                        >
                            <div className="bg-[#F5F0E6] border border-gray-200 rounded-xl p-6 hover:border-orange-400 transition-colors flex items-center gap-4">
                                <FileUp className="text-gray-500" size={20} />
                                <span className="text-gray-600">
                                    {uploadedShapefile
                                        ? `Uploaded: ${uploadedShapefile.name}`
                                        : 'Uploading a shape file'}
                                </span>
                            </div>
                        </button>

                        {/* Applied City Boundaries Section */}
                        {appliedCities.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-gray-700 font-semibold mb-3 text-base">
                                    Applied City Boundaries ({appliedCities.length})
                                </h3>
                                <div className="space-y-2">
                                    {appliedCities.map((city) => (
                                        <div
                                            key={city.place_id}
                                            className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {city.display_name.split(',')[0]}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-1">
                                                    {city.display_name}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (onRemoveCity) {
                                                        onRemoveCity(city.place_id);
                                                    }
                                                }}
                                                className="ml-3 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex-shrink-0"
                                                title="Remove this city boundary"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-100">
                        <div className="border border-gray-300 rounded-xl p-4">
                            <h3 className="text-gray-800 font-medium mb-3 text-center">
                                Scope Definition Finished
                            </h3>
                            <button className="w-full bg-[#D8D0C5] text-white py-3 rounded-lg font-medium hover:bg-[#C8C0B5] transition-colors">
                                Continue to object (s)
                                <br />
                                detection workflow
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activePanel === 'search' && (
                <div className="w-96 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 z-20">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3 text-orange-500 mb-6">
                            <button
                                onClick={() => setActivePanel('tools')}
                                className="hover:bg-orange-50 p-1 rounded"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-medium text-lg text-orange-500">Define Area of Interest</span>
                        </div>

                        <p className="text-gray-500 text-base leading-relaxed">
                            Search or use vector tool to create your region.
                        </p>
                    </div>

                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        <div>
                            <h3 className="text-gray-700 font-semibold mb-3 text-base">Search Area</h3>
                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="city, town, region..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#F5F0E6] border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                                />

                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.place_id}
                                                onClick={() => handleCitySelect(result)}
                                                className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="text-sm font-medium text-gray-800">
                                                    {result.display_name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {isSearching && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 text-sm">
                                        Searching...
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={!selectedCity}
                                onClick={() => {
                                    if (selectedCity && onApplyCity) {
                                        onApplyCity(selectedCity);
                                    }
                                }}
                                className={`w-full py-4 rounded-xl font-medium transition-colors shadow-sm ${selectedCity
                                    ? 'bg-[#C87941] text-white hover:bg-[#B86931]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Apply outline as base image
                            </button>

                            {selectedCity && (
                                <button
                                    onClick={() => {
                                        setSelectedCity(null);
                                        setSearchQuery('');
                                        if (onCitySelect) {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            onCitySelect(null as any);
                                        }
                                    }}
                                    className="w-full py-3 mt-3 rounded-xl font-medium transition-colors bg-red-500 text-white hover:bg-red-600"
                                >
                                    Clear Boundary
                                </button>
                            )}

                            <p className="text-gray-400 text-sm mt-3 text-center">
                                You can always edit the shape of the area later
                            </p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100">
                        <button
                            disabled={!selectedCity}
                            className={`w-full py-4 rounded-xl font-medium transition-colors ${selectedCity
                                ? 'bg-gray-700 text-white hover:bg-gray-800'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Confirm Area of Interest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
