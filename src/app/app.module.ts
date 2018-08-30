import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainModule } from './main/main.module';
import { MapModule } from './map/map.module';
import { RoutingModule } from './routing/routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main/main.component';
import { MapComponent } from './map/map/map.component';
import { SideBarComponent } from './main/side-bar/side-bar.component';
import { ConsoleComponent } from './main/console/console.component';
import { ModalComponent } from './main/modal/modal.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MapComponent,
    SideBarComponent,
    ConsoleComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    MainModule,
    MapModule,
    RoutingModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
