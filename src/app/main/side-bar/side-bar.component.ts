import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  hideSideBar(){
    $('app-side-bar').removeClass('show');
    $('.shadow').removeClass('show');
  }

}
