import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MapService } from '../../map/map.service';
import { RtmlsService } from '../../rtmls/rtmls.service';
import { repeatWhen, takeWhile, expand, delay, distinctUntilChanged, mergeMap, retryWhen, distinct } from 'rxjs/operators';
import { interval, concat, Observable, Subscription } from 'rxjs';
import { markers } from './markers';

declare const $: any;

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})

class MarkerObservable {
  /**
   *
   */
  constructor(readonly markerId: string, readonly observable: Subscription) {

  }
}
export class SideBarComponent implements OnInit {
  base;
  points;
  markers = [];
  center;
  dark = false;
  offline = false;
  rtks = false;
  markerObservables: MarkerObservable[] = [];
  private alive = true;
  private _RS: Object;
  private _CP: Object;
  private _AP: Object;
  private _flightId: string;
  private _targetId: string;
  private date: string;

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
        that.mapService.changeMapStyle(that.offline, that.dark);
        (that.dark) ? $('app-main').addClass('dark') : $('app-main').removeClass('dark')
        console.log('Divna Ukraina')
      }
    });
    $('.ui.checkbox#mapMode').checkbox({
      onChange() {
        that.offline = !that.offline;
        that.mapService.changeMapStyleOffline(that.offline, that.dark);
        //  (that.dark) ? $('app-main').addClass('dark') : $('app-main').removeClass('dark')
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
    this.mapService.initBase([this.RS.llh.lat, this.RS.llh.lon]);
    //this.base = basePoint;
    this.mapService.selectPoint([this.RS.llh.lon, this.RS.llh.lat], 16);
  }

  buildCross() {
    //if (this.base !== undefined) {
    //this.center = [13, 12]
    //let point = [12, 14];
    this.points = this.mapService.buildCross([this.CP.llh.lat, this.CP.llh.lon], [this.AP.llh.lat, this.AP.llh.lon]);
    //}
  }

  selectPoint(point, pointId) {
    $('tr.active').removeClass('active');
    $(`.${pointId}-point`).addClass('active');
    this.hideSideBar();
    this.mapService.selectPoint(point, 22);
  }

  selectMarker(marker) {
    $('tr.active').removeClass('active');
    $(`.${marker.marker_id}`).addClass('active');
    this.hideSideBar();
    this.mapService.selectPoint([marker.llh.lon, marker.llh.lat], 22);
    /*new mapboxgl.Popup()
        .setLngLat([marker.llh.lon, marker.llh.lat])
        .setHTML('<p>' + marker.marker_id + '<p><p>Latitude: ' + marker.llh.lat + '</p><p>Longtitude: ' + marker.llh.lon + '</p>')
        .addTo(this.mapService.map);*/
  }

  start() {
    this.viewLogs();
    $('#start').addClass('disabled');
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
    $('app-modal').removeClass('hide');
  }

  viewLogs() {
    $('app-console').addClass('show');
    $(".viewLogs").attr("disabled", true).addClass('grey');
  }

  modalIsHidden() {
    return $('app-modal').hasClass('hide');
  }

  runRTKserver() {
    const that = this;
    this.rtmls.runRTK(this.flightId, this.targetId).then(res => {

      if (res) {
        // this.rtmls.getRTKStatus(this.flightId, this.targetId).pipe(repeatWhen(() => interval(1000)), takeWhile(() => this.alive)).subscribe(res => {
        //   console.log(res);
        // });
        this.date = '2000-01-01 01:01:01';
        this.rtmls.getMarkersList(this.flightId, this.targetId, this.date).pipe(
          expand(ex => {
            return this.rtmls.getMarkersList(this.flightId, this.targetId, this.date).pipe(delay(1000));
          }),
          retryWhen(errors => {
            return errors.pipe(delay(1000));
          })
        ).subscribe(res => {
          if (res.marker.length > 0 && res.marker[0].timestamp != this.date) {
            this.date = res.marker[0].timestamp;
            res.marker.forEach(element => {

              let m = this.rtmls.getMarkerState(this.flightId, this.targetId, element.marker_id).pipe(
                //   distinctUntilChanged((marker1, marker2) => marker1.state == marker2.state),
                repeatWhen(() => interval(3000)),
               
              ).subscribe(marker => {

                this.pushToArray(marker);
                if (marker.state == 'ready') {
                  // find subscription in MarkerObservable array unsubscribe from it and delete from array
                  let obj = this.markerObservables.find(el => { return el.markerId == marker.marker_id });
                  obj.observable.unsubscribe();
                  this.markerObservables.splice(this.markerObservables.indexOf(obj), 1);
                  //
                  this.mapService.createMarker(marker.llh.lat, marker.llh.lon, 'marker', marker.marker_id);
                }
              });
              this.markerObservables.push(new MarkerObservable(element.marker_id, m));
            });

          }
        },
        );;
      }
    });
    this.rtks = true;
    // console.log(markers);
    // console.log(markers.marker[0].llh.lat);
    // setTimeout(()=>{
    //   this.markers.push(markers.marker[0]);
    //   this.mapService.createMarker( markers.marker[0].llh.lat, markers.marker[0].llh.lon,'marker', markers.marker[0].marker_id, markers.marker[0] );     
    // },5000);
    // setTimeout(()=>{
    //   this.markers.push(markers.marker[1]);
    //   this.mapService.createMarker( markers.marker[1].llh.lat, markers.marker[1].llh.lon,'marker', markers.marker[1].marker_id, markers.marker[1]);     
    // },9000);
    // setTimeout(()=>{
    //   this.markers.push(markers.marker[2]);
    //   this.mapService.createMarker( markers.marker[2].llh.lat, markers.marker[2].llh.lon,'marker', markers.marker[2].marker_id, markers.marker[2]);     
    // },7000);
    // setTimeout(()=>{
    //   this.markers.push(markers.marker[3]);
    //   this.mapService.createMarker( markers.marker[3].llh.lat, markers.marker[3].llh.lon,'marker', markers.marker[3].marker_id, markers.marker[3]);     
    // },6000);

  }
  stopRTKserver() {
    this.rtmls.stopRTK(this.flightId, this.targetId).then(res => {
      this.alive = false;
      console.log(res);
    });
  }

  hideTable(table) {
    console.log($(`.${table} .icon`));
    if ($(`.${table}`).hasClass('hideTable')) {
      $(`.${table}`).removeClass('hideTable');
      $(`.${table} .icon`).removeClass('down');
      $(`.${table} .icon`).addClass('up');
    } else {
      $(`.${table}`).addClass('hideTable');
      $(`.${table} .icon`).removeClass('up');
      $(`.${table} .icon`).addClass('down');
    }

  }

  pushToArray(marker: any) {
    let index = this.markers.findIndex((m) => m.marker_id == marker.marker_id);
    if (index == -1) {
      this.markers.push(marker);
    } else {
      this.markers[index] = marker;
    }
  }
}
