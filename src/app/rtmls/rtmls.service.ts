import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import { Log, LogResponse } from '../models/log';
import { Observable, BehaviorSubject } from 'rxjs';
import { LogResponseSerializer, MarkerListSerializer, MarkerStateSerialzer, TargetListSerializer, TargetSerializer } from '../models/serializers';
import { MarkerList, MarkerState } from '../models/marker';
import { TargetList, Target } from '../models/target';
@Injectable({
  providedIn: 'root'
})
export class RtmlsService {
  private flightIdSource = new BehaviorSubject<string>(null);
  currentflightId = this.flightIdSource.asObservable();
  constructor(private httpClient: HttpClient) { }

  readLogs(lastSync: string, flightId?: string): Observable<any> {
    let params = flightId ? { lastsync: lastSync, flight_id: flightId } : { lastsync: lastSync };

    return this.httpClient.get<LogResponse>(environment.apiUrl + 'log', { params: params });//.map(res => {
    // return new LogResponseSerializer().deserialize(res);
    //});
  }

  saveLogs(logMsg: string): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'log', { log_msg: logMsg });
  }

  // marker
  getMarkersList(flightId: string, targetId: string, lastSync: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + 'marker', { params: { flight_id: flightId, target_id: targetId, lastsync: lastSync } });
  }

  createMarker(flightId: string, targetId: string, markerId: string): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'marker', { params: { marker_id: markerId, flight_id: flightId, target_id: targetId } });
  }

  // get marker state 
  getMarkerState(flightId: string, targetId: string, markerId: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + 'marker/' + markerId, { params: { flight_id: flightId, target_id: targetId } });
    // .map(res => {
    //   return new MarkerStateSerialzer().deserialize(res);
    // })
  }

  updateMarker(flightId: string, targetId: string, markerId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + 'marker/' + markerId, { state: state }, { params: { flight_id: flightId, target_id: targetId } });
  }

  // targets
  getTargetsList(flightId: string): Observable<TargetList> {
    return this.httpClient.get<TargetList>(environment.apiUrl + 'target/', { params: { flight_id: flightId } }).map(res => {
      return new TargetListSerializer().deserialize(res);
    });
  }

  createTarget(flightId: string, targetId: string): Promise<any> {
    let params = new HttpParams().set('flight_id', flightId).set('target_id', targetId);
    return this.httpClient.request<any>(new HttpRequest("POST", environment.apiUrl + 'target', {}, { params: params })).toPromise();// post<any>(environment.apiUrl + 'target', {}, { params});
  }

  getTargetStatus(flightId: string, targetId: string): Observable<any> {
    return this.httpClient.get<Target>(environment.apiUrl + 'target/' + targetId, { params: { flight_id: flightId } });//.map(res => {
    // return new TargetSerializer().deserialize(res);
    // });
  }

  // azimuth
  getTargetAzimuthPointState(flightId: string, targetId: string): Observable<MarkerState> {
    return this.httpClient.get<MarkerState>(environment.apiUrl + 'target/' + targetId + '/ap', { params: { flight_id: flightId } }).map(res => {
      return new MarkerStateSerialzer().deserialize(res);
    })
  }

  createTargetAzimuthPoint(flightId: string, targetId: string, markerId: string): Promise<any> {
    let params = new HttpParams().set('flight_id', flightId).set('marker_id', markerId);
    return this.httpClient.request<any>(new HttpRequest("POST", environment.apiUrl + 'target/' + targetId + '/ap', {}, { params: params })).toPromise();
  }

  updateAzimuthPointPositionState(flightId: string, targetId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + 'target/' + targetId + '/ap', { state: state }, { params: { flight_id: flightId } });
  }

  // cp
  getTargetCentralPointState(flightId: string, targetId: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + 'target/' + targetId + '/cp', { params: { flight_id: flightId } });//.map(res => {
    //  return new MarkerStateSerialzer().deserialize(res);
    //});
  }

  createTargetCentralPoint(flightId: string, targetId: string, markerId: string): Promise<any> {
    let params = new HttpParams().set('flight_id', flightId).set('marker_id', markerId);
    return this.httpClient.request<any>(new HttpRequest("POST", environment.apiUrl + 'target/' + targetId + '/cp', {}, { params: params })).toPromise();
    //return this.httpClient.post<any>(environment.apiUrl + 'target/' + targetId + '/cp', { flight_id: flightId, marker_id: markerId });
  }

  updateCentralPointPositionState(flightId: string, targetId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + 'target/' + targetId + '/cp', { state: state }, { params: { flight_id: flightId } });
  }
  //rs
  getReferenceStationState(flightId: string, targetId: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + 'target/' + targetId + '/rs', { params: { flight_id: flightId } });//.map(res => {
    //   return new MarkerStateSerialzer().deserialize(res);
    // });
  }

  runReferenceStation(flightId: string, targetId: string, rsId: string): Promise<any> {
    let params = new HttpParams().set('flight_id', flightId).set('rs_id', rsId);
    return this.httpClient.request<any>(new HttpRequest("POST", environment.apiUrl + 'target/' + targetId + '/rs', {}, { params: params })).toPromise();
    //  return this.httpClient.post<any>(environment.apiUrl + 'target/' + targetId + '/rs', { flight_id: flightId, rs_id: rsId });
  }

  updateReferenceStationState(flightId: string, targetId: string, state: string): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + 'target/' + targetId + '/rs', { state: state }, { params: { flight_id: flightId } });
  }

  processFlightId(id: string) {
    this.flightIdSource.next(id);
  }

  //rtk server
  getRTKStatus(flightId: string, targetId: string): Observable<any> {
    return this.httpClient.get<Target>(environment.apiUrl + 'rtksrv', { params: { flight_id: flightId, target_id: targetId } });//.map(res => {
    // return new TargetSerializer().deserialize(res);
    // });
  }

  runRTK(flightId: string, targetId: string): Promise<any> {
    let params = new HttpParams().set('flight_id', flightId).set('target_id', targetId);
    return this.httpClient.request<any>(new HttpRequest("POST", environment.apiUrl + 'rtksrv', {}, { params: params })).toPromise();// post<any>(environment.apiUrl + 'target', {}, { params});
  }

  stopRTK(flightId: string, targetId: string): Promise<any> {
    return this.httpClient.delete<any>(environment.apiUrl + 'rtksrv', { params: { flight_id: flightId, target_id: targetId } }).toPromise();
  }

  rerunRTK(flightId: string, targetId: string, state):Promise<any>{
    let params = new HttpParams().set('flight_id', flightId).set('target_id', targetId);
    return this.httpClient.put<any>(environment.apiUrl + 'rtksrv', {state: state}, {params: params}).toPromise();
  }
}
