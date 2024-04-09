import { Component, HostListener, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';

import { SharedService } from 'src/app/service/shared.service';
declare var require: any;
import { PdfgeneratorService } from '../pdfgenerator.service';
// import { pdfmake}
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// const htmlToPdfmake = require("html-to-pdfmake");
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

interface monthHeader {
  name: string;
  id: string;

}
// Interface for monthly pay details
interface MonthlyPayDetails {
  amount: string;
  paycomponent: string;
}

// Interface for pay info month
interface PayInfoMonth {
  payroll_date: string;
  Employeemonthlypay_details_data: MonthlyPayDetails[];
}

// Interface for the entire JSON response
interface MonthlyPayData {
  employee_personal_info: {
    code: string;
    email_id: string;
    full_name: string;
    id: number;
  };
  pay_info_month: PayInfoMonth[];
  paycomponent: string[];
}


export interface FunctionHead {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-yearlysummary',
  templateUrl: './yearlysummary.component.html',
  styleUrls: ['./yearlysummary.component.scss']
})
export class YearlysummaryComponent implements OnInit, OnDestroy {
  isLoading: boolean;

  empData: Array<FunctionHead>;
  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('fnInput') fnInput: any;
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  has_next = true;
  monthly_paydata = [];

  has_previous = true;
  currentpage: number = 1;
  payData: any;
  monthlyData: any;
  summaryData: any;
  payComponent: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  payrollDates: string[];
  monthlyPayData: any[];
  lastFourTotals = [];
  personalData: any;
  public dataArray: any;
  monthObjects: { name: string, data: any }[] = [];
  paymentMonthData: any;
  columnNames = [];
  isDataPresent: boolean = false;
  totalRow: any = {};
  payRole: any;
  interPermission: any;
  adminUser: boolean = false;
  normalUser: boolean = false;
  empbranchid: any;
  currentUser: any;
  makerUser: boolean = false;
  checkUser: boolean = false;
  checkerUser: boolean = false;
  empId: any;
  personData: any;


  constructor(private payRollService: PayingempService, private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, public datepipe: DatePipe, private sharedservice: SharedService,
    private pdfGeneratorService: PdfgeneratorService) {
    let currenYear = new Date().getFullYear();
    let currYear = new Date().getFullYear();
    let startYear = currYear - 14;
    for (let year = startYear; year <= currYear + 17; year++) {
      this.years.push(year);
    }
  }
  yearlyForm: FormGroup;

  years: number[] = [];
  currenYear: number;
  yearData: [];
  pay_info_month: any;
  showHide: boolean = false
  currentValue: number = 0;
  intervalId: any;
  currentValues: number = 0;
  intervalIds: any;
  currentVal: number = 0;
  intervalsId: any;
  currentVals: number = 0;
  intervalsIds: any;
  idEmployee: any;
  EmployeeFullName: any;
  empName: any;

  ngOnInit(): void {

    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
    this.idEmployee = idValue.employee_id;
    this.EmployeeFullName = idValue.name;

    let userdata = this.sharedservice.transactionList
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
        }
        if (element.name.toLowerCase() == 'maker' || element.name.toLowerCase() == 'checker' || element.name.toLowerCase() == 'admin') {
          this.interPermission = element.code
          this.normalUser = true;
        }

      })
      if (isAdmin) {
        this.normalUser = false;
        this.makerUser = false;
        this.checkUser = false;
        this.checkerUser = false;
      }
    }
    this.yearlyForm = this.fb.group({
      emplName: '',
      year: ''
    })

  }

  ngOnDestroy() {
    this.clearIncrementLoop();
    this.clearIncrementLoopD();
    this.clearIncrementLoopE();
    this.clearIncrementLoops();
  }
  functionalHead() {
    let gstkeyvalue: String = "";
    this.getFunctional(gstkeyvalue);
    this.yearlyForm.get('emplName').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.payRollService.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empData = datas;

      })
  }

  private getFunctional(gstkeyvalue) {
    this.payRollService.getFunctionalHead(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empData = datas;
      })
  }
  autocompleteFunctionalHeadScroll() {
    setTimeout(() => {
      if (
        this.matFHAutocomplete &&
        this.autocompleteTrigger &&
        this.matFHAutocomplete.panel
      ) {
        fromEvent(this.matFHAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payRollService.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empData = this.empData.concat(datas);
                    if (this.empData.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  public displayFnFunHead(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }
  get fn() {
    const formValue = this.yearlyForm.value;
    if (formValue && typeof formValue.get === 'function') {
      return formValue.get('emplName');
    } else {
      // console.error('Unable to retrieve form value or get method is missing.');
      return null;
    }
  }
  loadData() {
    if (this.adminUser) {
      if (!this.yearlyForm.value.emplName.id) {
        this.notification.showError('Please Select Employee Name')
      }
    }
    if (!this.yearlyForm.value.year) {
      this.notification.showError('Please Select Year')
    }
    else {
      this.SpinnerService.show();
      if (this.adminUser == true) {
        this.empId = this.yearlyForm.value.emplName.id;
      }
      else {
        this.empId = this.idEmployee
      }
      let yr = this.yearlyForm.value.year;
      this.payRollService.getYearlyPay(this.empId, yr).subscribe((results: MonthlyPayData) => {
        this.SpinnerService.hide();
        if (!results) {
          return false;
        }
        this.isDataPresent = true
        const data = results;
        const originalJSON = data
        const transformedJSON = this.transformJSON(originalJSON);
        this.personalData = results;
        this.personData = results.employee_personal_info.full_name;
        this.payrollDates = transformedJSON.pay_info_month.map(item => item.payroll_date);
        this.monthlyPayData = transformedJSON.pay_info_month.map(item => item.Employeemonthlypay_details_data);
        const payComponent = transformedJSON.paycomponent;
        let total = 0;
        this.dataSource = new MatTableDataSource<any>();
        this.dataSource = new MatTableDataSource(transformedJSON.pay_info_month);
        this.dataSource = payComponent.map(component => {
          const row: any = {
            item: component,
          };
          //Adding data to the table using dates
          this.payrollDates.forEach((date, index) => {
            const monthlyPay = this.monthlyPayData[index];
            const payData = monthlyPay.find(pay => pay.paycomponent === component);
            row[date] = payData ? payData.amount : '';
            if (payData) {
              row.total = (row.total || 0) + Number(payData.amount);
            }
          });
          //taking the last four values to get NetPay, Total Deduction, Total Earnings. Days
          this.lastFourTotals.push(row.total)
          if (this.lastFourTotals.length > 4) {
            this.lastFourTotals.shift();
          }
          return row;
        });
        this.displayedColumns = ['item', ...this.payrollDates, 'total'];
        this.startIncrementLoop();
        this.currentValue = 0;
        this.startIncrementLoops();
        this.currentValues = 0;
        this.startIncrementLoopE();
        this.currentVal = 0;
        this.startIncrementLoopD();
        this.currentVals = 0;
      });
    }

  }
  empsearchbyname() {
    this.payRollService.getFunctionalHead(this.yearlyForm.value?.emplName.yearlyForm?.full_name, this.currentpage + 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.empData = this.empData.concat(datas);
        if (this.empData.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })

  }
  downloadData() {
    if (this.adminUser) {
      this.empId = this.yearlyForm.value.emplName.id;
      this.empName = this.yearlyForm.value.emplName.full_name;
    }
    else {
      this.empId = this.idEmployee

      this.empName = this.EmployeeFullName
    }
    let yr = this.yearlyForm.value.year;
    this.payRollService.downloadYearlyData(this.empId, yr).subscribe(results => {
      let newdate = new Date();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.empName + yr + "Data" + ".xlsx";
      link.click();
    })
  }
  transformJSON(json: any): any {
    const payInfoMonth = json.pay_info_month;
    for (const month of payInfoMonth) {
      const detailsData = month.Employeemonthlypay_details_data;
      if (detailsData.length > 0) {
        const netPay = month.NetPay || "";
        const paidDays = month.PaidDays || "";
        const totalDeduction = month.TotalDeduct || "";
        const totalEarning = month.TotalEarning || "";
        detailsData.push(
          {
            amount: netPay,
            id: "",
            paycomponent: "NetPay"
          },
          {
            amount: paidDays,
            id: "",
            paycomponent: "PaidDays"
          },
          {
            amount: totalDeduction,
            id: "",
            paycomponent: "TotalDeduct"
          },
          {
            amount: totalEarning,
            id: "",
            paycomponent: "TotalEarning"
          }
        );
      }
    }
    const existingPayComponents = json.paycomponent;
    if (existingPayComponents.length > 0) {
      json.paycomponent = [...existingPayComponents];
    }
    else {
      this.isDataPresent = false;
      this.notification.showWarning("No Data Available for the Employee")
    }
    return json;
  }
  startIncrementLoop() {
    this.clearIncrementLoop();
    const targetValue = this.lastFourTotals[2];
    const incrementStep = 500;
    this.intervalId = setInterval(() => {
      this.currentValue += incrementStep;
      if (this.currentValue > targetValue) {
        this.currentValue = targetValue;
        this.clearIncrementLoop();
      }

    }, 10);
  }

  clearIncrementLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;

    }
  }

  startIncrementLoops() {
    this.clearIncrementLoops();
    const targetValues = this.lastFourTotals[3];
    const incrementSteps = 1;
    this.intervalIds = setInterval(() => {
      this.currentValues += incrementSteps;
      if (this.currentValues > targetValues) {
        this.currentValues = targetValues;
        this.clearIncrementLoops();
      }

    }, 10);
  }

  clearIncrementLoops() {
    if (this.intervalIds) {
      clearInterval(this.intervalIds);
      this.intervalIds = null;

    }
  }


  startIncrementLoopE() {
    this.clearIncrementLoopE();
    const targetVal = this.lastFourTotals[1];
    const incrementStepE = 500;
    this.intervalsId = setInterval(() => {
      this.currentVal += incrementStepE;
      if (this.currentVal > targetVal) {
        this.currentVal = targetVal;
        this.clearIncrementLoopE();
      }

    }, 10);
  }

  clearIncrementLoopE() {
    if (this.intervalsId) {
      clearInterval(this.intervalsId);
      this.intervalsId = null;

    }
  }

  startIncrementLoopD() {
    this.clearIncrementLoopD();
    const targetVals = this.lastFourTotals[0];
    const incrementStepD = 500;
    this.intervalsIds = setInterval(() => {
      this.currentVals += incrementStepD;
      if (this.currentVals > targetVals) {
        this.currentVals = targetVals;
        this.clearIncrementLoopD();
      }

    }, 10);
  }

  clearIncrementLoopD() {
    if (this.intervalsIds) {
      clearInterval(this.intervalsIds);
      this.intervalsIds = null;

    }
  }
  downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    // var html = htmlToPdfmake(pdfTable.innerHTML);
    // const documentDefinition = { content: html };
    // pdfMake.createPdf(documentDefinition).download();

  }
  generatePDF() {
    const htmlId = 'tabledata';
    const filename = 'yearlysummary';
    this.pdfGeneratorService.generatePDFFromHTMLById(htmlId, filename);
  }
  clearForm() {
    this.isDataPresent = false
    this.yearlyForm.reset();
  }

  downloadPDF() {
    if (this.adminUser) {
      if (!this.yearlyForm.value.emplName.id) {
        this.notification.showError('Please Select Employee Name')
      }
    }
    if (!this.yearlyForm.value.year) {
      this.notification.showError('Please Select Year')
    }
    else {
      if (this.adminUser) {
        this.empId = this.yearlyForm.value.emplName.id;
        this.empName = this.yearlyForm.value.emplName.full_name;
      }
      else {
        this.empId = this.idEmployee
        this.empName = this.EmployeeFullName
      }
      let yr = this.yearlyForm.value.year;
      this.payRollService.downloadYearlyDataPdf(this.empId, yr).subscribe(results => {
        let newdate = new Date();
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = this.empName + yr + "Data" + ".pdf";
        link.click();
      })
    }

  }
  downloadDatapdf() {
    if (this.adminUser) {
      this.empId = this.yearlyForm.value.emplName.id;
      this.empName = this.yearlyForm.value.emplName.full_name;
    }
    else {
      this.empId = this.idEmployee

      this.empName = this.EmployeeFullName
    }
    let yr = this.yearlyForm.value.year;
    this.payRollService.downloadYearlyDataPdf(this.empId, yr).subscribe(results => {
      let newdate = new Date();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.empName + yr + "Data" + ".xlsx";
      link.click();
    })
  }


}
