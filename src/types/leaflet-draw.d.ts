// helper d.ts to avoid "Property 'Draw' does not exist on type 'typeof L'"
import * as L from 'leaflet';

declare module 'leaflet' {
  // minimal augmentation so TypeScript accepts L.Draw and Control.Draw
  namespace Control {
    // draw control constructor type (loose)
    class Draw extends Control {}
  }
  // expose Draw on the L namespace as any to avoid strict typing issues
  const Draw: any;
}

export {};
