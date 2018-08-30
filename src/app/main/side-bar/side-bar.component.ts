import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MapService } from '../../map/map.service';
import { RtmlsService } from '../../rtmls/rtmls.service';
import { repeatWhen, takeWhile } from 'rxjs/operators';
import { interval } from 'rxjs';

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
  dark = false;
  private alive = true;
  private _RS: Object;
  private _CP: Object;
  private _AP: Object;
  private _flightId: string;
  private _targetId: string;

  @Input() set RS(val: any) {
    this._RS = val;
  }

  get RS() {
    return this._RS;
  }

  @Input() set CP(val: any) {
    this._CP = val;
  }

  get CP() {
    return this._CP;
  }

  @Input() set AP(val: any) {
    this._AP = val;
  }

  get AP() {
    return this._AP;
  }

  @Input() set flightId(val: any) {
    this._flightId = val;
  }

  get flightId() {
    return this._flightId;
  }

  @Input() set targetId(val: any) {
    this._targetId = val;
  }

  get targetId() {
    return this._targetId;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    Object.keys(changes).forEach(key => {
      if (!changes[key].isFirstChange()) {
        switch (key) {
          case 'RS':
            this.initBase();
            break;
          case 'CP':

            break;
          case 'AP':
            this.buildCross();
            break;
          default:
            break;
        }
      }
    });
  }

  constructor(private mapService: MapService, private rtmls: RtmlsService) { }

  ngOnInit() {
    let that = this;
    $('.ui.checkbox#colorMode').checkbox({
      onChange() {
        that.dark = !that.dark;
        that.mapService.changeMapStyle(that.dark);
        (that.dark)?$('app-main').addClass('dark'):$('app-main').removeClass('dark')
        console.log('Divna Ukraina')
      }
    });
  }

  hideSideBar() {
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
  }

  initBase() {
    //let basePoint = [14, 13];
    this.mapService.initBase([this.RS.llh.lat,this.RS.llh.lon]);
    //this.base = basePoint;
    this.mapService.selectPoint([this.RS.llh.lat,this.RS.llh.lon], 6);
  }

  buildCross() {
    //if (this.base !== undefined) {
      //this.center = [13, 12]
      //let point = [12, 14];
      this.points = this.mapService.buildCross([this.CP.llh.lat,this.CP.llh.lon], [this.AP.llh.lat,this.AP.llh.lon]);
    //}
  }

  selectPoint(point, pointId) {
    $('tr.active').removeClass('active');
    $(`.${pointId}-point`).addClass('active');
    this.hideSideBar();
    this.mapService.selectPoint(point, 11);
  }

  start() {
    this.viewLogs();
    $('#start').addClass('disabled');
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
    $('app-modal').removeClass('hide');
  }

  viewLogs(){
    $('app-console').addClass('show');
    $(".viewLogs").attr("disabled", true).addClass('grey');
  }

  modalIsHidden() {
    return $('app-modal').hasClass('hide');
  }

  runRTKserver() {
    this.rtmls.runRTK(this.flightId, this.targetId).then(res => {
      console.log(res);
      if (res) {
        this.rtmls.getRTKStatus(this.flightId, this.targetId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.alive)).subscribe(res => {
          console.log(res);
        });
      }
    });
  }
  stopRTKserver() {
    this.rtmls.stopRTK(this.flightId, this.targetId).then(res => {
      console.log(res);
    });
  }

}
