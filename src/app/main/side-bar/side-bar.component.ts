import { Component, OnInit } from '@angular/core';
import { MapService } from '../../map/map.service';

declare const $: any;

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  base;
  points;
  center;
  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

  hideSideBar(){
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
  }
  
  initBase(){
    let basePoint = [14,13];
    this.mapService.initBase(basePoint);
    this.base = basePoint;
    this.mapService.selectPoint(basePoint,6);
  }

  buildCross(){
    if(this.base!==undefined){
      this.center = [13, 12]
      let point = [12, 14];
      this.points = this.mapService.buildCross(this.center, point);
    }
  }

  selectPoint(point, pointId){
    $('tr.active').removeClass('active');
    $(`.${pointId}-point`).addClass('active');
    this.hideSideBar();
    this.mapService.selectPoint(point,11);
  }

  start(){
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
     $('app-modal').removeClass('hide'); 
  }

}
