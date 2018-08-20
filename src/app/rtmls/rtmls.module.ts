import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtmlsService } from './rtmls.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
   HttpClientModule
  ],
  declarations: [],
  providers:[RtmlsService],
  
})
export class RtmlsModule { }
