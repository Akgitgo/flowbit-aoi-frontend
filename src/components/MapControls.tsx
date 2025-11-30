import { MessageCircle, Plus, Minus, Navigation } from 'lucide-react';
import { useMap } from 'react-leaflet';

export default function MapControls() {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute bottom-12 right-4 flex flex-col items-end gap-3 z-[1000]">
      {/* Help Assistant Button */}
      <button className="bg-[#F5F0E6] p-2 rounded-xl shadow-md hover:bg-[#EDE5D6] transition-colors flex flex-col items-center justify-center w-14 h-14 border border-white/50">
        <Navigation
          className="text-[#D97706] fill-[#D97706] transform rotate-45 mb-0.5"
          size={20}
          strokeWidth={0}
        />
        <span className="text-[9px] font-semibold text-gray-800 leading-[1.1] text-center">
          Help
          <br />
          Assistant
        </span>
      </button>

      {/* Vertical Control Group */}
      <div className="bg-white rounded-full shadow-md flex flex-col items-center w-10 py-1">
        {/* Chat */}
        <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors text-[#D97706]">
          <MessageCircle size={20} fill="currentColor" strokeWidth={0} />
        </button>

        {/* Divider */}
        {/* <div className="w-5 h-px bg-gray-100"></div> */}

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors text-[#D97706] flex items-center justify-center"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {/* Divider */}
        <div className="w-4 h-[1px] bg-[#E3Cfae]"></div>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors text-[#D97706] flex items-center justify-center"
        >
          <Minus size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
