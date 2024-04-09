import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { EmployeeInfoSummaryComponent } from './EMPData/employee-info-summary/employee-info-summary.component';
import { EmployeeInfoComponent } from './EMPData/employee-info/employee-info.component';
import { EmployeeInfoCreateComponent } from './EMPData/employee-info-create/employee-info-create.component';
import { AttendanceMasterComponent } from './attendance-master/attendance-master.component';
// import { LeaveRequestComponent } from './leave-request/leave-request.component';
// import { AttendanceComponent } from './attendance/attendance.component'; 
import { DocumentsComponent } from './documents/documents.component';
import { AttendancePageComponent } from './Attendance/attendance-page/attendance-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrackemployeeComponent } from './Attendance/trackemployee/trackemployee.component';
import { FetviewComponent } from './Attendance/fetview/fetview.component';
import { PostJobComponent } from './Recruitment/post-job/post-job.component';
import { RecruitmentBasePageComponent } from './Recruitment/recruitment-base-page/recruitment-base-page.component';
import { LeaveRequestPageComponent } from './LeaveRequest/leave-request-page/leave-request-page.component';
import { AttendanceLogComponent } from './Attendance/attendance-log/attendance-log.component'; 
import { EmployeeDataComponent } from './EMPData/employee-data/employee-data.component';
import { LeaveRequestSummaryComponent } from './LeaveRequest/leave-request-summary/leave-request-summary.component';
import { HrmsReportComponent } from './HRMS_Report/hrms-report/hrms-report.component';
import { HRPageComponent } from './HRMS_Report/hr-page/hr-page.component';
import { RoutepagesComponent } from './LandingPages/routepages/routepages.component';
import { AttendanceFullReportComponent } from './Attendance/attendance-full-report/attendance-full-report.component';
import { RequestChangeComponent } from './LeaveRequest/request-change/request-change.component';
import { TrackLeaveRequestComponent } from './LeaveRequest/track-leave-request/track-leave-request.component';
import { CanActivateGuardService } from '../can-activate-guard.service';
import { HRUpdateEMPCreateComponent } from './EMPData/hr-update-emp-create/hr-update-emp-create.component';
import { HRUpdateEMPBasicDetailsComponent } from './EMPData/hr-update-emp-basic-details/hr-update-emp-basic-details.component';
import { LeaveHistoryComponent } from './LeaveRequest/leave-history/leave-history.component';
import { EmployeeEducationComponent } from './EMPData/AllEmployeeDetails/employee-education/employee-education.component';
import { EmployeeInfoEditRoutesComponent } from './EMPData/AllEmployeeDetails/employee-info-edit-routes/employee-info-edit-routes.component';
import { EmployeeExperienceComponent } from './EMPData/AllEmployeeDetails/employee-experience/employee-experience.component';
import { EmployeeBankDetailsComponent } from './EMPData/AllEmployeeDetails/employee-bank-details/employee-bank-details.component';
import { EmployeeDocumentsComponent } from './EMPData/AllEmployeeDetails/employee-documents/employee-documents.component';
import { EmployeeFamilyInfoComponent } from './EMPData/AllEmployeeDetails/employee-family-info/employee-family-info.component';
import { OndutyrequestComponent } from './LeaveRequest/ondutyrequest/ondutyrequest.component';
import { HrManualRunComponent } from './hr-manual-run/hr-manual-run.component';
import { EmployeeManualRunComponent } from './employee-manual-run/employee-manual-run.component';
import { EmployeeLocationComponent } from './employee-location/employee-location.component';
import { EmergencyInfoComponent } from './emergency-info/emergency-info.component';
const routes: Routes = [ 
  //
  {path: 'employeeInfo', component: EmployeeInfoComponent, canActivate:[CanActivateGuardService]},
  {path: 'empsummary', component: EmployeeInfoSummaryComponent, canActivate:[CanActivateGuardService]},
  // {path:'employeeEducation',component: EmployeeEducationComponent,canActivate:[CanActivateGuardService]},
{path:'employeeInfoRoutes', children: [
  { path: 'employee-education', component: EmployeeEducationComponent },
  {path:'employee-experience', component: EmployeeExperienceComponent},
  {path:'employee-bank-details', component: EmployeeBankDetailsComponent},
  {path:'employee-documents', component: EmployeeDocumentsComponent},
  {path:'employee-family-info', component: EmployeeFamilyInfoComponent},


],component:EmployeeInfoEditRoutesComponent,canActivate:[CanActivateGuardService]},
// {path:'employee-education',component:EmployeeEducationComponent,canActivate:[CanActivateGuardService]},
  //

  {path: 'employeeCreate', component: EmployeeInfoCreateComponent, canActivate:[CanActivateGuardService] },
  { path: 'attendancemaster' ,component:AttendanceMasterComponent, canActivate:[CanActivateGuardService]},
  // { path: 'leaverequest', component: LeaveRequestComponent},
  // {path: 'attendance', component: AttendanceComponent},
  {path: 'attendance', component: AttendancePageComponent, canActivate:[CanActivateGuardService]},
  {path: 'employeedoument', component: DocumentsComponent, canActivate:[CanActivateGuardService]},
  {path: 'dashboard', component: DashboardComponent, canActivate:[CanActivateGuardService]},
  {path: 'trackemp', component: TrackemployeeComponent, canActivate:[CanActivateGuardService]},
  {path:'fetview', component:FetviewComponent, canActivate:[CanActivateGuardService]},
  {path: 'postjob', component: PostJobComponent, canActivate:[CanActivateGuardService]},
  {path: 'recruitmentprocess', component: RecruitmentBasePageComponent, canActivate:[CanActivateGuardService] },
  {path: 'logs', component: AttendanceLogComponent, canActivate:[CanActivateGuardService]  },
  {path: 'empdetails', component: EmployeeDataComponent, canActivate:[CanActivateGuardService] },
  {path: 'empCreate', component:HRUpdateEMPCreateComponent, canActivate:[CanActivateGuardService]},
  {path: 'empEdit', component:HRUpdateEMPBasicDetailsComponent, canActivate:[CanActivateGuardService]},

  {path: 'hrmsview', component: RoutepagesComponent, canActivate:[CanActivateGuardService],
  children:[

  ////// EMP summary, Emp view, Emp create  
  {path: 'empsummary', component: EmployeeInfoSummaryComponent, canActivate:[CanActivateGuardService]},
  {path: 'employeeInfo', component: EmployeeInfoComponent, canActivate:[CanActivateGuardService]},
  // {path:'employeeInfoEditView',component: EmployeeInfoEditViewComponent,canActivate:[CanActivateGuardService]},



  ////// leave balance counts
  {path: 'leavebalancecounts', component: HRPageComponent, canActivate:[CanActivateGuardService]},

  ////// HRMS Report 
  {path: 'hrmsempreport', component: HrmsReportComponent, canActivate:[CanActivateGuardService]},
  {path: 'attendancereport', component: AttendanceFullReportComponent, canActivate:[CanActivateGuardService] },

    ///// leave Request 

    {path: 'leavesummary', component: LeaveRequestSummaryComponent, canActivate:[CanActivateGuardService] },
    {path: 'leaverequest', component: LeaveRequestPageComponent, canActivate:[CanActivateGuardService] },
    {path: 'attendancechangerequest', component: RequestChangeComponent, canActivate:[CanActivateGuardService]},
    {path: 'leavereport', component: TrackLeaveRequestComponent, canActivate:[CanActivateGuardService]},
    {path: 'leavehistory', component: LeaveHistoryComponent, canActivate:[CanActivateGuardService] },
    {path: 'odrequest', component: OndutyrequestComponent, canActivate:[CanActivateGuardService]},
    {path: 'HrManualRun',component:HrManualRunComponent, canActivate:[CanActivateGuardService]},
    {path: 'EmpManualRun',component:EmployeeManualRunComponent, canActivate:[CanActivateGuardService]},
    {path: 'EmpLocation',component:EmployeeLocationComponent, canActivate:[CanActivateGuardService]},
    {path: 'Emergency',component:EmergencyInfoComponent, canActivate:[CanActivateGuardService]},
// {path: 'employee-education',component: EmployeeEducationComponent, canActivate:[CanActivateGuardService]},
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HRMSRoutingModule { }
