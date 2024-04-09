import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { StoriesComponent } from './stories/stories.component';
import { TaskManagerSummaryComponent } from './task-manager-summary/task-manager-summary.component';
import { TaskCreationComponent } from './task-creation/task-creation.component';
import { SprintCreationComponent } from './sprint-creation/sprint-creation.component';
import { TaskmainpageComponent } from './taskmainpage/taskmainpage.component';
import { TaskviewsComponent } from './taskviews/taskviews.component';

const routes: Routes = [
  // {path:"task-management",component:TaskManagementComponent,
  // children: [
  //   { path: 'stories', component: StoriesComponent },
  //   { path: 'story-summary', component: StorySummaryComponent } // Child route for 'stories'
    
  //   // Add more child routes within 'task-management' as needed
  // ]},
 
  // {path:"story-summary",component:StorySummaryComponent},

  { path: 'stories', component: StoriesComponent,canActivate:[CanActivateGuardService]},
  { path: 'task_manage_summary', component:TaskManagerSummaryComponent,canActivate:[CanActivateGuardService]},
  { path: 'task_creation', component:TaskCreationComponent},
  { path: 'sprint_creation', component: SprintCreationComponent},
  { path: 'task_singleView/:id', component: TaskviewsComponent}
  // { path: 'task_manage_summary', component:TaskmainpageComponent,canActivate:[CanActivateGuardService]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagerRoutingModule { }
