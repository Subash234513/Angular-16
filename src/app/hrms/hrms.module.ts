import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HRMSRoutingModule } from './hrms-routing.module';  
import { EmployeeInfoComponent } from './EMPData/employee-info/employee-info.component';
import { EmployeeInfoSummaryComponent } from './EMPData/employee-info-summary/employee-info-summary.component';
import { EmployeeInfoCreateComponent } from './EMPData/employee-info-create/employee-info-create.component'; 
// import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { AttendanceMasterComponent } from './attendance-master/attendance-master.component';
// import { AttendanceComponent } from './attendance/attendance.component';
import { DocumentsComponent } from './documents/documents.component';
import { AttendanceLogComponent } from './Attendance/attendance-log/attendance-log.component';
import { AttendanceReportComponent, CustomDateFormat2 } from './Attendance/attendance-report/attendance-report.component';
import { AttendancePageComponent } from './Attendance/attendance-page/attendance-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostJobComponent } from './Recruitment/post-job/post-job.component';
import { RecruitmentBasePageComponent } from './Recruitment/recruitment-base-page/recruitment-base-page.component';
import { LeaveRequestPageComponent } from './LeaveRequest/leave-request-page/leave-request-page.component';
import { LeaveRequestSummaryComponent } from './LeaveRequest/leave-request-summary/leave-request-summary.component';
import { LeaveRequestCreateComponent } from './LeaveRequest/leave-request-create/leave-request-create.component';
// import { LeaveRequestViewComponent } from './LeaveRequest/leave-request-view/leave-request-view.component'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { PostjobCreateComponent } from './Recruitment/postjob-create/postjob-create.component';
import { AmountPipePipe } from '../AppAutoEngine/Pipes/amount-pipe.pipe';
import { PostJobViewComponent } from './Recruitment/post-job-view/post-job-view.component';
import { TrackemployeeComponent } from './Attendance/trackemployee/trackemployee.component'; 
// import { AgmCoreModule } from '@agm/core';
import { TrackLeaveRequestComponent, CustomDateFormatLR } from './LeaveRequest/track-leave-request/track-leave-request.component';
import { AttendanceFullReportComponent, FullCustomDateFormat2 } from './Attendance/attendance-full-report/attendance-full-report.component';
import { MonthYearFormatDirective } from './month-year-format.directive';
import { RequestChangeComponent } from './LeaveRequest/request-change/request-change.component';
import { FetviewComponent } from './Attendance/fetview/fetview.component';
import { RequestChangeCreateComponent } from './LeaveRequest/request-change-create/request-change-create.component';
import { PenaltyComponent } from './HRMS_Master/penalty/penalty.component';
import { SpecialPermissionComponent } from './HRMS_Master/special-permission/special-permission.component';
import { HolidayComponent } from './HRMS_Master/holiday/holiday.component';
import { EmployeeDataComponent } from './EMPData/employee-data/employee-data.component';
import { HrmsReportComponent } from './HRMS_Report/hrms-report/hrms-report.component';
import { HRPageComponent } from './HRMS_Report/hr-page/hr-page.component';
import { RoutepagesComponent } from './LandingPages/routepages/routepages.component';
import { EMPHierarchyComponent } from './HRMS_Master/emp-hierarchy/emp-hierarchy.component';
import { HRUpdateEMPBasicDetailsComponent } from './EMPData/hr-update-emp-basic-details/hr-update-emp-basic-details.component';
import { HRUpdateEMPCreateComponent } from './EMPData/hr-update-emp-create/hr-update-emp-create.component';
import { LeaveHistoryComponent } from './LeaveRequest/leave-history/leave-history.component';
import { EmployeeEducationComponent } from './EMPData/AllEmployeeDetails/employee-education/employee-education.component'; 
import {MatStepperModule} from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { EmployeeInfoEditRoutesComponent } from './EMPData/AllEmployeeDetails/employee-info-edit-routes/employee-info-edit-routes.component';
import { EmployeeExperienceComponent } from './EMPData/AllEmployeeDetails/employee-experience/employee-experience.component';
import { EmployeeBankDetailsComponent } from './EMPData/AllEmployeeDetails/employee-bank-details/employee-bank-details.component';
import { EmployeeDocumentsComponent } from './EMPData/AllEmployeeDetails/employee-documents/employee-documents.component';
import { EmployeeFamilyInfoComponent } from './EMPData/AllEmployeeDetails/employee-family-info/employee-family-info.component';
import { EmployeeBasicDetailsComponent } from './EMPData/AllEmployeeDetails/employee-basic-details/employee-basic-details.component';
import { EmployeeEmergencyDetailsComponent } from './EMPData/AllEmployeeDetails/employee-emergency-details/employee-emergency-details.component';
import { OndutyrequestComponent } from './LeaveRequest/ondutyrequest/ondutyrequest.component';
import { OdRequestCreatComponent } from './LeaveRequest/od-request-creat/od-request-creat.component';
import { EmployeeaddressComponent } from './EMPData/employeeaddress/employeeaddress.component';
import { HrManualRunComponent } from './hr-manual-run/hr-manual-run.component';
import { EmployeeManualRunComponent } from './employee-manual-run/employee-manual-run.component';
import { EmployeeLocationComponent } from './employee-location/employee-location.component';
import { EmployeeinsuranceComponent } from './EMPData/AllEmployeeDetails/employeeinsurance/employeeinsurance.component';
import { EmergencyInfoComponent } from './emergency-info/emergency-info.component';


@NgModule({
  declarations: [ EmployeeInfoComponent, EmployeeInfoSummaryComponent,

     EmployeeInfoCreateComponent, AttendanceMasterComponent, DocumentsComponent, AttendanceLogComponent, AttendanceReportComponent, AttendancePageComponent, DashboardComponent, PostJobComponent, RecruitmentBasePageComponent, LeaveRequestPageComponent, LeaveRequestSummaryComponent, LeaveRequestCreateComponent,
      PostjobCreateComponent, AmountPipePipe, PostJobViewComponent,TrackemployeeComponent, TrackLeaveRequestComponent, CustomDateFormat2, CustomDateFormatLR, AttendanceFullReportComponent, FullCustomDateFormat2, MonthYearFormatDirective, RequestChangeComponent,FetviewComponent, RequestChangeCreateComponent, PenaltyComponent, SpecialPermissionComponent, HolidayComponent, EmployeeDataComponent, HrmsReportComponent, HRPageComponent, RoutepagesComponent, EMPHierarchyComponent, HRUpdateEMPBasicDetailsComponent, HRUpdateEMPCreateComponent, LeaveHistoryComponent, EmployeeEducationComponent, EmployeeInfoEditRoutesComponent, EmployeeExperienceComponent, EmployeeBankDetailsComponent, EmployeeDocumentsComponent, EmployeeFamilyInfoComponent, EmployeeBasicDetailsComponent, EmployeeEmergencyDetailsComponent, OndutyrequestComponent, OdRequestCreatComponent, EmployeeaddressComponent, HrManualRunComponent, EmployeeManualRunComponent, EmployeeLocationComponent, EmployeeinsuranceComponent, EmergencyInfoComponent],
//EmployeeInfoCreateComponent, AttendanceMasterComponent, DocumentsComponent, AttendanceLogComponent, AttendanceReportComponent, AttendancePageComponent, DashboardComponent, PostJobComponent, RecruitmentBasePageComponent, LeaveRequestPageComponent, LeaveRequestSummaryComponent, LeaveRequestCreateComponent,LeaveRequestComponent, AttendanceComponent, FetviewComponent, 
    //  PostjobCreateComponent, AmountPipePipe, PostJobViewComponent,TrackemployeeComponent]
  imports: [
    CommonModule,MatStepperModule,MatDialogModule,
    HRMSRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, SharedModule, MatDatepickerModule, MatNativeDateModule,
    // AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
    //   apiKey: 'AIzaSyDzR2M-IsC07ZP1vwiLKgvhIKZhqSMngC8'
    // })
  ]
})
    
    
    
    
    
    
    
    
    
export class HRMSModule { }
