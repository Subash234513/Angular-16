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
  selector: 'app-empnavigate',
  templateUrl: './empnavigate.component.html',
  styleUrls: ['./empnavigate.component.scss']
})
export class EmpnavigateComponent implements OnInit {
  payrollsubmoduleList:any;
  empList:any;
  presentpageemp: number = 1;
  pagesizeemp=10;
  has_nextEmp = true;
  has_previousEmp = true;
  empSearchForm:FormGroup;
  // functionalHeadList: Array<FunctionHead>;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading = false;
  statusList:any;
  isEmpDetails: boolean;
  isPaySummary: boolean;
  isPayMaster: boolean;
  isAdvancePay: boolean;
  isYearlySummary: boolean;
  isBulkUpload: boolean;
  isOfferTemplate: boolean;
  isPayStatement : boolean;
  isPayApprove: boolean;
  payRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  empbranchid: any;
  currentUser: any;
  makerUser:  boolean = false;
  checkUser: boolean = false;
  checkerUser: boolean = false;
  empId: any;
  personData : any;
  isShowNavs: boolean = true;
  // isShowTrue: boolean = false;
  isNewLandpage: boolean = false;
  returnnav: number;
  isMonthlyPay : boolean = false;
  isBankTemplate: boolean = false;
  isEmployeeUpload:boolean=false
  isAttendanceUpload:boolean=false
  isAttendanceSummary:boolean=false
  isBanktempreport : boolean = false;
  isIncementView : boolean = false;

  constructor(private shareService: SharedService,
    private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService,
    private payrollservice: PayingempService,private notification: NotificationService, private payrollShareService:PayingempShareService,
    private sharedservice: SharedService) { }

  ngOnInit(): void {


    let userdata = this.sharedservice.transactionList
    console.log("USER DATE", userdata)
    userdata.forEach(element => {
      if (element.name == 'Employee Payroll') {
        this.payRole = element.role
      }

    })
  
    if (this.payRole) {
      let isAdmin = false;
      this.payRole.forEach(element => {
        if (element.name.toLowerCase() == 'payroll admin') {
          this.interPermission = element.code
          this.adminUser = true;
          this.currentUser = 'admin';
          isAdmin = true;

          console.log("PERMISSION", this.interPermission)
        }
        if (element.name.toLowerCase() == 'maker' || element.name.toLowerCase() == 'checker' || element.name.toLowerCase() == 'admin' ) {
          this.interPermission = element.code
          this.normalUser = true;
          console.log("PERMISSION", this.interPermission)
        }
      
      })
      if(isAdmin)
      {
        this.normalUser = false;
        this.makerUser = false;
        this.checkUser = false;
        this.checkerUser = false;
      }
    }

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Employee Payroll") {
        this.payrollsubmoduleList = subModule;
      
        console.log("payroll component value",this.payrollsubmoduleList)
      }})
      this.payrollsubmoduleList.name  = 'Monthly Payroll';
      this.payrollsubmoduleList.name = 'Bank Template';

  }


  subModuleData(submodule) {
    console.log("submodule names ", submodule);
    if (submodule.name == "Payroll Summary") {
      this.isEmpDetails = false;
      this.isPaySummary = true;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;

    }
    if (submodule.name == "Employee Details") {
      this.isEmpDetails = true;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;

    }

    if (submodule.name == "Employee Advance") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = true;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "YTD Summary") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = true;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "Bulk Upload") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = true;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "Offer Template") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = true;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "Pay Summary") {
      this.isEmpDetails = false;
    this.isPaySummary = false;
    this.isPayMaster = false;
    this.isAdvancePay = false;
    this.isYearlySummary = false;
    this.isBulkUpload = false;
    this.isOfferTemplate = false;
    this.isPayStatement = true;
    this.isPayApprove = false;
    this.isNewLandpage = false;
    this.isMonthlyPay = false;
    this.isBankTemplate = false;
    this.isEmployeeUpload=false;
    this.isAttendanceUpload=false;
    this.isAttendanceSummary=false;
    this.isBanktempreport = false;
    this.isIncementView = false;



    }
    if (submodule.name == "PayApproval") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = true;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "Monthly Payroll") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = true;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;


    }
    if (submodule.name == "Bank Template") {
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = true;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;

    }
    if(submodule.name=='Employee Upload'){
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=true;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = false;
    }
    if(submodule.name=='Bank Template Report'){
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = true;
      this.isIncementView = false;
    }
    if(submodule.name=='Increment'){
      this.isEmpDetails = false;
      this.isPaySummary = false;
      this.isPayMaster = false;
      this.isAdvancePay = false;
      this.isYearlySummary = false;
      this.isBulkUpload = false;
      this.isOfferTemplate = false;
      this.isPayStatement = false;
      this.isPayApprove = false;
      this.isNewLandpage = false;
      this.isMonthlyPay = false;
      this.isBankTemplate = false;
      this.isEmployeeUpload=false;
      this.isAttendanceUpload=false;
      this.isAttendanceSummary=false;
      this.isBanktempreport = false;
      this.isIncementView = true;
    }


    //Increment
  

  }
  AttendSummary(){
    this.isEmpDetails = false;
    this.isPaySummary = false;
    this.isPayMaster = false;
    this.isAdvancePay = false;
    this.isYearlySummary = false;
    this.isBulkUpload = false;
    this.isOfferTemplate = false;
    this.isPayStatement = false;
    this.isPayApprove = false;
    this.isNewLandpage = false;
    this.isMonthlyPay = false;
    this.isBankTemplate = false;
    this.isEmployeeUpload=false;
    this.isAttendanceUpload=false;
    this.isAttendanceSummary=true;
    this.isBanktempreport = false;
  }
  // ExcelUpload(){
  //   this.isEmpDetails = false;
  //   this.isPaySummary = false;
  //   this.isPayMaster = false;
  //   this.isAdvancePay = false;
  //   this.isYearlySummary = false;
  //   this.isBulkUpload = false;
  //   this.isOfferTemplate = false;
  //   this.isPayStatement = false;
  //   this.isPayApprove = false;
  //   this.isNewLandpage = false;
  //   this.isMonthlyPay = false;
  //   this.isBankTemplate = false;
  //   this.isEmployeeUpload=true;
  //   this.isAttendanceUpload=false;
  // }
  // AttendanceUpload(){
  //   this.isEmpDetails = false;
  //   this.isPaySummary = false;
  //   this.isPayMaster = false;
  //   this.isAdvancePay = false;
  //   this.isYearlySummary = false;
  //   this.isBulkUpload = false;
  //   this.isOfferTemplate = false;
  //   this.isPayStatement = false;
  //   this.isPayApprove = false;
  //   this.isNewLandpage = false;
  //   this.isMonthlyPay = false;
  //   this.isBankTemplate = false;
  //   this.isEmployeeUpload=false;
  //   this.isAttendanceUpload=true;
  // }
 

}
