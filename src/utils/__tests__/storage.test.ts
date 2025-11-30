import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveFeatures, loadSavedFeatures } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveFeatures', () => {
    it('should save features to localStorage', () => {
      const features = [{ type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }];

      saveFeatures(features);

      const saved = localStorage.getItem('drawn_features');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(features);
    });

    it('should handle empty array', () => {
      saveFeatures([]);

      const saved = localStorage.getItem('drawn_features');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual([]);
    });
  });

  describe('loadSavedFeatures', () => {
    it('should load features from localStorage', () => {
      const features = [{ type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }];
      localStorage.setItem('drawn_features', JSON.stringify(features));

      const loaded = loadSavedFeatures();

      expect(loaded).toEqual(features);
    });

    it('should return empty array if no features saved', () => {
      const loaded = loadSavedFeatures();

      expect(loaded).toEqual([]);
    });

    it('should return empty array on parse error', () => {
      localStorage.setItem('drawn_features', 'invalid json');

      const loaded = loadSavedFeatures();

      expect(loaded).toEqual([]);
    });
  });
});
