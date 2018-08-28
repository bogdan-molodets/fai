import { Component, OnInit } from '@angular/core';

import { map, repeatWhen, retryWhen, takeWhile, delay, take, expand } from 'rxjs/operators';
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
  private date: string;
  constructor(private rtmls: RtmlsService) {

  }

  ngOnInit() {
    this.rtmls.currentflightId.pipe(takeWhile(() => this._alive)).subscribe(res => {
      this.date = this.getFormatedDate();
      this.rtmls.readLogs(this.date, res).pipe(
        expand(ex => {
          this.date = this.getFormatedDate();
          return this.rtmls.readLogs(this.date, res).pipe(delay(1000));
        }
        )
      ).subscribe(res => {
        console.log(res);
      });

    });


  }

  closeLogs() {
    $('app-console').removeClass('show');
    $(".viewLogs").removeAttr("disabled").removeClass('grey');
  }

  ngOnDestroy() {
    this._alive = false;
  }


  getFormatedDate(): string {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }
}
