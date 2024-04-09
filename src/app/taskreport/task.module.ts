import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TaskRoutingModule } from './task-routing.module';

import { TasksummaryComponent } from './tasksummary/tasksummary.component';
import { TaskCreateComponent } from './task-create/task-create.component';




import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TaskViewComponent } from './task-view/task-view.component';
import { EMPTaskCreateComponent } from './EmpTask/emptask-create/emptask-create.component';
import { EmpTaskSummaryComponent } from './EmpTask/emp-task-summary/emp-task-summary.component';
import { TaskmasterComponent } from './taskmaster/taskmaster.component';
import { TaskchartComponent } from './taskchart/taskchart.component';
import { WeeklychartComponent } from './weeklychart/weeklychart.component';
import { MonthlychartComponent } from './monthlychart/monthlychart.component'
import { TimeSheetComponent } from './EmpTask/time-sheet/time-sheet.component'
import * as imp from '../AppAutoEngine/import-services/CommonimportFiles';
import { ClientViewComponent } from './client-view/client-view.component';
import { ActivityComponent } from './activity/activity.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ModuleViewComponent } from './module-view/module-view.component';
import { MappingViewComponent } from './mapping-view/mapping-view.component';
import { TeamViewComponent } from './team-view/team-view.component';
import { PipelineViewComponent } from './pipeline-view/pipeline-view.component';
import { TaskApprovalComponent } from './task-approval/task-approval.component';
import { CategoryComponent } from './category/category.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { AuditMappingComponent } from './audit-mapping/audit-mapping.component';

@NgModule({
  declarations: [
    TasksummaryComponent, TaskCreateComponent, TaskViewComponent, EMPTaskCreateComponent, EmpTaskSummaryComponent, TaskmasterComponent, TaskchartComponent, WeeklychartComponent, MonthlychartComponent,TimeSheetComponent,ClientViewComponent, ActivityComponent, ProjectViewComponent, ModuleViewComponent, MappingViewComponent, TeamViewComponent, PipelineViewComponent, TaskApprovalComponent, CategoryComponent, SubcategoryComponent, AuditMappingComponent],
  imports: [
    CommonModule,
    TaskRoutingModule,
    ReactiveFormsModule, FormsModule,
    MaterialModule, SharedModule, PdfViewerModule
  ],
  providers:[imp.HrmsAPI]
})
export class TaskModule { }
