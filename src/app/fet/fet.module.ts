import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { FETRoutingModule } from './fet-routing.module';
// import { AgmCoreModule } from '@agm/core';
import { MainComponent } from './main/main.component';
import { FetviewComponent } from './fetview/fetview.component';
import { FetcustomerComponent } from './fetcustomer/fetcustomer.component';
import { ExecutivetaskComponent } from './executivetask/executivetask.component';



@NgModule({
  declarations: [MainComponent,FetviewComponent, FetcustomerComponent, ExecutivetaskComponent],
  imports: [
    CommonModule,MaterialModule,
    FETRoutingModule,FormsModule,ReactiveFormsModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyDzR2M-IsC07ZP1vwiLKgvhIKZhqSMngC8'
    // })
  ]
})

export class FETModule { }
