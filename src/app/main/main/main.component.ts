import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }
  valueRS = {};
  valueAP = {};
  valueCP = {};
  valueFlightId;
  valueTargetId;
  ngOnInit() {
  }

  viewLogs(){
    $('app-console').addClass('show');
    $(".viewLogs").attr("disabled", true).addClass('grey');
  }

  viewSideBar(){
    $('app-side-bar').addClass('show');
    $('.shadow').addClass('show');
  }

  hideSideBar(){
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
  }
  viewRS(e){
    console.log(e);
    this.valueRS = e;
  }
  viewCP(e){
    console.log(e);
    this.valueCP = e;
  }
  viewAP(e){
    console.log(e);
    this.valueAP = e;  
  }
  viewFlightId(e){
    console.log(e);
    this.valueFlightId = e;  
  }
  viewTargetId(e){
    console.log(e);
    this.valueTargetId = e;  
  }
}
