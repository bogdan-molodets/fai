import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
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
  codePattern = "[A-F0-9]{4,4}";
  index = 1;
  stateIndexes = [4, 7, 9];
  state = '';
  createReqRS: FormGroup;
  createReq: FormGroup;
  createMarkerReq: FormGroup;
  flight_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  target_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  rs_id = new FormControl('', [Validators.required, Validators.pattern(this.codePattern)]);
  marker_id = new FormControl('', [Validators.required, Validators.pattern(this.codePattern)]);

  @Output() changeRS: EventEmitter<Object> = new EventEmitter();
  @Output() changeCP: EventEmitter<Object> = new EventEmitter();
  @Output() changeAP: EventEmitter<Object> = new EventEmitter();
  @Output() changeFlightId: EventEmitter<String> = new EventEmitter();
  @Output() changeTargetId: EventEmitter<String> = new EventEmitter();

  constructor(private rtmls: RtmlsService) {
    this.initForm();
  }

  ngOnInit() {
    this.createReqRS.valueChanges.subscribe((val) => {
      if (this.createReqRS.dirty && this.createReqRS.invalid) {
        this.state = 'Error. Id lenght must have 4 symbol length. Use only A-F or 0-9.'
      } else {
        this.state = ''
      }
    }
    );
  }
  @HostListener('window:resize') onResize() {
    /**if(($(`.noimg`).height() + $(`#${this.index} img`).height()) > $(`.active`).outerHeight(true)){
      let res = ($(`#${this.index} img`).height()  - $(`.noimg`).height() - $(`#${this.index} img`).height() + $(`.active`).outerHeight(true));
      $(`#${this.index} img`).css('height', 0);
      $(`#${this.index} img`).css('width', 'auto');
    }else{
      $(`#${this.index} img`).css('height', '');
      $(`#${this.index} img`).css('width', '');
    }**/
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
      /**case 1:
        return this.createReq.invalid;
      case 5:
        return this.createReqRS.invalid;**/
      case 4: 
        //console.log(this.createReq.invalid || this.createReqRS.invalid);
        return this.createReq.invalid || this.createReqRS.invalid;
      case 6:
        return this.createMarkerReq.invalid;
      default:
        return false;
    }
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
    if (this.index < 9) {
      $(`#${this.index}`).addClass('right').removeClass('active');
      this.state = '';
      this.index++;
      $(`#${this.index}`).addClass('active').removeClass('right');
    } else if (this.index == 9) {
      this.index = 1;
      $('app-modal').addClass('hide');
      this.changeFlightId.emit(this.flight_id.value);
      this.changeTargetId.emit(this.target_id.value);
    }
  }

  isDark() {
    return $('app-main').hasClass('dark');
  }

  reset(index) {
    $(`#${this.index}`).addClass('right').removeClass('active');
    this.state = '';
    this.index = index;
    $(`#${this.index}`).addClass('active').removeClass('right');
  }

  createRS() {
    let alive = true;
    $('.modal-content-text.active .ui.orange.button').addClass('loading');
    $('.modal-content-text.active .ui.orange.button').addClass('disabled');
    this.rtmls.createTarget(this.flight_id.value, this.target_id.value).then(res => {
      if (res.statusText == "OK") {
        this.state = res.statusText;
        this.nextStep();
      }
      $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      $('.modal-content-text.active .ui.orange.button').removeClass('disabled');
    }, error => {
      this.state = `${error.error.detail.status}. ${error.error.detail.message}`
      $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      $('.modal-content-text.active .ui.orange.button').removeClass('disabled');
    })
    this.rtmls.processFlightId(this.flight_id.value);
  }

  runRS() {
    let alive = true;
    $('.modal-content-text.active .ui.orange.button').addClass('loading');
    $('.modal-content-text.active .ui.orange.button').addClass('disabled');
    // create rs
    this.rtmls.createTarget(this.flight_id.value, this.target_id.value).then(res => {
      if (res.statusText == "OK") {
        this.rtmls.processFlightId(this.flight_id.value);
        this.rtmls.runReferenceStation(this.flight_id.value, this.target_id.value, this.rs_id.value).then(runres => {
          if (runres.statusText == "OK") {
            // if (runres.statusText != "OK") {
            // get state untill ready
            this.rtmls.getReferenceStationState(this.flight_id.value, this.target_id.value).pipe(
              repeatWhen(() => interval(1000)),
              takeWhile(() => alive)
            ).subscribe(res => {
              this.state = res.state;
              if (res.state == 'ready') {
                alive = false;
                this.state = 'ready';
                this.changeRS.emit(res);
                $('.modal-content-text.active .ui.orange.button').removeClass('loading');
              }
            });
          }

        });

      }
      // $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      // $('.modal-content-text.active .ui.orange.button').removeClass('disabled');
    }, error => {
      this.state = `${error.error.detail.status}. ${error.error.detail.message}`
      $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      $('.modal-content-text.active .ui.orange.button').removeClass('disabled');
    })


  }

  runCP() {
    let alive = true;
    $('.modal-content-text.active .ui.orange.button').addClass('loading');
    //run cp
    this.rtmls.createTargetCentralPoint(this.flight_id.value, this.target_id.value, this.marker_id.value).then(res => {
      // get state cp
      if (res.statusText == "OK") {
        // if (res.statusText != "OK") {
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
            $('.modal-content-text.active .ui.orange.button').removeClass('loading');
          }
        });
      }
      //for demo
      // else {
      //   setTimeout(() => {
      //     this.state = 'init';
      //   }, 3000);
      //   setTimeout(() => {
      //     this.state = 'processing';
      //   }, 6000);
      //   setTimeout(() => {
      //     this.state = 'ready';
      //     alive = false;
      //     this.state = 'ready';
      //     this.changeCP.emit({
      //       llh: {
      //         hgt: 0,
      //         lat: 48.437348,
      //         lon: 35.035374
      //       },
      //       state: 'ready'
      //     });
      //     $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      //   }, 9000);
      // }
      //end of shit
    });
  }

  runAP() {
    let alive = true;
    $('.modal-content-text.active .ui.orange.button').addClass('loading');
    this.rtmls.createTargetAzimuthPoint(this.flight_id.value, this.target_id.value, this.marker_id.value).then(res => {
      if (res.statusText == "OK") {
        //  if (res.statusText != "OK") {
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
            $('.modal-content-text.active .ui.orange.button').removeClass('loading');
            // draw target
          }
        });
      }
      //for demo
      // else {
      //   setTimeout(() => {
      //     this.state = 'init';
      //   }, 3000);
      //   setTimeout(() => {
      //     this.state = 'processing';
      //   }, 6000);
      //   setTimeout(() => {
      //     this.state = 'ready';
      //     alive = false;
      //     this.state = 'ready';
      //     this.changeAP.emit({
      //       llh: {
      //         hgt: 0,
      //         lat: 48.437425,
      //         lon: 35.035179
      //       },
      //       state: 'ready'
      //     });
      //     $('.modal-content-text.active .ui.orange.button').removeClass('loading');
      //   }, 9000);
      // }
      //end of shit
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
