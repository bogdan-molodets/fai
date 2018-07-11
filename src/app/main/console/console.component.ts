import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeLogs(){
    $('app-console').removeClass('show');
    $(".viewLogs").removeAttr("disabled").removeClass('grey');
  }

}
