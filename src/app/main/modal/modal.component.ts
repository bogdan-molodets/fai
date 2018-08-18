import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
declare const $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  index = 1;
  stateIndexes = [5,8,10];
  state ='';
  createReq: FormGroup;
  createMarkerReq: FormGroup;
  flight_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  target_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  rs_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  marker_id = new FormControl('', [Validators.required, Validators.minLength(1)]);
  constructor() {
    this.initForm();
   }

  ngOnInit() {
    
  }

  initForm() {
    this.createReq = new FormGroup({
      flight_id: this.flight_id,
      target_id: this.target_id,
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

  checkState(){
    return (this.stateIndexes.includes(this.index) && this.state!='ready');
  }

  previousStep() {
    if (this.index > 1) {
      $(`#${this.index}`).addClass('left').removeClass('active');
      this.state ='';
      this.index--;
      $(`#${this.index}`).addClass('active').removeClass('right');
    }
  }

  nextStep() {
    if (this.index < 10) {
      $(`#${this.index}`).addClass('right').removeClass('active');
      this.state ='';
      this.index++;
      $(`#${this.index}`).addClass('active').removeClass('left');
    }else if(this.index == 10){
      this.index = 1;
      $('app-modal').addClass('hide'); 
    }
  }

  runRS(){
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    setTimeout(() => {
      this.state = 'ready';
      $('.modal-content-text.active .ui.green.button').removeClass('loading');
    }, 5000);
  }

  runCP(){
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    setTimeout(() => {
      this.state = 'ready';
      $('.modal-content-text.active .ui.green.button').removeClass('loading');
    }, 5000);
  }

  runAP(){
    $('.modal-content-text.active .ui.green.button').addClass('loading');
    setTimeout(() => {
      this.state = 'ready';
      $('.modal-content-text.active .ui.green.button').removeClass('loading');
    }, 5000);
  }

}
