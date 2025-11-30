// Nominatim API for geocoding and boundary fetching
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geojson?: any;
  osm_type: string;
  osm_id: number;
}

export async function searchCity(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?` +
      new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        polygon_geojson: '1',
      })
    );

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error searching city:', error);
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCityBoundary(osmType: string, osmId: number): Promise<any | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/lookup?` +
      new URLSearchParams({
        osm_ids: `${osmType[0].toUpperCase()}${osmId}`,
        format: 'json',
        polygon_geojson: '1',
      })
    );

    if (!response.ok) {
      throw new Error('Boundary fetch failed');
    }

    const results = await response.json();
    if (results.length > 0 && results[0].geojson) {
      return results[0].geojson;
    }

    return null;
  } catch (error) {
    console.error('Error fetching city boundary:', error);
    return null;
  }
}
