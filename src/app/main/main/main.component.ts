import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

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
}
