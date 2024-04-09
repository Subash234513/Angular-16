import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Observable, from, fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { F, I } from '@angular/cdk/keycodes';
// import { Console } from 'console';
export interface commoditylistss {
  id: string;
  name: string;
}
export interface branchlistss {
  id: any;
  name: string;
  code: string;
}
export interface supplierlistss {
  id: string;
  name: string;
}
export interface pcalistss {
  no:string;
  id: string;
  mepno: string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
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
export interface datesvalue {
  value: any;
}

@Component({
  selector: 'app-prpo-tabs-pr',
  templateUrl: './prpo-tabs-pr.component.html',
  styleUrls: ['./prpo-tabs-pr.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class PrpoTabsPRComponent implements OnInit {
  prpoPRList: any

  urls: string;
  urlprmaker;
  urlprapprover

  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isPrmaker: boolean;
  isPrmakerTab: boolean;

  isPrapprover: boolean
  isPrapproverTab: boolean

  isPrCreateScreenTab: boolean
  isPrApproverScreenTab: boolean

  prSummaryList: any
  prSummaryExport:boolean
  PRSummarySearch: FormGroup
  searchData: any
  tokenValues: any
  jpgUrls: string;
  imageUrl = environment.apiURL
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize = 10;
  isPrSummaryPagination: boolean;
  prtranSummaryList: any;
  PrTranHistoryList: any;
  prdetailsList: any;
  isEditBtn: boolean;

  prnodata: any
  prdate: any
  prraised: any
  prcommodity: any
  dtsdata: any
  typedata: any

  has_previousdetail: boolean
  has_nextdetail: boolean
  presentpageprdetail: number = 1;
  PRheaderID_Data: any

  showHeaderimagepopup: boolean

  showimageHeaderapp: boolean

  fileListHeader: any

  showimageHeader: boolean

  showimagepopup: boolean

  showHeaderimagepopupapp: boolean
  // fileListHeader: any

  approverlist: any
  isPRApproverExport:boolean
  PRApproverSearch: FormGroup
  prapproverList: any
  PrTranHistoryListapp: any

  presentpageapp: number = 1;
  has_nextapp = true;
  has_previousapp = true;
  // pageSize = 10;
  // tokenValues: any
  // jpgUrls: string;
  // imageUrl = environment.apiURL
  // currentpage: number = 1;
  isLoading = false
  commodityList: Array<commoditylistss>;
  branchList: Array<branchlistss>;
  supplierList: Array<supplierlistss>;
  PCAList:Array<pcalistss>;
  statuslist:any
  @ViewChild('supplier') matsupplierAutocomplete: MatAutocomplete;
  @ViewChild('supplierInput') supplierInput: any; 
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  @ViewChild('pcano') matpcaAutocomplete: MatAutocomplete;
  @ViewChild('PCAInput') PCAInput: any;
  constructor( private fb: FormBuilder,  private router: Router,
    private shareService: SharedService, private prposervice: PRPOSERVICEService,
    private prsharedservice: PRPOshareService, private toastr: ToastrService,
    private notification: NotificationService, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private datepipe:DatePipe) { }

  ngOnInit(): void {
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "PR") {
        this.prpoPRList = subModule;
        this.isPrmaker = subModule[0].name;
        console.log("prpoParmenuList", this.prpoPRList)
      }
    })

    this.PRSummarySearch = this.fb.group({
      no: [''],
      prheader_status: [''],
      branch_id: [''],
      supplier_id:[''],
      amount:[''],
      mepno:[''],
      date:['']
    })
    

    this.PRApproverSearch = this.fb.group({
      no: [''],
      commodityname: [''],
      branch_id: [''],
      supplier_id:[''],
      prheader_status:[''],
      amount:[''],
      mepno:[''],
      date:['']
    })
    this.getprstatus()
    this.PRApproverSearch.get('commodityname').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityList = datas;

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.PRSummarySearch.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.prposervice.getbranchFK(value, 1)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.PRApproverSearch.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),
        switchMap(value => this.prposervice.getbranchFK(value, 1)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.PRSummarySearch.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.PRApproverSearch.get('supplier_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.supplierList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

      this.PRSummarySearch.get('mepno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getmepFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.PCAList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


      this.PRApproverSearch.get('mepno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.prposervice.getmepFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.PCAList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



  }

  public displayFnsupplier(supplier?: supplierlistss): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getSupplier() {
    this.SpinnerService.show();
      this.prposervice.getsupplierDropdown()
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"]
          this.supplierList = datas;
          console.log("supplierList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  public displayFnPCANo(pca?: pcalistss): any | undefined {
    return pca ? pca.mepno : undefined;
  }

  getPCA() {
    this.SpinnerService.show();
      this.prposervice.getmepFK("")
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"]
          this.PCAList = datas;
         
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  currentpagesupplier = 1
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesupplierScroll() {
    setTimeout(() => {
      if (
        this.matsupplierAutocomplete &&
        this.autocompleteTrigger &&
        this.matsupplierAutocomplete.panel
      ) {
        fromEvent(this.matsupplierAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsupplierAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsupplierAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsupplierAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsupplierAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.prposervice.getsupplierDropdownFKdd(this.supplierInput.nativeElement.value, this.currentpagesupplier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.supplierList = this.supplierList.concat(datas);
                    if (this.supplierList.length >= 0) {
                      this.has_nextsupplier = datapagination.has_next;
                      this.has_previoussupplier = datapagination.has_previous;
                      this.currentpagesupplier = datapagination.index;

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

  currentpagepca = 1
  has_nextpca = true;
  has_previouspca = true;
  autocompletepcaScroll() {
    setTimeout(() => {
      if (
        this.matpcaAutocomplete &&
        this.autocompleteTrigger &&
        this.matpcaAutocomplete.panel
      ) {
        fromEvent(this.matpcaAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpcaAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpcaAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpcaAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpcaAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextpca === true) {
                this.prposervice.getmepFKdd(this.PCAInput.nativeElement.value, this.currentpagepca + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.PCAList = this.PCAList.concat(datas);
                    if (this.PCAList.length >= 0) {
                      this.has_nextpca = datapagination.has_next;
                      this.has_previouspca = datapagination.has_previous;
                      this.currentpagepca = datapagination.index;

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




  subModuleData(data) {
    this.urls = data.url;
    this.urlprmaker = "/prmaker";
    this.urlprapprover = "/prapprover";

    this.isPrmaker = this.urlprmaker === this.urls ? true : false;
    this.isPrapprover = this.urlprapprover === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.isPrmaker) {
      this.isPrmakerTab = true
      this.isPrapproverTab = false
      this.isPrCreateScreenTab = false
      this.isPrApproverScreenTab = false
      this.getPRsummary('');

    } else if (this.isPrapprover) {
      this.isPrmakerTab = false
      this.isPrapproverTab = true
      this.isPrCreateScreenTab = false
      this.isPrApproverScreenTab = false
      this.getPRAppsummary('');
    }
  }

  ////////////////////////////////////////////////////////PR Maker

  // getprSummary(pageNumber = 1, pageSize = 10) {
  //   this.SpinnerService.show();
  //   this.prposervice.getprsummary(pageNumber, pageSize)
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       this.prSummaryList = result['data']
  //       let dataPagination = result['pagination'];
  //       if (this.prSummaryList.length > 0) {
  //         this.has_next = dataPagination.has_next;
  //         this.has_previous = dataPagination.has_previous;
  //         this.presentpage = dataPagination.index;
  //       }
  //       console.log("PrSummary", result)
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  // nextClick() {
  //   if (this.has_next === true) {
  //     this.getprSummary(this.presentpage + 1, 10)
  //   }
  // }

  // previousClick() {
  //   if (this.has_previous === true) {
  //     this.getprSummary(this.presentpage - 1, 10)
  //   }
  // }



  serviceCallPRSummary(search,pageno,pageSize){
    this.prposervice.getprSearch(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("prsummary", result)
        this.prSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.prSummaryList.length > 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.prSummaryExport=false
        }
        if(this.prSummaryList.length == 0){
          this.prSummaryExport=true

        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
    getPRsummary(hint) {
      let search = this.PRSummarySearch.value;
      
       let obj = {
        no: search.no,
        prheader_status: search.prheader_status,
        branch_id: search.branch_id.id,
        supplier_id:search.supplier_id.id,
        amount:search.amount,
        mepno:search.mepno.no,
        date:this.datepipe.transform(search.date, 'yyyy-MM-dd')

      }
      for (let i in obj) {
        if (obj[i] == null || obj[i] == "" || obj[i] == undefined ) {
          delete obj[i];
        }
      }
      this.SpinnerService.show();
    
    if(hint == 'next'){
    this.serviceCallPRSummary(obj, this.presentpage + 1, 10)
    }
    else if(hint == 'previous'){
    this.serviceCallPRSummary(obj, this.presentpage - 1, 10)
    }
    else{
    this.serviceCallPRSummary(obj,1, 10)
    }
    
    }

    makerexceldownload(){

      let prno:any
      let prstatus:any
      let branchid:any
      let supid:any
      let pramt:any
      let mepno:any
      let prdate:any
  
      let data = this.PRSummarySearch.value
      if(data.no != null && data.no != undefined && data.no != ""){
        prno = data.no
      }else{
        prno = ""
      }
  
      if(data.prheader_status != null && data.prheader_status != undefined && data.prheader_status != ""){
        prstatus = data.prheader_status
      }else{
        prstatus = ""
      }
  
      if(data.date != null && data.date != undefined && data.date != "" ){
        prdate = this.datepipe.transform(data.date, 'yyyy-MM-dd');
      }else{
        prdate = ""
      }
  
      if(data.amount != null && data.amount != undefined  && data.amount != ""){
        pramt = data.amount
      }else{
        pramt = ""
      }

      if(typeof(data.branch_id) == 'object'){
        branchid = data.branch_id.id
      }else if(typeof(data.branch_id) == 'number'){
        branchid = data.branch_id
      }else{
        branchid = "" 
      }

      if(typeof(data.supplier_id) == 'object'){
        supid = data.supplier_id.id
      }else if(typeof(data.supplier_id) == 'number'){
        supid = data.supplier_id
      }else{
        supid = "" 
      }


      if(typeof(data.mepno) == 'object'){
        mepno = data.mepno.no
      }else if(typeof(data.mepno) == 'string'){
        mepno = data.mepno
      }else{
        mepno = "" 
      }
  
  
    
     
      this.SpinnerService.show();
      this.prposervice.getPRMakerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate)
      .subscribe((data) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'PR Maker Report'+".xlsx";
        link.click();
        })
  
    }
  
    checkerexceldownload(){

      let prno:any
      let prstatus:any
      let branchid:any
      let supid:any
      let pramt:any
      let mepno:any
      let prdate:any
      let commname:any
  
      let data = this.PRApproverSearch.value
      console.log("dataaaas",data)
      console.log("dataaaas1",data.date)
      if(data.no != null && data.no != undefined  && data.no != ""){
        prno = data.no
      }else{
        prno = ""
      }
  
      if(data.prheader_status != null && data.prheader_status != undefined && data.prheader_status != ""){
        prstatus = data.prheader_status
      }else{
        prstatus = ""
      }
  
      if(data.date != null && data.date != undefined && data.date != ""){
        prdate = this.datepipe.transform(data.date, 'yyyy-MM-dd');
      }else{
        prdate = ""
      }
  
      if(data.amount != null && data.amount != undefined && data.amount != ""){
        pramt = data.amount
      }else{
        pramt = ""
      }

      if(typeof(data.branch_id) == 'object'){
        branchid = data.branch_id.id
      }else if(typeof(data.branch_id) == 'number'){
        branchid = data.branch_id
      }else{
        branchid = "" 
      }

      if(typeof(data.supplier_id) == 'object'){
        supid = data.supplier_id.id
      }else if(typeof(data.supplier_id) == 'number'){
        supid = data.supplier_id
      }else{
        supid = "" 
      }


      if(typeof(data.mepno) == 'object'){
        mepno = data.mepno.no
      }else if(typeof(data.mepno) == 'string'){
        mepno = data.mepno
      }else{
        mepno = "" 
      }

      if(typeof(data.commodityname) == 'object'){
        commname = data.commodityname.id
      }else if(typeof(data.commodityname) == 'number'){
        commname = data.commodityname
      }else{
        commname = "" 
      }
  
  
    
     
      this.SpinnerService.show();
      this.prposervice.getPRCheckerExcel(prno,prstatus,branchid,supid,pramt,mepno,prdate,commname)
      .subscribe((data) => {
        this.SpinnerService.hide()
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'PR Approver Report'+".xlsx";
        link.click();
        })
  
    }
  
















  // PRSearch() {
  //   let search = this.PRSummarySearch.value;
  //   let obj = {
  //     no: search.no,
  //     prheader_status: search.prheader_status,
  //     branch_id: search.branch_id.id
  //   }
  //   for (let i in obj) {
  //     if (obj[i] == null || obj[i] == "" || obj[i] == undefined ) {
  //       delete obj[i];
  //     }
  //   }
  //   this.SpinnerService.show();
  //   this.prposervice.getprSearch(obj)
  //     .subscribe(result => {
  //       this.SpinnerService.hide();
  //       console.log("identificationData", result)
  //       this.prSummaryList = result['data']
  //       return true
  //     },(error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }

  reset() {
    this.PRSummarySearch.controls["no"].reset("");
    this.PRSummarySearch.controls["prheader_status"].reset("");
    this.PRSummarySearch.controls["branch_id"].reset("");
    this.PRSummarySearch.controls["supplier_id"].reset("");
    this.PRSummarySearch.controls["mepno"].reset("");
    this.PRSummarySearch.controls["amount"].reset("");
    this.PRSummarySearch.controls["date"].reset("");
    this.getPRsummary('');
  }

  commentPopup(pdf_id, file_name) {
    if ((pdf_id == '') || (pdf_id == null) || (pdf_id == undefined)) {
      this.notification.showInfo("No Files Found")
      return false
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    this.showimagepopup = true
    this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
    console.log("img", this.jpgUrls)
  };

  gettranhistory(data) {
    let headerId = data.id
    console.log("headerId", headerId)
    this.SpinnerService.show();
    this.prposervice.getprtransummary(headerId)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PrTranHistoryList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  dataOnHeader(data) {
    this.PRheaderID_Data = data.id
    if (data.dts == 0) {
      this.dtsdata = "NO"
    }
    else {
      this.dtsdata = "Yes"
    }
    this.typedata = data.type
    this.prnodata = data.no
    this.prdate = data.date
    this.prraised = data.created_by.full_name
    this.prcommodity = data.commodity_id.name
  }

  getprdetails(data, pageNumber = 1, pageSize = 10) {
    let headerId = data.id
    this.SpinnerService.show();
    this.prposervice.getprdetails(headerId, pageNumber, pageSize)
      .subscribe((results) => {
        let dataset = results["data"];
        this.SpinnerService.hide();
        this.prdetailsList = dataset;
        console.log("getproduct", dataset);
        let datapagination = results["pagination"];
        if (this.prdetailsList.length > 0) {
          this.has_nextdetail = datapagination.has_next;
          this.has_previousdetail = datapagination.has_previous;
          this.presentpageprdetail = datapagination.index;
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  nextClickdetail() {
    if (this.has_nextdetail === true) {
      this.SpinnerService.show();
      this.prposervice.getprdetails(this.PRheaderID_Data, this.presentpageprdetail + 1, 10)
        .subscribe((results) => {
          this.SpinnerService.hide();
          let dataset = results["data"];
          this.prdetailsList = dataset;
          console.log("getproduct", dataset);
          let datapagination = results["pagination"];
          if (this.prdetailsList.length > 0) {
            this.has_nextdetail = datapagination.has_next;
            this.has_previousdetail = datapagination.has_previous;
            this.presentpageprdetail = datapagination.index;
          }
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }

  previousClickdetail() {
    if (this.has_previousdetail === true) {
      this.SpinnerService.show();
      this.prposervice.getprdetails(this.PRheaderID_Data, this.presentpageprdetail - 1, 10)
        .subscribe((results) => {
          this.SpinnerService.hide();
          let dataset = results["data"];
          this.prdetailsList = dataset;
          console.log("getproduct", dataset);
          let datapagination = results["pagination"];
          if (this.prdetailsList.length > 0) {
            this.has_nextdetail = datapagination.has_next;
            this.has_previousdetail = datapagination.has_previous;
            this.presentpageprdetail = datapagination.index;
          }
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }

  addpr() {
    let data = ""
    this.prsharedservice.prsummary.next(data);
    // this.router.navigate(['/prmakers'], { skipLocationChange: true })
    this.isPrmakerTab = false
    this.isPrapproverTab = false
    this.isPrCreateScreenTab = true
    this.isPrApproverScreenTab = false
  }

  PRCreateSubmit() {
    this.getPRsummary('');
    this.isPrmakerTab = true
    this.isPrapproverTab = false
    this.isPrCreateScreenTab = false
    this.isPrApproverScreenTab = false
  }

  PRCreateCancel() {
    this.isPrmakerTab = true
    this.isPrapproverTab = false
    this.isPrCreateScreenTab = false
    this.isPrApproverScreenTab = false
  }

  predit(data) {
    this.prsharedservice.prsummary.next(data);
    console.log("app", data)
    // this.router.navigate(['/prmakers'], { skipLocationChange: true })
    this.isPrmakerTab = false
    this.isPrapproverTab = false
    this.isPrCreateScreenTab = true
    this.isPrApproverScreenTab = false
    return data
  }

  fileDownloads(id, fileName) {
    if ((id == '') || (id == null) || (id == undefined)) {
      this.notification.showInfo("No Files Found")
      return false
    }
    this.SpinnerService.show();
    this.prposervice.fileDownloadpo(id)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  PRPDf(data) {
    let id = data.id
    let name = data.no
    this.SpinnerService.show();
    this.prposervice.getpdfPR(id)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  HeaderFilesPRdownload(data) {
    console.log("For Header Files", data)
    let filesdataValue = data.prheader_file
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found")
      this.showHeaderimagepopup = false
      return false
    }
    else {
      this.fileListHeader = filesdataValue
      this.showHeaderimagepopup = true
    }
  }

  fileDownloadheader(id, fileName) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsPoHeader(id)
      .subscribe((results) => {
        console.log("re", results)
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
       
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  commentPopupHeaderFiles(pdf_id, file_name) {
    if ((pdf_id == '') || (pdf_id == null) || (pdf_id == undefined)) {
      this.notification.showInfo("No Files Found")
      return false
    }
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeader = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimageHeader = false
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////PR Approval

  approver(data) {
    this.prsharedservice.Prapprover.next(data)
    console.log("app", data)
    // this.router.navigate(['/PRApprover'], { skipLocationChange: true })
    this.isPrmakerTab = false
    this.isPrapproverTab = false
    this.isPrCreateScreenTab = false
    this.isPrApproverScreenTab = true
  }

  PRApproveSubmit() {
    this.getPRAppsummary('')
    this.isPrmakerTab = false
    this.isPrapproverTab = true
    this.isPrCreateScreenTab = false
    this.isPrApproverScreenTab = false
  }

  PRApproveCancel() {
    this.isPrmakerTab = false
    this.isPrapproverTab = true
    this.isPrCreateScreenTab = false
    this.isPrApproverScreenTab = false
  }



  serviceCallPRAppSummary(search,pageno,pageSize){
    this.prposervice.getprapproverSearch(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("searchhh", result)
        this.approverlist = result['data']
        let datapagination = result["pagination"];
        if (this.approverlist.length > 0) {
          this.has_nextapp = datapagination.has_next;
          this.has_previousapp = datapagination.has_previous;
          this.presentpageapp = datapagination.index;
          this.isPRApproverExport=false
        }
        if (this.approverlist.length==0){
          this.isPRApproverExport=true
        }
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
    }
    
    getPRAppsummary(hint) {
      let Prappsearch = this.PRApproverSearch.value;
      // this.PRApproverSearch.value.commodityname = this.PRApproverSearch.value.commodityname.id
      let obj = {
        no: this.PRApproverSearch.value.no,
        commodityname: this.PRApproverSearch.value.commodityname.id,
        branch_id: this.PRApproverSearch.value.branch_id.id,
        supplier_id:this.PRApproverSearch.value.supplier_id.id,
        prheader_status:this.PRApproverSearch.value.prheader_status,
        amount:this.PRApproverSearch.value.amount,
        date:this.datepipe.transform(this.PRApproverSearch.value.date, 'yyyy-MM-dd')
      }

      for (let i in obj) {
        if (obj[i] == null || obj[i] == "" || obj[i] == undefined ) {
          delete obj[i];
      }
    }
      this.SpinnerService.show();
    
    if(hint == 'next'){
    this.serviceCallPRAppSummary(obj, this.presentpageapp + 1, 10)
    }
    else if(hint == 'previous'){
    this.serviceCallPRAppSummary(obj, this.presentpageapp - 1, 10)
    }
    else{
    this.serviceCallPRAppSummary(obj,1, 10)
    }
    
  }

  resetapp() {
    this.PRApproverSearch.controls["no"].reset("");
    this.PRApproverSearch.controls["commodityname"].reset("");
    this.PRApproverSearch.controls["branch_id"].reset("");
    this.PRApproverSearch.controls["supplier_id"].reset("");
    this.PRApproverSearch.controls["prheader_status"].reset("");
    this.PRApproverSearch.controls["mepno"].reset("");
    this.PRApproverSearch.controls["amount"].reset("");
    this.PRApproverSearch.controls["date"].reset("");
    this.getPRAppsummary('');
    // this.PRApproverSearch.reset();
  }

  gettranhistoryapp(data) {
    let headerId = data.id
    console.log("headerId", headerId)
    this.SpinnerService.show();
    this.prposervice.getprtransummary(headerId)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getranhistory", datas);
        this.PrTranHistoryListapp = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122)) {
      return false;
    }
  }


  HeaderFilesPRdownloadapp(data) {
    console.log("For Header Files", data)

    let filesdataValue = data.prheader_file
    if (filesdataValue.length <= 0) {
      this.notification.showInfo("No Files Found")
    }
    else {
      this.fileListHeader = filesdataValue
      this.showHeaderimagepopupapp = true
    }
  }

  fileDownloadheaderapp(id, fileName) {
    this.SpinnerService.show();
    this.prposervice.fileDownloadsPoHeader(id)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  commentPopupHeaderFilesapp(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderapp = true
      this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
      console.log("url", this.jpgUrls)
    }
    else {
      this.showimageHeaderapp = false
    }
  }


  public displayFncommodity(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }
  getCommodityFK() {
    this.SpinnerService.show();
    this.prposervice.getcommoditydd()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.commodityList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  currentpagecom = 1
  has_nextcom = true;
  has_previouscom = true;

  autocompletecommodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.prposervice.getcommodityFKdd(this.commodityInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    if (this.commodityList.length >= 0) {
                      this.has_nextcom = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom = datapagination.index;
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



  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }

  getbranchFK() {
    this.SpinnerService.show()
    this.prposervice.getbranchdd()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      },(error) => {
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
                this.prposervice.getbranchFK(this.branchInput.nativeElement.value, this.currentpagebranch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.branchList = this.branchList.concat(datas);
                    if (this.branchList.length >= 0) {
                      this.has_nextbranch = datapagination.has_next;
                      this.has_previousbranch = datapagination.has_previous;
                      this.currentpagebranch = datapagination.index;
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getprstatus(){
    this.prposervice.getPRStatus()
    .subscribe(result=>{
      this.statuslist = result['data']
      console.log("statuslist", this.statuslist)
    })
  }

}

