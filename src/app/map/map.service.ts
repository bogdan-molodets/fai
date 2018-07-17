import { Injectable } from '@angular/core';


import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;

  constructor() {

  }


  getMap(container: string, centerLon: number, centerLat: number, zoom: number): any {
    return this.map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/bogdanmolodets/cjc0iypmd2gcf2rlefqdzoasf',
      center: [centerLon, centerLat],
      zoom: zoom,
      attributionControl: false
    });
  }

  initBase(basePoint) {
    let el = this.createMarker(basePoint[0], basePoint[1], 'base', 'base');
  }

  buildCross(center, point) {
    if (this.map.getSource('cross-source-1')) {
      let i = 1
      while (i < 5) {
        this.map.removeLayer(`cross-layer-${i}`);
        this.map.removeSource(`cross-source-${i}`);
        i++;
      }
    }
    let style = {
      'line-color': 'green',
      'line-width': 10
    }
    this.createMarker(center[0], center[1], 'base', 'center');
    this.createMarker(point[0], point[1], 'base', 'point1');
    let line1 = turf.lineString([center, point], { name: 'line1' });
    let line2 = turf.transformRotate(line1, 90, { pivot: center });
    let line3 = turf.transformRotate(line1, 180, { pivot: center });
    let line4 = turf.transformRotate(line1, 270, { pivot: center });
    this.createMarker(line2.geometry.coordinates[1][0], line2.geometry.coordinates[1][1], 'base', 'point2');
    this.createMarker(line3.geometry.coordinates[1][0], line3.geometry.coordinates[1][1], 'base', 'point3');
    this.createMarker(line4.geometry.coordinates[1][0], line4.geometry.coordinates[1][1], 'base', 'point4');
    this.addSource('cross-source-1', line1, 'line', 'cross-layer-1', style);
    this.addSource('cross-source-2', line2, 'line', 'cross-layer-2', style);
    this.addSource('cross-source-3', line3, 'line', 'cross-layer-3', style)
    this.addSource('cross-source-4', line4, 'line', 'cross-layer-4', style);
    return [point, line2.geometry.coordinates[1], line3.geometry.coordinates[1], line4.geometry.coordinates[1]]
  }

  addSource(sourceId, data, layerType, layerId, paint) {
    this.map.addSource(sourceId, {
      type: 'geojson',
      data: data
    });
    this.map.addLayer({
      id: layerId,
      type: layerType,
      source: sourceId,
      paint: paint
    });
  }

  createMarker(lat, lon, icon, id) {
    if (!document.getElementById(id.toString())) {
      let el = document.createElement('div');
      el.className = 'marker';
      el.id = id;
      el.style.backgroundImage = `url(../../assets/${icon}.png)`;
      el.style.cursor = 'pointer';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.visibility = 'visible';
      return new mapboxgl.Marker(el)
        .setLngLat([lat, lon])
        .addTo(this.map);
    } else {
      console.log('is here');
    }

  }


  selectPoint(point, zoom) {
    this.map.flyTo({
      center: point,
      zoom: zoom
    });
  }
}
