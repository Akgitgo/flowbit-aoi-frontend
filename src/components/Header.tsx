import React from 'react';

export default function Header() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-green-500 flex items-center justify-center text-white font-bold">
          FB
        </div>
        <div>
          <div className="text-lg font-semibold">Flowbit AOI Creator</div>
          <div className="text-sm text-gray-500">Map & AOI creation demo</div>
        </div>
      </div>
    </header>
  );
}
