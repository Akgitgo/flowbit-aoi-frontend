import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface ConfirmAreasButtonProps {
  onConfirm?: () => void;
}

export default function ConfirmAreasButton({ onConfirm }: ConfirmAreasButtonProps) {
  const map = useMap();
  const [hasShapes, setHasShapes] = useState(false);

  useEffect(() => {
    const checkShapes = () => {
      const drawnItems = (window as any).__REACT_LEAFLET_DRAWN_ITEMS__;
      if (drawnItems) {
        setHasShapes(drawnItems.getLayers().length > 0);
      }
    };

    // Check initially
    checkShapes();

    // Listen for draw events
    map.on('draw:created draw:deleted draw:edited', checkShapes);

    return () => {
      map.off('draw:created draw:deleted draw:edited', checkShapes);
    };
  }, [map]);

  if (!hasShapes) return null;

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000]">
      <button
        onClick={onConfirm}
        className="bg-black/80 text-white px-8 py-4 rounded-2xl font-medium hover:bg-black/90 transition-colors backdrop-blur-sm shadow-2xl"
      >
        Confirm Areas
      </button>
    </div>
  );
}
