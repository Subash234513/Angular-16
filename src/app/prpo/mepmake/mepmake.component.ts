import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map, first } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
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
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
export interface raisorlistss {
  id: any;
  full_name: any;
}
export interface budgetlistss {
  id: any;
  full_name: any;
}
export interface projectownlistss {
  id: any;
  full_name: any;
}
export interface parnolistss {
  id: any;
  no: string;
}

export interface prodCatlistss {
  id: string;
  name, code: any
}
export interface rforlistss {
  id: any;
  name: string;
}
export interface branchlistss {
  id: any;
  code: string;
  name: string;
}
export interface emplistss {
  id: any;
  full_name: string;
}
export interface comlistss {
  id: string;
  name: string;
}
@Component({
  selector: 'app-mepmake',
  templateUrl: './mepmake.component.html',
  styleUrls: ['./mepmake.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class MEPmakeComponent implements OnInit {
  MEPmakerForm: FormGroup;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() linesChange = new EventEmitter<any>();
  expensetype: any;
  FinancialYearList: any
  yesorno: any[] = [
    { value: 1, display: 'Yes' },
    { value: 0, display: 'No' }
  ]
  parornopar: any[] = [
    { value: 1, display: 'Par' },
    { value: 0, display: 'No Par' }
  ]
  date = new Date()

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  productCatList: Array<prodCatlistss>;

  parnoList: Array<parnolistss>;

  raisorList: Array<raisorlistss>;

  budgetownerList: Array<budgetlistss>;

  projectownerList: Array<projectownlistss>;

  branchList: Array<branchlistss>;

  commodityList: Array<comlistss>;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('raisor') matraisorAutocomplete: MatAutocomplete;
  @ViewChild('raisorInput') raisorInput: any;

  @ViewChild('budgetowner') matbudgetownerAutocomplete: MatAutocomplete;
  @ViewChild('budgetownerInput') budgetownerInput: any;

  @ViewChild('projectowner') matprojectownerAutocomplete: MatAutocomplete;
  @ViewChild('projectownerInput') projectownerInput: any;

  @ViewChild('parno') matparnoAutocomplete: MatAutocomplete;
  @ViewChild('parnoInput') parnoInput: any;

  @ViewChild('prodCat') matprodCatAutocomplete: MatAutocomplete;
  @ViewChild('prodCatInput') prodCatInput: any;

  @ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('comInput') comInput: any;
  todayDate = new Date();


  @ViewChild('rfor') matrforAutocomplete: MatAutocomplete;
  @ViewChild('rforInput') rforInput: any;

  @ViewChild('branch') matbranchAutocomplete: MatAutocomplete;
  @ViewChild('branchInput') branchInput: any;

  requestforList: Array<rforlistss>;
  requestfor = new FormControl();
  clicked = false;
  expensevalue: any
  parvalue: any
  isBudgetedReadonly: boolean = false
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr: ToastrService,private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private notification: NotificationService, private router: Router, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    let data: any = this.prposhareService.MepParentShare.value
    if (data != "") {
      this.getmepedit();
      this.isBudgetedReadonly = true
    }
    this.MEPmakerForm = this.fb.group({
      name: ['', Validators.required],
      no: [''],
      content: ['', Validators.required],
      parno: [''],
      type: ['', Validators.required],
      amount: ['', Validators.required],
      finyear: ['', Validators.required],
      budgeted: [0, Validators.required],
      projectowner_id: ['', this.SelectionValidator],
      requestfor: ['', Validators.required],
      startdate: [ ""],
      //startdate :[''],
      enddate: [""],
      branch_id: ['', Validators.required],
      mode: [0, Validators.required],
      raisor_id: ['', this.SelectionValidator],
      budgetowner_id: ['', this.SelectionValidator],
      justification: ['', Validators.required],
      mepdetails: new FormArray([
     
      ])
    })

    // let parnokeyvalue: String = "";
    // this.getparnoFK(parnokeyvalue);
    this.MEPmakerForm.get('parno').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getparnoFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parnoList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // let branchkeyvalue: String = "";
    // this.getbranchFK(branchkeyvalue);
    this.MEPmakerForm.get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // let raisorkeyvalue: String = "";
    // this.getraisorFK(raisorkeyvalue);
    this.MEPmakerForm.get('raisor_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getraisorFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.raisorList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })



    // let projectownerkeyvalue: String = "";
    // this.getprojectownerFK(projectownerkeyvalue);
    this.MEPmakerForm.get('projectowner_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getprojectownerFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.projectownerList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    // let requestforkeyvalue: String = "";
    // this.getrequestforFK();
    this.MEPmakerForm.get('requestfor').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getreqforFK(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.requestforList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

    // let budgetownerkeyvalue: String = "";
    // this.getbudgetownerFK(budgetownerkeyvalue);
    this.MEPmakerForm.get('budgetowner_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getbudgetownerFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.budgetownerList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


    // this.getcommodityFK();
    
    if (this.selectedValue === "opex") {
      this.isopex = !this.isopex
      this.iscapex = false

    }
    if (this.selectedValue === "capex") {
      this.iscapex = !this.iscapex
      this.isopex = false


    }
    this.getParyear();
    this.getParexpensetype();


  }


  paramountaddition: any
  gettingamount: any
  meptotalList: any
  amoun: any
  approvedamt:any
  pendamt: any
  mepappr: any
  balanceAmount:any
   meptotalget() {
    this.selectedsValue = this.MEPmakerForm.get('parno').value	
    this.selectedValue = this.MEPmakerForm.get('type').value	
    if(this.selectedsValue == undefined || this.selectedsValue == null || this.selectedsValue == ""){	
      return false	
    }	
    if(this.selectedValue == undefined){	
      return false	
    }	
    this.iscapex = true
    this.dataService.meptotalget(this.selectedValue, this.selectedsValue)
      .subscribe((results: any[]) => {
        this.meptotalList = results;
        this.amoun = this.meptotalList.par_amount
        this.balanceAmount = this.meptotalList.balance_amount
        this.approvedamt = this.meptotalList.balance_amount
          this.pendamt = this.meptotalList.pending_amount 
          this.mepappr = this.meptotalList.approved_amount
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  MEPdet() {
    let group = new FormGroup({
      productcategory_id: new FormControl(''),
      desc: new FormControl(''),
      totalamt: new FormControl(0),
    })
    
    group.get('productcategory_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.dataService.getcommodityFKdd(value, 1)
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

    group.get('totalamt').valueChanges.pipe(
      debounceTime(20)
    ).subscribe(value => {
      console.log("should be called first")
      this.datasums()
      if (!this.MEPmakerForm.valid) {
        return;
      }
      this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
    }
    )

    return group
  }
  ////////////////////////////////////////////calculation
  calcTotal(group: FormGroup) {
    const qty = +group.controls['qty'].value;
    const unitprice = +group.controls['unitprice'].value;
    group.controls['totalamt'].setValue((qty * unitprice), { emitEvent: false });
    this.datasums();
  }
  amt: any;
  sum: any = 0.00;
  datasums() {
    this.amt = this.MEPmakerForm.value['mepdetails'].map(x => x.totalamt);
    console.log('data check amt', this.amt);
    this.sum = this.amt.reduce((a, b) => a + b, 0);
    console.log('sum of total ', this.sum);
  }

  getSections(form) {
    return form.controls.mepdetails.controls;
  }
  addSection() {
    const control = <FormArray>this.MEPmakerForm.get('mepdetails');
    control.push(this.MEPdet());
  }

  removeSection(i) {
    const control = <FormArray>this.MEPmakerForm.get('mepdetails');
    control.removeAt(i);
    this.datasums()
  }


  currentpagepar: number = 1;
  has_nextpar = true;
  has_previouspar = true;
  //////////////////////////////////////par no scroll
  autocompleteparnoScroll() {
    setTimeout(() => {
      if (
        this.matparnoAutocomplete &&
        this.autocompleteTrigger &&
        this.matparnoAutocomplete.panel
      ) {
        fromEvent(this.matparnoAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matparnoAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matparnoAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matparnoAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matparnoAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.dataService.getparnoFKdd(this.parnoInput.nativeElement.value, this.currentpagepar + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.parnoList = this.parnoList.concat(datas);
                    if (this.parnoList.length > 0) {
                      this.has_nextpar = datapagination.has_next;
                      this.has_previouspar = datapagination.has_previous;
                      this.currentpagepar = datapagination.index;
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

  displayFnparno(parno?: any) {
    if ((typeof parno) === 'string') {
      return parno;
    }
    return parno ? this.parnoList.find(_ => _.no === parno).no : undefined;
  }

  getparnoFK() {
    this.SpinnerService.show();
    this.dataService.getparnoFK('')
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.parnoList = datas;
        console.log("parnoList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  //////////////////////////////////////////branch scroll

  currentpagebranch: number = 1;
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

  public displayFnbranch(branch?: branchlistss): string | undefined {
    let code = branch ? branch.code : undefined;
    let name = branch ? branch.name : undefined;
    return branch ? code + "-" + name : undefined;
   
  }

  getbranchFK() {
    this.SpinnerService.show();
    this.dataService.getbranch('')
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.branchList = datas;
        console.log("branchList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  //////////////////////////////////raisor scroll
  currentpageraisor: number = 1;
  has_nextraisor = true;
  has_previousraisor = true;
  autocompleteraisorScroll() {
    setTimeout(() => {
      if (
        this.matraisorAutocomplete &&
        this.autocompleteTrigger &&
        this.matraisorAutocomplete.panel
      ) {
        fromEvent(this.matraisorAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matraisorAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matraisorAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matraisorAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matraisorAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextraisor === true) {
                this.dataService.getraisorFKdd(this.raisorInput.nativeElement.value, this.currentpageraisor + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.raisorList = this.raisorList.concat(datas);
                    if (this.raisorList.length >= 0) {
                      this.has_nextraisor = datapagination.has_next;
                      this.has_previousraisor = datapagination.has_previous;
                      this.currentpageraisor = datapagination.index;
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

  public displayFnraisor(raisor?: emplistss): string | undefined {
    return raisor ? raisor.full_name : undefined;
  }

  getraisorFK() {
    this.SpinnerService.show();
    this.dataService.getraisorFK("")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.raisorList = datas;
        console.log("raisorList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  //////////////////////////////////project owner scroll
  currentpageproown: number = 1;
  has_nextproowner = true;
  has_previousproowner = true;
  autocompleteprojectownerScroll() {
    setTimeout(() => {
      if (
        this.matprojectownerAutocomplete &&
        this.autocompleteTrigger &&
        this.matprojectownerAutocomplete.panel
      ) {
        fromEvent(this.matprojectownerAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matprojectownerAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matprojectownerAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprojectownerAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprojectownerAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextproowner === true) {
                this.dataService.getprojectownerFKdd(this.projectownerInput.nativeElement.value, this.currentpageproown + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.projectownerList = this.projectownerList.concat(datas);
                    if (this.projectownerList.length >= 0) {
                      this.has_nextproowner = datapagination.has_next;
                      this.has_previousproowner = datapagination.has_previous;
                      this.currentpageproown = datapagination.index;
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

  public displayFnprojectowner(projectowner?: emplistss): string | undefined {
    return projectowner ? projectowner.full_name : undefined;
  }

  getprojectownerFK() {
    this.SpinnerService.show();
    this.dataService.getprojectownerFK("")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.projectownerList = datas;
        console.log("projectownerList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  //////////////////////////////////req for scroll
  currentpagerfor: number = 1;
  has_nextrfor = true;
  has_previousrfor = true;
  autocompleterforScroll() {
    setTimeout(() => {
      if (
        this.matrforAutocomplete &&
        this.autocompleteTrigger &&
        this.matrforAutocomplete.panel
      ) {
        fromEvent(this.matrforAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matrforAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matrforAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matrforAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matrforAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextrfor === true) {
                this.dataService.getreqforFK(this.rforInput.nativeElement.value, this.currentpagerfor + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.requestforList = this.requestforList.concat(datas);
                    if (this.requestforList.length >= 0) {
                      this.has_nextrfor = datapagination.has_next;
                      this.has_previousrfor = datapagination.has_previous;
                      this.currentpagerfor = datapagination.index;
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

  displayFnrfor(rfor) {
    if ((typeof rfor) === 'string') {
      return rfor;
    }
    return rfor ? this.requestforList.find(x => x.id === rfor).name : undefined;
  }

  getrequestforFK() {
    this.SpinnerService.show();
    this.dataService.getreqfor()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.requestforList = datas;
        console.log("requestforList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  //////////////////////////////////budgetowner scroll
  currentpagebudjown: number = 1;
  has_nextbudjown = true;
  has_previousbudjown = true;
  autocompletebudgetownerScroll() {
    setTimeout(() => {
      if (
        this.matbudgetownerAutocomplete &&
        this.autocompleteTrigger &&
        this.matbudgetownerAutocomplete.panel
      ) {
        fromEvent(this.matbudgetownerAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbudgetownerAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbudgetownerAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbudgetownerAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbudgetownerAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextbudjown === true) {
                this.dataService.getbudgetownerFKdd(this.budgetownerInput.nativeElement.value, this.currentpagebudjown + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.budgetownerList = this.budgetownerList.concat(datas);
                    if (this.budgetownerList.length >= 0) {
                      this.has_nextbudjown = datapagination.has_next;
                      this.has_previousbudjown = datapagination.has_previous;
                      this.currentpagebudjown = datapagination.index;
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

  public displayFnbudgetowner(budgetowner?: emplistss): string | undefined {
    return budgetowner ? budgetowner.full_name : undefined;
  }

  getbudgetownerFK() {
    this.SpinnerService.show();
    this.dataService.getbudgetownerFK("")
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.budgetownerList = datas;
        console.log("budgetownerList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  selectedValue: any
  currentpagecom: number = 1;
  has_nextcom = true;
  has_previouscom = true;
  autocompletecomScroll() {
    setTimeout(() => {
      if (
        this.matcomAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomAutocomplete.panel
      ) {
        fromEvent(this.matcomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom === true) {
                this.dataService.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpagecom + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    // console.log("emp", datas)
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

  public displayFncom(com?: comlistss): string | undefined {
    console.log('id', com.id);
    console.log('name', com.name);
    return com ? com.name : undefined;
  }

  getcommodityFK() {
    this.SpinnerService.show();
    this.dataService.getcommodityFKkey()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.commodityList = datas;
        console.log("commodityList", datas)
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;




  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }


  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }

  ///////////////validations
  private SelectionValidator(fcvalue: FormControl) {
    if (typeof fcvalue.value === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    return null;
  }

  selectedsValue: any

  isopex: boolean
  iscapex: boolean

  typeamount() {
    this.selectedValue = this.MEPmakerForm.get('type').value
    if( (this.selectedValue =="") || (this.selectedValue == null) || (this.selectedValue == undefined) ){
      return false
    }
    console.log("type", this.selectedValue)
    if (this.selectedValue === "opex") {
      this.iscapex = false
      this.isopex = true
      this.approvedamt = 0


    }
    if (this.selectedValue === "Capex_Opex") {
      this.isopex = false
      this.iscapex = true
      this.approvedamt = 0



    }
    this.meptotalget()


  }

  clas() {

    this.selectedsValue = this.MEPmakerForm.get('parno').value
    console.log("parno", this.selectedsValue)
    if (this.selectedValue === "opex") {
      this.iscapex = false
      this.isopex = true
      this.approvedamt = 0

    }
    if (this.selectedValue === "capex") {
      this.isopex = false
      this.iscapex = true
      this.approvedamt = 0

    }
    this.meptotalget()
  }
 
  omit_hyphen(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57));
  }
  omit_special_num(event) {
    var k;
    k = event.charCode;
    return ((k == 190) || (k >= 48 && k <= 57));
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

  only_char(event) {
    var a;
    a = event.which;
    if ((a < 65 || a > 90) && (a < 97 || a > 122) || a == 32 || (a >= 48 && a <= 57)) {
      return false;
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////// MEP edit functionality
  getFormArray(): FormArray {
    return this.MEPmakerForm.get('mepdetails') as FormArray;
  }
  mepheaderId: any
  getmepedit() {
    
    let data: any = this.prposhareService.MepParentShare.value
    let id = data.id
    this.mepheaderId = data.id
    this.SpinnerService.show();
    this.dataService.getmepEdit(id)
      .subscribe((result: any) => {
        this.SpinnerService.hide();
        console.log('array details', result.mepdetails)
        const { id, no, name, parno, type, amount, startdate, enddate, finyear, mode, branch_id,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, content } = result;
        let startdates = this.datePipe.transform(startdate, 'yyyy-MM-dd');
        let endates = this.datePipe.transform(enddate, 'yyyy-MM-dd');

        this.MEPmakerForm.patchValue({
          no, name, parno, content,
          type, amount,
          startdate: startdates, enddate: endates, finyear,
          branch_id,
          mode,
          raisor_id, budgeted, projectowner_id, requestfor, budgetowner_id, justification, id
        })
        this.meptotalget()
        for (let detail of result.mepdetails) {
          let productcategory_id: FormControl = new FormControl('');
          let descControl: FormControl = new FormControl('');
          
          let totalamt: FormControl = new FormControl('');
          let idControl: FormControl = new FormControl('');

          productcategory_id.setValue(detail.commodity_id)
          descControl.setValue(detail.desc);
          totalamt.setValue(detail.totalamt);
          idControl.setValue(detail.id);

          this.getFormArray().push(new FormGroup({
            productcategory_id: productcategory_id,
            desc: descControl,
            
            totalamt: totalamt,
            id: idControl,
          }));
          this.datasums();
          

          productcategory_id.valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')

              }),
              switchMap(value => this.dataService.getcommodityFKdd( value, 1)
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
            })


          totalamt.valueChanges.pipe(
            debounceTime(20)
          ).subscribe(value => {
            console.log("should be called first")
            this.datasums()
            if (!this.MEPmakerForm.valid) {
              return;
            }

            this.linesChange.emit(this.MEPmakerForm.value['mepdetails']);
          }
          )

        }

      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  //////////////////submit function


  mepmakerSubmit() {
    if ((this.MEPmakerForm.value.name == '') || (this.MEPmakerForm.value.name == null) || (this.MEPmakerForm.value.name == undefined)) {
      this.toastr.error('Please Enter Name');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.parno == '') || (this.MEPmakerForm.value.parno == null) || (this.MEPmakerForm.value.parno == undefined)) {
      this.toastr.error('Please Enter BPA No');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.type == '') || (this.MEPmakerForm.value.type == null) || (this.MEPmakerForm.value.type == undefined)) {
      this.toastr.error('Please Enter Expense Type');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.finyear == '') || (this.MEPmakerForm.value.finyear == null) || (this.MEPmakerForm.value.finyear == undefined)) {
      this.toastr.error('Please Enter Final year');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.projectowner_id == '') || (this.MEPmakerForm.value.projectowner_id == null) || (this.MEPmakerForm.value.projectowner_id == undefined)) {
      this.toastr.error('Please Enter Project Owner');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.requestfor == '') || (this.MEPmakerForm.value.requestfor == null) || (this.MEPmakerForm.value.requestfor == undefined)) {
      this.toastr.error('Please Enter Request For');
      this.clicked = false
      return false;
    }
    if ( (this.MEPmakerForm.value.startdate == '') || (this.MEPmakerForm.value.startdate == null) || (this.MEPmakerForm.value.startdate == undefined)) {
      this.toastr.error('Please Enter Start Date');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.enddate == '') || (this.MEPmakerForm.value.enddate == null) || (this.MEPmakerForm.value.enddate == undefined) ) {
      this.toastr.error('Please Enter End Date');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.branch_id == '') || (this.MEPmakerForm.value.branch_id == null) || (this.MEPmakerForm.value.branch_id == undefined)) {
      this.toastr.error('Please Enter Branch');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.raisor_id == '') || (this.MEPmakerForm.value.raisor_id == null) || (this.MEPmakerForm.value.raisor_id == undefined)) {
      this.toastr.error('Please Enter Raisor');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.budgetowner_id == '') || (this.MEPmakerForm.value.budgetowner_id == null) || (this.MEPmakerForm.value.budgetowner_id == undefined)) {
      this.toastr.error('Please Enter Budget Owner');
      this.clicked = false
      return false;
    }
    if ((this.MEPmakerForm.value.justification == '') || (this.MEPmakerForm.value.justification == null) || (this.MEPmakerForm.value.justification == undefined)) {
      this.toastr.error('Please Enter Justification');
      this.clicked = false
      return false;
    }
    let Startdate = this.MEPmakerForm.value.startdate
    let startdate = this.datePipe.transform(Startdate, 'yyyy-MM-dd');
    let Enddate = this.MEPmakerForm.value.enddate
    let enddate = this.datePipe.transform(Enddate, 'yyyy-MM-dd');
    let enddateAndFinalYear = this.datePipe.transform(Enddate, 'yyyy');
    let yearvalidation: number = +enddateAndFinalYear         //////////////end date chaning to number
    let maxfinalyear = new Date()
    let maxfinalyearformat = this.datePipe.transform(maxfinalyear, 'yyyy');   //////////now date changing format 
    let maxfinalyearformatToNumber: number = +maxfinalyearformat               //////////now date changing to number 
    let maxfinalyearvalidation = maxfinalyearformatToNumber + 50  //////////now date changing to 50 years

    let validationForParamount = this.balanceAmount
    console.log("validationForParamount", validationForParamount)

    this.MEPmakerForm.value.startdate = startdate
    this.MEPmakerForm.value.enddate = enddate


    if (this.MEPmakerForm.value.amount <= 0) {
      this.toastr.error('Check PCA Amount', 'Please Enter Valid Amount');
      this.clicked = false
      return false;
    }

    if (this.MEPmakerForm.value.enddate < this.MEPmakerForm.value.startdate) {
      this.toastr.error('Select Valid Date', 'End date must be greater than Start date');
      this.clicked = false
      return false;
    }

    if (this.MEPmakerForm.value.amount < this.sum || this.MEPmakerForm.value.amount > this.sum) {
      this.toastr.error('Check PCA Details Amount', 'Please Enter Valid Amount');
      this.clicked = false
      return false;
    }

    let dataPCAdetails = this.MEPmakerForm.value.mepdetails
    if(dataPCAdetails.length == 0 ){
      this.notification.showWarning("Please Fill Details")
      return false
    }


    for (let i in dataPCAdetails) {
      let Prodcat = dataPCAdetails[i].productcategory_id

      let desc = dataPCAdetails[i].desc

      let amount = dataPCAdetails[i].totalamt

      let indexNumber = Number(i)
      if ((Prodcat == "") || (Prodcat == undefined) || (Prodcat == null)) {
        this.notification.showWarning("Commodity is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((desc == "") || (desc == undefined) || (desc == null)) {
        this.notification.showWarning("Description is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

      if ((amount == "") || (amount == undefined) || (amount == null)) {
        this.notification.showWarning("Amount is not filled, Please check on line " + (indexNumber + 1))
        return false
      }

    }

    let duplicateCheckOnCommodity = this.MEPmakerForm.value['mepdetails'].map(x => x.productcategory_id.name);
    console.log("duplicate check in commodity", duplicateCheckOnCommodity)


    for (let i in duplicateCheckOnCommodity){
      let first_index = duplicateCheckOnCommodity.indexOf(duplicateCheckOnCommodity[i]);
      let last_index = duplicateCheckOnCommodity.lastIndexOf(duplicateCheckOnCommodity[i]);

      if (first_index !== last_index) {
        console.log('Duplicate item in array ' + duplicateCheckOnCommodity[i]);
        console.log('Duplicate item in array index ' + i);   
        let indexNumber = Number(i)
        this.notification.showWarning("There is a duplicate commodity of '"+duplicateCheckOnCommodity[i]+"' indentified in line "+ (indexNumber + 1))
        return false
      }


    }

    let datas = this.MEPmakerForm.get('mepdetails')['controls']
    for (let i in datas) {
      if (datas) {
        if (datas[i].value.productcategory_id.id == undefined) {
          datas[i].value.productcategory_id = datas[i].value.productcategory_id
        }
        else {
          datas[i].value.productcategory_id = datas[i].value.productcategory_id.id
        }
      }
    }

    this.clicked = true
    console.log('datas', datas)
    if ( this.MEPmakerForm.value.branch_id.id == undefined) {
      this.MEPmakerForm.value.branch_id = this.MEPmakerForm.value.branch_id
    }
    else {
      this.MEPmakerForm.value.branch_id = this.MEPmakerForm.value.branch_id.id
    }

    if ( this.MEPmakerForm.value.raisor_id.id == undefined) {
      this.MEPmakerForm.value.raisor_id = this.MEPmakerForm.value.raisor_id
    }
    else {
      this.MEPmakerForm.value.raisor_id = this.MEPmakerForm.value.raisor_id.id
    }


    if ( this.MEPmakerForm.value.projectowner_id.id == undefined) {
      this.MEPmakerForm.value.projectowner_id = this.MEPmakerForm.value.projectowner_id
    }
    else {
      this.MEPmakerForm.value.projectowner_id = this.MEPmakerForm.value.projectowner_id.id
    }


    if ( this.MEPmakerForm.value.budgetowner_id.id == undefined) {
      this.MEPmakerForm.value.budgetowner_id = this.MEPmakerForm.value.budgetowner_id
    }
    else {
      this.MEPmakerForm.value.budgetowner_id = this.MEPmakerForm.value.budgetowner_id.id
    }
   
    let data = this.MEPmakerForm.value


    if (this.mepheaderId != undefined) {


      let dataID = Object.assign({}, data, { "id": this.mepheaderId })
      this.SpinnerService.show();
      this.dataService.MEPmakerUpdate(dataID)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.SpinnerService.hide();
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
            this.clicked = false
          }
          else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide();
            this.clicked = false
            this.notification.showError("UNEXPECTED ERROR")
          }
          else if (result.error == "Error" && result.description == "Please Check Total Amount") {
            this.SpinnerService.hide();
            this.clicked = false
            this.notification.showError("Check PCA amount should not exceed than Selected BPA amount")
          }
          else {
            this.SpinnerService.hide();
            this.notification.showSuccess("Successfully Updated!...")
            this.onSubmit.emit();
          }
          console.log("prserv/mep Form SUBMIT", result)
          return true
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    } else {
      this.SpinnerService.show();
      this.dataService.MEPmakerFormSubmit(data)
        .subscribe(result => {
          this.SpinnerService.hide();
          if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
            this.SpinnerService.hide();
            this.notification.showError("Duplicate! [INVALID_DATA! ...]")
          }
          else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
            this.SpinnerService.hide();
            this.notification.showError("UNEXPECTED ERROR")
          }
          else if (result.error == "Error" && result.description == "Please Check Total Amount") {
            this.SpinnerService.hide();
            this.clicked = false
            this.notification.showError("Check PCA amount should not exceed than Selected BPA amount")
          }
          else {
            this.notification.showSuccess("Successfully Created!...")
            this.onSubmit.emit();
            this.SpinnerService.hide();
          }
          console.log("prserv/mep Form SUBMIT", result)
          return true
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }



  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  onCancelClick() {
    this.onCancel.emit()
  }

  getParyear() {
    this.SpinnerService.show();
    this.dataService.getParyear()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        this.FinancialYearList = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getParexpensetype() {
    this.SpinnerService.show();
    this.dataService.getParexpensetype()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.expensetype = datas;
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




}
