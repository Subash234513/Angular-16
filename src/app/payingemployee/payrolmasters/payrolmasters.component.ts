import { Component, OnInit,ViewChild,Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../../service/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempService } from '../payingemp.service';
import { PayingempShareService } from '../payingemp-share.service';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { Observable, from, fromEvent } from 'rxjs';

@Component({
  selector: 'app-payrolmasters',
  templateUrl: './payrolmasters.component.html',
  styleUrls: ['./payrolmasters.component.scss']
})
export class PayrolmastersComponent implements OnInit {
  isBankTemplate: boolean;

  
  constructor(private shareService: SharedService,
    private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService,
    private payrollservice: PayingempService,private notification: NotificationService, private payrollShareService:PayingempShareService) { }


    ispaycategory: boolean;
    iscompcontrib: boolean;
    ispaycompo: boolean;
    ispaycompotype: boolean;
    istemplatesmaster: boolean;
    isSegmentMaster: boolean;
    isTemplateMapping : boolean;
    isPayrollMapping: boolean;
    isGradeMasters: boolean;
    isReportColumns:boolean;

  ngOnInit(): void {
  }
  pfcategory()
  {
    this.ispaycategory = true;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  compcontrib()
  {
    this.ispaycategory = false;
    this.iscompcontrib = true;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  paycomp()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = true;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  paycomptype()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = true;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;


  }
  template()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = true;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  segments()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = true;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  tempsegments()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = true;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;


  }
  payrollmaster()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = true;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = false;

  }
  grademaster()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = true;
    this.isReportColumns=false
    this.isBankTemplate = false;

  }
  ReportColumns(){
    // this.router.navigate(['/payingemployee/ReportColumns'])
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=true;
    this.isBankTemplate = false;
  }
  bankTemplate()
  {
    this.ispaycategory = false;
    this.iscompcontrib = false;
    this.ispaycompo = false;
    this.ispaycompotype = false;
    this.istemplatesmaster = false;
    this.isSegmentMaster = false;
    this.isTemplateMapping = false;
    this.isPayrollMapping = false;
    this.isGradeMasters = false;
    this.isReportColumns=false;
    this.isBankTemplate = true;
  }
  MonthPayroll(){
    this.router.navigate(['/payingemployee/BankTemplate'])
  }

}
