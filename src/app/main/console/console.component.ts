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
  logs = [];
  constructor(private rtmls: RtmlsService) {

  }

  ngOnInit() {
    this.rtmls.currentflightId.subscribe(resf => {
      console.log(resf);
      if (resf) {
        this.date = '2018-01-01 01:01:01';
        this.rtmls.readLogs(this.date).pipe(
          expand(ex => {
            return this.rtmls.readLogs(this.date).pipe(delay(1000));
          }
          )
        ).subscribe(res => {

          this.logs=this.logs.concat(res.log);
          if (res.log.length > 0) {          
            this.date = this.logs[0].timestamp;
          }
        });

      }

    });


  }

  closeLogs() {
    $('app-console').removeClass('show');
    $(".viewLogs").removeAttr("disabled").removeClass('grey');
  }

  setWide(){
    if ($('app-console').hasClass('wide')){
      $('app-console').removeClass('wide');
      $('.window.minimize.icon').removeClass('minimize').addClass('maximize');
    }else{
      $('app-console').addClass('wide');
      $('.window.maximize.icon').removeClass('maximize').addClass('minimize');
    }
    
  }

  ngOnDestroy() {
    this._alive = false;
  }

  isDark(){
    return $('app-main').hasClass('dark');
  }
  
  getFormatedDate(): string {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  }
}
