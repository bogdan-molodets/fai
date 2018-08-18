import { Injectable } from '@angular/core';


import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;
  cross: any;
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
    if (this.cross) {
      this.cross.features.forEach(function (value, index) {
        this.map.removeLayer(`cross-layer-${index}`);
        this.map.removeSource(`cross-source-${index}`);
      });
    }

    const that = this;
    let style = {
      'line-color': 'green',
      'line-width': 10
    }
    this.createMarker(center[0], center[1], 'base', 'center');

    let line1 = turf.lineString([center, point], { name: 'line1' });
    let line2 = turf.transformRotate(line1, 90, { pivot: center });
    let line3 = turf.transformRotate(line1, 180, { pivot: center });
    let line4 = turf.transformRotate(line1, 270, { pivot: center });

    this.cross = turf.featureCollection([
      line1,
      line2,
      line3,
      line4
    ]);

    this.cross.features.forEach(function (value, index) {
      that.createMarker(value.geometry.coordinates[1][0], value.geometry.coordinates[1][1], 'base', 'point' + index);
      that.addSource('cross-source-' + index, value, 'line', 'cross-layer-' + index, style);
    });

    return this.cross.features;
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
      let that = this;
      el.addEventListener('click', function () {
        that.selectPoint([lat, lon], 11);
      });
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
