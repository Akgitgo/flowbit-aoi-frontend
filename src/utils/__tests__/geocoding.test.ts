import { describe, it, expect, vi } from 'vitest';
import { searchCity } from '../geocoding';

// Mock fetch
global.fetch = vi.fn();

describe('geocoding', () => {
  describe('searchCity', () => {
    it('should return search results from Nominatim API', async () => {
      const mockResponse = [
        {
          place_id: 123,
          display_name: 'Berlin, Germany',
          lat: '52.5200',
          lon: '13.4050',
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const results = await searchCity('Berlin');

      expect(results).toHaveLength(1);
      expect(results[0].display_name).toBe('Berlin, Germany');
      expect(results[0].lat).toBe('52.5200');
    });

    it('should return empty array on API error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const results = await searchCity('InvalidCity');

      expect(results).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const results = await searchCity('Berlin');

      expect(results).toEqual([]);
    });
  });
});
