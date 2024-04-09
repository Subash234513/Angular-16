import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { F } from '@angular/cdk/keycodes';

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export interface SupplierName {
  id: number;
  name: string;
}
export interface branchlistss {
  id: any;
  name: string;
  code: string;
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-prpo-tabs-grn',
  templateUrl: './prpo-tabs-grn.component.html',
  styleUrls: ['./prpo-tabs-grn.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PrpoTabsGRNComponent implements OnInit {
  isGRNinward: boolean;
  prpoGRNList: any
  urls: string;
  urlgrnmaker
  urlgrnapprover
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isGRNmaker: boolean;
  isGRNapprover: boolean;

  isGRNmakerTab: boolean;
  isGRNapproverTab: boolean;

  isGRNCreateform: boolean;
  isGRNApproverFormTab: boolean;
  isGRNViewTab: boolean
  //----------------------------------
  suplist: any;
  isLoading: boolean;
  supplierNameData: any;
  SupplierName: string;
  //-----------------------------------
  branchList: Array<branchlistss>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService, private notification: NotificationService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "GRN") {
        this.prpoGRNList = subModule;
        this.isGRNmaker = subModule[0].name;
        console.log("prpoGRNmenuList", this.prpoGRNList)
      }
    })
    this.GRNDataForm = this.fb.group({
      no: [''],
      suppliername: [''],
      fromdate: [''],
      todate: [''],
      // maxquantity: [''],
      // minquantity: [''],
      branch_id: ['']
    })


    this.grnSearchForm = this.fb.group({
      no: [''],
      suppliername: [""],
      fromdate: [''],
      todate: [''],
      // maxquantity: [''],
      // minquantity: [''],
      branch_id: ['']

    })
    let suppliername: String = "";
    this.getsuppliername(this.suplist, suppliername);
    this.GRNDataForm.get('suppliername').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsuppliername(this.suplist, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

    this.grnSearchForm.get('suppliername').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getsuppliername(this.suplist, value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierNameData = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
    this.GRNDataForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.grnSearchForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbranchFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    this.getsuppliername(this.suplist, "");


  }
  public displayFn(SupplierName?: SupplierName): string | undefined {
    return SupplierName ? SupplierName.name : undefined;
  }

  get supplierName() {
    return this.GRNDataForm.get('suppliername');
  }

  getsuppliername(id, suppliername) {
    this.SpinnerService.show();
    this.dataService.getsuppliername(id, suppliername)
      .subscribe((results) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.supplierNameData = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  //===========================GRN INWARD TAB ===================================//
  subModuleData(data) {
    this.urls = data.url;
    this.urlgrnmaker = "/grnmaker";
    this.urlgrnapprover = "/grnapprover";

    this.isGRNmaker = this.urlgrnmaker === this.urls ? true : false;
    this.isGRNapprover = this.urlgrnapprover === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.isGRNmaker) {
      this.isGRNmakerTab = true
      this.isGRNapproverTab = false

      this.isGRNCreateform = false
      this.isGRNApproverFormTab = false
      this.isGRNViewTab = false
      this.getgrnsummary();
    } else if (this.isGRNapprover) {
      this.isGRNmakerTab = false
      this.isGRNapproverTab = true
      this.isGRNCreateform = false
      this.isGRNApproverFormTab = false
      this.isGRNViewTab = false
      this.getgrnchecker();
    }
  }




  GRNDataForm: FormGroup;
  presentpagegrn: number = 1;
  currentepagegrn: number = 1;
  has_nextgrn = true;
  has_previousgrn = true;
  pageSize = 10;
  grnList: any;
  grnpage: boolean = true;
  grnid: any;
  grnMakerExport:boolean
  presentpagetran: number = 1;
  currentepagetran: number = 1;
  has_nexttran = true;
  has_previoustran = true;
  pageSizetran = 10;
  tranList: any;
  tranpage: boolean = true;
  tokenValues: any
  jpgUrls: string;
  fileList: any;
  filepage: boolean = true;
  has_nextfile = true;
  has_previousfile = true;
  presentpagefile: number = 1;
  currentepagefile: number = 1;
  GRNdetails: any;
  pageSizefile = 10;
  GRNNo: number;
  POno: number;
  grnview: any;
  imageUrl = environment.apiURL

  searchname: any;

  getgrnsummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getgrnsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        console.log("getgrn", datas);
        let datapagination = results["pagination"];
        this.grnList = datas;
        if (this.grnList.length === 0) {
          this.grnpage = false
        }
        if (this.grnList.length > 0) {
          this.has_nextgrn = datapagination.has_next;
          this.has_previousgrn = datapagination.has_previous;
          this.presentpagegrn = datapagination.index;
          this.grnpage = true
          this.grnMakerExport=false
        }
        if(this.grnList.length == 0){
          this.grnMakerExport=true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  nextClickgrn() {
    if (this.has_nextgrn === true) {
      this.currentepagegrn = this.presentpagegrn + 1
      this.getgrnsummary(this.presentpagegrn + 1, 10)
    }
  }

  previousClickgrn() {
    if (this.has_previousgrn === true) {
      this.currentepagegrn = this.presentpagegrn - 1
      this.getgrnsummary(this.presentpagegrn - 1, 10)
    }
  }
  GRNSummaryFormsearch() {
    let searchgrn = this.GRNDataForm.value;

    console.log('data for searchgrn', searchgrn);

    if (searchgrn.fromdate !== '' && searchgrn.todate === '') {
      this.notification.showError("Please enter 'To' date ")
      return false
    }
    // else if (searchgrn.maxquantity !== '' && searchgrn.minquantity === '') {
    //   this.notification.showError("Please enter 'Min' Quantity ")
    //   return false
    // }
    else if (searchgrn.todate !== '' && searchgrn.fromdate === '') {
      this.notification.showError("Please enter 'From' date ")
      return false
    }
    // else if (searchgrn.minquantity !== '' && searchgrn.maxquantity === '') {
    //   this.notification.showError("Please enter 'Max' Quantity ")
    //   return false
    // }
    let obj = {
      no: searchgrn.no,
      suppliername: searchgrn.suppliername.id,
      fromdate: searchgrn.fromdate,
      todate: searchgrn.todate,
      // maxquantity: searchgrn.maxquantity,
      // minquantity: searchgrn.minquantity,
      branch_id: searchgrn.branch_id.id
    }
    if (obj.fromdate != null || obj.fromdate != "" || obj.fromdate != undefined) {
      obj.fromdate = this.datePipe.transform(obj.fromdate, 'yyyy-MM-dd');
      obj.todate = this.datePipe.transform(obj.todate, 'yyyy-MM-dd');
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        delete obj[i];
      }
    }

    this.SpinnerService.show();
    this.dataService.getgrninwardsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("grnList search result", result)
        this.grnList = result['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  dataclear() {
    this.GRNDataForm.controls['no'].reset("")
    this.GRNDataForm.controls['suppliername'].reset("")
    this.GRNDataForm.controls['fromdate'].reset("")
    this.GRNDataForm.controls['todate'].reset("")
    // this.GRNDataForm.controls['maxquantity'].reset("")
    // this.GRNDataForm.controls['minquantity'].reset("")
    this.GRNDataForm.controls['branch_id'].reset("")
    this.getgrnsummary();
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
    // return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  tranview(data) {
    this.GRNdetails = data.inwardheader.id
    this.grnid = this.GRNdetails
    this.prposhareService.grnsummaryid.next(data)
    this.SpinnerService.show();
    this.dataService.getgrnView(this.grnid)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("grn", result)
        let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          // this.GRNData = result
          // this.prposhareService.grnsummaryid.next(this.GRNData)
          this.GRNNo = this.grnview.inwardheader.code;
          this.POno = this.grnview.poheader_id.no;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
    this.transactionhistorysummary();
  }
  fileview(data) {
    // this.GRNdetails = data.inwardheader.id
    // this.grnid = this.GRNdetails
    // this.prposhareService.grnsummaryid.next(data)
    // this.dataService.getgrnView(this.grnid)
    //   .subscribe(result => {
    //     console.log("grn", result)
    //     let datas = result['data']
    //     let overall = datas;
    //     for (var i = 0; i < overall.length; i++) {
    //       this.grnview = overall[i]
    //       // this.GRNData = result
    //       // this.prposhareService.grnsummaryid.next(this.GRNData)
    //       this.GRNNo = this.grnview.inwardheader.code;
    //       this.POno = this.grnview.poheader_id.no;
    //     }
    //   })
    // this.filesummary();
    this.GRNNo = data.inwardheader.code;
    this.POno = data.poheader_id.no;
    let filedata = data.file_data
    this.fileList = filedata
  }
  // transaction history code.

  transactionhistorysummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.transactionhistorysummary(pageNumber, pageSize, this.grnid)
      .subscribe((result) => {
        this.SpinnerService.hide();
        let datas = result['data'];
        let datapagination = result["pagination"];
        this.tranList = datas;
        if (this.tranList.length === 0) {
          this.tranpage = false
        }
        if (this.tranList.length > 0) {
          this.has_nexttran = datapagination.has_next;
          this.has_previoustran = datapagination.has_previous;
          this.presentpagetran = datapagination.index;
          this.tranpage = true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  nextClicktran() {
    if (this.has_nexttran === true) {
      this.currentepagetran = this.presentpagetran + 1
      this.transactionhistorysummary(this.presentpagetran + 1)
    }
  }

  previousClicktran() {
    if (this.has_previoustran === true) {
      this.currentepagetran = this.presentpagetran - 1
      this.transactionhistorysummary(this.presentpagetran - 1)
    }
  }
  filenamess: any
  filesummary(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getgrndetailsfileviewsummary(pageNumber, pageSize, this.grnid)
      .subscribe((result) => {
        let datafile = result;
        this.SpinnerService.hide();
        console.log("sssssssssssssssfilesssss", datafile)

        this.fileList = datafile.file_data;
        // this.filenamess = datafile.file_name
        let datapagination = result["pagination"];
        if (this.fileList?.length === 0) {
          this.filepage = false
        }
        if (this.fileList?.length > 0) {
          this.has_nextfile = datapagination.has_next;
          this.has_previousfile = datapagination.has_previous;
          this.presentpagefile = datapagination.index;
          this.filepage = true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  nextClickfile() {
    if (this.has_nextfile === true) {
      this.currentepagefile = this.presentpagefile + 1
      this.filesummary(this.presentpagefile + 1)
    }
  }

  previousClickfile() {
    if (this.has_previoustran === true) {
      this.currentepagefile = this.presentpagefile - 1
      this.filesummary(this.presentpagefile - 1)
    }
  }

  downloadUrlimage: any
  fileDownload(id, fileName) {
    this.SpinnerService.show();
    this.dataService.
      fileDownloadsgrnmaker(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }


  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }

    let stringValue = file_name.split('.')

    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimagepopup = false
    }

  };

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }


  GRNcreateform() {
    this.isGRNCreateform = true
    this.isGRNmakerTab = false
    this.isGRNViewTab = false
  }


  grncreateSubmit() {
    this.getgrnsummary();
    this.isGRNCreateform = false
    this.isGRNmakerTab = true
    this.isGRNapproverTab = false
    this.isGRNApproverFormTab = false
    this.isGRNViewTab = false
  }

  grncreateCancel() {
    this.isGRNCreateform = false
    this.isGRNmakerTab = true
    this.isGRNapproverTab = false
    this.isGRNApproverFormTab = false
    this.isGRNViewTab = false
  }
  viewGRN(data) {
    this.GRNdetails = data
    this.grnid = this.GRNdetails
    this.prposhareService.grnsummaryid.next(this.GRNdetails)
    this.isGRNViewTab = true
    this.isGRNCreateform = false
    this.isGRNmakerTab = false
    this.isGRNapproverTab = false
    this.isGRNApproverFormTab = false

  }



  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////GRN APPROVER

  grnSearchForm: FormGroup
  presentpage: number = 1;
  has_next = true;
  has_previous = true;

  //pageSize = 10;

  grnappList: any;
  grnApproverExport:boolean
  grnappLists: any;
  todayDate = new Date();
  // tokenValues: any
  pdfUrls: string;
  // jpgUrls: string;
  // imageUrl =  "http://143.110.244.51:8000/"





  getgrnchecker(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.dataService.getgrn(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.table("grnsum", datas);
        let datapagination = results["pagination"];
        this.grnappList = datas;
        if (this.grnappList.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
          this.grnApproverExport=false
        }
        if(this.grnappList.length==0){
          this.grnApproverExport=true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  nextClick() {
    if (this.has_next === true) {
      this.getgrnchecker(this.presentpage + 1, 10)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getgrnchecker(this.presentpage - 1, 10)
    }
  }


  resetgrnapp() {
    this.grnSearchForm.controls['no'].reset("")
    this.grnSearchForm.controls['suppliername'].reset("")
    this.grnSearchForm.controls['fromdate'].reset("")
    this.grnSearchForm.controls['todate'].reset("")
    // this.grnSearchForm.controls['minquantity'].reset("")
    // this.grnSearchForm.controls['maxquantity'].reset("")
    this.grnSearchForm.controls['branch_id'].reset("")
    // this.grnSearchForm.reset("")
    this.getgrnchecker();
    return false
  }



  grnsummarySearch() {
    let searchgrn = this.grnSearchForm.value;
    console.log('data for searchpo', searchgrn);

    // if (searchgrn.suppliername.id == undefined) {
    //   searchgrn.suppliername = this.grnSearchForm.value.suppliername
    // } else {
    //   searchgrn.suppliername = this.grnSearchForm.value.suppliername.id
    //   // return false
    // }
    if (searchgrn.fromdate !== '' && searchgrn.todate === '') {
      this.notification.showError("Please enter 'To' date ")
      return false
    }
    // else if (searchgrn.maxquantity !== '' && searchgrn.minquantity === '') {
    //   this.notification.showError("Please enter 'Min' Quantity ")
    //   return false
    // }
    else if (searchgrn.todate !== '' && searchgrn.fromdate === '') {
      this.notification.showError("Please enter 'From' date ")
      return false
    }
    // else if (searchgrn.minquantity !== '' && searchgrn.maxquantity === '') {
    //   this.notification.showError("Please enter 'Max' Quantity ")
    //   return false
    // }
    let obj = {
      no: searchgrn.no,
      suppliername: searchgrn.suppliername.id,
      fromdate: searchgrn.fromdate,
      todate: searchgrn.todate,
      // maxquantity: searchgrn.maxquantity,
      // minquantity: searchgrn.minquantity,
      branch_id: searchgrn.branch_id.id
    }

    if (obj.fromdate != null || obj.fromdate != "" || obj.fromdate != undefined) {
      obj.fromdate = this.datePipe.transform(obj.fromdate, 'yyyy-MM-dd');
      obj.todate = this.datePipe.transform(obj.todate, 'yyyy-MM-dd');
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        delete obj[i];
      }
    }

    this.SpinnerService.show();
    this.dataService.grnsummarySearch(obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("grn search result", result)
        this.grnappList = result['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }

  makerexceldownload(){
    
      let no:any
      let fromdate:any
      let todate:any
      let branchid:any
      let supid:any
     
  
      let data = this.GRNDataForm.value

      if (data.fromdate !== '' && data.todate === '') {
        this.notification.showError("Please enter 'To' date ")
        return false
      }
      if (data.fromdate === '' && data.todate !== '') {
        this.notification.showError("Please enter 'From' date ")
        return false
      }
      if(data.no != null && data.no != undefined &&  data.no != ""){
        no = data.no
      }else{
        no = ""
      }
  
    
  
      if(data.fromdate != null && data.fromdate != undefined && data.fromdate != ""){
        fromdate = this.datePipe.transform(data.fromdate, 'yyyy-MM-dd');
      }else{
        fromdate = ""
      }

      if(data.todate != null && data.todate != undefined && data.todate != ""){
        todate = this.datePipe.transform(data.todate, 'yyyy-MM-dd');
      }else{
        todate = ""
      }
  
     if(typeof(data.branch_id) == 'object'){
        branchid = data.branch_id.id
      }else if(typeof(data.branch_id) == 'number'){
        branchid = data.branch_id
      }else{
        branchid = ""
      }

      if(typeof(data.suppliername) == 'object'){
        supid = data.suppliername.id
      }else if(typeof(data.suppliername) == 'number'){
        supid = data.suppliername
      }else{
        supid = ""
      }
  
     
      this.SpinnerService.show();
      this.dataService.getGRNMakerExcel(no,supid,fromdate,todate,branchid)
      .subscribe((data) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'GRN Maker Report'+".xlsx";
        link.click();
        })
  
  
    
  
  }


  approverexceldownload(){
    
    let no:any
    let fromdate:any
    let todate:any
    let branchid:any
    let supid:any
   

    let data = this.grnSearchForm.value

    if (data.fromdate !== '' && data.todate === '') {
      this.notification.showError("Please enter 'To' date ")
      return false
    }
    if (data.fromdate === '' && data.todate !== '') {
      this.notification.showError("Please enter 'From' date ")
      return false
    }
    if(data.no != null && data.no != undefined &&  data.no != ""){
      no = data.no
    }else{
      no = ""
    }

  

    if(data.fromdate != null && data.fromdate != undefined && data.fromdate != ""){
      fromdate = this.datePipe.transform(data.fromdate, 'yyyy-MM-dd');
    }else{
      fromdate = ""
    }

    if(data.todate != null && data.todate != undefined && data.todate != ""){
      todate = this.datePipe.transform(data.todate, 'yyyy-MM-dd');
    }else{
      todate = ""
    }

   if(typeof(data.branch_id) == 'object'){
      branchid = data.branch_id.id
    }else if(typeof(data.branch_id) == 'number'){
      branchid = data.branch_id
    }else{
      branchid = ""
    }

    if(typeof(data.suppliername) == 'object'){
      supid = data.suppliername.id
    }else if(typeof(data.suppliername) == 'number'){
      supid = data.suppliername
    }else{
      supid = ""
    }

   
    this.SpinnerService.show();
    this.dataService.getGRNApproverExcel(no,supid,fromdate,todate,branchid)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'GRN Approver Report'+".xlsx";
      link.click();
      })


  

}



  transactionlist: any
  gettransaction(data) {
    this.ponumpop = data.poheader_id.no
    this.SpinnerService.show();
    this.dataService.transactionget(data.inwardheader.id)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.transactionlist = datas;

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )

  }
  filelist: any
  Filedownload
  fileDownloads(id, fileName) {
    this.SpinnerService.show();
    this.dataService.fileDownloads(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let filevalue = fileName.split('.')
        if(filevalue[1] != "pdf" && filevalue[1] != "PDF"){
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
        }else{
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: results.type }));
          window.open(downloadUrl, "_blank");
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }
  grnjson: any
  grnnumpop
  ponumpop
  filejson(data) {
    this.grnjson = data["file_data"]
    this.grnnumpop = data.inwardheader.code

    console.log("grnjson", this.grnjson)

  }
  // showimagepopup: boolean
  commentPopupapprover(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }

    let stringValue = file_name.split('.')

    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimagepopup = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimagepopup = false
    }

  };

  closeModal() {
    document.getElementById("myModal").style.display = "none";
  }





  approverview(data) {
    this.prposhareService.grnapprovalShare.next(data)
    this.isGRNCreateform = false
    this.isGRNmakerTab = false
    this.isGRNapproverTab = false
    this.isGRNApproverFormTab = true
    this.isGRNViewTab = false
    return data
    // this.router.navigate(['/grnapproverview'], { skipLocationChange: true })
  }

  grncreateApproverSubmit() {
    this.getgrnchecker();
    this.isGRNCreateform = false
    this.isGRNmakerTab = false
    this.isGRNapproverTab = true
    this.isGRNApproverFormTab = false
    this.isGRNViewTab = false
  }


  grncreateApproverCancel() {
    this.isGRNCreateform = false
    this.isGRNmakerTab = false
    this.isGRNapproverTab = true
    this.isGRNApproverFormTab = false
    this.isGRNViewTab = false
  }


  grnViewCancel() {
    this.isGRNCreateform = false
    this.isGRNmakerTab = true
    this.isGRNapproverTab = false
    this.isGRNApproverFormTab = false
    this.isGRNViewTab = false
  }

  GRNPDf(data) {
    let id = data.inwardheader.id
    let name = data.inwardheader.code
    this.SpinnerService.show();
    this.dataService.GRRPDf(id)
      .subscribe((datas) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(datas)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: datas.type }));
        window.open(downloadUrl, "_blank");
        // let link = document.createElement('a');
        // link.href = downloadUrl;
        // link.download = name + ".pdf";
        // link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
  }




  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.SpinnerService.show()
    this.dataService.getbranchdd()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  currentpagebranch = 1
  has_nextbranch = true;
  has_previousbranch = true;
  autocompletebranchScroll() {
    setTimeout(() => {
      if (
        this.matbranchAutocomplete &&
        this.autocompleteTrigger &&
        this.matbranchAutocomplete.panel
      ) {
        fromEvent(this.matbranchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbranchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbranchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbranchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbranchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbranch === true) {
                this.dataService.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }




}

