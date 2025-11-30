import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { useState } from 'react';
import { useMap } from 'react-leaflet';

export default function CustomMapControls() {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleFullscreen = () => {
    const mapContainer = map.getContainer().parentElement;
    if (!mapContainer) return;

    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className="absolute top-6 right-6 z-[1000] flex flex-col gap-2"
      role="group"
      aria-label="Map controls"
    >
      <button
        onClick={handleZoomIn}
        className="bg-white hover:bg-gray-50 p-3 rounded-xl shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn size={20} className="text-[#C87941]" />
      </button>

      <button
        onClick={handleZoomOut}
        className="bg-white hover:bg-gray-50 p-3 rounded-xl shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut size={20} className="text-[#C87941]" />
      </button>

      <button
        onClick={handleFullscreen}
        className="bg-white hover:bg-gray-50 p-3 rounded-xl shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize size={20} className="text-[#C87941]" />
        ) : (
          <Maximize size={20} className="text-[#C87941]" />
        )}
      </button>
    </div>
  );
}
