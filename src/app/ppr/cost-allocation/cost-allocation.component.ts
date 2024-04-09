import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map, startWith, timeout } from 'rxjs/operators';
import { PprService } from '../ppr.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/service/notification.service';
import { E, I } from '@angular/cdk/keycodes';
import { element } from 'protractor';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DatePipe, formatDate } from '@angular/common';
import { ErrorhandlingService } from '../errorhandling.service';

export interface businessList {
  id: number
  name: string
}
export interface bsList {
  id: number
  name: string
}
export interface ccList {
  id: number
  name: string
}
export interface AlevelList {
  id: number
  name: string
}
export interface CostDriverList {
  id: number
  name: string
}
export interface CostDriverInputList {
  id: number
  name:string
  sector: string
}
export interface BSCCcodeInputLists {
  id: number
  code: string
}
export interface BSCNameLists {
  id: number
  name: string
}
export interface BSNameLists {
  id: number
  name: string
}
export interface ccNameList{
  id:number
  name:string
}
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

// import {} from '../budget-builder/budget-builder.component'
@Component({
  selector: 'app-cost-allocation',
  templateUrl: './cost-allocation.component.html',
  styleUrls: ['./cost-allocation.component.scss'],
  providers:[ { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe]
})
export class CostAllocationComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('bssearchAutoComplete') bssearchAutoComplete: MatAutocomplete;
  @ViewChild('bssearchInput') bssearchInput: any;
  // Allocation_level
  @ViewChild('Allocation_level') Allocation_level: MatAutocomplete;
  @ViewChild('allocation_input') allocation_input: any;
  // costdriver_level
  @ViewChild('costdriver_level') costdriver_level: MatAutocomplete;
  @ViewChild('costdriver_input') costdriver_input: any;
  // bsccAutoComplete 
  @ViewChild('bsccAutoComplete') bsccAutoComplete: MatAutocomplete;
  @ViewChild('bsccInput') bsccInput: any;
  //bs
  @ViewChild('bsInput') bsInput: any;
  @ViewChild('bsAutoComplete') bsAutoComplete:MatAutocomplete;
  @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  //cc
  @ViewChild('ccInput') ccInput: any;
  @ViewChild('ccAutoComplete') ccAutoComplete:MatAutocomplete;
  @ViewChild('cc_name') matAutocompletecc: MatAutocomplete;
  //inputamount
  @ViewChild('inputamount') inputamount:any
  //bscc
  @ViewChild('bsNameInput') bsNameInput: any;
// bs
@ViewChild('bsformInput') bsformInput: any;
@ViewChild('bsfromAutoComplete') bsfromAutoComplete:MatAutocomplete;

// cc

@ViewChild('ccformInput') ccformInput: any;
@ViewChild('ccfromAutoComplete') ccfromAutoComplete:MatAutocomplete;

@ViewChild('bsccsearchInput') bsccsearchInput: any;
@ViewChild('bsccsearchAutoComplete') bsccsearchAutoComplete:MatAutocomplete;

@ViewChild('bs_searchInput') bs_searchInput: any;
@ViewChild('bs_searchAutoComplete') bs_searchAutoComplete:MatAutocomplete;
currentdate=new Date();
  has_next: any;
  has_previous: any;
  Bsfromcode: any;
  ccfromcode: any;
  cost_id: any;
  bsccsearch: any;
  Bssearch: any;
  ccsearch: any;

  constructor(private errorHandler: ErrorhandlingService,private formBuilder: FormBuilder,private datePipe:DatePipe,private notification: NotificationService, private dataService: PprService, private SpinnerService: NgxSpinnerService, private toastr: ToastrService) { }
  cost_allocationform: FormGroup
  cost_allocationtoform: FormGroup
  costallocation_summary: FormGroup
  cost_allocationsearch:FormGroup
  newrowadd: FormGroup
  add_tag: any
  summary_tag: any
  allocationto_List: any
  allocation_bsccList: any
  methodology_list: any
  businessList: Array<businessList>;
  value_defalut:Number=0;
  bsList: Array<bsList>;
  ccList: Array<ccList>;
  AlevelList: Array<AlevelList>;
  CostDriverList: Array<CostDriverList>;
  CostDriverInputList: Array<CostDriverInputList>;
  BSCCcodeInputList: Array<BSCCcodeInputLists>;
  costallocationsummary_List: []
  isLoading = false;
  page=1 ;
  pageSize =10
  BsNamecode: Array<BSCNameLists>
  bsName_dropdown = new FormControl()
  cc_dropdown = new FormControl()
  rows_value: FormArray
  presentpage: number = 1;
  identificationSize:number=10
  isSummaryPagination:boolean
  input_value:any
  ratio_value:any
  amountvalue:any
  ngOnInit(): void {
   
    
    this.add_tag = true
    this.methodology_list = ["FTE", "Fixed", "Variable", "sq.foot", "Transaction Based", "Business Unit", "Based on Usage"]
    // this.newrowadd=this.formBuilder.group({rows_value : this.formBuilder.array([this.createItemFormGroup])})
    this.newrowadd = this.formBuilder.group({
      rows_value: new FormArray([
        this.createItemFormGroup()
      ])
    })
    console.log(this.newrowadd.value['rows_value'])
    this.cost_allocationsearch=this.formBuilder.group({
      allocationbscc_search:[''],
      allocationbs_search:[''],
      allocationcc_search:['']
    })
    this.cost_allocationform = this.formBuilder.group({
      allocation_from: [""],
      allocationbs_filter: [""],
      allocationfrom_catelog: [""],
      allocationfrom_subcategory: [""],
      allocationfrom_bs: [""],
      allocationbsform_filter:[''],
      allocationfrom_cc: [""],
      allocationfromcc:[''],
      allocationfrom_methodology: [""],
      allocationfrom_ratio: [""],
      validity_from:[""],
      validity_to:[""]
    })

    this.cost_allocationtoform = this.formBuilder.group({
      allocation_to: [""],
      allocationto_category: [""],
      allocationto_subcategory: [""],
      allocationto_bs: [""],
      allocationto_cc: [""],
      parameter_inputform: [""],
      allocationto_input: [""],
      allocationto_ratio: [""],
      allocationto_amount: [""]
    })

    // this.costallocation_summary=this.formBuilder.group({

    //   Bscc:[null],
    //   cc_dropdown:[null],
    //   bsName_dropdown:[null],
    //   parameter_dropdown:[null],
    //   inputvalue:[null],
    //   ratiovalue:[null],
    //   amount_value:[null],
    //   // bscc_dropdown:[null],
    //   // cc_dropdown:[''],
    // })
     console.log("value",this.newrowadd.value.rows_value)
     this.summary_tag = false
     if(this.summary_tag==false){
       this.getcostallocationsummary();
       console.log(this.summary_tag)
 
     }
  }
  currentIndex
  handlePageChange(event) {
    console.log("page=>",event)
    this.page = event;
  }
  add_allocation() {
    this.allocation_bsccList = []
    this.cost_allocationform.reset();
    this.editid=0
    console.log("cost_allocation=>",this.cost_allocationtoform)
    this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
    this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
    this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
    this.cost_allocationform.controls['allocationbs_filter'].reset({})
    // this.getcostallocationsummary();
    let cls= (this.newrowadd.controls['rows_value'] as FormArray)
    cls.reset();
    this.add_tag = false
    this.summary_tag = true
    this.edit_flag = false
    console.log(this.newrowadd)
  }
  cancel_allocation() {
    this.allocation_bsccList = []
    this.amount=0
    this.editid=0
    this.bsdropdown_id=0
    this.editview=0
    this.hideElement=true
    this.minvalue_from=''
    this.cost_allocationform.reset();
    this.newvalue=[]
    this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
    this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
    this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
    this.cost_allocationform.controls['allocationbs_filter'].reset({})
    let cls= (this.newrowadd.controls['rows_value'] as FormArray)
    cls.reset();
    const control = <FormArray>this.newrowadd.controls['rows_value'];
        for(let i = control.length-1; i >= 1; i--) {
            control.removeAt(i)
    }
    this.currentpage=1
    // // this.reset()
    // this.totalAmount=0
    // // this.newrowadd.get('rows_value').value
    // this.newrowadd.reset()
    this.cost_allocationsearch.get('allocationbscc_search').reset('')
    this.cost_allocationsearch.get('allocationbs_search').reset('')
    this.cost_allocationsearch.get('allocationcc_search').reset('')
    this.getcostallocationsummary();
    this.add_tag = true
    this.summary_tag = false
    this.edit_flag = true

  
    
    console.log("row=>",this.newrowadd)
    // window.location.reload()
  }
  public allocationto_List1 = [];
  add_allocationto(data) {
    let a = []
    a.push(data)
    this.allocationto_List1.push(data)
    console.log(data)
  }
  removeallocationto(data, data1, index_no) {
    this.allocationto_List1.splice(index_no, 1);
    // this.allocationto_List1=data
  }
  methodologydrop_val: any
  fixedratio_val: any
  allocation_to1: any
  allocationtotal_amount: any
  submit_allocationfrom(data) {
    this.allocation_to1 = data.allocation_from.name
    this.allocationtotal_amount = data.allocationfrom_ratio
    this.cost_allocationtoform.value.allocation_to = data.allocation_from.name
    this.methodologydrop_val = data.allocationfrom_methodology
    if (data.allocationfrom_methodology == 'Fixed') {
      this.fixedratio_val = data.allocationfrom_ratio
    }
  }

  // business dropdown start
  Business_dropdown() {
    let prokeyvalue: String = "";
    this.getbusiness(prokeyvalue);
    this.cost_allocationform.get('allocation_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_business_dropdown(1, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }


  business_id = 0;
  private getbusiness(prokeyvalue) {
    this.dataService.get_business_dropdown(1, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.businessList = datas;

      })
  }

  public displayfnbusiness(business_name?: businessList): string | undefined {
    return business_name ? business_name.name : undefined;

  }

  selectbusinessSection(data) {
    this.business_id = data.id
    if (this.business_id == undefined) {
      this.cost_allocationform.value.bs_id = ' ';
    }
  }

  // business dropdown end
  // allocation level dropdown start
  allocation_id
  Allocationlevel_dropdown() {
    let prokeyvalue: String = "";
    this.getallocationlevel(prokeyvalue);
    this.cost_allocationform.get('allocationfrom_catelog').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getallocationleveldropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.allocation_id=value.id

              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.AlevelList = datas;
        
        for(var i = 0; i < results["data"].length; i++){
          if(results["data"][i].code!='AL4'){
            console.log(results["data"][i].code,i)
            results["data"].splice(i, 1); 
            i--; 
          }
        }
      
      })
  }
  

  // business_id=0;
  private getallocationlevel(prokeyvalue) {
    this.dataService.getallocationleveldropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.AlevelList = datas;
        console.log("allocation_id=>",this.allocation_id)
        if(this.bsdropdown_id==18 || this.bsdropdown_id==11){
          for(var i = 0; i < results["data"].length; i++){
            if(results["data"][i].code!='AL4'){
              console.log(results["data"][i].code,i)
              results["data"].splice(i, 1); 
              i--; 
            }
          }
        }
      })
  }

  public displayallocationlevel(Allocation_level?: AlevelList): string | undefined {
    return Allocation_level ? Allocation_level.name : undefined;

  }
  allocationlevelscroll(){
    this.has_nextval =true
                      this.has_previousval =true
                      this.currentpagenum =1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.Allocation_level &&
        this.autocompleteTrigger &&
        this.Allocation_level.panel
      ) {
        fromEvent(this.Allocation_level.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.Allocation_level.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.Allocation_level.panel.nativeElement.scrollTop;
            const scrollHeight = this.Allocation_level.panel.nativeElement.scrollHeight;
            const elementHeight = this.Allocation_level.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getallocationleveldropdown(this.allocation_input.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.AlevelList = this.AlevelList.concat(datas);
                    if (this.AlevelList.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // selectbusinessSection(data){
  //   this.business_id=data.id
  //   if (this.business_id==undefined){
  //     this.cost_allocationform.value.bs_id = ' ';
  //   }
  // }

  // business_bs_clear(){
  //   this.cost_allocationform.controls['allocationfrom_bs'].reset('')
  //   this.cost_allocationform.controls['allocationfrom_cc'].reset('')
  // }
  // allocation level dropdown end
  costdrive_id
  // cost driver dropdown start
  CostDriver_dropdown() {
    let prokeyvalue: String = "";
    this.getcostdriver(prokeyvalue);
    this.cost_allocationform.get('allocationfrom_subcategory').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.costdrive_id=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CostDriverList = datas;

      })
  }
  costdriverscroll(){
    this.has_nextval =true
    this.has_previousval =true
    this.currentpagenum =1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.costdriver_level &&
        this.autocompleteTrigger &&
        this.costdriver_level.panel
      ) {
        fromEvent(this.costdriver_level.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.costdriver_level.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.costdriver_level.panel.nativeElement.scrollTop;
            const scrollHeight = this.costdriver_level.panel.nativeElement.scrollHeight;
            const elementHeight = this.costdriver_level.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getcostdriverdropdown(this.costdriver_input.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.CostDriverList = this.CostDriverList.concat(datas);
                    if (this.CostDriverList.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // cost driver dropdown start
  parameterinput_dropdown() {
    let prokeyvalue: String = "";
    this.getcostdriverinput(prokeyvalue);
    this.cost_allocationform.get('allocation_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CostDriverInputList = datas;

      })
  }


  // business_id=0;
  private getcostdriver(prokeyvalue) {
    this.dataService.getcostdriverdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CostDriverList = datas;

      })
  }

  public displaycdvalues(costdriver_level?: CostDriverList): string | undefined {
    return costdriver_level ? costdriver_level.name : undefined;

  }
  private getcostdriverinput(prokeyvalue) {
    this.dataService.getcostdriverdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.CostDriverInputList = datas;

      })
  }
  public displaycdvalues1(costdriver_level?: CostDriverInputList): string | undefined {
    return costdriver_level ? costdriver_level.sector : undefined;

  }

  // selectbusinessSection(data){
  //   this.business_id=data.id
  //   if (this.business_id==undefined){
  //     this.cost_allocationform.value.bs_id = ' ';
  //   }
  // }

  // business_bs_clear(){
  //   this.cost_allocationform.controls['allocationfrom_bs'].reset('')
  //   this.cost_allocationform.controls['allocationfrom_cc'].reset('')
  // }
  // cost driver dropdown end



  // cost driver dropdown start
  bscccodeto_dropdown() {
    let prokeyvalue: String = "";
    this.getbscccode(prokeyvalue);
    this.cost_allocationform.get('allocation_from').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsccdropdown(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BSCCcodeInputList = datas;

      })
  }


  // business_id=0;
  private getbscccode(prokeyvalue) {
    this.dataService.getbsccdropdown(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BSCCcodeInputList = datas;
        console.log("DD List", this.BSCCcodeInputList)

      })
  }

  public displayfnbscccode(bsccocde_level?: BSCCcodeInputLists): string | undefined {
    return bsccocde_level ? bsccocde_level.code : undefined;

  }

  // bs dropdown start

  bsname_dropdown() {
    let prokeyvalue: String = "";
    this.getbsid(prokeyvalue);
    this.cost_allocationform.get('allocationfrom_bs').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getbsdropdown(this.business_id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
        // this.cancel_allocation()
      })
  }

  private getbsid(prokeyvalue) {
    this.dataService.getbsdropdown(this.business_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;

      })
  }

  cc_bs_id = 0
  currentpagebs: any = 1
  has_nextbs: boolean = true
  has_previousbs: boolean = true
  @ViewChild('bsNameAutoComplete')bsmatAutocomplete:MatAutocomplete
  autocompletebsnameScroll() {
    this.has_nextbs = true
    this.has_previousbs = true
    this.currentpagebs = 1
    setTimeout(() => {
      if (
        this.bsmatAutocomplete &&
        this.autocompleteTrigger &&
        this.bsmatAutocomplete.panel
      ) {
        fromEvent(this.bsmatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.bsmatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.bsmatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bsmatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bsmatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbs === true) {
                this.dataService.get_bs_dropdown(this.business_id, this.bsNameInput.nativeElement.value, this.currentpagebs + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.BsNamecode = this.BsNamecode.concat(datas);
                    if (this.BsNamecode.length >= 0) {
                      this.has_nextbs = datapagination.has_next;
                      this.has_previousbs = datapagination.has_previous;
                      this.currentpagebs = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  public displayfnbs(bs?: bsList): string | undefined {
    return bs ? bs.name : undefined;

  }

  selectbsSection(data) {
    this.cc_bs_id = data.id
  }

  bs_cc_clear() {
    this.cost_allocationform.controls['allocationfrom_cc'].reset('')
  }
  // bs dropdown end
  // cc dropdown start

  ccname_dropdown() {
    let prokeyvalue: String = "";
    this.getccid(prokeyvalue);
    this.cost_allocationform.get('allocationfrom_cc').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getccdropdown(this.cc_bs_id, value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;

      })
  }



  private getccid(prokeyvalue) {
    this.dataService.getccdropdown(this.cc_bs_id, prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;

      })
  }

  currentpagecc: any = 1
  has_nextcc: boolean = true
  has_previouscc: boolean = true
  autocompletccnameScroll() {
    this.has_nextcc = true
    this.has_previouscc = true
    this.currentpagecc = 1
    setTimeout(() => {
      if (
        this.ccAutoComplete &&
        this.autocompleteTrigger &&
        this.ccAutoComplete.panel
      ) {
        fromEvent(this.ccAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(() => this.ccAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(() => {
            const scrollTop = this.ccAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.ccAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.ccAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcc === true) {
                this.dataService.get_cc_dropdown(this.cc_bs_id, this.ccInput.nativeElement.value, this.currentpagecc + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cccode = this.cccode.concat(datas);
                    if (this.cccode.length >= 0) {
                      this.has_nextcc = datapagination.has_next;
                      this.has_previouscc = datapagination.has_previous;
                      this.currentpagecc = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  public displayfncc(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;

  }
  // cc dropdown end
  ratio_percentageto: any
  toataltoamount: any
  total_rationcal: any
  pre_totalamt: any
  amount_change(data) {
    if (this.allocationto_List1.length == 0) {
      this.total_rationcal = data
      this.pre_totalamt = this.total_rationcal

    } else {
      this.total_rationcal = 0
      for (let i = 0; i < this.allocationto_List1.length; i++) {
        this.total_rationcal = this.total_rationcal + parseInt(this.allocationto_List1[i].allocationto_input)
      }
      this.pre_totalamt = parseInt(this.total_rationcal) + parseInt(data)

    }
    for (let i = 0; i < this.allocationto_List1.length; i++) {
      let ratio_percentageto1 = (parseInt(this.allocationto_List1[i].allocationto_input) / parseInt(this.pre_totalamt)) * 100
      this.allocationto_List1[i].allocationto_ratio = ratio_percentageto1
      let toataltoamount1 = (parseFloat(this.allocationto_List1[i].allocationto_ratio) / 100) * parseFloat(this.allocationtotal_amount)
      this.allocationto_List1[i].allocationto_amount = toataltoamount1
    }

    this.ratio_percentageto = (parseInt(data) / parseInt(this.pre_totalamt)) * 100
    this.toataltoamount = (parseFloat(this.ratio_percentageto) / 100) * parseFloat(this.allocationtotal_amount)
    this.cost_allocationtoform.patchValue({
      allocationto_ratio: this.ratio_percentageto,
      allocationto_amount: this.toataltoamount
    })
    console.log(this.ratio_percentageto)
    console.log(data)
  }
 searchdata
 statusName:any
   getcostallocationsummary() {
   if(this.srachid==undefined){
     this.srachid=0
   }
   console.log("summary=>",this.cost_allocationsearch.value)
   if(this.cost_allocationsearch.value.allocationbscc_search==''||this.cost_allocationsearch.value.allocationbscc_search==undefined || this.cost_allocationsearch.value.allocationbscc_search==null){
    this.cost_allocationsearch.value.allocationbs=''
  }else{
    this.cost_allocationsearch.value.allocationbs=this.cost_allocationsearch.value.allocationbscc_search.id

  }
  if(this.cost_allocationsearch.value.allocationbs_search==''|| this.cost_allocationsearch.value.allocationbs_search==undefined || this.cost_allocationsearch.value.allocationbs_search ==null ){
    this.cost_allocationsearch.value.bssearch=''
  }else{
    this.cost_allocationsearch.value.bssearch=this.cost_allocationsearch.value.allocationbs_search.id

  }
  if(this.cost_allocationsearch.value.allocationcc_search==''|| this.cost_allocationsearch.value.allocationcc_search==undefined || this.cost_allocationsearch.value.allocationcc_search ==null  ){
    this.cost_allocationsearch.value.ccsearch=''
  }else{
    this.cost_allocationsearch.value.ccsearch=this.cost_allocationsearch.value.allocationcc_search.id
  }
  let bscc=this.cost_allocationsearch.value.allocationbs
  let cc=this.cost_allocationsearch.value.ccsearch
  let bs=this.cost_allocationsearch.value.bssearch
   this.SpinnerService.show()
    this.dataService.get_cost_allocation_summary(this.currentpage,this.srachid,bscc,cc,bs)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let dataPagination = results['pagination'];
        // console.log(dataPagination)
        this.costallocationsummary_List = datas;
       
       
        if (datas.length >= 0) {
          console.log("val")
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isSummaryPagination = true;
        } if (datas <= 0) {
          console.log("val1")

          this.isSummaryPagination = false;
        }

      },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  currentpage: number = 1;

  nextClick() {
    if (this.has_next === true) {
         
        this.currentpage = this.presentpage + 1
        this.getcostallocationsummary()
      }
   
    }
  
  previousClick() {
    if (this.has_previous === true) {
      
      this.currentpage = this.presentpage - 1
      this.getcostallocationsummary()
    }
  }
  // allocationform_search(){

  // }
  getcostallocationclear(){
    this.cost_allocationsearch.get('allocationbscc_search').reset('')
    this.cost_allocationsearch.get('allocationbs_search').reset('')
    this.cost_allocationsearch.get('allocationcc_search').reset('')
  }
  BsccSearch: Array<BSCNameLists>
srachid:any
  private asset_Bscodesearch(keyvalue) {
    this.dataService.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsccSearch = datas;
        
        console.log("main=>",this.BsccSearch)
      })
  }
 
  public displaybspprsearch(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  allocationform_search() {
    let keyvalue: String = "";
    this.asset_Bscodesearch(keyvalue);
    this.cost_allocationform.get('allocationbs_filter').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_business_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              // this.val=value
              this.srachid=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsccSearch = datas;
        console.log("value")
      })
  }
  currentpagenum=1
  has_nextval=true
 has_previousval=true
  allocationfromscroll(){
    console.log("scroll")
    this.has_nextval = true
    this.has_previousval = true
    this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.bssearchAutoComplete &&
        this.autocompleteTrigger &&
        this.bssearchAutoComplete.panel
      ) {
        fromEvent(this.bssearchAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bssearchAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bssearchAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bssearchAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bssearchAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log(this.has_nextval)
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.get_business_dropdown(1,this.bssearchInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.BsccSearch = this.BsccSearch.concat(datas);
                    if (this.BsccSearch.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      console.log("datapagination.has_next=>",datapagination.has_next)
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })

              }
              
            }
          });
      }
    });
  }
  changeinput(data, index, alldata) {
    console.log('ratio', data)
    console.log('index', index)
    console.log('alldata', alldata)
    alldata.input_value = data
    // data.valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    // ).subscribe(value => {
    //     console.log(value)
    //   }
    //   )
    // console.log('ratio',data)
  }
  changeratio(data, index, alldata) {
    console.log('ratio', data)
    console.log('index', index)
    console.log('alldata', alldata)
    alldata.ratio = data
    // data.valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    // ).subscribe(value => {
    //     console.log(value)
    //   }
    //   )
    // console.log('ratio',data)
  }
  changeamount(data, index, alldata) {
    console.log('ratio', data)
    console.log('index', index)
    console.log('alldata', alldata)
    alldata.to_amount = data
    // data.valueChanges.pipe(
    //   debounceTime(100),
    //   distinctUntilChanged(),
    // ).subscribe(value => {
    //     console.log(value)
    //   }
    //   )
    // console.log('ratio',data)
  }

  // insert_allocation() {
  //   let a = this.cost_allocationform.value

  //   let b = this.allocation_bsccList

  //   for (let i = 0; i < b.length; i++) {
  //     // let a1=b[i].bscc_data
  //     let bscccode_id = b[i].bscc_data[0].id
  //     let cc_id = b[i].cc_data[0].id
  //     let bs_id = b[i].bs_data[0].id
  //     b[i]['bscc_code'] = bscccode_id
  //     b[i]['cc_id'] = cc_id
  //     b[i]['bs_id'] = bs_id
  //     // delete b[b[i],a1];
  //   }
  //   let params = {}
  //   if (this.edit_flag == true) {
  //     a['id'] = this.getallocationListdata['id']
  //     params = {
  //       "id": a.id,
  //       "source_bscc_code": a.allocation_from.id,
  //       "level": 2,
  //       "cost_driver": 2,
  //       "allocation_amount": a.allocationfrom_ratio,
  //       "to_data": b
  //     }
  //   } else {
  //     params = {
  //       "source_bscc_code": a.allocation_from.id,
  //       "level": 2,
  //       "cost_driver": 2,
  //       "allocation_amount": a.allocationfrom_ratio,
  //       "to_data": b
  //     }
  //   }

  //   console.log('params', params)
  //   this.set_allocationratio(params)
  // }

  // private set_allocationratio(prokeyvalue) {
  //   // this.SpinnerService.show()
  //   this.dataService.set_allocationratio(prokeyvalue)
  //     .subscribe((results: any[]) => {
  //       // this.SpinnerService.hide()
  //       let datas = results;
  //       if (datas.length != 0) {
  //         this.toastr.success('', 'Saved Successfully', { timeOut: 1500 });
  //         this.add_tag = true
  //         this.summary_tag = false
  //         this.getcostallocationsummary()
  //         return false;
  //       } else {
  //         this.toastr.warning('', 'Failed Data', { timeOut: 1500 });
  //         return false;
  //       }


  //     })
  // }
  getallocationListdata: []
  edit_flag: any
  editid=0
  editview=0
  view_allocation(id,cost_obj){
    this.editid=2
    this.editview=2
    this.add_tag = false
    this.summary_tag = true
    this.edit_flag = true
    // this.od(cost_obj.bscc_data)

   
    this.getparticularallocationcost(id)
    
  }
  editview_allocation(id,cost_obj) {
    this.editid=1
    // this.editview=1
    this.add_tag = false
    this.summary_tag = true
    this.edit_flag = true
    
    if( this.editid===1){
    // this.od(cost_obj.bscc_data)

    this.getparticularallocationcost(id)

    }
  }
bsccid:any
  costsummary_id:any
  todata_id:any=[]
  minvalue_from:any
  
  private getparticularallocationcost(prokeyvalue) {
    this.SpinnerService.show()
    this.dataService.particularallocation(prokeyvalue)
      .subscribe((datas: any[]) => {
    this.SpinnerService.hide()

        let results =datas['data'][0]
        console.log("results=>",results['validity_from'])
        // if(results['bscc_data'].id===18){

        // this.bsccid=results['bscc_data'].id
        // console.log("id=>",this.bsccid)
        console.log("new=>",this.newrowadd.controls.rows_value['controls'])
        // alocation_from=
        this.cost_id=results.id
        let display_data=results['to_data']
        // this.todata_id=results['to_data'].id
        this.costsummary_id=prokeyvalue
        console.log("display_data=>",this.todata_id)
        
        let data=new FormArray([])
        display_data.forEach(element => {
          console.log("element",element)
        this.todata_id.push(element.id)
         //id_droupdown summary
        //  this.bscc_id=element['bscc_data'].id
         this.bs_id=element['bs_data'].id
         
        // console.log("display_data=>",this.newrowadd.controls.rows_value['controls'].parameter_dropdown['sector'])
        this.minvalue_from=results['validity_from']
          data.push(this.formBuilder.group({
          id:element.id,
          Bscc: element['bscc_data'],
          bsName_dropdown:element['bs_data'],
          cc_dropdown:element['cc_data'],
          // parameter_dropdown:element['parameter'],
          // premium_amount:element['premium_amount'],
          // inputvalue:element['input_value'],
          ratiovalue:element['ratio'],
          // amount_value:element['to_amount']
          }))
          return data;
        });
        this.newrowadd.setControl('rows_value',data)
        console.log("newrow",this.newrowadd)
        console.log("cost_allocationform",this.cost_allocationform)
        this.cost_allocationform.patchValue({

          allocationbs_filter:results['bscc_data'],
          allocationbsform_filter:results['bs_data'],
          allocationfromcc:results['cc_data'],
          // allocationfrom_catelog:results['level_data'],
          // allocationfrom_subcategory:results['cost_driver_data'],
          // allocationfrom_ratio:results['premium_amount'],
          validity_from:results['validity_from'],
          validity_to:results['validity_to'],

          // validity_from:'',
          // validity_to:'',
        })
        console.log("cost_allocationform",this.cost_allocationform)
        // this.bsdropdown_id=results['bscc_data'].id
        // this.costdrive_id=results['cost_driver_data'].id
        // this.allocation_id=results['level_data'].id
       

      },error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  status(id,status){
    let statusid
    if(status==1){
      statusid=0
    }else{
      statusid=1
    }
    console.log(id,statusid)
    let dataConfirm = confirm("Are you sure,You Are Change The Status?")
    if (dataConfirm == false) {
      return false;
    }
    this.dataService.getStatus(id,statusid).subscribe((results: any[]) => {
        this.toastr.success('', status, { timeOut: 1500 });
        this.getcostallocationsummary();
        console.log("result=>",results)
      })
    }


  // Business Application from filter
  Bscode: Array<BSCNameLists>
  // private getasset_Bscode(keyvalue) {
  //   this.dataService.getbusinessdropdown(1, keyvalue, 1)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Bscode = datas;
        
  //       console.log("main=>",this.Bscode)
  //     })
  // }
   private getasset_Bscode1(keyvalue) {
    this.dataService.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscode = datas;
        
        console.log("main=>",this.Bscode)
      })
  }
  bsdropdown_id=0
  val
  public displaybsppr(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  bsDropdown() {
    let keyvalue: String = "";
    this.getasset_Bscode1(keyvalue);
    this.cost_allocationform.get('allocationbs_filter').valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.get_business_dropdown(1,value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              // this.val=value
              this.bsdropdown_id=value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bscode = datas;
        console.log("value")
        
      })
  }
  costallocationfromscroll(){
    this.has_nextval = true
                      this.has_previousval = true
                      this.currentpagenum = 1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.bsAutoComplete &&
        this.autocompleteTrigger &&
        this.bsAutoComplete.panel
      ) {
        fromEvent(this.bsAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bsAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bsAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bsAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bsAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.get_business_dropdown(1,this.bsInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.Bscode = this.Bscode.concat(datas);
                    if (this.Bscode.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // bsDropdown() {
  //   let keyvalue: String = "";
  //   this.getasset_Bscode(keyvalue);
  //   this.cost_allocationform.get('allocationbs_filter').valueChanges
  //     .pipe(
  //       startWith(""),
  //       debounceTime(100),
  //       distinctUntilChanged(),
  //       tap(() => {
  //         this.isLoading = true;


  //       }),

  //       switchMap(value => this.dataService.getbusinessdropdown(1, value, 1)
  //         .pipe(
  //           finalize(() => {
  //             console.log(value.id)
  //             this.bsdropdown_id=value.id
              
  //             this.isLoading = false
  //           }),
  //         )
  //       )
  //     )
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.Bscode = datas;
  //       // this.od()
  //       // this.cancel_allocation()
  //       this.empty()
  //       console.log("Bscode=>",this.Bscode)
        
  //     })

  // }
  empty(){
    // this.cost_allocationform.reset();
    // this.reset()
    this.totalAmount=0
    // this.newrowadd.get('rows_value').value
    this.newrowadd.reset()
    const control = <FormArray>this.newrowadd.controls['rows_value'];
        for(let i = control.length-1; i >= 1; i--) {
            control.removeAt(i)
    }
  }
  data:any
  other=[]
  inputValue = [];
   totalAmount=0
   PremiumAmount:any
   premium
   inputvalamount
   inputvalcal
   changeAmount=0
   indexval=[]
    change_amount

    amount_calculation(amountofinput,ind){
      // 92
     var len=[]
      if(this.bsdropdown_id==11 ){
        if(this.editid==0){
        console.log("change_amount",this.change_amount,amountofinput)
        this.indexval.push(ind)
        var uniqueElements = [...new Set(this.indexval)];
      // console.log(uniqueElements)
      // var index=
     var holder={}
    var addrowoddd=[]
    var tot=[]
var valin=[]
var totamount=0
var ratioamount=0
      for(var j in this.newrowadd.controls.rows_value['controls']){
    addrowoddd.push(Number(j))   
      }
      
     
      for(let el of uniqueElements){
        for(let addr in addrowoddd){
        console.log("el=>",el)
        if(Number(el)===addrowoddd[addr]){
          addrowoddd.splice(Number(addr),1)
          console.log("addr",addr,addrowoddd[addr],Number(el))
          
          tot.push(this.newrowadd.controls.rows_value.value[Number(el)].inputvalue)
        // console.log("amount",this.newrowadd.controls.rows_value.value[Number(addr)].inputvalue)
  
        }
      }
  
     
    }
    console.log("tot=>",tot)
    console.log("addrowoddd=>",addrowoddd)
    for(let val of tot){
      ratioamount=val
      totamount +=val
  }
  for(let sampleval of addrowoddd){
   
   
    var amountcal=Number(sampleval)
   
    // var changelen=sampleval.length
let ratiovalue=this.cost_allocationform.value.allocationfrom_ratio
    this.change_amount =(this.cost_allocationform.value.allocationfrom_ratio- totamount)
    let amount= (this.change_amount/addrowoddd.length).toFixed(2)
    this.amountValue=parseFloat(amount)
    

    var ratioval=((this.amountValue/ratiovalue)*100).toFixed(2)
    console.log("tot=>",ratioval)
  
    console.log("ratioamount=>",ratioamount,ratioval)
    this.newrowadd.controls.rows_value['controls'].at(sampleval).patchValue({amount_value:this.amountValue});
    this.newrowadd.controls.rows_value['controls'].at(sampleval).patchValue({ratiovalue:ratioval})
  }
  // }
  var arrayval=[]
    for(let i of uniqueElements){
      console.log("=>",uniqueElements)
  
      if(i==ind){
  
      var value=(this.cost_allocationform.value.allocationfrom_ratio-amountofinput)
      var ratiovalchange= ((ratioamount/this.cost_allocationform.value.allocationfrom_ratio)*100).toFixed(2)
      this.newrowadd.controls.rows_value['controls'].at(ind).patchValue({ratiovalue:ratiovalchange}) 
      this.newrowadd.controls.rows_value['controls'].at(ind).patchValue({amount_value:amountofinput});
    
  
     }
    
  }
}
  if(this.editid==1){
    var addrowoddd1=[]
    var tot1=[]
var valin1=[]
var totamount1=0
var ratioamount1=0
var uniqueElements1=[]
var indexval1=[]
var change_amount1
var amountValues
// console.log("change_amount",change_amount1,amountofinput)
// indexval1.push(ind)
var uniqueElements1 = [...new Set(indexval1)];
for(var j in this.newrowadd.controls.rows_value['controls']){
  addrowoddd1.push(Number(j))   
    }
    this.newrowadd.controls.rows_value['controls'].forEach((element,indval) => {
    //  console.log(element)
     if(element.value.inputvalue!=0){
      //  console.log("input",indval)
       tot1.push(Number(element.value.inputvalue))
       valin1.push(Number(indval))
       uniqueElements1.push(indval)
      
     }
   });
  
   for (let valinv of valin1){  
   for(let addr in addrowoddd1){
     if(Number(valinv)===addrowoddd1[addr]){
      //  console.log("addr2",addr,Number(valinv))
       addrowoddd1.splice(Number(addr),1)
 
     }
   }
     }
     for(let el of uniqueElements1){
      for(let addr in addrowoddd1){
      console.log("el=>",el)
      if(Number(el)===addrowoddd1[addr]){
        addrowoddd1.splice(Number(addr),1)
        // console.log("addr",addr,addrowoddd1[addr],Number(el))
        
        tot1.push(this.newrowadd.controls.rows_value.value[Number(el)].inputvalue)
      // console.log("amount",this.newrowadd.controls.rows_value.value[Number(addr)].inputvalue)

      }
    }
  }
  for(let val of tot1){
    ratioamount1=val
    totamount1 +=val
}
  for(let sampleval of addrowoddd1){
  let val=this.cost_allocationform.value.allocationfrom_ratio
  change_amount1 =(this.cost_allocationform.value.allocationfrom_ratio- totamount1)
  amountValues=(change_amount1/(addrowoddd1.length)).toFixed(2)
  console.log("this.cost_allocationform.value.allocationfrom_ratio=>",this.cost_allocationform.value.allocationfrom_ratio)
  console.log("amountValues 1=>",change_amount1,addrowoddd1.length,totamount1,amountValues)
    var ratioval1=((amountValues/val)*100).toFixed(2)
    console.log("tot=>",ratioval1)
  
    console.log("ratioamount=>",ratioamount1,ratioval1)
    this.newrowadd.controls.rows_value['controls'].at(sampleval).patchValue({amount_value:amountValues});
    this.newrowadd.controls.rows_value['controls'].at(sampleval).patchValue({ratiovalue:ratioval1})
  }
  for(let i of uniqueElements1){
    console.log("=>",uniqueElements1)

    if(i==ind){

    var value=(this.cost_allocationform.value.allocationfrom_ratio-amountofinput)
    var ratiovalchange1= ((amountofinput/this.cost_allocationform.value.allocationfrom_ratio)*100).toFixed(2)
    this.newrowadd.controls.rows_value['controls'].at(ind).patchValue({ratiovalue:ratiovalchange1}) 
    this.newrowadd.controls.rows_value['controls'].at(ind).patchValue({amount_value:amountofinput});
  

   }
  
}
  console.log("tot=>",tot1)
  console.log("addrowoddd1=>",addrowoddd1)
  } 
  console.log(arrayval)     
      }
      // this.change_event()
  console.log("len=>",len.length)
     }
     
   

   amount_valuecalc(amountcal,index){
     this.inputvalcal=amountcal
     console.log(this.bsccid)
     if(this.bsdropdown_id==18){
      console.log("totalAmount=>",this.totalAmount)
      var total=((this.inputvalcal/100)*this.totalAmount).toFixed(2)
      // var ration =this.inputvalcal/this.totalAmount
console.log("con=>",this.newrowadd.controls.rows_value['controls'])
      // console.log("id=>",this.cost_allocationform)
      for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
        
        this.newrowadd.controls.rows_value['controls'].at(index).patchValue({amount_value:total});
        // this.newrowadd.controls.rows_value['controls'].at(index).patchValue({ratiovalue:ration})
      }
        }
    console.log(amountcal);

   }
   
   onSearchChange(searchValue: string): void {  
    this.premium=searchValue
    if(this.bsdropdown_id==18 ){
      
      // console.log("id=>",this.cost_allocationform)
      for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
        this.newrowadd.controls.rows_value['controls'].at(len).patchValue({premium_amount:this.premium});
        
      }
   
        }
    console.log("searchValue",searchValue);



  }
   amountValue=0
   amount=0
   totallen:any
   allparam=[]
   parametername(event){
    //  this.allparam.push(event.id)
     console.log("val=>",this.newrowadd.controls.rows_value['controls'])
    
     console.log("bsccid",event,this.bsccid,this.allparam)
     if( this.bsdropdown_id==18 ){
       console.log("true value")
     for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
      this.newrowadd.controls.rows_value['controls'].at(len).patchValue({parameter_dropdown:event});
      // pramsName
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({premium_amount:this.cost_allocationform.value.allocationfrom_ratio});
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:0.00});
     }
    }
   }
  // total_amount=0
  hideElement: boolean = true;
  searchdatas(){
    this.hideElement=false

  }
od(value){

  this.hideElement=false
  var addrowod=new FormArray([])
  // var inputfloat=parseFloat('0.00')
  var zeroval=(0).toFixed(2)
  var amountvalue=(1).toFixed(2)
  console.log("true")
  for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
    for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
      this.newrowadd.controls.rows_value['controls'].at(len).patchValue({parameter_dropdown:this.pramsName});
      // pramsName
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({premium_amount:this.cost_allocationform.value.allocationfrom_ratio});
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:zeroval});
      this.newrowadd.controls.rows_value['controls'].at(len).patchValue({ratiovalue:zeroval});
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({premium_amount:amountvalue});
      // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({amount_value:amountvalue});
      // amount_value
    }
      
      }
       this.cost_allocationform.patchValue({
      allocationfrom_ratio:amountvalue,
      allocationfrom_subcategory:''

    })

// }
// else{
//   this.hideElement = true;
//   this.newrowadd.reset()
//   this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
//       this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
//       this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
//   this.newrowadd.reset()
//   const control = <FormArray>this.newrowadd.controls['rows_value'];

//   for(let i = control.length-1; i >= 1; i--) {
//               control.removeAt(i)
//       }
// }
}
// console.log("value=>",value.id)
// if(value.id===18){
//   // this.PremiumAmount=this.premium
//   // console.log("true")
//   this.dataService.allocationfrom_amountcal().subscribe((result:any[])=>{
//     // console.log("result=>",this.inputvalamount)
//   // console.log("PremiumAmount=>",  this.PremiumAmount)
//       let addrowod=new FormArray([])

//     this.data=result['data']
//     console.log("this.data=>",this.data)
//   for(let amount of this.data){
//     this.totalAmount+=Number(amount.totalamount)
//   }
//   for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
//     this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:0.00});
  
//   }
//   // console.log("totalAmount=>",this.totalAmount)
//   // this.cost_allocationform.patchValue({
//   //     allocationfrom_ratio:this.totalAmount

//   //   })

//   var holder:any = {};
//   // this.inputvalamount
//   this.data.forEach(function(d) {
//     if (holder.hasOwnProperty(d.entry_crno.substring(0,3))) {
//       holder[d.entry_crno.substring(0,3)] = holder[d.entry_crno.substring(0,3)] + Number(d.totalamount);
//     } else {
//       holder[d.entry_crno.substring(0,3)] = Number(d.totalamount);
//     }
//   });
  
  
//   for (var prop in holder) {
//     this.inputValue.push({ "entry_crno": prop, "amount": holder[prop] });
//   }
// // console.log(this.inputValue)
  



// // console.log("newrowadd=>",this.newrowadd)
    
//     this.inputValue.forEach((elem,vals1)=>{
//     for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
   
      
//   // console.log("=>",len)
//     // if(len===vals1){
//       var ration =elem.amount/this.totalAmount
    
//         // addrowod.push(this.formBuilder.group({
//         // // id:element.id,
//         // Bscc: '',
//         // bsName_dropdown:'',
//         // cc_dropdown:'',
//         // parameter_dropdown:'',
//         // premium_amount:'',
//         // inputvalue:elem['amount'],
//         // ratiovalue:ration,
//         // amount_value:''
//         // }))
//         // return addrowod;
//       // }

//       // console.log("ration=>",ration)
//       // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({ratiovalue:ration})
//       //  this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:elem.amount});
//       // console.log("same",elem,vals1)
//       // this.newrowadd.controls.rows_value['controls'].patchValue({inputvalue:elem})
    
//   // console.log("total=>",this.newrowadd.controls.rows_value['controls'].length)
//    }
//   })
//   // this.newrowadd.setControl('rows_value',addrowod)

//   })
// }else{
//   // this.allocation_bsccList = []
//   // this.cost_allocationform.reset();
//   // this.cost_allocationform.get('allocationbs_filter').patchValue(this.val)
//   // this.reset()
//   this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
//     this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
//     this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
//   this.totalAmount=0
//   // this.newrowadd.get('rows_value').value
//   this.newrowadd.reset()
//   // this.add_tag = true
//   // this.summary_tag = false
//   // (this.newrowadd.controls['rows_value'] as FormArray).clear();
//   const control = <FormArray>this.newrowadd.controls['rows_value'];
//       for(let i = control.length-1; i >= 1; i--) {
//           control.removeAt(i)
//   }
//   // this.cancel_allocation()
// }
//  if(value.id===11){
//   this.dataService.allocationfrom_techAllocation().subscribe((result:any[])=>{
//     let data=result['data']
//     let holder={}
//     this.totallen=data.length
//    let  tech_aloocation=new FormArray([])
//     console.log("data value=>",data)
//     var amounts=0
//     // data.forEach(function(d) {
//     //   // console.log(d['bs_data'].id)
//     //   if (holder.hasOwnProperty(d['bs_data'].code===65 )) {
//     //     holder[d.entry_crno.substring(0,3)] = holder[d.entry_crno.substring(0,3)] + Number(d.totalamount);
//     //   } else {
//     //     holder[d.entry_crno.substring(0,3)] = Number(d.totalamount);
//     //   }
//     // });
//     // this.amount=0
//     var count=[]
//     var ratioamounts=0
//     for(let value of data){
      
//       // console.log(value['bs_data'].code)
//       if(Number(value['bs_data'].code)===65 && Number(value['cc_data'].code)===266){
//         // console.log("if=>",value['bs_data'].code)
//         console.log("value=>",value)
//         this.amount+=Number(value.totalamount)
        
        
//       }else{
//         if(Number(value['bs_data'].code)!=65 && Number(value['cc_data'].code)!=266){
//           ratioamounts+=Number(value.totalamount)
//         count.push(1)
//       }
//       }
     
//     }
//     this.cost_allocationform.patchValue({
//       allocationfrom_ratio:this.amount

//     })

//     data.forEach(element => {

//       if(Number(element['bs_data'].code)!=65 && Number(element['cc_data'].code)!=266){
//         console.log("element1=>",element)
//         // this.bscc_id=element['cc_data'].id
//          this.bs_id=element['bs_data'].id
//          let amount=((this.amount/count.length).toFixed(2))
//         this.amountValue=parseFloat(amount)
        
//         var ratioval=((this.amountValue/this.cost_allocationform.value.allocationfrom_ratio)*100).toFixed(2)
//         console.log("value od")
//         var zeroval=(0).toFixed(2)
//         // var bsname=element['bs_data'].name
//         // console.log(element['bs_data'].name)
//         tech_aloocation.push(this.formBuilder.group({
//             id:element.id,
//             Bscc: '',
//             bsName_dropdown:element['bs_data'],
//             cc_dropdown:element['cc_data'],
//             parameter_dropdown:'',
//             premium_amount:zeroval,
//             inputvalue:zeroval,
//             ratiovalue:ratioval,
//             amount_value:this.amountValue
//             }))
//             return tech_aloocation;
//           }
//       })
//         this.newrowadd.setControl('rows_value',tech_aloocation)

        
//     })
    
//   }else{
//     // this.allocation_bsccList = []
//     // this.cost_allocationform.reset();
//     // this.cost_allocationform.get('allocationbs_filter').patchValue(this.val)
//     // this.reset()
//     this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
//     this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
//     this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
//     this.amount=0
//     this.totalAmount=0
//     // this.newrowadd.get('rows_value').value
//     this.newrowadd.reset()
//     // this.add_tag = true
//     // this.summary_tag = false
//     // (this.newrowadd.controls['rows_value'] as FormArray).clear();
//     const control = <FormArray>this.newrowadd.controls['rows_value'];
//         for(let i = control.length-1; i >= 1; i--) {
//             control.removeAt(i)
//     }
//     // this.cancel_allocation()
//   }
// }
    
   
    // console.log(amount)
    
          // bs_code=65 and cc_code=266
          // console.log(index)
          // element['']
        // if(index>0){
        //   data_value.push(this.formBuilder.group({
        //   id:element.id,
        //   Bscc: '',
        //   bsName_dropdown:'',
        //   cc_dropdown:'',
        //   parameter_dropdown:'',
        //   premium_amount:'',
        //   inputvalue:element['totalamount'],
        //   ratiovalue:'',
        //   amount_value:''
        //   }))
        //   return data_value;
        // }
        // console.log("data=>",data_value)
        
        //   if(index==1){
        // data_value.push(this.formBuilder.group({
        //   id:element.id,
        //   Bscc: element['bscc_data'],
        //   bsName_dropdown:element['bs_data'],
        //   cc_dropdown:element['cc_data'],
        //   parameter_dropdown:element['parameter'],
        //   premium_amount:element['premium_amount'],
        //   inputvalue:element['input_value'],
        //   ratiovalue:element['ratio'],
        //   amount_value:element['to_amount']
        //   }))
        //   return data;
        // }
       
      
        // this.newrowadd.setControl('rows_value',data_value)


    // console.log("id-1",data)
  // })

  // allocationfrom_techAllocation
 
  // summary
  Bscc = new FormControl()
  Bsccname: Array<BSCNameLists>
  bscc_id: any 
  private getasset_Bscc(keyvalue) {
    this.dataService.get_business_dropdown(1,keyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsccname = datas;
        console.log("out")
        // for(let idval of this.bsccval){
        // let bsccid=this.Bsccname.findIndex(ele=>ele.id==idval)
        // this.Bsccname.splice(bsccid,1)
        // }
      })
  }

  public displaybscc(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }
  bsccval=[]
  BsccDropdown(i) {
    console.log(i)
   let keyvalue: String = "";
    this.getasset_Bscc(keyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    // let keyvalue: String = "";
    // this.getasset_Bscc(keyvalue);
    console.log(((this.newrowadd.get('rows_value') as FormArray).at(i) as FormGroup).get("Bscc"))
    console.log("val",this.newrowadd.value['rows_value'])
    item.get("Bscc").valueChanges

      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.dataService.get_business_dropdown(1, value,1)
          .pipe(
            finalize(() => {
              // console.log(value.id)
              this.bscc_id = value.id
              this.bsccval.push(this.bscc_id)

              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.Bsccname = datas;
       
   
        // let filterdata=this.Bsccname.findIndex(brid=>brid.id===this.bsdropdown_id)
        //      this.Bsccname.splice(filterdata,1)
        // console.log(this.bsccval)
        // let va=((this.newrowadd.get('rows_value') as FormArray).at(i) as FormGroup).get("Bscc")
        // console.log("valueof=>",va)
        // this.bsccval.push(va.value.id)
        // console.log("bscc",this.bsccval)
        // for(let idval of this.bsccval){
        // let bsccid=this.Bsccname.findIndex(ele=>ele.id==idval)
        // this.Bsccname.splice(bsccid,1)
        // }
        // if(i==arrayControl.at(i)){
        // this.bsNameInput.nativeElement.value=''}
      })

  }
  bscc_dublicate(ind){
    console.log("inside",this.newrowadd)
    console.log("val",this.newrowadd.value['rows_value'])
    console.log("row=>",this.newrowadd.controls.rows_value['controls'])
    let duplicateCheckOnbscc:any[] 
    let duplicateCheckbs
   
      duplicateCheckOnbscc= this.newrowadd.value['rows_value'].filter((v,r)=>{return (r.Bscc=='' || r.Bscc ==null || r.Bscc ==undefined)}).map((x) => { return x.Bscc.name});
    
    if(this.cost_allocationform.value.allocationbs_filter!='' || this.cost_allocationform.value.allocationbs_filter!=null || this.cost_allocationform.value.allocationbs_filter!=undefined || Object.keys(this.cost_allocationform.value.allocationbs_filter).length !=0){
      duplicateCheckbs=this.cost_allocationform.value.allocationbs_filter.name
      duplicateCheckOnbscc.push(duplicateCheckbs)
    } 
    console.log("duplicateCheckOnbscc=>",duplicateCheckOnbscc)
    for(let i in duplicateCheckOnbscc){
     let first_index = duplicateCheckOnbscc.indexOf(duplicateCheckOnbscc[i]);
     let last_index = duplicateCheckOnbscc.lastIndexOf(duplicateCheckOnbscc[i])
     if(first_index != last_index){
       console.log('Duplicate item in array ' + duplicateCheckOnbscc[i]);
       console.log('Duplicate item in array index ' + i);   
       let indexNumber = Number(i)
       let indexval=Number(ind)
       this.toastr.warning("There is a duplicate bscc of '"+duplicateCheckOnbscc[i]+"' indentified in line "+ (indexval+1),'',{timeOut:1500})
       this.newrowadd.get('rows_value')['controls'][indexval].get("Bscc").reset('')
       return false;
     }
    }
  }
     
    
  
  bsccscroll(){
    this.has_nextval = true
                      this.has_previousval = true
                      this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.bsccAutoComplete &&
        this.autocompleteTrigger &&
        this.bsccAutoComplete.panel
      ) {
        fromEvent(this.bsccAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bsccAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bsccAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bsccAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bsccAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.get_business_dropdown(1,this.bsccInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.Bsccname = this.Bsccname.concat(datas);
                    if (this.Bsccname.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // bscc end


  bs_dublicate(ind){
    console.log("inside",this.newrowadd)
    console.log("val",this.newrowadd.value['rows_value'])
    console.log("row=>",this.newrowadd.controls.rows_value['controls'])
    let duplicateCheckOnbs:any[]=[]
    let duplicateCheckbs:any
    duplicateCheckOnbs= this.newrowadd.value['rows_value'].map(x => x.bsName_dropdown.name);
    if(this.cost_allocationform.value.allocationbsform_filter!='' || this.cost_allocationform.value.allocationbsform_filter!=null || this.cost_allocationform.value.allocationbsform_filter!=undefined || Object.keys(this.cost_allocationform?.value?.allocationbsform_filter)?.length !=0){
      duplicateCheckbs=this.cost_allocationform.value.allocationbsform_filter.name
      duplicateCheckOnbs.push(duplicateCheckbs)
    } 
    console.log("duplicateCheckOnbscc=>",duplicateCheckOnbs)
    console.log("duplicateCheckOnbscc=>",duplicateCheckOnbs)
    for(let i in duplicateCheckOnbs){
     let first_index = duplicateCheckOnbs.indexOf(duplicateCheckOnbs[i]);
     let last_index = duplicateCheckOnbs.lastIndexOf(duplicateCheckOnbs[i])
     if(first_index != last_index){
       console.log('Duplicate item in array ' + duplicateCheckOnbs[i]);
       console.log('Duplicate item in array index ' + i);   
       let indexNumber = Number(i)
       let indexval=Number(ind)
       console.log('index=>',indexNumber,last_index,i)
       this.toastr.warning("There is a duplicate cc of '"+duplicateCheckOnbs[i]+"' indentified in line "+ (indexNumber + 1),'',{timeOut:1500})
       this.newrowadd.get('rows_value')['controls'][indexval].get("bsName_dropdown").reset('')
       duplicateCheckOnbs=[]
       return false;
     }
    }
 }

  cccode: Array<ccList>
  cc_id: any 
  private getasset_cccode(keyvalue) {
    this.dataService.get_cc_dropdown(this.bs_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cccode = datas;

      })
  }

  public displayccppr(cc_name?: ccList): string | undefined {
    return cc_name ? cc_name.name : undefined;
  }
  ccDropdown(i) {
    let keyvalue: String = "";
    this.getasset_cccode(keyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("cc_dropdown").valueChanges
      .pipe(
       
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.dataService.get_cc_dropdown(this.bs_id, value, 1)
          .pipe(
            finalize(() => {
              // console.log(value)
              this.cc_id = value.id
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cccode = datas;

      })

  }
  cc_dublicate(ind){
    console.log("inside",this.newrowadd)
    console.log("val",this.newrowadd.value['rows_value'])
    console.log("row=>",this.newrowadd.controls.rows_value['controls'])
    let duplicateCheckOncc:any[] 
    let duplicateCheckcc
    duplicateCheckOncc= this.newrowadd.value['rows_value'].map(x => x.cc_dropdown.name);
    if(this.cost_allocationform.value.allocationfromcc !='' || this.cost_allocationform.value.allocationfromcc != null || this.cost_allocationform.value.allocationfromcc != undefined ){
      duplicateCheckcc=this.cost_allocationform.value.allocationfromcc.name
      duplicateCheckOncc.push(duplicateCheckcc)
    } 
    console.log("duplicateCheckOnbscc=>",duplicateCheckOncc)
    for(let i in duplicateCheckOncc){
     let first_index = duplicateCheckOncc.indexOf(duplicateCheckOncc[i]);
     let last_index = duplicateCheckOncc.lastIndexOf(duplicateCheckOncc[i])
     if(first_index != last_index){
       console.log('Duplicate item in array ' + duplicateCheckOncc[i]);
       console.log('Duplicate item in array index ' + i);   
       let indexNumber = Number(i)
       let indexval=Number(ind)
       this.toastr.warning("There is a duplicate cc of '"+duplicateCheckOncc[i]+"' indentified in line "+ (indexNumber + 1),'',{timeOut:1500})
       this.newrowadd.get('rows_value')['controls'][indexval].get("cc_dropdown").reset('')
       return false;
     }
    }
 }

  bs_id: any 
  public displaybsName(bsccocde_level?: BSCNameLists): string | undefined {
    return bsccocde_level ? bsccocde_level.name : undefined;
  }

  getbsDropdown(keyvalue) {

    this.dataService.get_bs_dropdown(this.bscc_id, keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamecode = datas;
        

      })
  }
  bsNameDropdown(i) {
    let keyvalue: String = "";
    this.getbsDropdown(keyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("bsName_dropdown").valueChanges
      .pipe(
        
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;


        }),

        switchMap(value => this.dataService.get_bs_dropdown(this.bscc_id, value, 1)
          .pipe(
            finalize(() => {
              console.log(value.id)
              this.bs_id = value.id
              this.isLoading = false

            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.BsNamecode = datas;

      })
  }
  
  parameter_dropdown = new FormControl()
  parameter: Array<CostDriverInputList>
  public displayparam(CostDriver?: CostDriverInputList): string | undefined {
    return CostDriver ? CostDriver.sector : undefined;
  }
  pramsName
  getParameterDropdown(keyvalue) {

    this.dataService.getcostdriverdropdown(keyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameter = datas;
        console.log(this.parameter)

      })
  }
  ParameterDropdown(i) {
    let prokeyvalue: String = "";
    this.getParameterDropdown(prokeyvalue);
    var arrayControl = this.newrowadd.get('rows_value') as FormArray;
    let item = arrayControl.at(i);
    item.get("parameter_dropdown").valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.dataService.getcostdriverdropdown(value, 1)
          .pipe(
            finalize(() => {
              console.log(value)
              this.pramsName=value
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parameter = datas;

      })
  }
  @ViewChild('parameterAutoComplete') parameterAutoComplete:MatAutocomplete;
  @ViewChild('parameterInput') parameterInput:any
  autocompletScrollparam(){
    this.has_nextval = true
                      this.has_previousval = true
                      this.currentpagenum = 1
    setTimeout(() => {
      if (
        this.parameterAutoComplete &&
        this.autocompleteTrigger &&
        this.parameterAutoComplete.panel
      ) {
        fromEvent(this.parameterAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.parameterAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.parameterAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.parameterAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.parameterAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.getcostdriverdropdown(this.parameterInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.parameter = this.parameter.concat(datas);
                    if (this.parameter.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  // inputvalue:any
  ratiovalue: any
  amount_value: any

  addTable() {
    //  let addobj={
    //   Bscc:'',
    //     cc_dropdown:'',
    //     bsName_dropdown:'',
    //     parameter_dropdown:'',
    //     inputvalue:'',
    //     ratiovalue:'',
    //     amount_value:''
    // }
    // this.costallocation_summary.push(this.rows)
    // const val = 
    
    const form = <FormArray> this.newrowadd.get('rows_value')
  
    // form.push(this.formBuilder.group({
    //   Bscc: [null],
    //   cc_dropdown: [null],
    //   bsName_dropdown: [null],
    //   parameter_dropdown: [null],
    //   inputvalue: [null],
    //   ratiovalue: [null],
    //   amount_value: [null]
    // }));
    // for(let iv of this.data){
    //   var counts
    //   let spliceVal=iv.entry_crno.substring(0, 3)
    //   if(counts===undefined || iv.entry_crno.substring(0, 3)===counts.substring(0, 3)){
    //     console.log("id=>",iv)
    //     amount+=iv.totalamount
    //     counts=iv.entry_crno
    //     console.log("counts",counts)
        
    //   }
    // }
  
  
    // console.log("data=>",this.other)
    // if()
    console.log("perium_amount=>",this.cost_allocationform.value.allocationfrom_ratio)
    form.push(this.createItemFormGroup())
    
      // if(this.editid==1){
      //   this.cost_allocationform.controls['validity_from'].reset('')
      // }


      
    // if(this.cost_allocationform.)
  //  if(this.pramsName.id==18){
    
  //   for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
  //    this.newrowadd.controls.rows_value['controls'].at(len).patchValue({parameter_dropdown:this.pramsName});
   
     
  //    }
  //   }
      //  this.newrowadd.setControl('rows_value',addrowod)
    // console.log(form)
    // this.inputValue.forEach((elem,vals1)=>{
    //   for(let len=0;len<=this.newrowadd.controls.rows_value['controls'].length-1;len++){
    //  // this.newrowadd.controls.rows_value['controls'].length-1
    //  // this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:elem});
    //     // var le=len+1
    // // console.log("=>",len)
    //   if(len===vals1){
    //     var ration =elem.amount/this.totalAmount
    //     // console.log("ration=>",ration)
    //     this.newrowadd.controls.rows_value['controls'].at(len).patchValue({ratiovalue:ration})
    //      this.newrowadd.controls.rows_value['controls'].at(len).patchValue({inputvalue:elem.amount});
    //     // console.log("same",elem,vals1)
    //    //  this.newrowadd.controls.rows_value['controls'].patchValue({inputvalue:elem})
    //   }
    // console.log("total=>",this.newrowadd.controls.rows_value['controls'].length)
    //  }
    // })
   
  }

  deleteRow(x) {
    var delBtn = confirm(" Do you want to delete ?");
    if (delBtn == true) {
      this.newrowadd.controls.rows_value['controls'].splice(x, 1);
      this.newvalue.splice(x,1)
    }
  }

  // createItemFormGroup(): FormGroup {
  //   return this.formBuilder.group({
  //     Bscc:'',
  //     cc_dropdown:'',
  //     bsName_dropdown:'',
  //     parameter_dropdown:'',
  //     inputvalue:'',
  //     ratiovalue:'',
  //     amount_value:''
  //   });
  // }

  createItemFormGroup() {
    // var zeroval=(0).toFixed(2)
    // var amountval=(1).toFixed(2)
    let fg = new FormGroup({
      Bscc:new FormControl(''),
      cc_dropdown: new FormControl(''),
      bsName_dropdown: new FormControl(''),
      // parameter_dropdown: new FormControl(''),
      // inputvalue: new FormControl(zeroval),
      ratiovalue: new FormControl(''),
      // amount_value: new FormControl(amountval),
      // premium_amount:new FormControl(amountval)
    })
    
    return fg
    
  }

  // this.costallocation_summary=this.formBuilder.group({

  //   Bscc:[null],
  //   cc_dropdown:[null],
  //   bsName_dropdown:[null],
  //   parameter_dropdown:[null],
  //   inputvalue:[null],
  //   ratiovalue:[null],
  //   amount_value:[null],
  //   // bscc_dropdown:[null],
  //   // cc_dropdown:[''],
  // })
  newvalue=[]
  submit(editid){
    console.log("editid=>",editid)
    console.log(this.newrowadd.controls.rows_value.value)
      var maxratio=0

    for(var calc of this.newrowadd.controls.rows_value.value ){
      console.log("calc=>",calc)
      maxratio+=(Number(calc.ratiovalue))
    
    }
    // if(this.cost_allocationform.value.allocationfrom_catelog.code!='AL3'){
    //   this.toastr.error("alloction leavel ");
    //   return false;

    // }
    console.log("bscc=>",this.cost_allocationform.value.Bscc)
    console.log("bs=>",this.cost_allocationform.value.bsName_dropdown)
    console.log("cc=>",this.cost_allocationform.value)
    if(this.cost_allocationform.value.allocationbs_filter=='' || this.cost_allocationform.value.allocationbs_filter==undefined || this.cost_allocationform.value.allocationbs_filter==null || Object.keys(this.cost_allocationform.value.allocationbs_filter).length==0){
      this.toastr.warning('', 'Please Select Core Bs', { timeOut: 1500 });
      return false;
    }
    if(this.cost_allocationform.value.allocationbsform_filter=='' ||this.cost_allocationform.value.allocationbsform_filter==undefined || this.cost_allocationform.value.allocationbsform_filter==null){
      this.toastr.warning('', 'Please Select BS', { timeOut: 1500 });
      return false;
    }
    console.log("this.cost_allocationform.value.validity_to=>",this.cost_allocationform.value.validity_to)

    if(this.cost_allocationform.value.validity_from=='' || this.cost_allocationform.value.validity_from==null || this.cost_allocationform.value.validity_from==undefined){
      this.toastr.warning('', 'Please Select Form Date', { timeOut: 1500 });
      return false;

    }
    if(this.cost_allocationform.value.validity_to=='' || this.cost_allocationform.value.validity_to==null || this.cost_allocationform.value.validity_to==undefined){
      this.toastr.warning('', 'Please Select To Date', { timeOut: 1500 });
      return false;

    }
    if(Number(maxratio)!=100){
      console.log("max",maxratio)
      this.toastr.error("Ratio Value Should Be 100 Percentage");
      return false;
    }
    console.log("validity_from=>",this.cost_allocationform.value.validity_from)
    var fromdate=this.cost_allocationform.value.validity_from
    let validityfrom=this.datePipe.transform(fromdate, 'yyyy-MM-dd')
    var todate=this.cost_allocationform.value.validity_to
    let validityto=this.datePipe.transform(todate, 'yyyy-MM-dd')
    let ccdata=false
    if(this.cost_allocationform.value.allocationbs_filter==''||this.cost_allocationform.value.allocationbs_filter==undefined || this.cost_allocationform.value.allocationbs_filter==null || Object.keys(this.cost_allocationform.value.allocationbs_filter).length==0 ){
      this.cost_allocationform.value.allocationbsfilter=''
    }else{
      this.cost_allocationform.value.allocationbsfilter=this.cost_allocationform.value.allocationbs_filter.id

    }
    if(this.cost_allocationform.value.allocationbsform_filter==''|| this.cost_allocationform.value.allocationbsform_filter==undefined || this.cost_allocationform.value.allocationbsform_filter ==null ){
      this.cost_allocationform.value.bsNamedropdown=''
    }else{
      this.cost_allocationform.value.bsNamedropdown=this.cost_allocationform.value.allocationbsform_filter.id

    }
    if(this.cost_allocationform.value.allocationfromcc==''|| this.cost_allocationform.value.allocationfromcc==undefined || this.cost_allocationform.value.allocationfromcc ==null  ){
      this.cost_allocationform.value.ccdropdown=''
    }else{
      this.cost_allocationform.value.ccdropdown=this.cost_allocationform.value.allocationfromcc.id
      ccdata=true
    }
    for(let [ind,val] of this.newrowadd.controls.rows_value['controls'].entries()){
      let indnum=(Number(ind))+1

      console.log("todata_id=>",val.value.Bscc,ind)
      if(val.value.ratiovalue =='' || val.value.ratiovalue==null || val.value.ratiovalue ==undefined){
      this.toastr.warning("Please Enter The Ratio Value");  
        return false;
      }
      if(val.value.Bscc=='' || val.value.Bscc==undefined || val.value.Bscc==null){
        console.log("index =>",ind +1)
        console.log("indnum=>",indnum)
        this.toastr.warning("Must Be Select Core Bs" + '\xa0\xa0' + indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
        return false;
        val.value.bsccdata='' 
      }else{ 
        val.value.bsccdata=val.value.Bscc.id
      }
      if(val.value.bsName_dropdown=='' || val.value.bsName_dropdown==undefined || val.value.bsName_dropdown==null){
        this.toastr.warning("Please Select BS" + '\xa0\xa0' +  indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
        return false;
        val.value.bsName=''
      }else{
        val.value.bsName=val.value.bsName_dropdown.id
      }
      if(ccdata==true){
        if(val.value.cc_dropdown == '' || val.value.cc_dropdown == undefined || val.value.cc_dropdown == null){
          this.toastr.warning("Please Select CC" + '\xa0\xa0' +  indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
          return false;
        }
      }else if(val.value.cc_dropdown=='' || val.value.cc_dropdown==undefined || val.value.cc_dropdown==null){
        // if(this.cost_allocationform.value.allocationfromcc !=null || this.cost_allocationform.value.allocationfromcc!=undefined || this.cost_allocationform.value.allocationfromcc!=''){
        //   this.toastr.warning("Please Select CC" + '\xa0\xa0' +  indnum +'\xa0\xa0' + 'Row','',{timeOut:1500});
        //   return false;
        // }
        val.value.ccdropdown=''
      }else{
        val.value.ccdropdown=val.value.cc_dropdown.id
      }
      if(val.value.id=='' || val.value.id==undefined || val.value.id==null){
        val.value.id=''
      }else{
        val.value.id=val.value.id
      }
   
        console.log("else")
        if(editid==1){
          this.newvalue.push({
            "id":val.value.id,
            "bscc_code": val.value.bsccdata,
            "cc_id": val.value.ccdropdown,
            "bs_id": val.value.bsName,
            "ratio": val.value.ratiovalue,
           
         
        });
        }else{
          this.newvalue.push({  
          "bscc_code": val.value.bsccdata,
          "cc_id": val.value.ccdropdown,
          "bs_id": val.value.bsName,
          "ratio": val.value.ratiovalue,  
      });
    }
     }
    console.log("finally=>",this.newvalue)
    console.log("Core BSCC=>",this.cost_allocationform.value)
    console.log("BSCC=>",this.cost_allocationform.value.allocationbs_filter)
    // console.log("BS=>",this.cost_allocationform.value.allocationbsform_filter.id)
    // console.log("CC=>",this.cost_allocationform.value.allocationfromcc.id)
   
    console.log("editid=>",this.cost_id)
    let changeValue
    if(editid==1){
      changeValue = {
        "bs_id":this.cost_allocationform.value.bsNamedropdown,
        "cc_id":this.cost_allocationform.value.ccdropdown,
        "frombscccode": this.cost_allocationform.value.allocationbsfilter,
        "validity_from":validityfrom,
        "validity_to":validityto,
        "level": 4,
        "to_data":this.newvalue,
        "id":this.cost_id
        }
    }else{
      changeValue = {
        "bs_id":this.cost_allocationform.value.bsNamedropdown,
        "cc_id":this.cost_allocationform.value.ccdropdown,
        "frombscccode": this.cost_allocationform.value.allocationbsfilter,
        "validity_from":validityfrom,
        "validity_to":validityto,
        "level": 4,
        "to_data":this.newvalue
        }
    }
    
   var amount=this.cost_allocationform.value.allocationfrom_ratio
   console.log("amount=>",changeValue)
    // "source_bscc_code": 1,
    // "level": 2,
    // "cost_driver": 2,
    // "allocation_amount"

    this.SpinnerService.show()
    this.dataService.set_allocationratio(changeValue,editid).subscribe(res => {
      this.SpinnerService.hide()
      if(res){

      
      this.toastr.success('',res['set_description'],{ timeOut: 1500 })
      this.allocation_bsccList = []
    this.amount=0
    this.editid=0
    this.bsdropdown_id=0
    this.currentpage=1
    this.editview=0
    this.hideElement=true
    this.minvalue_from=''
    this.cost_allocationform.reset();
    this.newvalue=[]
    this.cost_allocationform.controls['allocationfrom_catelog'].reset('')
    this.cost_allocationform.controls['allocationfrom_subcategory'].reset('')
    this.cost_allocationform.controls['allocationfrom_ratio'].reset('')
    this.cost_allocationform.controls['allocationbs_filter'].reset({})
    let cls= (this.newrowadd.controls['rows_value'] as FormArray)
    cls.reset();

    const control = <FormArray>this.newrowadd.controls['rows_value'];
        for(let i = control.length-1; i >= 1; i--) {
            control.removeAt(i)
        } 
    this.getcostallocationsummary();
    this.add_tag = true
    this.summary_tag = false
    this.edit_flag = true

    }
  },error => {
      changeValue={}
      this.newvalue=[]

      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    })
    // this.getcostallocationsummary()
    
    console.log("value",this.newrowadd.value.rows_value[0].inputvalue)

    console.log("new value",this.newvalue)
  }

  // changeeve(event){
  //   this.cost_allocationform.value.validity_to=""
  // }

// bs DroupDown

bsfromDropdown(){
  let keyvalue: String = "";
  this.getasset_Bs(keyvalue);
  this.cost_allocationform.get('allocationbsform_filter').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_bs_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            // console.log(value.id)
            // this.val=value
            // this.bsdropdown_id=value.id
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bsfromcode = datas;
      console.log("value")
      
    })
}
private getasset_Bs(keyvalue) {
  this.dataService.get_bs_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bsfromcode = datas;
      
      console.log("main=>",this.Bsfromcode)
    })
}
displaybsfrom(BSName:BSNameLists): string | undefined{
  return BSName ? BSName.name : undefined;
}
bsfromscroll(){
   this.has_nextval = true
   this.has_previousval = true
   this.currentpagenum = 1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.bsfromAutoComplete &&
        this.autocompleteTrigger &&
        this.bsfromAutoComplete.panel
      ) {
        fromEvent(this.bsfromAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bsfromAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bsfromAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bsfromAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bsfromAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.get_bs_dropdown(1,this.bsformInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.Bsfromcode = this.Bsfromcode.concat(datas);
                    if (this.Bsfromcode.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}

ccfromDropdown(){
  let keyvalue: String = "";
  this.getasset_cc(keyvalue);
  this.cost_allocationform.get('allocationfromcc').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_cc_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            // console.log(value.id)
            // this.val=value
            // this.bsdropdown_id=value.id
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccfromcode = datas;
      console.log("value")
      
    })
}
private getasset_cc(keyvalue) {
  this.dataService.get_cc_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccfromcode = datas;
      
      console.log("main=>",this.ccfromcode)
    })
}
displayccfrom(ccname:ccNameList):string |undefined{
  return ccname?ccname.name :undefined
}
ccfromscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.ccfromAutoComplete &&
       this.autocompleteTrigger &&
       this.ccfromAutoComplete.panel
     ) {
       fromEvent(this.ccfromAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.ccfromAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.ccfromAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.ccfromAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.ccfromAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_cc_dropdown(1,this.ccformInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.ccfromcode = this.ccfromcode.concat(datas);
                   if (this.ccfromcode.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}




// summary page 
private get_Bs(keyvalue) {
  this.dataService.get_business_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsccsearch = datas;
      console.log("main=>",this.bsccsearch)
    })
} 
bsccDropdown() {
  let keyvalue: String = "";
  this.get_Bs(keyvalue);
  this.cost_allocationsearch.get('allocationbscc_search').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_business_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bsccsearch = datas;
      console.log("value")   
    })
}
bsccsearchscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
  console.log("scroll")
  setTimeout(() => {
    if (
      this.bsccsearchAutoComplete &&
      this.autocompleteTrigger &&
      this.bsccsearchAutoComplete.panel
    ) {
      fromEvent(this.bsccsearchAutoComplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.bsccsearchAutoComplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(x => {
          const scrollTop = this.bsccsearchAutoComplete.panel.nativeElement.scrollTop;
          const scrollHeight = this.bsccsearchAutoComplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.bsccsearchAutoComplete.panel.nativeElement.clientHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
          if (atBottom) {
            if (this.has_nextval === true) {
              console.log("true")
              this.dataService.get_business_dropdown(1,this.bsccsearchInput.nativeElement.value, this.currentpagenum+1)
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  let datapagination = results["pagination"];
                  console.log("loop",this.currentpagenum)
                  this.bsccsearch = this.bsccsearch.concat(datas);
                  if (this.bsccsearch.length >= 0) {
                    this.has_nextval = datapagination.has_next;
                    this.has_previousval = datapagination.has_previous;
                    this.currentpagenum = datapagination.index;
                  }
                })
            }
          }
        });
    }
  });
}
public displaybssearch(bsccocde_level?: BSCNameLists): string | undefined {
  return bsccocde_level ? bsccocde_level.name : undefined;
}
bs_search(){
  let keyvalue: String = "";
  this.get_bs(keyvalue);
  this.cost_allocationsearch.get('allocationbs_search').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_bs_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bssearch = datas;
      console.log("value")
      
    })
}
private get_bs(keyvalue) {
  this.dataService.get_bs_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.Bssearch = datas;
      
      console.log("main=>",this.Bsfromcode)
    })
}
displaybs_search(BSName:BSNameLists): string | undefined{
  return BSName ? BSName.name : undefined;
}
bssearchscroll(){
   this.has_nextval = true
   this.has_previousval = true
   this.currentpagenum = 1
    console.log("scroll")
    setTimeout(() => {
      if (
        this.bs_searchAutoComplete &&
        this.autocompleteTrigger &&
        this.bs_searchAutoComplete.panel
      ) {
        fromEvent(this.bs_searchAutoComplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.bs_searchAutoComplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.bs_searchAutoComplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.bs_searchAutoComplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.bs_searchAutoComplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextval === true) {
                console.log("true")
                this.dataService.get_bs_dropdown(1,this.bs_searchInput.nativeElement.value, this.currentpagenum+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    console.log("loop",this.currentpagenum)
                    this.Bssearch = this.Bssearch.concat(datas);
                    if (this.Bssearch.length >= 0) {
                      this.has_nextval = datapagination.has_next;
                      this.has_previousval = datapagination.has_previous;
                      this.currentpagenum = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
}

cc_search(){
  let keyvalue: String = "";
  this.get_cc(keyvalue);
  this.cost_allocationsearch.get('allocationcc_search').valueChanges
    .pipe(
      
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.dataService.get_cc_dropdown(1,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccsearch = datas;
      console.log("value")
      
    })
}
private get_cc(keyvalue) {
  this.dataService.get_cc_dropdown(1,keyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.ccsearch = datas;
      
      console.log("main=>",this.ccsearch)
    })
}
displaycc_search(ccname:ccNameList):string |undefined{
  return ccname?ccname.name :undefined
}
ccsearchscroll(){
  this.has_nextval = true
  this.has_previousval = true
  this.currentpagenum = 1
   console.log("scroll")
   setTimeout(() => {
     if (
       this.ccfromAutoComplete &&
       this.autocompleteTrigger &&
       this.ccfromAutoComplete.panel
     ) {
       fromEvent(this.ccfromAutoComplete.panel.nativeElement, 'scroll')
         .pipe(
           map(x => this.ccfromAutoComplete.panel.nativeElement.scrollTop),
           takeUntil(this.autocompleteTrigger.panelClosingActions)
         )
         .subscribe(x => {
           const scrollTop = this.ccfromAutoComplete.panel.nativeElement.scrollTop;
           const scrollHeight = this.ccfromAutoComplete.panel.nativeElement.scrollHeight;
           const elementHeight = this.ccfromAutoComplete.panel.nativeElement.clientHeight;
           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
           if (atBottom) {
             if (this.has_nextval === true) {
               console.log("true")
               this.dataService.get_cc_dropdown(1,this.ccformInput.nativeElement.value, this.currentpagenum+1)
                 .subscribe((results: any[]) => {
                   let datas = results["data"];
                   let datapagination = results["pagination"];
                   console.log("loop",this.currentpagenum)
                   this.ccfromcode = this.ccfromcode.concat(datas);
                   if (this.ccfromcode.length >= 0) {
                     this.has_nextval = datapagination.has_next;
                     this.has_previousval = datapagination.has_previous;
                     this.currentpagenum = datapagination.index;
                   }
                 })
             }
           }
         });
     }
   });
}
}
