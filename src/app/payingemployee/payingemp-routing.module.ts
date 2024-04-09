import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpDetailSummaryComponent } from './emp-detail-summary/emp-detail-summary.component';
import { EmpdetailCreationComponent } from './empdetail-creation/empdetail-creation.component';
import { EmpdetailViewComponent } from './empdetail-view/empdetail-view.component';
import{EmployeepayrollinfoComponent} from './employeepayrollinfo/employeepayrollinfo.component'
import { PayrollsummaryComponent } from './payrollsummary/payrollsummary.component';
import { PayrollmasterComponent } from './payrollmaster/payrollmaster.component';
import { PayrolmastersComponent } from './payrolmasters/payrolmasters.component';
import { EmpnavigateComponent } from './empnavigate/empnavigate.component';
import {EmployeeInfoCreateComponent} from '../hrms//EMPData/employee-info-create/employee-info-create.component';
import { NewadvanceComponent } from './newadvance/newadvance.component';
import { NewPayStructuresComponent } from './new-pay-structures/new-pay-structures.component';
import { SegmentmappingComponent } from './segmentmapping/segmentmapping.component';
import { PayStructureComponent } from './pay-structure/pay-structure.component';
import { EmppayrollthbComponent } from './emppayrollthb/emppayrollthb.component';
import { NestedformarrayComponent } from './nestedformarray/nestedformarray.component';
import { MonthlyPayrollReportComponent } from './monthly-payroll-report/monthly-payroll-report.component';
import { ReportColumnsComponent } from './report-columns/report-columns.component';
import { BanktemplateComponent } from './banktemplate/banktemplate.component';




const routes: Routes = [
  {path:'empdetailcreation', component:EmpdetailCreationComponent},
  { path: 'empdetailsummary', component: EmpDetailSummaryComponent},
  { path: 'empdetailView', component:EmpdetailViewComponent},
  {path:'emp_pay',component:EmployeepayrollinfoComponent},
  {path:'paysummary',component:PayrollsummaryComponent},
  {path: 'payrollmaster',component:PayrollmasterComponent},
  {path:'paymasters', component: PayrolmastersComponent},
  {path:'empnav', component:EmpnavigateComponent},
  {path:'employeecreate', component: EmployeeInfoCreateComponent},
  {path:'newadvance', component: NewadvanceComponent},
  {path:'newpay', component: NewPayStructuresComponent},
  {path:'mapping', component:SegmentmappingComponent},
  {path:'emp_struc', component:PayStructureComponent},
  {path:'paystructcreate',component:EmppayrollthbComponent},
  {path:'advancedpaystruct',component:NestedformarrayComponent},
  {path:'MonthlyPayroll',component:MonthlyPayrollReportComponent},
  {path:'ReportColumns',component:ReportColumnsComponent},
  {path:'BankTemplate',component:BanktemplateComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayingempRoutingModule { }
