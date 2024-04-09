import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayingempRoutingModule } from './/payingemp-routing.module';
import { EmpdetailCreationComponent } from './empdetail-creation/empdetail-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EmpDetailSummaryComponent } from './emp-detail-summary/emp-detail-summary.component';
import { EmpdetailViewComponent } from './empdetail-view/empdetail-view.component';
import { AmountPipePipe } from './amount-pipe.service';
import { EmployeepayrollinfoComponent } from './employeepayrollinfo/employeepayrollinfo.component';
import { PayrollmasterComponent } from './payrollmaster/payrollmaster.component';
import { Dialogclass, PayrollsummaryComponent } from './payrollsummary/payrollsummary.component';
import { PayrolmastersComponent } from './payrolmasters/payrolmasters.component';
import { PfcategoryComponent } from './pfcategory/pfcategory.component';
import { PaycomponentypeComponent } from './paycomponentype/paycomponentype.component';
import { PayrollcomponentComponent } from './payrollcomponent/payrollcomponent.component';
import { CompanycontribComponent } from './companycontrib/companycontrib.component';
import { EmpnavigateComponent } from './empnavigate/empnavigate.component';
import { EmployeeadvancesComponent } from './employeeadvances/employeeadvances.component';
import { YearlysummaryComponent } from './yearlysummary/yearlysummary.component';
import { BulkuploadComponent } from './bulkupload/bulkupload.component';
import { OffertemplateComponent } from './offertemplate/offertemplate.component';
import { PaysummaryComponent } from './paysummary/paysummary.component';
import { PayapprovalComponent } from './payapproval/payapproval.component';
import { TemplatesComponent } from './templates/templates.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { NewemployeepayComponent } from './newemployeepay/newemployeepay.component';
import { NewadvanceComponent } from './newadvance/newadvance.component';
import { NewPayStructuresComponent } from './new-pay-structures/new-pay-structures.component';
import { SegmentMasterComponent } from './segment-master/segment-master.component';
import { SegmentmappingComponent } from './segmentmapping/segmentmapping.component';
import { TemplatemasterComponent } from './templatemaster/templatemaster.component';
import { PayrollmappingComponent } from './payrollmapping/payrollmapping.component';
import { CurrencyPipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { GrademasterComponent } from './grademaster/grademaster.component';
import { CustomDatePipe } from './customdate.pipe';
import { EmppayrollthbComponent } from './emppayrollthb/emppayrollthb.component';
import { NestedformarrayComponent } from './nestedformarray/nestedformarray.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { startWith } from 'rxjs/operators';
import { map } from 'jquery';
import { MonthlyPayrollReportComponent } from './monthly-payroll-report/monthly-payroll-report.component';
import { ReportColumnsComponent } from './report-columns/report-columns.component';
// @NgModule({
//   declarations: [EmpdetailCreationComponent, EmpDetailSummaryComponent, EmpdetailViewComponent,AmountPipePipe, EmployeepayrollinfoComponent, PayrollsummaryComponent,Dialogclass,PayrollmasterComponent, PayrolmastersComponent, PfcategoryComponent, PaycomponentypeComponent, PayrollcomponentComponent, CompanycontribComponent, EmpnavigateComponent, EmployeeadvancesComponent, YearlysummaryComponent, BulkuploadComponent, OffertemplateComponent, PaysummaryComponent, PayapprovalComponent, TemplatesComponent, CurrencyFormatPipe, NewemployeepayComponent, NewadvanceComponent, NewPayStructuresComponent, SegmentMasterComponent, SegmentmappingComponent, TemplatemasterComponent, PayrollmappingComponent, GrademasterComponent, CustomDatePipe, EmppayrollthbComponent, NestedformarrayComponent, MonthlyPayrollReportComponent, ReportColumnsComponent],
import { BanktemplateComponent } from './banktemplate/banktemplate.component';
import { ExcelUploadDataComponent } from './excel-upload-data/excel-upload-data.component';
import { EmpAttendUploadComponent } from './emp-attend-upload/emp-attend-upload.component';
import { EmpAttendSummaryComponent } from './emp-attend-summary/emp-attend-summary.component';
import { BanktemplatereportComponent } from './banktemplatereport/banktemplatereport.component';
import { IncrementviewComponent } from './incrementview/incrementview.component';
@NgModule({
  declarations: [EmpdetailCreationComponent, EmpDetailSummaryComponent, EmpdetailViewComponent,AmountPipePipe, EmployeepayrollinfoComponent, PayrollsummaryComponent,Dialogclass,PayrollmasterComponent, PayrolmastersComponent, PfcategoryComponent, PaycomponentypeComponent, PayrollcomponentComponent, CompanycontribComponent, EmpnavigateComponent, EmployeeadvancesComponent, YearlysummaryComponent, BulkuploadComponent, OffertemplateComponent, PaysummaryComponent, PayapprovalComponent, TemplatesComponent, CurrencyFormatPipe, NewemployeepayComponent, NewadvanceComponent, NewPayStructuresComponent, SegmentMasterComponent, SegmentmappingComponent, TemplatemasterComponent, PayrollmappingComponent, GrademasterComponent, CustomDatePipe, EmppayrollthbComponent, NestedformarrayComponent, MonthlyPayrollReportComponent, BanktemplateComponent,ReportColumnsComponent, ExcelUploadDataComponent, EmpAttendUploadComponent, EmpAttendSummaryComponent, BanktemplatereportComponent, IncrementviewComponent],
  imports: [
    CommonModule,
    PayingempRoutingModule,
    ReactiveFormsModule, FormsModule,
    MaterialModule, SharedModule, PdfViewerModule,MatFormFieldModule
  ],
  providers:[CurrencyPipe, DecimalPipe]
})
export class PayingempModule { }