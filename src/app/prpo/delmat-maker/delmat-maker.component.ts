import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import {  MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'

export interface Emplistss {
  id: string;
  full_name: string;
}
export interface comlistss {
  id: string;
  name: string;
}



@Component({
  selector: 'app-delmat-maker',
  templateUrl: './delmat-maker.component.html',
  styleUrls: ['./delmat-maker.component.scss']
})
export class DelmatMakerComponent implements OnInit {
  delmatmakerForm: FormGroup;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;


  employeeList     : Array<Emplistss>;
  employee_id      = new FormControl();

  commodityList    : Array<comlistss>;
  commodity_id     = new FormControl();


  delmattypeList       : Array<any>;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('comInput') comInput: any;


  limit:any;
  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr:ToastrService,private notification: NotificationService, private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService ) { }

  ngOnInit(): void {
    this.delmatmakerForm = this.fb.group({
      employee_id     :['',   this.SelectionValidator],
      commodity_id    :['',   this.SelectionValidator],
      type            :[null,  Validators.required],
      limit           :[null,  Validators.required]
    })

    let empkeyvalue: String = "";
    this.getemployeeFK(empkeyvalue);
    this.delmatmakerForm.get('employee_id').valueChanges
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


      let comkeyvalue: String = "";
    this.getcommodityFK(comkeyvalue);
    this.delmatmakerForm.get('commodity_id').valueChanges
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

      this.getdelmattype();

  }
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

  public displayFnemp(emp?: Emplistss): string | undefined {
    console.log('id', emp.id);
    console.log('full_name', emp.full_name);
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.delmatmakerForm.get('employee_id');
  }
  getemployeeFK(empkeyvalue){
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
              if (this.has_next === true) {
                this.dataService.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    // console.log("emp", datas)
                    if (this.commodityList.length >= 0) {
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

  public displayFncom(com?: comlistss): string | undefined {
    console.log('id', com.id);
    console.log('name', com.name);
    return com ? com.name : undefined;
  }

  get com() {
    return this.delmatmakerForm.get('commodity_id');
  }
  getcommodityFK(comkeyvalue){
    this.SpinnerService.show();
    this.dataService.getcommodityFK(comkeyvalue)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.SpinnerService.hide();
          this.commodityList = datas;
          console.log("commodityList", datas)
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  getdelmattype(){
    this.SpinnerService.show();
    this.dataService.getdelmattype()
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          this.delmattypeList = datas;
          console.log("delmattypeList", datas)
        },(error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
  }
  private SelectionValidator(fcvalue: FormControl) {
    if (typeof fcvalue.value === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    return null;
  }
                          
  delmatmakerSubmit(){
    if (this.delmatmakerForm.value.employee_id===""){
      this.toastr.error('Add Employee Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }if (this.delmatmakerForm.value.commodity_id===""){
      this.toastr.error('Add Commodity Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }if (this.delmatmakerForm.value.commodity_id==='string'){
      this.toastr.error('Add Proper Commodity Field','Please Select the Commodity' ,{timeOut: 1500});
      return false;
    }
    if (this.delmatmakerForm.value.type===null){
      this.toastr.error('Add Type Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }if (this.delmatmakerForm.value.limit===null){
      this.toastr.error('Add Limit Field','Empty value inserted' ,{timeOut: 1500});
      return false;
    }
  this.delmatmakerForm.value.employee_id=this.delmatmakerForm.value.employee_id.id;
  this.delmatmakerForm.value.commodity_id=this.delmatmakerForm.value.commodity_id.id;
  this.SpinnerService.show();

  this.dataService.delmatmakercreate(this.delmatmakerForm.value)
  .subscribe(res => {
    this.SpinnerService.hide();
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.SpinnerService.hide();
      this.notification.showError("[INVALID_DATA! ...]")
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.SpinnerService.hide();
      this.notification.showWarning("Duplicate Data! ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.SpinnerService.hide();
      this.notification.showError("INVALID_DATA!...")
    }
     else {
      this.SpinnerService.hide();
       this.notification.showSuccess("Successfully created!...")
       this.onSubmit.emit();
     
     }
       console.log("this.delmatmakerForm.value Form SUBMIT", res)
       return true
     },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }) 
  }

  omit_special_char(event)
{   
  var k;  
  k = event.charCode;  
  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}
omit_special_num(event)
{   
  var k;  
  k = event.charCode;  
  return((k == 188) ||(k == 46) || (k >= 48 && k <= 57)); 
}
 onCancelClick() {

  this.onCancel.emit()
 }
}
