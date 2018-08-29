import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from '../map.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map;
  constructor(private mapService: MapService) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
   }

  ngOnInit() {
    this.map = this.mapService.getMap('map',0,0,4).addControl(new mapboxgl.NavigationControl(),'top-left');
  }

}
