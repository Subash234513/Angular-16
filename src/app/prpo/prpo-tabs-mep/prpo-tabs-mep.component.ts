import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
export interface datesvalue {

  value: any;
}
export interface Emplistss {
  id: any;
  full_name: string;
}

@Component({
  selector: 'app-prpo-tabs-mep',
  templateUrl: './prpo-tabs-mep.component.html',
  styleUrls: ['./prpo-tabs-mep.component.scss']
})
export class PrpoTabsMEPComponent implements OnInit {
  prpoMEPList: any

  urls: string;
  urlMEPmaker;
  urlMEPapprover

  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isMEPmaker: boolean;
  isMEPmakerTab: boolean;

  isMEPapprover: boolean
  isMEPapproverTab: boolean

  isMepcreateTab: boolean
  isMEPEditTab: boolean
  isMEPContigencyTab: boolean
  isMEPStatusTab: boolean
  isMEPApproverScreenTab: boolean

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
private prposhareService: PRPOshareService, private toastr: ToastrService, private notification: NotificationService, ) {

  }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "PCA") {
        this.prpoMEPList = subModule;
        this.isMEPmaker = subModule[0].name;
        console.log("prpoMEPmenuList", this.prpoMEPList)
      }
    })
    ///////////////////////////////////////////////////////////////////////mep maker 
    this.mepsummarySearchForm = this.fb.group({
      no: [''],
      name: [""],
      raisor: [''],
      amount: [''],
      finyear: [''],
      budgeted: null,
    })



    let empkeyvalue: String = "";
    this.getemployeeFK(empkeyvalue);


    this.mepsummarySearchForm.get('raisor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // this.getMepList();

    /////////////////////////////////////////Mep approver
    this.mepAppsummarySearchForm = this.fb.group({
      no: [''],
      name: [""],
      raisor: [''],
      amount: [''],
      finyear: [''],
      budgeted: null,
    })
    this.mepAppsummarySearchForm.get('raisor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // this.getMepAppList();
  }
  subModuleData(data) {
    this.urls = data.url;
    this.urlMEPmaker = "/pcamaker";
    this.urlMEPapprover = "/pcaapprover";

    this.isMEPmaker = this.urlMEPmaker === this.urls ? true : false;
    this.isMEPapprover = this.urlMEPapprover === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.isMEPmaker) {
      this.isMEPmakerTab = true
      this.isMEPapproverTab = false

      this.isMepcreateTab = false
      this.isMEPEditTab = false
      this.isMEPContigencyTab = false
      this.isMEPStatusTab = false
      this.isMEPApproverScreenTab = false
      this.getMepList();



    } else if (this.isMEPapprover) {
      this.isMEPmakerTab = false
      this.isMEPapproverTab = true

      this.isMepcreateTab = false
      this.isMEPEditTab = false
      this.isMEPContigencyTab = false
      this.isMEPStatusTab = false
      this.isMEPApproverScreenTab = false
      this.getMepAppList();

    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////MEP Maker




  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isPCASummaryExport:boolean
  isLoading = false;

  ismepsum: boolean
  ismepForm: boolean
  ismepEditForm: boolean

  mepsummarySearchForm: FormGroup;

  employeeList: Array<Emplistss>;
  raisor = new FormControl();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  MepList: any;
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]




  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  displayFnraisor(rfor?: any) {
    return rfor ? this.employeeList.find(_ => _.id === rfor).full_name : undefined;
  }

  getemployeeFK(empkeyvalue) {
    this.SpinnerService.show();
    this.dataService.getemployeeFK(empkeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.employeeList = datas;
        console.log("employeeList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  private getMepList(
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.dataService.getMepList(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("data", datas)
        this.MepList = datas;
        let datapagination = results["pagination"];
        this.MepList = datas;
        if (this.MepList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isPCASummaryExport=false
        }
        if(this.MepList.length == 0){
          this.isPCASummaryExport=true

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  nextClick() {
    if (this.has_next === true) {
      this.getMepList(this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getMepList(this.presentpage - 1, 10)
    }
  }


  resetmep() {
    this.mepsummarySearchForm.reset()
    this.getMepList();
  }
  mepsummarySearch() {

    let searchdel = this.mepsummarySearchForm.value;
    console.log('data for search', searchdel);
    for (let i in searchdel) {
      if (searchdel[i] === null || searchdel[i] === "") {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getmepsummarySearch(searchdel)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("MepList search result", result)
        this.MepList = result['data']
        if (searchdel.no === '' && searchdel.name === '' && searchdel.raisor === '' && searchdel.amount === '' && searchdel.finyear === '' && searchdel.budgeted === null) {
          this.getMepList();
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  makerexceldownload(){

    let mepno:any
    let mepname:any
    let mepamount:any
    let mepyear:any
    let mepbudget:any

    let data = this.mepsummarySearchForm.value
    if(data.no != null && data.no != undefined && data.no != ""){
      mepno = data.no
    }else{
      mepno = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      mepname = data.name
    }else{
      mepname = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    mepamount = data.amount
    }else{
      mepamount = ""
    }

    if(data.finyear != null && data.finyear != undefined && data.finyear != ""){
      mepyear = data.finyear
    }else{
      mepyear = ""
    }
    if(data.budgeted != null && data.budgeted != undefined && data.budgeted != ""){
      mepbudget = data.budgeted
    }else{
      mepbudget = ""
    }
   
    this.SpinnerService.show();
    this.dataService.getMEPMakerExcel(mepno,mepname,mepamount,mepyear,mepbudget)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PCA Maker Report'+".xlsx";
      link.click();
      })

  }

  checkerexceldownload(){

    let mepno:any
    let mepname:any
    let mepamount:any
    let mepyear:any
    let mepbudget:any

    let data = this.mepAppsummarySearchForm.value
    if(data.no != null && data.no != undefined && data.no != ""){
      mepno = data.no
    }else{
      mepno = ""
    }

    if(data.name != null && data.name != undefined && data.name != ""){
      mepname = data.name
    }else{
      mepname = ""
    }

   if(data.amount != null && data.amount != undefined && data.amount != ""){
    mepamount = data.amount
    }else{
      mepamount = ""
    }

    if(data.finyear != null && data.finyear != undefined && data.finyear != ""){
      mepyear = data.finyear
    }else{
      mepyear = ""
    }
    if(data.budgeted != null && data.budgeted != undefined  && data.budgeted != ""){
      mepbudget = data.budgeted
    }else{
      mepbudget = ""
    }
   
    this.SpinnerService.show();
    this.dataService.getMEPCheckerExcel(mepno,mepname,mepamount,mepyear,mepbudget)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'PCA Checker Report'+".xlsx";
      link.click();
      })

  }





  addMep() {
    let data = ""
    this.prposhareService.MepParentShare.next(data)
    this.isMepcreateTab = true
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = false
    return data
  }

  MEPCreateSubmit() {
    this.getMepList();
    this.getMepAppList();
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }

  MEPCreateCancel() {
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }

  MEPEditSubmit() {
    this.getMepList();
    this.getMepAppList();
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }

  MEPEditCancel() {
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }
  MEPContigencySubmit() {
    this.getMepList()
    this.getMepAppList();
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }
  MEPContigencyCancel() {
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }
  MEPStatusCancel() {
    this.ismakerCheckerButton = true;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = true
    this.isMEPapproverTab = false
  }





  editmepmake(data) {
    this.prposhareService.MepParentShare.next(data)
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = true
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = false
    return data;
  }
  editmepconmake(data) {
    this.prposhareService.MepParentShare.next(data)
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = true
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = false
    return data;
  }
  StatusScreen(data) {
    this.prposhareService.MepStatusShare.next(data)
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = true
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = false
    return data;
  }






  //////////////////////////////////////////////////////////////////////////////////////////// Mep Approver

  has_nextApp = true;
  has_previousApp = true;
  currentpageApp: number = 1;
  presentpageApp: number = 1;
  pageSizeApp = 10;
  mepAppsummarySearchForm: FormGroup
  MepAppList: any;
  isPCAApproverSummary:boolean;

  private getMepAppList(
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.dataService.getMepapproverList(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("data", datas)
        this.MepAppList = datas;
        let datapagination = results["pagination"];
        this.MepAppList = datas;
        if (this.MepAppList.length > 0) {
          this.has_nextApp = datapagination.has_next;
          this.has_previousApp = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.isPCAApproverSummary=false
        }
        if(this.MepAppList.length == 0){
          this.isPCAApproverSummary=true

        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  nextClickApp() {
    if (this.has_nextApp === true) {
      this.getMepAppList(this.presentpage + 1, 10)
    }
  }

  previousClickApp() {
    if (this.has_previousApp === true) {
      this.getMepAppList(this.presentpage - 1, 10)
    }
  }


  resetmepApp() {
    this.mepAppsummarySearchForm.reset();
    this.getMepAppList();

  }
  mepAppsummarySearch() {

    let searchdel = this.mepAppsummarySearchForm.value;
    console.log('data for search', searchdel);
    for (let i in searchdel) {
      if (searchdel[i] === null || searchdel[i] === "") {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show();
    this.dataService.getmeapproverpsummarySearch(searchdel)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("MepList search result", result)
        this.MepAppList = result['data']
        if (searchdel.no === '' && searchdel.name === '' && searchdel.raisor === '' && searchdel.amount === '' && searchdel.finyear === '' && searchdel.budgeted === null) {
          this.getMepAppList();
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  editmepmakeApp(data) {
    this.prposhareService.MEPcheckerShare.next(data)
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = true
    this.isMEPmakerTab = false
    this.isMEPapproverTab = false
    return data;
  }



  MEPApproverSubmit() {
    this.getMepList()
    this.getMepAppList()
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = true
  }
  MEPApproverCancel() {
    this.ismakerCheckerButton = false;
    this.isMepcreateTab = false
    this.isMEPEditTab = false
    this.isMEPContigencyTab = false
    this.isMEPStatusTab = false
    this.isMEPApproverScreenTab = false
    this.isMEPmakerTab = false
    this.isMEPapproverTab = true
  }



  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }









}