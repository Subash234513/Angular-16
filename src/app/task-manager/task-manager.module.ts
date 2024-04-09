import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { MaterialModule } from "../material/material.module";
import { PdfViewerModule } from "ng2-pdf-viewer";

import { TaskManagerRoutingModule } from "./task-manager-routing.module";

import { StoriesComponent } from "./stories/stories.component";
import { TaskManagerSummaryComponent } from "./task-manager-summary/task-manager-summary.component";
import { TaskCreationComponent } from "./task-creation/task-creation.component";
import { SprintCreationComponent } from "./sprint-creation/sprint-creation.component";
import { IconDialogComponent } from "./icon-dialog/icon-dialog.component";
import { TaskeditComponent } from "./taskedit/taskedit.component";
import { DialogfilterComponent } from "./dialogfilter/dialogfilter.component";
import { DevTypeDialogComponent } from "./dev-type-dialog/dev-type-dialog.component";
import { IssuecreationComponent } from "./issuecreation/issuecreation.component";
import { TaskmainpageComponent } from "./taskmainpage/taskmainpage.component";
import { ChatboxComponent } from "./chatbox/chatbox.component";
import { PipelinecreateComponent } from "./pipelinecreate/pipelinecreate.component";
import { TimesheetComponent } from "./timesheet/timesheet.component";
import { PipelineComponent } from "./pipeline/pipeline.component";
import { IssuesComponent } from "./issues/issues.component";
import { BacklogComponent } from "./backlog/backlog.component";
import { TasksComponent } from "./tasks/tasks.component";
import { StoriesmainComponent } from "./storiesmain/storiesmain.component";
import { SprintmainComponent } from "./sprintmain/sprintmain.component";
import { TaskviewsComponent } from "./taskviews/taskviews.component";
import { TimesheetaddComponent } from "./timesheetadd/timesheetadd.component";
import { IssueviewComponent } from './issueview/issueview.component';
import { MeetingComponent } from './meeting/meeting.component';
import { ReportIconComponent } from "./report-icon/report-icon.component";
import { ReportMytaskComponent } from "./report-mytask/report-mytask.component";
import { ReportGanttchartComponent } from './report-ganttchart/report-ganttchart.component';
import { PipelinetransactionComponent } from './pipelinetransaction/pipelinetransaction.component';
import { PipelinereleaseComponent } from './pipelinerelease/pipelinerelease.component';
import { BrdsummaryComponent } from './brdsummary/brdsummary.component';
import { BrdaddComponent } from './brdadd/brdadd.component';
import { ClientreportComponent } from './clientreport/clientreport.component';
import { BrdviewComponent } from './brdview/brdview.component';
// import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component'
import { ReportDashboardComponent } from "./report-dashboard/report-dashboard.component";
import { MonthlydataComponent } from './monthlydata/monthlydata.component';

@NgModule({
  declarations: [
    StoriesComponent,
    TaskManagerSummaryComponent,
    TaskCreationComponent,
    SprintCreationComponent,
    IconDialogComponent,
    TaskeditComponent,
    DialogfilterComponent,
    DevTypeDialogComponent,
    IssuecreationComponent,
    TaskmainpageComponent,
    ChatboxComponent,
    PipelinecreateComponent,
    TimesheetComponent,
    PipelineComponent,
    IssuesComponent,
    BacklogComponent,
    TasksComponent,
    StoriesmainComponent,
    SprintmainComponent,
    TaskviewsComponent,
    TimesheetaddComponent,
    IssueviewComponent,
    MeetingComponent,
    ReportIconComponent,
    ReportMytaskComponent,
    ReportGanttchartComponent,
    PipelinetransactionComponent,
    PipelinereleaseComponent,
    BrdsummaryComponent,
    BrdaddComponent,
    ClientreportComponent,
    BrdviewComponent,
    ReportDashboardComponent,
    MonthlydataComponent,
   
  ],
  imports: [
    CommonModule,
    TaskManagerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
    PdfViewerModule,
  ],
})
export class TaskManagerModule {}
