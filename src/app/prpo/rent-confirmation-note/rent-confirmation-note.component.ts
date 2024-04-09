import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface branchcodeLists {
  name: string;
  code: string;
  id: number;
}

export interface supplierlistsearch {
  id: string;
  name: string;
}
export interface branchlistss {
  id: any;
  name: string;
  code: string;
}
@Component({
  selector: 'app-rent-confirmation-note',
  templateUrl: './rent-confirmation-note.component.html',
  styleUrls: ['./rent-confirmation-note.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class RentConfirmationNoteComponent implements OnInit {


  isRCN: boolean;
  prpoRCNList: any
  urls: string;
  urlrcnmaker
  urlrcnrelease
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isRCNmaker: boolean;
  isRCNrelease: boolean;

  isRCNmakerTab: boolean;
  isRCNreleaseTab: boolean;

  isRCNCreateform: boolean
  isRCNreleaseform: boolean
  isRCNViewTab: boolean
  GRNDataForm: FormGroup;
  presentpagegrn: number = 1;
  currentepagegrn: number = 1;
  has_nextgrn = true;
  has_previousgrn = true;
  pageSize = 10;
  grnList: any;
  grnpage: boolean = true;
  grnid: any;

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
  branchNameData: Array<branchcodeLists>;
  isLoading: boolean;
  isRCNCreate: boolean

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  suppliersearchList: Array<supplierlistsearch>;
  @ViewChild('suppliersearch') matsuppliersearchAutocomplete: MatAutocomplete;
  @ViewChild('suppliersearchInput') suppliersearchInput: any;
  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;
  branchList: Array<branchlistss>;
  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private dataService: PRPOSERVICEService,
    private prposhareService: PRPOshareService, private toastr: ToastrService, private datePipe: DatePipe, private notification: NotificationService) { }
  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "RCN") {
        this.prpoRCNList = subModule;
        this.isRCNmaker = subModule[0].name;
      }
    })
    this.GRNDataForm = this.fb.group({
      no: [''],
      suppliername: [''],
      fromdate: [''],
      todate: [''],
      maxquantity: [''],
      minquantity: [''],
    })
    // this.getgrnsummary();

    this.rcnreleaseSearchForm = this.fb.group({
      pono: [''],
      suppliername: [''],
      branchcode: ['']
    })
    // this.getrcnrelease();


    this.Releaseform = this.fb.group({
      id: '',
      remarks: ''
    })
    let branchcode: String = "";
    this.getbranchFK();

    this.rcnreleaseSearchForm.get('branchcode').valueChanges
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
      })

    this.GRNDataForm.get('suppliername').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.suppliersearchList = datas;
      })
    this.rcnreleaseSearchForm.get('suppliername').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getsupplierDropdownFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.suppliersearchList = datas;
      })

  }
  //===========================RCN INWARD TAB ===================================//
  subModuleData(data) {
    this.urls = data.url;
    this.urlrcnmaker = "/rcnmaker";
    this.urlrcnrelease = "/rcnrelease";

    this.isRCNmaker = this.urlrcnmaker === this.urls ? true : false;
    this.isRCNrelease = this.urlrcnrelease === this.urls ? true : false;

    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.isRCNmaker) {
      this.isRCNmakerTab = true;
      this.isRCNreleaseTab = false;
      this.isRCNCreateform = false;
      this.isRCNreleaseform = false;
      this.isRCNViewTab = false;
      this.getgrnsummary();

    } else if (this.isRCNrelease) {
      this.isRCNmakerTab = false;
      this.isRCNreleaseTab = true;
      this.isRCNCreateform = false;
      this.isRCNreleaseform = false;
      this.isRCNViewTab = false;
      this.getrcnrelease();
    }
  }
  addForm() {
    //this.isRCNCreate = true;
  }
  getgrnView() {

  }

  getgrnsummary(pageNumber = 1, pageSize = 10) {
    this.dataService.getrcnsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.grnList = datas;
        console.log("list", this.grnList)
        if (this.grnList.length === 0) {
          this.grnpage = false
        }
        if (this.grnList.length > 0) {
          this.has_nextgrn = datapagination.has_next;
          this.has_previousgrn = datapagination.has_previous;
          this.presentpagegrn = datapagination.index;
          this.grnpage = true
        }
      })

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
    if ( searchgrn.suppliername?.id == undefined ){
      searchgrn.suppliername = searchgrn.suppliername
    }else{
      searchgrn.suppliername = searchgrn.suppliername.id
    }
    // searchgrn.suppliername = this.GRNDataForm.value.suppliername.id
    if (searchgrn.fromdate !== '' && searchgrn.todate == '') {
      this.notification.showWarning("Please enter 'To Date' ")
      return false
    }
    else if (searchgrn.maxquantity !== '' && searchgrn.minquantity == '') {
      this.notification.showWarning("Please enter 'Min Amount' ")
      return false
    }
    else if (searchgrn.todate !== '' && searchgrn.fromdate == '') {
      this.notification.showWarning("Please enter 'From date' ")
      return false
    }
    else if (searchgrn.minquantity !== '' && searchgrn.maxquantity == '') {
      this.notification.showWarning("Please enter 'Max Amount' ")
      return false
    }
    if (searchgrn.fromdate != null || searchgrn.fromdate != ""|| searchgrn.fromdate != undefined) {
      searchgrn.fromdate = this.datePipe.transform(searchgrn.fromdate, 'yyyy-MM-dd');
      searchgrn.todate = this.datePipe.transform(searchgrn.todate, 'yyyy-MM-dd');
    }
    for (let i in searchgrn) {
      if (searchgrn[i] == null || searchgrn[i] == "" || searchgrn[i] == undefined) {
        delete searchgrn[i];
      }
    }

    this.dataService.getrcninwardsummarySearch(searchgrn)
      .subscribe(result => {
        this.grnList = result['data']
        if (searchgrn.no === '' && searchgrn.suppliername === '' && searchgrn.fromdate === '' && searchgrn.todate === ''
          && searchgrn.maxquantity === '' && searchgrn.minquantity === '') {
          this.getgrnsummary();
        }
      })
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
    this.GRNDataForm.controls['maxquantity'].reset("")
    this.GRNDataForm.controls['minquantity'].reset("")
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
    return ((k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  view(data) {
    this.GRNdetails = data.inwardheader.id
    this.grnid = this.GRNdetails
    this.prposhareService.rcnsummary.next(this.GRNdetails)
    this.isRCNCreateform = false
    this.isRCNmakerTab = false
    this.isRCNreleaseTab = false
    this.isRCNreleaseform = false
    this.isRCNViewTab = true
    return data
  }
  tranview(data) {
    this.GRNdetails = data.inwardheader.id
    this.grnid = this.GRNdetails
    this.prposhareService.grnsummaryid.next(data)
    this.dataService.getgrnView(this.grnid)
      .subscribe(result => {
        let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          this.GRNNo = this.grnview.inwardheader.code;
          this.POno = this.grnview.poheader_id.no;
        }
      })
    this.transactionhistorysummary();
  }
  fileview(data) {
    this.GRNdetails = data.inwardheader.id
    this.grnid = this.GRNdetails
    this.prposhareService.grnsummaryid.next(data)
    this.dataService.getgrnView(this.grnid)
      .subscribe(result => {
        let datas = result['data']
        let overall = datas;
        for (var i = 0; i < overall.length; i++) {
          this.grnview = overall[i]
          this.GRNNo = this.grnview.inwardheader.code;
          this.POno = this.grnview.poheader_id.no;
        }
      })
    // this.filesummary();
  }

  transactionhistorysummary(pageNumber = 1, pageSize = 10) {
    this.dataService.transactionhistorysummary(pageNumber, pageSize, this.grnid)
      .subscribe((result) => {
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
      })
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
  filesummary( data) {
    console.log(data.file_data)
    let datafile = data.file_data
    this.fileList = datafile;
    

    // this.dataService.getgrndetailsviewsummary(1, 10, this.grnid)
    //   .subscribe((result) => {
    //     let datafile = result['file_data'];

    //     this.fileList = datafile;
    //     let datapagination = result["pagination"];
    //     if (this.fileList?.length === 0) {
    //       this.filepage = false
    //     }
    //     if (this.fileList.length > 0) {
    //       this.has_nextfile = datapagination?.has_next;
    //       this.has_previousfile = datapagination?.has_previous;
    //       this.presentpagefile = datapagination?.index;
    //       this.filepage = true
    //     }
    //   })
  }
  nextClickfile() {
    // if (this.has_nextfile === true) {
    //   this.currentepagefile = this.presentpagefile + 1
    //   this.filesummary(this.presentpagefile + 1, '')
    // }
  }

  previousClickfile() {
    // if (this.has_previoustran === true) {
    //   this.currentepagefile = this.presentpagefile - 1
    //   this.filesummary(this.presentpagefile - 1)
    // }
  }

  downloadUrlimage: any
  fileDownload(id, fileName) {

    this.dataService.fileDownloadsgrnmaker(id)
      .subscribe((results) => {
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
      })

  }

  showimagepopup: boolean
  commentPopup(pdf_id, file_name) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    this.tokenValues = token
    let id = pdf_id;
    // const headers = { 'Authorization': 'Token ' + token }

    // let stringValue = file_name.split('.')

    // if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
    //   this.showimagepopup = true
    //   this.jpgUrls = this.imageUrl + "prserv/prpo_fileview/" + id + "?token=" + token;
    // }
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



  rcncreateform() {
    this.isRCNCreateform = true
    this.isRCNmakerTab = false
    this.isRCNreleaseTab = false
    this.isRCNreleaseform = false
  }

  rcncreateSubmit() {
    this.isRCNCreateform = false
    this.isRCNmakerTab = true
    this.isRCNreleaseTab = false
    this.isRCNreleaseform = false
    this.getgrnsummary();
  }

  rcncreateCancel() {
    this.isRCNCreateform = false
    this.isRCNmakerTab = true
    this.isRCNreleaseTab = false
    this.isRCNreleaseform = false
  }
































  GRNPDf(data) {
    // let id = this.getMemoIdValue(this.idValue)
    let statusData = data?.inwardheader?.grn_status
    if (statusData == "REJECTED") {
      this.notification.showInfo("File Not Found")
      return false
    }
    let id = data.inwardheader_id
    let jsonid = { "id": id }
    let name = data.inwardheader.rent_refno
    this.dataService.getpdfGRN(jsonid)
      .subscribe((datas) => {
        let binaryData = [];
        binaryData.push(datas)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: datas.type }));
        window.open(downloadUrl, "_blank");
        // let link = document.createElement('a');
        // link.href = downloadUrl;
        // link.download = name + ".pdf";
        // link.click();
      })
  }





  /////////////////////////////////////////////////////////////////rcn release




  rcnreleaseSearchForm: FormGroup;
  presentpagepo: number = 1;
  has_nextpo = true;
  has_previouspo = true;
  // pageSize = 10;
  releaseList: any;
  poreopenpage: boolean = true;
  currentepageporp: number = 1;




  getrcnrelease(pageNumber = 1, pageSize = 10) {
    this.dataService.getROHoldsummary(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("getrcnrelease", datas);
        let datapagination = results["pagination"];
        this.releaseList = datas;
        if (this.releaseList.length > 0) {
          this.has_nextpo = datapagination.has_next;
          this.has_previouspo = datapagination.has_previous;
          this.presentpagepo = datapagination.index;
        }
      })

  }
  nextClickpo() {
    if (this.has_nextpo === true) {
      this.currentepageporp = this.presentpagepo + 1
      this.getrcnrelease(this.presentpagepo + 1, 10)
    }
  }

  previousClickpo() {
    if (this.has_previouspo === true) {
      this.currentepageporp = this.presentpagepo - 1
      this.getrcnrelease(this.presentpagepo - 1, 10)
    }
  }



  resetReleaseSearchForm() {
    this.rcnreleaseSearchForm.reset()
    this.getrcnrelease();

  }
  rcnreleaseSearch() {
    let searchrelease = this.rcnreleaseSearchForm.value;
    // searchrelease.suppliername = this.rcnreleaseSearchForm.value.suppliername.id
    if ( searchrelease.suppliername?.id == undefined ){
      searchrelease.suppliername = searchrelease.suppliername
    }else{
      searchrelease.suppliername = searchrelease.suppliername.id
    }
    // searchrelease.branchcode = this.rcnreleaseSearchForm.value.branchcode.id
    if ( searchrelease.branchcode?.id == undefined ){
      searchrelease.branchcode = searchrelease.branchcode
    }else{
      searchrelease.branchcode = searchrelease.branchcode.id
    }
    // console.log('data for searchrelease', searchrelease);
    for (let i in searchrelease) {
      if (searchrelease[i] == null || searchrelease[i] == "" || searchrelease[i] == undefined) {
        delete searchrelease[i];
      }
    }

    this.dataService.getroHoldsummarySearch(searchrelease)
      .subscribe(result => {
        // console.log("poList search result", result)
        this.releaseList = result['data']
        if (searchrelease.pono === '' && searchrelease.suppliername === '' && searchrelease.branchcode === '') {
          this.getrcnrelease();
        }
      })
  }


  sharercnrelease(data) {
    this.prposhareService.rcnrelease.next(data)
    this.isRCNreleaseform = true
    this.isRCNCreateform = false
    this.isRCNmakerTab = false
    this.isRCNreleaseTab = false
    return data;
  }



  Rcnreleasesubmit() {
    this.getrcnrelease();
    this.isRCNCreateform = false
    this.isRCNmakerTab = false
    this.isRCNreleaseTab = true
    this.isRCNreleaseform = false
  }

  rcnreleaseCancel() {
    this.isRCNCreateform = false
    this.isRCNmakerTab = false
    this.isRCNreleaseTab = true
    this.isRCNreleaseform = false
  }

  ROHeader: any
  RObranchCode: any
  ROSupplierCode: any
  ROSupplierName: any
  ROBranchName: any
  RoType: any
  RoAmount: any

  Releaseform: FormGroup

  releasedata(data) {
    this.ROHeader = data.poheader_id.no
    this.RObranchCode = data?.prpoqty_id?.prccbs_id?.branch_id?.code
    this.ROBranchName = data?.prpoqty_id?.prccbs_id?.branch_id?.name
    this.ROSupplierCode = data?.poheader_id?.supplierbranch_id?.code
    this.ROSupplierName = data?.poheader_id?.supplierbranch_id?.name
    this.RoType = data?.podetails_id?.product_name
    this.RoAmount = data?.qty - data?.received_quantity

    this.Releaseform.patchValue({
      id: data.poheader_id.id
    })

  }



  ReleaseRoSubmit() {
    const data = this.Releaseform.value;
    this.dataService.RoRelease(data)
      .subscribe(results => {
        this.notification.showSuccess("Successfully Released!...")
        this.getrcnrelease();
        return true
      })
  }


  displayFns(branch?: any) {
    let a = branch ? this.branchNameData.find(_ => _.name === branch).code : undefined;
    let b = branch ? this.branchNameData.find(_ => _.name === branch).name : undefined;
    return branch ? a + "--" + b : undefined;
  }
  get branchName() {
    return this.rcnreleaseSearchForm.get('branchcode');
  }
  getbranchname(bankname) {
    this.dataService.getbranch(bankname)
      .subscribe((results) => {
        let datas = results["data"];
        this.branchNameData = datas;
        // console.log("this.branchNameData", this.branchNameData)
      })
  }
  rcnViewCancel() {
    this.isRCNCreateform = false
    this.isRCNmakerTab = true
    this.isRCNreleaseTab = false
    this.isRCNreleaseform = false
    this.isRCNViewTab = false
  }

  currentpagesupplier = 1
  has_nextsupplier = true;
  has_previoussupplier = true;
  autocompletesuppliersearchScroll() {
    setTimeout(() => {
      if (
        this.matsuppliersearchAutocomplete &&
        this.autocompleteTrigger &&
        this.matsuppliersearchAutocomplete.panel
      ) {
        fromEvent(this.matsuppliersearchAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsuppliersearchAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsuppliersearchAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsuppliersearchAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsupplier === true) {
                this.dataService.getsupplierDropdownFKdd(this.suppliersearchInput.nativeElement.value, this.currentpagesupplier + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.suppliersearchList = this.suppliersearchList.concat(datas);
                    if (this.suppliersearchList.length >= 0) {
                      this.has_nextsupplier = datapagination.has_next;
                      this.has_previoussupplier = datapagination.has_previous;
                      this.currentpagesupplier = datapagination.index;

                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayFnsuppliersearch(supplier?: supplierlistsearch): any | undefined {
    return supplier ? supplier.name : undefined;
  }

  getSuppliersearch() {
    this.dataService.getsupplierDropdown()
      .subscribe((results: any[]) => {
        let datas = results["data"]
        this.suppliersearchList = datas;
        console.log("suppliersearchList", datas)
      })
  }




  public displayFnbranch(branch?: branchlistss): any | undefined {
    return branch ? branch.code + "-" + branch.name : undefined;
  }



  getbranchFK() {
    this.dataService.getbranchdd()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
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
                  })
              }
            }
          });
      }
    });
  }
































}

