import { Minus, Square, Pentagon, Move, FileUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { saveFeatures } from '../utils/storage';

export default function DrawingToolbar() {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [hasUploadedShapefile, setHasUploadedShapefile] = useState(false);
  const map = useMap();

  useEffect(() => {
    const shapefile = localStorage.getItem('uploaded_shapefile');
    setHasUploadedShapefile(!!shapefile);

    const handleStorageChange = () => {
      const shapefile = localStorage.getItem('uploaded_shapefile');
      setHasUploadedShapefile(!!shapefile);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persistLayers = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawnItems = (window as any).__REACT_LEAFLET_DRAWN_ITEMS__;
    if (drawnItems) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      drawnItems.eachLayer((layer: any) => {
        try {
          const geojson = layer.toGeoJSON();
          data.push(geojson);
        } catch (err) {
          console.warn('toGeoJSON failed', err);
        }
      });
      saveFeatures(data);
    }
  };

  const handleToolClick = (toolType: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawControl = (window as any).leafletDrawControl;
    if (!drawControl) return;

    if (activeTool) {
      try {
        if (activeTool === 'edit') {
          drawControl._toolbars.edit._modes.edit?.handler?.disable();
        } else if (activeTool === 'remove') {
          drawControl._toolbars.edit._modes.remove?.handler?.disable();
          persistLayers(); // Ensure deletion is saved before switching
        } else {
          drawControl._toolbars.draw._modes[activeTool]?.handler?.disable();
        }
      } catch (e) { }
    }

    if (activeTool === toolType) {
      setActiveTool(null);
      return;
    }

    try {
      const handler = drawControl._toolbars.draw._modes[toolType]?.handler;
      if (handler) {
        handler.enable();
        setActiveTool(toolType);
      }
    } catch (e) {
      console.error('Error activating tool:', e);
    }
  };

  const handleEdit = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawControl = (window as any).leafletDrawControl;
    if (!drawControl) return;

    if (activeTool) {
      try {
        if (activeTool === 'remove') {
          drawControl._toolbars.edit._modes.remove?.handler?.disable();
          persistLayers(); // Ensure deletion is saved before switching
        } else if (activeTool !== 'edit') {
          drawControl._toolbars.draw._modes[activeTool]?.handler?.disable();
        }
      } catch (e) { }
    }

    try {
      const editHandler = drawControl._toolbars.edit._modes.edit?.handler;
      if (editHandler) {
        if (activeTool === 'edit') {
          editHandler.disable();
          setActiveTool(null);
        } else {
          editHandler.enable();
          setActiveTool('edit');
        }
      }
    } catch (e) {
      console.error('Error toggling edit:', e);
    }
  };

  const handleDelete = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawControl = (window as any).leafletDrawControl;
    if (!drawControl) return;

    if (activeTool) {
      try {
        if (activeTool === 'edit') {
          drawControl._toolbars.edit._modes.edit?.handler?.disable();
        } else if (activeTool !== 'remove') {
          drawControl._toolbars.draw._modes[activeTool]?.handler?.disable();
        }
      } catch (e) { }
    }

    try {
      const deleteHandler = drawControl._toolbars.edit._modes.remove?.handler;
      if (deleteHandler) {
        if (activeTool === 'remove') {
          deleteHandler.disable();
          setActiveTool(null);
          persistLayers();
        } else {
          deleteHandler.enable();
          setActiveTool('remove');
        }
      }
    } catch (e) { }
  };

  const disableAllTools = () => {
    if (activeTool) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drawControl = (window as any).leafletDrawControl;
      if (drawControl) {
        try {
          if (activeTool === 'edit') {
            drawControl._toolbars.edit._modes.edit?.handler?.disable();
          } else if (activeTool === 'remove') {
            drawControl._toolbars.edit._modes.remove?.handler?.disable();
            persistLayers(); // Ensure deletion is saved before disabling
          } else {
            drawControl._toolbars.draw._modes[activeTool]?.handler?.disable();
          }
        } catch (e) { }
      }
      setActiveTool(null);
    }
  };

  return (
    <div
      className="absolute top-1/2 right-6 transform -translate-y-1/2 z-[1000]"
      role="toolbar"
      aria-label="Drawing tools"
    >
      {showTooltip && (
        <div className="absolute right-full mr-4 top-8 bg-black/80 text-white px-6 py-4 rounded-2xl whitespace-nowrap backdrop-blur-sm">
          {showTooltip === 'polygon' ? (
            <>
              <p className="text-base font-light">Multiple areas can</p>
              <p className="text-base font-light">be selected even if</p>
              <p className="text-base font-light">they are not</p>
              <p className="text-base font-light">touching</p>
            </>
          ) : (
            <p className="text-base font-light">{showTooltip}</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-2 flex flex-col gap-1">
        <button
          onClick={() => handleToolClick('polygon')}
          onMouseEnter={() => setShowTooltip('polygon')}
          onMouseLeave={() => setShowTooltip(null)}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeTool === 'polygon' ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Draw polygon - Multiple areas can be selected even if they are not touching"
          title="Draw polygon"
        >
          <Pentagon size={20} strokeWidth={2} className="text-[#C87941]" />
        </button>

        <button
          onClick={handleEdit}
          onMouseEnter={() => setShowTooltip('Adjust edges')}
          onMouseLeave={() => setShowTooltip(null)}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeTool === 'edit' ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Adjust edges of drawn shapes"
          title="Adjust edges"
        >
          <Move size={20} strokeWidth={2} className="text-[#C87941]" />
        </button>

        <button
          onClick={handleDelete}
          onMouseEnter={() => setShowTooltip('Erase shapes')}
          onMouseLeave={() => setShowTooltip(null)}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeTool === 'remove' ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Erase shapes from the map"
          title="Erase shapes"
        >
          <Square
            size={20}
            strokeWidth={1.5}
            className="text-[#C87941] opacity-60"
            style={{ strokeDasharray: '4 2' }}
          />
        </button>

        <button
          onClick={() => handleToolClick('polyline')}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeTool === 'polyline' ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Draw line"
          title="Draw line"
        >
          <Minus size={20} strokeWidth={2} className="text-[#C87941]" />
        </button>

        <button
          onClick={disableAllTools}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${!activeTool ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Select and pan mode"
          title="Select and pan"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#C87941]"
          >
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
          </svg>
        </button>

        <button
          onClick={() => handleToolClick('rectangle')}
          className={`p-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 ${activeTool === 'rectangle' ? 'bg-[#E3D5C1]' : 'hover:bg-gray-50'
            }`}
          aria-label="Draw rectangle"
          title="Draw rectangle"
        >
          <Square size={20} strokeWidth={2} className="text-[#C87941]" />
        </button>

        {hasUploadedShapefile && (
          <button
            onClick={() => {
              const shapefileData = localStorage.getItem('uploaded_shapefile');
              if (shapefileData) {
                alert('Shapefile will be applied to the map');
              }
            }}
            onMouseEnter={() => setShowTooltip('Use uploaded shapefile')}
            onMouseLeave={() => setShowTooltip(null)}
            className="p-3 rounded-2xl transition-colors bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            aria-label="Use uploaded shapefile"
            title="Use uploaded shapefile"
          >
            <FileUp size={20} strokeWidth={2} className="text-orange-600" />
          </button>
        )}
      </div>
    </div>
  );
}
