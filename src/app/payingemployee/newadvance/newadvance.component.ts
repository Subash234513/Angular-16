import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from "../payingemp.service";
import { debounceTime, distinctUntilChanged, switchMap, tap, } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { NotificationService } from "src/app/service/notification.service";
import { Router } from "@angular/router";
import { SharedService } from "src/app/service/shared.service";
import { Advances } from "../models/advances";
import { MatTableDataSource } from "@angular/material/table";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "MMM/YYYY",
  },
  display: {
    dateInput: "MMM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
export interface advancesummary {
  full_name: string;
}
@Component({
  selector: "app-newadvance",
  templateUrl: "./newadvance.component.html",
  styleUrls: ["./newadvance.component.scss", "./newadvance.css"],

  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class NewadvanceComponent implements OnInit {
  selectedValue: string = 'True';
  editshow: string = 'false';

  principal: any;
  actual_amount: number
  editloanTenure: number
  loanTenure: number;
  emi: number;

  takeHome: number;
  editemi: number;
  EditemiDetails: any[] = [];
  emiDetails: any[] = [];
  currentMonth: string = '';
  nextMonths: string[] = [];
  presentpageadvance: number = 1;
  presentsizeadvance = 10;
  droplist: any;
  AdvanceDraft = 8;
  AdvanceSubmit = 9
  @ViewChild('labelImport') labelImport: ElementRef;
  // @ViewChild('closebtn') closebtn: ElementRef;
  @ViewChild('closebtn') closebtn: ElementRef;
  images: any;
  selectedIds: number[] = [];
  updateview: FormGroup;


  addForm: FormGroup;
  advEditForm: FormGroup;
  searchForm: FormGroup;
  searchForms: FormGroup;
  lastMonthLastDay: any;
  approveDetails: any;
  EmpObjects: any;
  advancerole: any;
  summarylist: any;
  monthDifference: number;
  btnAddSubmit: boolean = false
  ModalClose: boolean = true
  detailsView: boolean = false;
  normalView: boolean = true;
  admindata: any;
  showAdvanceUpload: boolean;
  selectedVal: any;
  enablebtn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private payRollService: PayingempService,
    private notification: NotificationService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    public datepipe: DatePipe,
    private sharedservice: SharedService,
    private snackBar: MatSnackBar

  ) {

  }
  advRequest: FormGroup;
  advanceApprove: FormGroup;
  from_date = new FormControl(moment());
  payableMonth = new FormControl(moment());
  to_date = new FormControl(moment());
  payablesMonth = new FormControl(moment());
  from_dates = new FormControl(moment());
  payableMonths = new FormControl(moment());
  to_dates = new FormControl(moment());
  payablesMonths = new FormControl(moment());
  currentmonth = new FormControl(moment());
  advanceSummary: [];
  advancesummarys: [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  paginations = {
    has_next: false,
    has_previous: false,
    index: 1,
  };
  diffMonths: any = 1;
  isDuration: boolean = false;
  adminUsers: boolean;
  payRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  empbranchid: any;
  currentUser: any;
  makerUser: boolean = false;
  checkUser: boolean = false;
  checkerUser: boolean = false;
  isshowtable: boolean = true;
  showedit: boolean;
  showdelete: boolean = true;

  functionalHead: any;
  functionheads: any
  employees: any[];
  filteredEmployees: any[];
  filteredEmployee: any[];
  filteredchecker: any[];
  approvedCount = 0;
  pendingCount = 0;
  rejectedCount = 0;
  monthDiffs: any;
  fromDate: Date;
  toDate: Date;

  employeeName = new FormControl();
  aprovalemployee = new FormControl();
  checkerapproval = new FormControl();
  selectedId: any;
  SelectEmpty: any;
  AdvanceAll: any;
  displayedColumns = [
    "id",
    "code",
    "name",
    "fromDate",
    "toDate",
    "advStatus",
    "history",
    "edit",
    "delete",
  ];
  dataObj: any;
  public dataArray: any;
  public dataSource: MatTableDataSource<Advances>;
  TranHistoryList: any;
  payTranHistoryList: any;
  currentId: any;
  EmployeeFullName: any;
  EmployeeCode: any;
  idEmployee: any;
  totalCount: any;
  remark: any;
  reason: any;
  selectEmpId: any;
  uploadForms: FormGroup;
  ngOnInit(): void {



    const getDataid = localStorage.getItem("sessionData");
    let idValue = JSON.parse(getDataid);
    this.idEmployee = idValue.employee_id;
    this.EmployeeFullName = idValue.name;
    this.EmployeeCode = idValue.code
    console.log('Employee Name', this.EmployeeFullName)
    console.log("empid", this.idEmployee)


    let userdata = this.sharedservice.transactionList;
    console.log("USER DATE", userdata);
    const userRole = this.getUserRole(userdata);
    console.log('User Role:', userRole);
    console.log(userRole)
    // if(userRole == 'Admin')
    // {
    //   this.adminUser =true;
    // }
    // else if(userRole == 'Checker')
    // {
    //   this.checkUser = true;
    //   this.adminUser=false;
    // }
    // else
    // {
    //   this.normalUser = true;
    // }

    this.droplist = [{
      index: 'True',
      name: 'All',

    },
    {
      index: 'False',
      name: 'My Queue',
    }

    ]


    this.advRequest = this.fb.group({
      employee_id: "",
      actual_amount: "",
      principal: '',
      reason: new FormControl("", [Validators.required]),
      payableMonth: new FormControl(""),
      payablesMonth: new FormControl(""),
      emi_amount: "",
      id: "",
      to_employee_id: '',
      remarks: '',
      advance_id: ''

    });
    this.advanceApprove = this.fb.group({
      employee_id: "",
      actual_amount: "",
      principal: "",
      reason: "",
      remark: '',
      payableMonths: new FormControl(""),
      payablesMonths: new FormControl(""),
      emi_amount: "",
      approverName: "",
      employeeName: "",
      aprovalemployee: "",
      checkerapproval: "",
    });

    this.advEditForm = this.fb.group({
      employee_id: "",
      emplName: "",
      actual_amount: "",
      principal: "",
      reason: new FormControl('', [Validators.required]),
      from_dates: "",
      payableMonth: "",
      toDate: "",
      payablesMonth: "",
      emi_amount: "",
      id: "",
      to_employee_id: '',
      remarks: '',
      advance_id: '',
      tran_id: ''
    });

    this.searchForm = this.fb.group({
      id: "",
      empName: "",
      summary: "",
      advancesummary: "",
      advancesummarys: ""

    });
    this.searchForms = this.fb.group({
      empName: "",
      advancesummary: "",
    });
    this.getAdvanceSummary();
    this.updateview = this.fb.group({
      emi_paid: '',
      emi_balance: ''
    })
    this.from_date.valueChanges.subscribe((from_dateValue) => {
      const to_dateValue = this.to_date.value;
      if (from_dateValue && to_dateValue) {
        const payDate = new Date(from_dateValue.toDate());
        const paysDate = new Date(to_dateValue.toDate());

        const monthsDifference = this.getMonthsDifference(payDate, paysDate);
        console.log("Months Difference:", monthsDifference);
      }
    });

    this.to_date.valueChanges.subscribe((to_dateValue) => {
      const from_dateValue = this.from_date.value;
      if (from_dateValue && to_dateValue) {
        const payDate = new Date(from_dateValue.toDate());
        const paysDate = new Date(to_dateValue.toDate());

        const monthsDifference = this.getMonthsDifference(payDate, paysDate);
        console.log("Months Difference:", monthsDifference);
      }
    });

    this.advRequest
      .get("actual_amount")
      .valueChanges.subscribe((actual_amount) => {
        let advamt = this.advRequest.get('actual_amount').value
        advamt = actual_amount
        this.updateEMI();
      });
    this.advEditForm
      .get("actual_amount")
      .valueChanges.subscribe((actual_amount) => {
        this.updateEMIs();

      });
    this.advEditForm.patchValue({

    })


    this.from_dates.valueChanges.subscribe((from_dateValues) => {
      const to_dateValues = this.to_dates.value;
      if (from_dateValues && to_dateValues) {
        const payeDate = new Date(from_dateValues.toDate());
        const payseDate = new Date(to_dateValues.toDate());

        const monthsDifference = this.getMonthsDifference(payeDate, payseDate);
        console.log("Months Difference:", monthsDifference);
        this.updateEMIs();
      }
    });

    this.to_dates.valueChanges.subscribe((to_dateValue) => {
      const from_dateValue = this.from_dates.value;
      if (from_dateValue && to_dateValue) {
        const payDate = new Date(from_dateValue.toDate());
        const paysDate = new Date(to_dateValue.toDate());

        const monthsDifference = this.getMonthsDifference(payDate, paysDate);
        console.log("Months Difference:", monthsDifference);
        this.updateEMIs();
      }
    });
    this.get_dropdownsummary_advance();


    // normal user dropdown changes
    if (this.normalUser) {
      this.employeeName.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => {
            this.functionalHead = [];
          }),
          switchMap((value) => this.payRollService.getFunctionHeadBychecker(value, 'checker'))
        )
        .subscribe((response: any) => {
          this.employees = response.data;
          this.functionalHead = this.employees;
        });
    }


    if (this.checkUser) {
      this.aprovalemployee.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => {
            this.functionalHead = [];
          }),
          switchMap((value) => this.payRollService.getFunctionalHeadByName(value, 'Approver'))
        )
        .subscribe((response: any) => {
          this.employees = response.data;
          this.functionalHead = this.employees;
        })

    }

    if (this.normalUser) {
      this.checkerapproval.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => {
            this.functionalHead = [];
          }),
          switchMap((value) => this.payRollService.getFunctionHeadBychecker(value, 'create checker'))
        )
        .subscribe((response: any) => {
          this.employees = response.data;
          this.functionalHead = this.employees;
        })
      this.uploadForms = this.fb.group({
        files: ['', Validators.required],
      })
    }

  }
  getUserRole(data) {
    let hasMaker = false;
    let hasChecker = false;
    let hasAdmin = false;

    for (const entry of data) {
      if (entry.name === 'Employee Payroll') {
        for (const role of entry.role) {
          if (role.name === 'Payroll Admin') {
            hasAdmin = true;
          } else if (role.name === 'Maker') {
            hasMaker = true;
          } else if (role.name === 'Payroll Checker') {
            hasChecker = true;
          }
        }
      }
    }


    if (hasAdmin) {
      this.adminUser = true;
      return 'Admin';
    } else if (hasMaker && hasChecker) {
      this.checkUser = true;
      return 'Checker';
    } else if (hasMaker) {
      this.normalUser = true;
      return 'Maker';
    } else if (hasChecker) {
      this.checkUser = true;
      return 'Checker';
    } else {
      this.normalUser = true;
      return 'Maker';
    }

    // if (hasAdmin) {
    //   return 'Admin';
    //   this.adminUser = true;
    // } else if (hasMaker && hasChecker) {
    //   return 'Checker';
    //   this.checkUser = true;
    // } else if (hasMaker) {
    //   return 'Maker';
    //   this.normalUser = true;

    // } else if (hasChecker) {
    //   return 'Checker';
    //   this.checkUser = true;
    // }
    // else if (hasChecker && hasAdmin || hasAdmin && hasMaker || hasAdmin && hasMaker && hasChecker) {
    //   return 'Admin';
    //   this.adminUser = true;
    // } 
    // else {
    //   return 'Maker';
    //   this.normalUser = true;
    // }



  }
  getAdvanceSummary() {
    console.log("USER TYPE", this.checkUser)
    const value = this.searchForm.value
    console.log("VALURES", value)
    let id = value.id
    if (this.normalUser) {
      this.payRollService
        .getEmpAdvanceUsers(this.pagination.index, id)
        .subscribe((results) => {
          if (!results) {
            return false;
          }

          this.advanceSummary = results["data"];
          this.dataSource = new MatTableDataSource<any>(this.advanceSummary);
          this.dataArray = this.advanceSummary;
          this.countApprovedRows(results["data"]);
          this.countPendingRows(results["dgetMonthsDifferenceata"]);
          this.countRejectedRows(results["data"]);

          this.pagination = results.pagination
            ? results.pagination
            : this.pagination;
        });
      console.log('value', id)
    } else if (this.checkUser) {
      this.payRollService
        .getEmpAdvancesAdm(this.pagination.index, id)
        .subscribe((results) => {
          if (!results) {
            return false;
          }
          this.advanceSummary = results["data"];
          this.dataSource = new MatTableDataSource<any>(this.advanceSummary);
          this.dataArray = this.advanceSummary;
          this.countApprovedRows(results["data"]);
          this.countPendingRows(results["data"]);
          this.countRejectedRows(results["data"]);

          this.pagination = results.pagination
            ? results.pagination
            : this.pagination;
        });
      console.log('advanceSummary', this.advanceSummary)
    } else {
      this.payRollService
        .getEmpAdvancesAdm(this.pagination.index, id)
        .subscribe((results) => {
          if (!results) {
            return false;
          }
          this.advanceSummary = results["data"];
          this.dataSource = new MatTableDataSource<any>(this.advanceSummary);
          this.dataArray = this.advanceSummary;
          let dataPagination = results['pagination'];
          this.countApprovedRows(results["data"]);
          this.countPendingRows(results["data"]);
          this.countRejectedRows(results["data"]);
          this.presentpageadvance = dataPagination.index;
          this.pagination = results.pagination
            ? results.pagination
            : this.pagination;
        });
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.from_date.value;
    ctrlValue.year(normalizedYear.year());
    this.from_date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.from_date.value;
    ctrlValue.month(normalizedMonth.month());
    this.from_date.setValue(ctrlValue);
    this.updatePayableMonth();
    datepicker.close();
  }

  chosenYearHandlers(normalizedYear: Moment) {
    const ctrlValues = this.payableMonth.value;
    ctrlValues.year(normalizedYear.year());
    this.payableMonth.setValue(ctrlValues);
  }

  chosenMonthHandlers(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValues = this.payableMonth.value;
    ctrlValues.month(normalizedMonth.month());
    this.payableMonth.setValue(ctrlValues);
    datepicker.close();
  }

  chosenYearHandle(normalizedYear: Moment) {
    const ctrlValues = this.to_date.value;
    ctrlValues.year(normalizedYear.year());
    this.to_date.setValue(ctrlValues);
  }

  chosenMonthHandle(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValues = this.to_date.value;
    ctrlValues.month(normalizedMonth.month());
    this.to_date.setValue(ctrlValues);
    this.updatePayableMonths();
    datepicker.close();
  }

  chosenYearHandl(normalizedYear: Moment) {
    const ctrlValues = this.payablesMonth.value;
    ctrlValues.year(normalizedYear.year());
    this.payablesMonth.setValue(ctrlValues);
  }

  chosenMonthHandl(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValues = this.payablesMonth.value;
    ctrlValues.month(normalizedMonth.month());
    this.payablesMonth.setValue(ctrlValues);
    datepicker.close();
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1;
    }
    this.getAdvanceSummary();
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1;
    }
    this.getAdvanceSummary();
  }

  getMonthsDifference(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    if (diffTime == 0) {
      this.diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 31));
    } else {
      this.diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 31));
    }
    this.isDuration = true;
    return this.diffMonths;
  }

  deleteAdvance(id) {
    this.payRollService.deleteempadvance(id).subscribe((results) => {
      if (results.status == "success") {
        this.notification.showSuccess("Deleted Successfully");
        // this.getAdvanceSummary();
        this.getEmployee()
      } else {
        this.notification.showError(results.description);



      }

    });
  }

  getMonthDifference(date1: Date, date2: Date): number {
    const monthsInYear = 12;
    const yearDiff = date1.getFullYear() - date2.getFullYear();
    const monthDiff = date1.getMonth() - date2.getMonth();
    return yearDiff * monthsInYear + monthDiff;
  }

  // Example usage:
  editAdvance(data) {
    this.payRollService.getAdvanceParticularGet(data.id).subscribe((result) => {
      console.log("API RESPONSE", result);
      console.log(this.takeHome)
      this.actual_amount = result.actual_amount
      this.fromDate = result.from_date
      this.toDate = result.to_date
      this.monthDifference = this.getMonthDifference(new Date(this.toDate), new Date(this.fromDate));
      this.editloanTenure = this.monthDifference
      console.log(this.actual_amount)
      console.log(this.editloanTenure)
      this.advEditForm.patchValue({
        id: result.id,
        emplName: result.name,
        reason: result.reason,
        to_employee_id: result.to_employee_id?.full_name,
        remarks: result.remarks,
        tran_id: result.tran_id



      });
      this.selectedId = result.to_employee_id.id;

      this.EditcalculateEMI()

      const date1 = new Date(this.fromDate);
      const date2 = new Date(this.toDate);
      this.monthDifference = this.getMonthDifference(date2, date1);

      console.log(`Month difference: ${this.monthDifference}`);
      const formattedDate = this.datepipe.transform(
        result.from_date,
        "yyyy-MM"
      );

      const dateObject = new Date(formattedDate);
      const momentdate=moment(dateObject)
      this.from_dates.setValue(momentdate);
      const formattedDates = this.datepipe.transform(
        result.to_date,
        "yyyy-MM"
      );

      const dateObjects = new Date(formattedDates);
      const momentdates=moment(dateObjects)
      this.to_dates.setValue(momentdates);
      const newDateObject = new Date(dateObject);
      const payDates = newDateObject.setMonth(newDateObject.getMonth());
      const momentpaydate=moment(this.datepipe.transform(payDates, "yyyy-MM"))
      this.payableMonths.setValue(
        momentpaydate
      );

      const newDateObjects = new Date(dateObjects);
      const payDatess:Date = new Date(newDateObjects.setMonth(newDateObjects.getMonth()));
      const momentpayDates=moment(this.datepipe.transform(payDatess, "yyyy-MM-dd"))
      this.payablesMonths.setValue(
        momentpayDates
      );

      const payDate = new Date(dateObject);
      const paysDate = new Date(dateObjects);
      const monthsDifference = this.getMonthsDifference(payDate, paysDate);
      console.log("Months Difference:", monthsDifference);

    });
    this.editloanTenure = 0;
    this.actual_amount = 0;
    this.advRequest.reset();

  }
  gettranhistory(data) {
    let headerId = data.id;
    console.log("headerId", headerId);
    this.payRollService.getAdvanceHistory(headerId).subscribe(
      (results) => {
        let datas = results["data"];
        console.log("getranhistory", datas);
        console.log("Type OF", typeof datas);
        this.TranHistoryList = datas;
      },
      (error) => {
        this.notification.showError(error);
      }
    );
  }

  getpayhistory(data) {
    let headerId = data.id;
    console.log("headerId", headerId);
    this.payRollService.getAdvancePayHistory(headerId).subscribe((results) => {
      let datas = results["data"];
      console.log("getranhistory", datas);
      this.payTranHistoryList = datas;


    });
  }

  searchFunctionalHead(name, status) {
    this.payRollService.getFunctionHeadBychecker(name, status)
      .subscribe((response: any) => {
        this.functionalHead = response.data;
      });
  }

  searchFunctionalHeads(name, status) {
    this.payRollService.getFunctionalHeadByName(name, status)
      .subscribe((response: any) => {
        this.functionalHead = response.data;
      });
  }

  searchfunctionchecker(name, status) {
    this.payRollService.getfunctioncheckerbychecker(name, status)
      .subscribe((response: any) => {
        this.functionalHead = response.data;
      })
  }

  addAdvance() {
    this.SpinnerService.show();
    const moment = require('moment');
    var date = moment();
    var dateIn5Months = date.add(5, 'months');
    var strDate = dateIn5Months.format('yyyy-MM');

    var currentDate = new Date()
    const newdata = new Date(currentDate)
    let toDate = newdata.setMonth(newdata.getMonth() + this.loanTenure)
    console.log(currentDate);

    let values = this.advRequest.value;
    console.log("EMP Values", values);
    let year = this.emiDetails[0]
    let years = this.emiDetails[this.emiDetails.length - 1]
    // console.log("yesyr", year.year)


    const fixedOffsetMilliseconds = 2628288000;
    let payload = {
      from_date: moment(new Date().getTime() + 2628288000).format("YYYY-MM"),
      to_date: moment(new Date().getTime() + 2628288000)
        .add(this.loanTenure - 1, 'months')
        .format("YYYY-MM"),
      actual_amount: this.principal,
      emi_amount: this.emi?.toString(),
      reason: values.reason,
      advance_status: this.AdvanceSubmit,
      advance_id: values.id,
      to_employee_id: this.selectedId,
      remarks: values.remarks,

      // id:values.id
    };
    console.log('advanceID', payload.advance_id)
    this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {
      this.SpinnerService.hide();
      if (result.status == "success") {
        this.notification.showSuccess("Successfully Created");
        // this.getAdvanceSummary();
        this.getEmployee()
        this.advRequest.reset();
        this.loanTenure = 0;
        this.principal = '';
        this.emiDetails = [];
        this.ModalClose = false
      }
      else if (result.status == "INVALID EMPLOYEE CODE") {
        this.notification.showError("Already a Advance Request Created by you is Processing...");
        return false;
      }
      else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;

      }

    }
    );

  }
  Draft() {
    console.log('checkapproval', this.advRequest.get('to_employee_id'))
    let values = this.advRequest.value;
    if (this.selectedId) {
      this.selectEmpId = this.selectedId
    }
    else {
      this.selectEmpId = ""
    }
    let payload = {
      from_date: moment(new Date().getTime() + 2628288000).format("YYYY-MM"),
      to_date: moment(new Date().getTime() + 2628288000)
        .add(this.loanTenure - 1, 'months')
        .format("YYYY-MM"),
      actual_amount: this.principal,
      emi_amount: this.emi?.toString(),
      reason: values.reason,
      advance_status: this.AdvanceDraft,
      to_employee_id: this.selectEmpId,
      advance_id: values.advance_id,
      remarks: values.remarks,
      //  id:values.id
    };
    this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {
      this.SpinnerService.hide();
      if (result.message == "Successfully Created") {
        this.notification.showSuccess("Added Successfully");
        //  this.getAdvanceSummary();
        this.getEmployee()
        this.advRequest.reset();
        this.loanTenure = 0;
        this.principal = '';
        this.emiDetails = [];
        //  this.ModalClose=false
      }
      else if (result.status == "INVALID EMPLOYEE CODE") {
        this.notification.showError("Already a Advance Request Created by you is Processing...");
        return false;
      }

      else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;

      }

    }
    );
  }

  AddClose() {
    this.loanTenure = 0;
    this.principal = 0;
    this.emiDetails = [];
    this.advRequest.reset();
  }

  updatePayableMonth() {
    const selectedDate = this.from_date.value;
    if (selectedDate) {
      const payableDate = selectedDate.clone().add(1, "month");
      this.payableMonth.setValue(payableDate);
    }
  }

  updatePayableMonths() {
    const selectedDate = this.to_date.value;
    if (selectedDate) {
      const payableDate = selectedDate.clone().add(1, "month");
      this.payablesMonth.setValue(payableDate);
      this.updateEMI();
    }
  }

  updateEMI() {
    let totAmount = this.advRequest.get("actual_amount").value;
    if (this.diffMonths == 0) {
      this.notification.showWarning(
        "From Pay Month & To Pay Month values should not be same"
      );
    } else {
      let emi = (totAmount / this.diffMonths).toFixed(2);
      this.advRequest.get("emi_amount").setValue(emi);
    }
  }

  onOptionSelected(event: any) {
    const selectedName = event;
    this.selectedId = selectedName.id;
  }

  filterEmployees(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) =>
      employee.full_name.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelect(event: any) {
    const selectedName = event;
    this.selectedId = selectedName.id;
  }

  filterEmployee(value: string) {
    const filteremp = value.toLowerCase();
    this.filteredEmployee = this.employees.filter((employee) =>
      employee.full_name.toLowerCase().includes(filteremp))
  }
  //checkercreate to by checker
  onoptionchecker(event: any) {
    const selectedName = event
    this.selectedId = selectedName.id
  }
  onoptionchecked(event: any) {
    const selectedName = event
    this.selectedId = selectedName.id
    console.log('Selected', this.selectedId)
  }

  filterchecker(value: string) {
    const filtercheck = value.toLowerCase();
    this.filteredchecker = this.employees.filter((employee) =>
      employee.full_name.toLowerCase().includes(filtercheck))
  }

  advanceEdit() { }
  countApprovedRows(apiResponse) {
    for (const item of apiResponse) {
      if (item.advance_status && item.advance_status.name === "APPROVED") {
        this.approvedCount++;
      }
    }
    return this.approvedCount;
  }
  countPendingRows(apiResponse) {
    for (const item of apiResponse) {
      if (
        item.advance_status &&
        item.advance_status.name !== "APPROVED" &&
        item.advance_status.name !== "REJECT"
      ) {
        this.pendingCount++;
      }
    }
    return this.pendingCount;
  }
  countRejectedRows(apiResponse) {
    for (const item of apiResponse) {
      if (item.advance_status && item.advance_status.name === "REJECT") {
        this.rejectedCount++;
      }
    }
    return this.rejectedCount;
  }

  chosenYearHandlere(normalizedYear: Moment) {
    const ctrlValue = this.from_dates.value;
    ctrlValue.year(normalizedYear.year());
    this.from_dates.setValue(ctrlValue);
  }

  chosenMonthHandlere(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.from_dates.value;
    ctrlValue.month(normalizedMonth.month());
    this.from_dates.setValue(ctrlValue);
    this.updatePayableMonthe();
    datepicker.close();

  }

  ApproveViews(data) {
    const checkdraft = document.querySelector('.checkdraft')
    if (data == 'DRAFT') {
      checkdraft.classList.add('display')
    }

    this.payRollService.getAdvanceParticularGet(data.id).subscribe((result) => {
      this.approveDetails = result;
      if (this.approveDetails?.balance_oldadvance > 0) {
        const config = new MatSnackBarConfig();
        config.duration = 11000;
        config.horizontalPosition = 'end';
        config.verticalPosition = 'top';
        config.panelClass = ["custom-style"];

        this.snackBar.open("Please note that the employee currently has existing ongoing advances. Request you to review the previous status and proceed.", '', config);
      }
      console.log('ApproveDetails', this.approveDetails)
      this.currentId = result.id;
    });
  }

  approveAdv() {
    let values = this.advanceApprove.value;
    let payload = {
      //   from_date : moment(new Date().getTime() + 2628288000).format("YYYY-MM"),
      //  to_date :moment(new Date().getTime() + 2628288000)
      //  .add(this.loanTenure-1, 'months')
      //  .format("YYYY-MM"),
      //  actual_amount: this.principal ,
      //  emi_amount: this.emi?.toString(),
      //  reason: values.reason, 
      //  advance_status:this.AdvanceSubmit,
      //  advance_id:values.id,
      //  to_employee_id:this.selectedId,
      //  remarks:values.remarks,
      advance_id: this.currentId,
      advance_status: 10,
      to_employee_id: this.selectedId,
      remarks: values.remark

      // id:values.id
    };
    console.log("EMP Values", values);
    // this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {
    this.payRollService
      .addNewAdvanceEmployee(payload)
      .subscribe((result) => {
        if (result.status == "success") {
          this.notification.showSuccess("Advance Moved to Admin Level");
          this.getAdvanceSummary();
          this.advanceApprove.reset();
          this.advanceApprove.get('approverName').setValue(null);
          this.advanceApprove.get('aprovalemployee').setValue('');
          this.aprovalemployee.setValue('');
          // this.advanceApprove.get('remarks').setValue('');
          this.closebtn.nativeElement.click();

        }
        else if (result.status == "INVALID EMPLOYEE CODE") {
          this.notification.showError("Already a Advance Request Created by you is Processing...");
          return false;
        } else {
          this.notification.showError(result.description);

          return false;
        }
      });
    this.advanceApprove.reset();
  }


  approvechecker() {
    const values = this.advanceApprove.get('remark').value;
    console.log("EMP Values", values);
    this.payRollService
      .advanceMovetoChecker(this.currentId, this.selectedId, values)
      .subscribe((result) => {
        if (result.status == "success") {
          this.notification.showSuccess("Advance Moved to checker Level");
          this.getAdvanceSummary();
          this.advRequest.reset();
        } else {
          this.notification.showError(result.description);
          return false;
        }
      });
  }

  finalApprove() {
    let employee_ids = this.selectedId;
    let values = this.advanceApprove.get('remark').value;
    let payload = {
      //   from_date : moment(new Date().getTime() + 2628288000).format("YYYY-MM"),
      //  to_date :moment(new Date().getTime() + 2628288000)
      //  .add(this.loanTenure-1, 'months')
      //  .format("YYYY-MM"),
      //  actual_amount: this.principal ,
      //  emi_amount: this.emi?.toString(),
      //  reason: values.reason, 
      //  advance_status:this.AdvanceSubmit,
      //  advance_id:values.id,
      //  to_employee_id:this.selectedId,
      //  remarks:values.remarks,
      advance_id: this.currentId,
      advance_status: 1,
      to_employee_id: '',
      remarks: values

      // id:values.id
    };
    console.log("EMP Values", values);
    this.payRollService
      .addNewAdvanceEmployee(payload)
      .subscribe((result) => {
        if (result.status == "success") {
          this.notification.showSuccess("Advance Approved");
          this.getAdvanceSummary();
          this.advanceApprove.reset();
        }
        else if (result.status == "INVALID EMPLOYEE CODE") {
          this.notification.showError("Already a Advance Request Created by you is Processing...");
          return false;
        } else {
          this.notification.showError(result.description);
          return false;
        }
      });
  }

  rejectAdvances() {
    let employee_ids = this.selectedId;
    let values = this.advanceApprove.get('remark').value;
    console.log("EMP Values", values);
    if (this.selectedId) {
      this.SelectEmpty = this.selectedId;
    }
    else {
      this.SelectEmpty = ''
    }
    let payload = {
      //   from_date : moment(new Date().getTime() + 2628288000).format("YYYY-MM"),
      //  to_date :moment(new Date().getTime() + 2628288000)
      //  .add(this.loanTenure-1, 'months')
      //  .format("YYYY-MM"),
      //  actual_amount: this.principal ,
      //  emi_amount: this.emi?.toString(),
      //  reason: values.reason, 
      //  advance_status:this.AdvanceSubmit,
      //  advance_id:values.id,
      //  to_employee_id:this.selectedId,
      //  remarks:values.remarks,
      advance_id: this.currentId,
      advance_status: 3,

      to_employee_id: this.SelectEmpty,
      remarks: values

      // id:values.id
    };
    this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {
      if (result.status == "success") {
        this.notification.showWarning("Advance Rejected");
        this.getAdvanceSummary();
        this.advanceApprove.reset();
        this.aprovalemployee.setValue('');
      }
      else if (result.status == "INVALID EMPLOYEE CODE") {
        this.notification.showError("Already a Advance Request Created by you is Processing...");
        return false;
      } else {
        this.notification.showError(result.description);
        return false;
      }
    });
  }

  updateAdvance() {
    this.SpinnerService.show();
    let values = this.advEditForm.value;
    let payload = {
      from_date: this.datepipe.transform(this.from_dates.value.toDate(), "yyyy-MM"),
      to_date: this.datepipe.transform(this.to_dates.value.toDate(), "yyyy-MM"),
      actual_amount: this.actual_amount,
      emi_amount: this.editemi,
      reason: values.reason,
      id: values.id,
      advance_status: this.AdvanceSubmit,
      advance_id: values.id,
      to_employee_id: this.selectedId,
      remarks: values.remarks,
    };
    this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {

      if (result.status == "success") {
        this.notification.showSuccess("Updated Successfully");
        this.SpinnerService.hide();
        // this.getAdvanceSummary();
        this.getEmployee()
      }
      else if (result.status == "INVALID EMPLOYEE CODE") {
        this.notification.showError("Already a Advance Request Created by you is Processing...");
        return false;
      } else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;
      }
      this.SpinnerService.hide();
    });
  }
  UpdateDraft() {
    this.SpinnerService.show();
    let values = this.advEditForm.value;
    if (this.selectedId) {

    }
    let payload = {
      from_date: this.datepipe.transform(this.from_dates.value.toDate(), "yyyy-MM"),
      to_date: this.datepipe.transform(this.to_dates.value.toDate(), "yyyy-MM"),
      actual_amount: this.actual_amount,
      emi_amount: this.editemi,
      reason: values.reason,
      id: values.id,
      advance_status: this.AdvanceDraft,
      to_employee_id: this.selectedId,
      advance_id: values.advance_id,
      remarks: values.remarks,
      tran_id: values.tran_id
    };
    this.payRollService.addNewAdvanceEmployee(payload).subscribe((result) => {

      if (result.message == "Successfully Updated") {
        this.notification.showSuccess("Updated Successfully");
        this.SpinnerService.hide();
        this.getEmployee()
        // this.getAdvanceSummary();
      }
      else if (result.status == "INVALID EMPLOYEE CODE") {
        this.notification.showError("Already a Advance Request Created by you is Processing...");
        return false;
      } else {
        this.notification.showError(result.description);
        this.SpinnerService.hide();
        return false;
      }
      this.SpinnerService.hide();
    });
  }

  getAccentColor(paidDate: string): string {
    const year = new Date(paidDate).getFullYear();
    return "color-code-based-on-year";
  }

  getYear(paidDate: string): number {
    return new Date(paidDate).getFullYear();
  }

  getEmployee() {
    this.SpinnerService.show();
    let name = this.searchForm.get("empName").value;
    let status = this.searchForm.get("summary").value;
    let id = this.searchForm.get("advancesummary").value;
    this.payRollService.getEmpAdvanceSearch(name, status, id).subscribe((results) => {
      this.SpinnerService.hide();
      if (!results) {
        return false;

      }
      this.advanceSummary = results["data"];
      this.isshowtable = true;
      this.pagination = results.pagination
        ? results.pagination
        : this.pagination;
    });
    if (this.AdvanceAll) {
      this.selectedValue = this.AdvanceAll
    }
    else {
      this.selectedValue = 'True'
    }

  }
  // getdropdown_advance

  getSearch(event) {
    console.log("EEVENT:", event);
  }

  updateEMIs() {
    let totAmount = this.advEditForm.get("actual_amount").value;
    if (this.diffMonths == 0) {
      this.notification.showWarning(
        "From Pay Month & To Pay Month values should not be same"
      );
    } else {
      let emi = (totAmount / (this.diffMonths - 0)).toFixed(2);
      this.advEditForm.get("emi_amount").setValue(emi);
    }
  }

  updatePayableMonthe() {
    const selectedDate = this.from_dates.value;
    if (selectedDate) {
      const payableDate = selectedDate.clone().add(1, "month");
      this.payableMonths.setValue(payableDate);
    }
  }

  chosenYearHandlet(normalizedYear: Moment) {
    const ctrlValue = this.to_dates.value;
    ctrlValue.year(normalizedYear.year());
    this.to_dates.setValue(ctrlValue);
  }

  chosenMonthHandleret(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.to_dates.value;
    ctrlValue.month(normalizedMonth.month());
    this.to_dates.setValue(ctrlValue);
    this.updatePayableMontht();
    datepicker.close();
  }

  updatePayableMontht() {
    const selectedDate = this.to_dates.value;
    if (selectedDate) {
      const payableDate = selectedDate.clone().add(1, "month");
      this.payablesMonths.setValue(payableDate);
    }
  }

  showRaisedbyMe() {
    const id = this.searchForm.value
    this.payRollService
      .getEmpAdvanceUsers(this.pagination.index, id)
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.advanceSummary = results["data"];
        this.dataSource = new MatTableDataSource<any>(this.advanceSummary);
        this.dataArray = this.advanceSummary;
        this.countApprovedRows(results["data"]);
        this.countPendingRows(results["data"]);
        this.countRejectedRows(results["data"]);

        this.pagination = results.pagination
          ? results.pagination
          : this.pagination;
      });
  }

  calculateEMI() {
    if (!this.principal) {
      this.notification.showError('Please Enter a Requested Amount Greater than 0')
    }
    else if (!this.loanTenure) {
      this.notification.showError('Please Select Emi')
    }
    else {
      this.btnAddSubmit = true
      const emi = (this.principal / this.loanTenure).toFixed(2);
      this.emiDetails = [];
      const currentYear = new Date().getFullYear();
      console.log('sewews', currentYear)
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      let currentMonthIndex = new Date().getMonth();
      for (let i = 1; i <= this.loanTenure; i++) {
        let year = currentYear + Math.floor((currentMonthIndex + i) / 12);
        let monthIndex = (currentMonthIndex + i) % 12;
        let month = months[monthIndex];
        this.emi = this.principal / this.loanTenure;
        this.emiDetails.push({
          year: year,
          loanTenure: month,
          emi: emi
        });
      }
      console.log('kdfjdkfj', this.emiDetails)
      this.enablebtn = true;
    }

  }

  EditcalculateEMI() {
    if (!this.actual_amount) {
      this.notification.showError('Please Enter a Requested Amount Greater than 0')
    }
    else if (!this.editloanTenure) {
      this.notification.showError('Please Select Emi')
    }
    else {
      this.btnAddSubmit = true
      const editemi = (this.actual_amount / this.editloanTenure).toFixed(2);
      this.EditemiDetails = [];
      const currentYear = new Date().getFullYear();
      console.log('sewews', currentYear)
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      let currentMonthIndex = new Date().getMonth();
      for (let i = 1; i <= this.editloanTenure; i++) {
        let year = currentYear + Math.floor((currentMonthIndex + i) / 12);
        let monthIndex = (currentMonthIndex + i) % 12;
        let month = months[monthIndex];
        this.editemi = this.actual_amount / this.editloanTenure;
        this.EditemiDetails.push({
          year: year,
          loanTenure: month,
          emi: editemi
        });
      }
      console.log('kdfjdkfj', this.EditemiDetails)
      this.enablebtn = true;
    }

  }

  clearform() {
    this.searchForm = this.fb.group({
      id: "",
      empName: "",
      summary: "True",
      advancesummary: "",
      advancesummarys: ""

    })
    this.getEmployee();
    this.isshowtable = false;
    this.showedit = false;
  }

  get_dropdownsummary_advance() {
    this.payRollService.get_dropdownsummary_advance().subscribe(result => {
      this.summarylist = result['data'];
      console.log('advance', this.summarylist)
    })
  }

  myqueue(advance) {
    this.isshowtable = false
    this.AdvanceAll = advance.index
    console.log('Index', this.AdvanceAll)
    if (advance.name == 'My Queue') {
      this.showedit = true
    } else {
      this.showedit = false
    }

  }
  viewdetails() {
    this.detailsView = true;
    this.normalView = false;
    this.getAdvanceAdminSummary();
  }


  getAdvanceAdminSummary() {

    this.payRollService
      .getDetailAdminAdvances(this.EmployeeCode, this.paginations.index)
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.admindata = results['data'];
        this.paginations = results.pagination
          ? results.pagination
          : this.paginations;

      });
  }

  uploadAdvance() {
    this.showAdvanceUpload = true;
    this.detailsView = false;
    this.normalView = false;
  }
  uploadDocuments() {
    this.payRollService.uploadAdvanceData(this.images)
      .subscribe((results: any) => {

        if (results?.status == 'INVALID DATA') {

          this.notification.showError("INVALID DATA")
        }
        else if (results?.code == 'CHECK YOUR ID') {
          this.notification.showError("You DO NOT have permission to perform this operation")
        }
        else {

          this.notification.showSuccess('File Upload Successfull')
          this.uploadForms.reset();
        }

      })
  }
  fileChange(file, files: FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
      .map(f => f.name)
      .join(', ');
    this.images = <File>file.target.files[0];
  }

  updateStatus() {

  }


  toggleSelection(event: any, id: number) {
    if (event.target.checked) {
      this.selectedIds.push(id);
    } else {
      const index = this.selectedIds.indexOf(id);
      if (index !== -1) {
        this.selectedIds.splice(index, 1);
      }
    }
    console.log("Selected IDs", this.selectedIds)
  }

  paidAdvance() {
    let ids = this.selectedIds;
    let payload = {
      "id": this.selectedIds,
      "remarks": "successfully paid"
    }
    this.payRollService.PaidAdvanceUpdate(payload).subscribe((results: any) => {

      if (results?.status == 'INVALID DATA') {

        this.notification.showError("INVALID DATA")
      }
      else if (results?.code == 'CHECK YOUR ID') {
        this.notification.showError("You DO NOT have permission to perform this operation")
      }
      else {

        this.notification.showSuccess('Advance Status Updated successfully')
        this.uploadForms.reset();
        this.getAdvanceAdminSummary();
      }

    })
  }
  forceUpdate(data) {
    // this.updateview.patchValue({
    //   emi_paid : data?.emi_paid,
    //   emi_balance : data?.emi_balance,
    //   id: data?.id
    // })
    this.selectedVal = data?.id;
  }
  backtoAdvances() {
    this.showAdvanceUpload = false;
    this.detailsView = false;
    this.normalView = true;
  }
  backtoAdvanceDetails() {
    this.showAdvanceUpload = false;
    this.detailsView = true;
    this.normalView = false;
  }

  forceclosure() {
    let ids = this.selectedVal;
    let paidEMI = this.updateview.get('emi_paid').value;
    let paidBal = this.updateview.get('emi_balance').value;
    let payload = {
      "id": ids,
      "emi_paid": paidEMI,
      "emi_balance": paidBal
    }
    this.payRollService.forceAdvanceClose(payload).subscribe((results: any) => {

      if (results?.status == 'INVALID DATA') {

        this.notification.showError("INVALID DATA")
      }
      else if (results?.code == 'CHECK YOUR ID') {
        this.notification.showError("You DO NOT have permission to perform this operation")
      }
      else {

        this.notification.showSuccess('Advance Status Updated successfully')
        this.uploadForms.reset();
        this.getAdvanceAdminSummary();
      }

    })
  }
  getEmployeeAdvances() {
    let empCode = this.searchForms.get('empName').value;
    let advStatus = this.searchForms.get('advancesummary').value;
    this.payRollService
      .getDetailAdminAdvanceSearch(empCode, advStatus)
      .subscribe((results) => {
        if (!results) {
          return false;
        }
        this.admindata = results['data'];
        this.paginations = results.pagination
          ? results.pagination
          : this.paginations;

      });
  }

  prevpages() {
    if (this.paginations.has_previous) {
      this.paginations.index = this.paginations.index - 1;
    }
    // this.getAdvanceAdminSummary();
    const empNameValue = this.searchForms.get('empName').value;
    const advanceSummaryValue = this.searchForms.get('advancesummary').value;

    if (!empNameValue && !advanceSummaryValue) {
      this.getAdvanceAdminSummary();
    } else {
      this.getEmployeeAdvances();
    }
  }

  nextpages() {
    if (this.paginations.has_next) {
      this.paginations.index = this.paginations.index + 1;
    }
    // this.getAdvanceAdminSummary();
    const empNameValue = this.searchForms.get('empName').value;
    const advanceSummaryValue = this.searchForms.get('advancesummary').value;

    if (!empNameValue && !advanceSummaryValue) {
      this.getAdvanceAdminSummary();
    } else {
      this.getEmployeeAdvances();
    }
  }






}
