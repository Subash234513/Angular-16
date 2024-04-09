import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksummaryComponent } from './tasksummary/tasksummary.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskmasterComponent } from './taskmaster/taskmaster.component';
import { EmpTaskSummaryComponent } from './EmpTask/emp-task-summary/emp-task-summary.component';

const routes: Routes = [
  {path: 'tasksummary', component:TasksummaryComponent},
  {path: 'taskcreate', component:TaskCreateComponent},
  {path: 'taskview', component:TaskViewComponent},
  {path: 'taskmaster',component:TaskmasterComponent},
  {path: 'mytask/:data', component: EmpTaskSummaryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
