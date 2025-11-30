// import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { useState } from 'react';
import { SearchResult } from './utils/geocoding';

function App() {
    const [selectedCity, setSelectedCity] = useState<SearchResult | null>(null);
    const [appliedCities, setAppliedCities] = useState<SearchResult[]>([]);
    const [showProjectScope, setShowProjectScope] = useState(false);

    const handleApplyCity = (city: SearchResult) => {
        setAppliedCities((prev) => [...prev, city]);
    };

    const handleRemoveCity = (cityId: number) => {
        setAppliedCities((prev) => prev.filter((city) => city.place_id !== cityId));
    };

    return (
        <div className="flex flex-col h-screen w-full">
            {/* <Header /> */}
            <div className="flex flex-1 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 z-[2000] h-full">
                    <Sidebar
                        onCitySelect={setSelectedCity}
                        showProjectScope={showProjectScope}
                        selectedCity={selectedCity}
                        appliedCities={appliedCities}
                        onApplyCity={handleApplyCity}
                        onRemoveCity={handleRemoveCity}
                    />
                </div>
                <div className="flex-1 relative h-full w-full">
                    <MapView
                        selectedCity={selectedCity}
                        appliedCities={appliedCities}
                        onConfirmAreas={() => setShowProjectScope(true)}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
