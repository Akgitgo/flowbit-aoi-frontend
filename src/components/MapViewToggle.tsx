import { useState } from 'react';

export default function MapViewToggle() {
    const [showBaseImage, setShowBaseImage] = useState(true);

    return (
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
    );
}

export { MapViewToggle };
