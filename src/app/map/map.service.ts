import { Injectable } from '@angular/core';


import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: mapboxgl.Map;

  constructor() {
    
   }


   getMap(container: string, centerLon: number, centerLat: number, zoom: number): any {
    return this.map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/bogdanmolodets/cjc0iypmd2gcf2rlefqdzoasf',
      center: [centerLon, centerLat], // starting position [lng, lat]
      zoom: zoom,
      attributionControl: false
  });
  }

}
