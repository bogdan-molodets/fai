import { Component, OnInit } from '@angular/core';

import { map, repeatWhen, retryWhen, takeWhile, delay, take } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';
import { RtmlsService } from '../../rtmls/rtmls.service';
declare const $: any;

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  private _alive = true;
  constructor(private rtmls: RtmlsService) {

  }

  ngOnInit() {
    // this.rtmls.readLogs('2018-08-18 12:12:34', 'test_id'). pipe(
     
    //   repeatWhen(() => interval(1000)),      
    //   takeWhile(() => this._alive)
    // ).subscribe(res => {
    //   console.log(res);
    // });

  }

  closeLogs() {
    $('app-console').removeClass('show');
    $(".viewLogs").removeAttr("disabled").removeClass('grey');
  }

  ngOnDestroy() {
    this._alive = false;
  }

}
