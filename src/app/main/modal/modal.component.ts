import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { RtmlsService } from '../../rtmls/rtmls.service';
import { map, repeatWhen, retryWhen, takeWhile, delay, take } from 'rxjs/operators';
import { Observable, interval } from 'rxjs';
declare const $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  private alive = true;
  index = 1;
  stateIndexes = [1, 5, 8, 10];
  state = '';
  createReqRS: FormGroup;
  createReq: FormGroup;
  createMarkerReq: FormGroup;
  flight_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  target_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  rs_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  marker_id = new FormControl('', [Validators.required, Validators.minLength(1)]);

  @Output() changeRS: EventEmitter<Object> = new EventEmitter();
  @Output() changeCP: EventEmitter<Object> = new EventEmitter();
  @Output() changeAP: EventEmitter<Object> = new EventEmitter();

  constructor(private rtmls: RtmlsService) {
    this.initForm();
  }

  ngOnInit() {

  }

  initForm() {
    this.createReq = new FormGroup({
      flight_id: this.flight_id,
      target_id: this.target_id,
    });
    this.createReqRS = new FormGroup({
      rs_id: this.rs_id
    });
    this.createMarkerReq = new FormGroup({
      marker_id: this.marker_id
    });
  }

  checkInValid(index) {
    switch (index) {
      case 1:
        return this.createReq.invalid;
      case 6:
        return this.createMarkerReq.invalid;
      default:
        return false;
    }
    //return this.createReq.invalid && this.index == 1;
  }

  checkState() {
    return (this.stateIndexes.includes(this.index) && this.state != 'ready' && this.state != "OK");
  }

  previousStep() {
    if (this.index > 1) {
      $(`#${this.index}`).addClass('right').removeClass('active');
      this.state = '';
      this.index--;
      $(`#${this.index}`).addClass('active').removeClass('right');
    }
  }

  nextStep() {
    if (this.index < 10) {
      $(`#${this.index}`).addClass('right').removeClass('active');
      this.state = '';
      this.index++;
      $(`#${this.index}`).addClass('active').removeClass('right');
    } else if (this.index == 10) {
      this.index = 1;
      $('app-modal').addClass('hide');
    }
  }

  reset(index) {
    $(`#${this.index}`).addClass('right').removeClass('active');
    this.state = '';
    this.index = index;
    $(`#${this.index}`).addClass('active').removeClass('right');
  }

  createRS() {
    let alive = true;
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    this.rtmls.createTarget(this.flight_id.value, this.target_id.value).subscribe(res => {
      if (res.statusText == "OK") {
        this.state = res.statusText;
      }
      $('.modal-content-text.active .ui.green.button').removeClass('loading');
    }, error => {
      this.state = `${error.error.detail.status}. ${error.error.detail.message}`
      $('.modal-content-text.active .ui.green.button').removeClass('loading');
    })
    this.rtmls.processFlightId(this.flight_id.value);
  }

  runRS() {
    let alive = true;
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    // create rs
    this.rtmls.runReferenceStation(this.flight_id.value, this.target_id.value, this.rs_id.value).subscribe(runres => {
      if (runres.statusText == "OK") {
        // get state untill ready
        this.rtmls.getReferenceStationState(this.flight_id.value, this.target_id.value).pipe(
          repeatWhen(() => interval(1000)),
          takeWhile(() => alive)
        ).subscribe(res => {
          this.state = res.state;
          if (res.state == 'ready') {
            console.log(res);
            alive = false;
            this.state = 'ready';
            this.changeRS.emit(res);
            $('.modal-content-text.active .ui.green.button').removeClass('loading');
          }
        });
      }
    });
   
    // setTimeout(() => {
    //   this.state = 'ready';
    //   $('.modal-content-text.active .ui.green.button').removeClass('loading');
    // }, 5000);
  }

  runCP() {
    let alive = true;
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    //run cp
    this.rtmls.createTargetCentralPoint(this.flight_id.value, this.target_id.value, this.marker_id.value).subscribe(res => {
      // get state cp
      console.log(res);
      if (res.statusText == "OK") {
        this.rtmls.getTargetCentralPointState(this.flight_id.value, this.target_id.value).pipe(
          repeatWhen(() => interval(1000)),
          takeWhile(() => alive)
        ).subscribe(res => {
          this.state = res.state;
          if (res.state == 'ready') {
            console.log(res);
            alive = false;
            this.state = 'ready';
            this.changeCP.emit(res);
            $('.modal-content-text.active .ui.green.button').removeClass('loading');
          }
        });
      }
    });
    // setTimeout(() => {
    //   this.state = 'ready';
    //   $('.modal-content-text.active .ui.green.button').removeClass('loading');
    // }, 5000);
  }

  runAP() {
    let alive = true;
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    this.rtmls.createTargetAzimuthPoint(this.flight_id.value, this.target_id.value, this.marker_id.value).subscribe(res => {
      if (res.statusText == "OK") {
        this.rtmls.getTargetAzimuthPointState(this.flight_id.value, this.target_id.value).pipe(
          repeatWhen(() => interval(1000)),
          takeWhile(() => alive)
        ).subscribe(res => {
          this.state = res.state;
          if (res.state == 'ready') {
            console.log(res);
            alive = false;
            this.state = 'ready';
            this.changeAP.emit(res);
            $('.modal-content-text.active .ui.green.button').removeClass('loading');
            // draw target
          }
        });
      }
    });
    // setTimeout(() => {
    //   this.state = 'ready';
    //   $('.modal-content-text.active .ui.green.button').removeClass('loading');
    // }, 5000);
  }


  ngOnDestroy() {
    this.alive = false;
  }
}
