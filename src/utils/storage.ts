const STORAGE_KEY = 'flowbit_aoi_features';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveToStorage = (key: string, value: any) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('Error saving to localStorage', error);
    }
};

export const getFromStorage = (key: string) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
            return null;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Error reading from localStorage', error);
        return null;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveFeatures = (features: any[]) => {
    saveToStorage(STORAGE_KEY, features);
};

export const loadSavedFeatures = () => {
    return getFromStorage(STORAGE_KEY) || [];
};
