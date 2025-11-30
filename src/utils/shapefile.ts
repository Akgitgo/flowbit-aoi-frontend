import shp from 'shpjs';

export interface ShapefileData {
  type: string;
  features: any[];
}

export const parseShapefile = async (file: File): Promise<ShapefileData | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const geojson = await shp(arrayBuffer);
    return geojson as ShapefileData;
  } catch (error) {
    console.error('Error parsing shapefile:', error);
    return null;
  }
};

export const saveUploadedShapefile = (data: ShapefileData) => {
  try {
    localStorage.setItem('uploaded_shapefile', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save shapefile', e);
  }
};

export const loadUploadedShapefile = (): ShapefileData | null => {
  try {
    const saved = localStorage.getItem('uploaded_shapefile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load shapefile', e);
  }
  return null;
};

export const clearUploadedShapefile = () => {
  try {
    localStorage.removeItem('uploaded_shapefile');
  } catch (e) {
    console.warn('Failed to clear shapefile', e);
  }
};
