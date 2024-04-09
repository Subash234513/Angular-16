import { Component, OnInit, ViewChild, Output, EventEmitter, Injectable } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { CMSSharedService } from '../cms-shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AmountPipePipe } from '../amount-pipe.pipe'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-supplier-catlog',
  templateUrl: './supplier-catlog.component.html',
  styleUrls: ['./supplier-catlog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class SupplierCatlogComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private notify: ToastrService, private activateroute: ActivatedRoute, private datepipe: DatePipe,
  ) {

  }
  
  SupplierCatlogForm: FormGroup
  today = new Date()
  activityTypeList:any = [{name:'Product', id: 1},{name:'Service', id: 2}];
  SubmitBtnShowOrHide: boolean
  ProposalID : any 


  ngOnInit(): void {
    let datavalue: any = this.cmsShare.SupplierCatlog.value 
    console.log("datavalue ", datavalue )
    this.ProposalID = datavalue?.proposalsdetails?.id
    this.SupplierCatlogForm = this.fb.group({
      "supplier_code":"",
      "type": '',
      "name": "",
      "description": "",
      "start_date": new Date(),
      "end_date": new Date(),
      "contract_spend": 0,
      "rm": '',
      "fidelity": false,
      "bidding": false,
      "raisor": '',
      "approver":'',
      "productname": '',
      "category": '',
      "subcategory":''
    })
    this.SupplierPatch(datavalue)
    this.userdd(datavalue?.proposercode)
  }


  MoveToSupplierBTN: any 
  vendorCode: any 
  SupplierPatch(data){
    console.log("data Response ", data)
    let dataForProcess = data?.catlogres
    let vendorcodedata = data?.proposercode
    console.log("vendorcoddedata??????????????????????????////////////////////////////////////",dataForProcess, vendorcodedata)
    this.vendorCode = vendorcodedata
    if(dataForProcess?.is_created == true){
      this.SupplierCatlogForm.patchValue({
        "supplier_code":dataForProcess?.supplier_code,
        "type": dataForProcess?.type,
        "name": dataForProcess?.name,
        "description":  dataForProcess?.description,
        "start_date":  dataForProcess?.start_date,
        "end_date":  dataForProcess?.end_date,
        "contract_spend":  dataForProcess?.contract_spend,
        "rm":  dataForProcess?.rm,
        "fidelity":  dataForProcess?.fidelity,
        "bidding": dataForProcess?.bidding,
        "raisor":  dataForProcess?.raisor,
        "approver": dataForProcess?.approver,
        "productname":  dataForProcess?.productname,
        "category":  dataForProcess?.category,
        "subcategory": dataForProcess?.subcategory
      })
      this.SubmitBtnShowOrHide = true  
    }
    if(dataForProcess?.is_created == false){
      this.SubmitBtnShowOrHide = false   
    }
    if(dataForProcess?.is_vendor == false){
      this.MoveToSupplierBTN = true 
    }
    if(dataForProcess?.is_vendor == true){
      this.MoveToSupplierBTN = false  
    }

    


  }





































  
  isLoading: boolean = false 
  EMPList: any
  has_nextemp: any
  has_previousemp: any
  currentpageemp: any
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  EmpDD(data) {
    this.service.Allemployeesearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.EMPList = datas;
        let datapagination = results["pagination"];
        this.has_nextemp = datapagination.has_next;
        this.has_previousemp = datapagination.has_previous;
        this.currentpageemp = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnemp(emp?: emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }




  ProductList: any
  has_nextprod: any
  has_previousprod: any
  currentpageprod: any

  @ViewChild('prod') matprodAutocomplete: MatAutocomplete;
  @ViewChild('prodInput') prodInput: any;

  prodDD(data) {
    this.service.ProductSearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.ProductList = datas;
        let datapagination = results["pagination"];
        this.has_nextprod = datapagination.has_next;
        this.has_previousprod = datapagination.has_previous;
        this.currentpageprod = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnprod(prod?: prodlistss): string | undefined {
    let codeName = prod?.code + prod?.name 
    return prod ? prod.name : undefined;
  }




  CategoryList: any
  has_nextcat: boolean
  has_previouscat: boolean
  currentpagecat: any = 1
  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  categoryDD(data) {
    
    this.service.projectcatsearch(data, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CategoryList = datas;
        let datapagination = results["pagination"];
        this.has_nextcat = datapagination?.has_next;
        this.has_previouscat = datapagination?.has_previous;
        this.currentpagecat = datapagination?.index;
      }, (error) => {

      })
  }


  public displayFncat(cat?: catlistss): string | undefined {
    return cat ? cat.name : undefined;
  }

  SubCategoryList: any
  has_nextsubcat: boolean
  has_previoussubcat: boolean
  currentpagesubcat: any = 1
  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatInput') subcatInput: any;

  SubcategoryDD(cat, data) {
    let obj = JSON.stringify(data)
    this.service.projectsubcatsearch(data, cat.id, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SubCategoryList = datas;
        let datapagination = results["pagination"];
        this.has_nextsubcat = datapagination?.has_next;
        this.has_previoussubcat = datapagination?.has_previous;
        this.currentpagesubcat = datapagination?.index;
      }, (error) => {

      })
  }


  public displayFnsubcat(subcat?: subcatlistss): string | undefined {
    return subcat ? subcat.name : undefined;
  }






  UserList: any
  has_nextuser: any
  has_previoususer: any
  currentpageuser: any = 1

  userdd(data) {
    // this.SpinnerService.show();
    this.service.SupplierVendor(data, this.currentpageuser)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.UserList = datas;
        // let datapagination = results["pagination"];
        // this.has_nextuser = datapagination.has_next;
        // this.has_previoususer = datapagination.has_previous;
        // this.currentpageuser = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  // displayFnuser(user?: userlistss): string | undefined {

  //   let codeName = '('+user?.code+')'+' '+ user?.name 
  //   console.log("code and name", codeName)
  //   return user? codeName : undefined
  // }
  displayFnuser(user?: any) {
    if ((typeof user) === 'string') {
      return user;
    }
    return user ? this.UserList.find(_ => _.code === user).code : undefined;
  }




  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  oncancel() {
    this.onCancel.emit()
  }
  SupplierCatlogSubmit(){
    let dataform = this.SupplierCatlogForm.value 
    let id = this.ProposalID

    let Start_date_transform = dataform?.start_date
    let End_date_transform = dataform?.end_date

    let startdate = this.datepipe.transform(Start_date_transform, 'yyyy-MM-dd')
    let enddate = this.datepipe.transform(End_date_transform, 'yyyy-MM-dd')
    // let suppliercodeData = 

    let obj = {
      "supplier_code": this.SupplierCatlogForm.value.supplier_code,
      "type": this.SupplierCatlogForm.value.type,
      "name": this.SupplierCatlogForm.value.name,
      "description": this.SupplierCatlogForm.value.description,
      "start_date": startdate,
      "end_date": enddate,
      "contract_spend": this.SupplierCatlogForm.value.contract_spend,
      "rm": this.SupplierCatlogForm.value.rm?.id,
      "fidelity": this.SupplierCatlogForm.value.fidelity,
      "bidding": this.SupplierCatlogForm.value.bidding,
      "raisor":this.SupplierCatlogForm.value.raisor?.id,
      "approver": this.SupplierCatlogForm.value.approver?.id,
      "productname": this.SupplierCatlogForm.value.productname?.id,
      "category": this.SupplierCatlogForm.value.category?.id,
      "subcategory": this.SupplierCatlogForm.value?.subcategory.id
    }

    this.service.supplierCatlogCreate(id, obj)
    .subscribe(results=>{
      console.log("data after submit catlog supplier  ", results)
    })



    this.onSubmit.emit()
  }



  pushtovendor() {
    this.SpinnerService.show();
    this.service.proposal_vendorcreate(this.ProposalID, this.vendorCode)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide(); 
        this.onSubmit.emit()
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



}
export interface emplistss {
  id: string;
  name: any;
  full_name: any
}
export interface prodlistss {
  id: string;
  name: any;
  full_name: any
  code: any 
}

export interface catlistss {
  id: string;
  name: any;
  full_name: any
}

export interface subcatlistss {
  id: string;
  name: any;
  full_name: any
}
export interface userlistss {
  id: string;
  name: any;
  code: any; 
}

