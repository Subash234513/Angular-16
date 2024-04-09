import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExecutivetaskComponent } from './executivetask/executivetask.component';
import { FetcustomerComponent } from './fetcustomer/fetcustomer.component';
import { FetviewComponent } from './fetview/fetview.component';
import { MainComponent } from './main/main.component';



const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: 'main', component: MainComponent,
        children: [
          { path: 'fetview', component: FetviewComponent },
          { path: 'executivecustomersummary', component: FetcustomerComponent },
          { path: 'executivetask',component:ExecutivetaskComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FETRoutingModule { }
