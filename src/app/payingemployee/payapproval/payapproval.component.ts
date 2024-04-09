import { Component, OnInit, ViewChild, ViewEncapsulation, Directive } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Payreview } from '../models/payreview';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Payspecial } from '../models/payspecial';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface Employee {
  employee_id: number;
  payroll_date: string;
  amount: number;
  bonus: number;
  year: number | string;
  month: number | string;
  headings: string;
  id: number | null;
  full_name: string | null;
  code: string | null;
  employee_branch__code: string | null;
  employee_branch__name: string | null;
  doj: number | null;
}

interface GroupedEmployee {
  [heading: string]: Employee;
}

export interface FunctionHead {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-payapproval',
  templateUrl: './payapproval.component.html',
  styleUrls: ['./payapproval.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  // encapsulation: ViewEncapsulation.None,


})
export class PayapprovalComponent implements OnInit {
  years: number[] = [];
  date = new FormControl(moment());
  currMonShow: string;
  prevMonShow: string;
  oldMonShow: string;
  isShowStd: boolean = true;
  splAllowance: boolean = false;
  functionalHeadList: any;
  isLoading: boolean;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  constructor(private fb: FormBuilder, private apiservice: PayingempService, private notification: NotificationService,
    private datePipe: DatePipe) {
    // let currenYear = new Date().getFullYear();
    // let currYear = new Date().getFullYear();
    // let startYear = currYear - 25;
    // for (let year = startYear; year <= currYear + 15; year++) {
    //   this.years.push(year);
    // }

  }
  summarylist: [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }

  displayedColumns = ['select', 'empcode', 'name', 'doj', 'businesssegment', 'costcentre', 'stdtakeHomeWOBonus', 'stdMonthBonus', 'stdTakeHome', 'currLOPdays', 'curradvDeduct', 'currtakeHomeWOBonus', 'currMonthBonus', 'currTakeHome', 'prevLOPdays', 'prevadvDeduct', 'prevtakeHomeWOBonus', 'prevMonthBonus', 'prevTakeHome', 'oldLOPdays', 'oldadvDeduct', 'oldtakeHomeWOBonus', 'oldMonthBonus', 'oldTakeHome']
  displayedColumnsSpl = ['select', 'empcode', 'name', 'doj', 'businesssegment', 'costcentre', 'Amount', 'prevAmount', 'oldAmount', 'prevMonthBonus']
  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
  dataObj: any;
  public dataArray: any;
  public dataSource: MatTableDataSource<Payreview>;
  public dataSourceSpl: MatTableDataSource<Payspecial>;
  selection = new SelectionModel<Payreview>(true, []);
  selections = new SelectionModel<Payspecial>(true, []);
  @ViewChild('sortCol1') sortCol1 = new MatSort();
  @ViewChild('pageCol1') pageCol1: MatPaginator;
  isCheckboxChecked: boolean = false;
  isAllCheckboxCheck: boolean = false;
  draftsList = [];
  selectAllId = [];
  showButtons: boolean = false;
  currMonth: any;
  prevMonth: any;
  oldMonth: any;
  dataFilter = [{ key: 'Consistent', value: '1' }, { key: 'Inconsistent', value: 2 }]

  showStandard = false;
  showCurrent = true;
  showPrevious = true;
  showOlder = true;
  groupedData: any;
  searchform: FormGroup;
  send_value: String = "";
  selectedMonth: number;
  selectedYear: number;
  isShowTable: boolean = false;
  showFilter: boolean = false;
  showRecords: boolean = false;
  droplist: [];
  checkedRows: number[] = [];
  checkedTableRows = [];
  monthlySelect = [];
  removeId: any;
  bslist: [];
  cclist: [];
  specialform: FormGroup;
  isShowTableSpl: boolean = false;
  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild('fnInput') fnInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;



  ngOnInit(): void {

    const currDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = currDate.getDate();
    const month = months[currDate.getMonth() - 0];
    const prevmonth = months[currDate.getMonth() - 1]
    const oldmonth = months[currDate.getMonth() - 2]
    const year = currDate.getFullYear();
    this.searchform = this.fb.group({
      filter: '',
      month: '',
      year: '',
      status: '',
      bs: '',
      cc: '',
      monthyear: [moment()],
      employee:'', 
      functional_head:''
    })
    this.specialform = this.fb.group({
      filter: '',
      month: '',
      year: '',
      status: '',
      bs: '',
      cc: '',
      monthyear: [moment()],
    })


    this.searchform.get('month').valueChanges.subscribe((value: number) => {
      this.selectedMonth = value;
      this.updateMonths();
    });

    this.searchform.get('year').valueChanges.subscribe((value: number) => {
      this.selectedYear = value;
      this.updateMonths();
    });
    this.getDropDown();
    this.getbSDropDown();
    this.getCCDropDown();
  }

  getDropDown() {
    this.apiservice.getStatus()
      .subscribe((results: any) => {
        this.droplist = results['data'];
      })
  }

  getbSDropDown() {
    this.apiservice.getdropdownSegments()
      .subscribe((results: any) => {
        this.bslist = results['data'];
      })
  }
  getCCDropDown() {
    this.apiservice.getdropdownCC()
      .subscribe((results: any) => {
        this.cclist = results['data'];
      })
  }

  searchData() {
    if(this.searchform.get('monthyear').value == '' || this.searchform.get('monthyear').value == null || this.searchform.get('monthyear').value == undefined || this.searchform.get('monthyear').value == 'None' )
    {
      this.notification.showError("Please Select Month and Year to Proceed");
      return false;
    }
    if (this.splAllowance == false) {
      const selectedMonthYear = this.monyear.value; // Assuming this contains the selected month and year
      const selectedDate = new Date(selectedMonthYear.toDate());
      const prevMonthDate = new Date(selectedDate);
      prevMonthDate.setMonth(selectedDate.getMonth() - 1);
      const oldMonthDate = new Date(selectedDate);
      oldMonthDate.setMonth(selectedDate.getMonth() - 2);
      this.currMonShow = this.datePipe.transform(selectedDate, 'MMMM');
      this.prevMonShow = this.datePipe.transform(prevMonthDate, 'MMMM');
      this.oldMonShow = this.datePipe.transform(oldMonthDate, 'MMMM');

      this.isCheckboxChecked = false;
      let formValue = this.searchform.value;
      let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
      let splitdata = monthyeardata.split('-')
      let month = splitdata[1]
      let year = splitdata[0]
      this.send_value = ""
      if (month) {
        this.send_value = this.send_value + '&month=' + month
      }
      if (year) {
        this.send_value = this.send_value + '&year=' + year
      }
      if (formValue.filter) {
        this.send_value = this.send_value + '&query=' + formValue.filter
      }
      if (formValue.status) {
        this.send_value = this.send_value + '&paystatus=' + formValue.status
      }
      if (formValue.bs) {
        this.send_value = this.send_value + '&emp_bs=' + formValue.bs
      }
      if (formValue.cc) {
        this.send_value = this.send_value + '&emp_cc=' + formValue.cc
      }
      if (formValue.functional_head) {
        this.send_value = this.send_value + '&employee=' + formValue.functional_head.id
      }
      let page = 1;
      this.apiservice.getReviewSummary(this.send_value, this.pagination.index).subscribe(results => {
        if (!results) {
          return false;
        }
        if (results['data'] && results['data'].length === 0) {
          // this.notification.showWarning("No Data Available for the selected Month and Year")
          this.isShowTable = false;
          this.showButtons = false;
          this.showRecords = true;
          this.isShowStd = false;
          this.isShowTableSpl = false;
          this.showFilter = true;
        }
        else {
          this.summarylist = results['data'];
          this.groupedData = this.groupAndSortByEmployeeId(this.summarylist);
          this.apiservice.getDrafts(this.send_value, this.pagination.index).subscribe(res => {
            this.draftsList = res['data'];

          })
          this.dataSource = new MatTableDataSource<any>(this.groupedData);
          this.dataArray = this.groupedData;
          this.dataSource.sort = this.sortCol1;
          this.dataSource.paginator = this.pageCol1;
          this.pagination = results.pagination ? results.pagination : this.pagination;
          this.isShowTable = true;
          this.showButtons = true;
          this.showFilter = true
          this.showRecords = false
          this.isShowStd = false;
          this.isShowTableSpl = false;

        }
      })

    }
    else {
      const selectedMonthYears = this.monyear.value; // Assuming this contains the selected month and year
      const selectedDates = new Date(selectedMonthYears.toDate());
      const prevMonthDate = new Date(selectedDates);
      prevMonthDate.setMonth(selectedDates.getMonth() - 1);
      const oldMonthDate = new Date(selectedDates);
      oldMonthDate.setMonth(selectedDates.getMonth() - 2);
      this.currMonShow = this.datePipe.transform(selectedDates, 'MMMM');
      this.prevMonShow = this.datePipe.transform(prevMonthDate, 'MMMM');
      this.oldMonShow = this.datePipe.transform(oldMonthDate, 'MMMM');

      this.isCheckboxChecked = false;
      let formValue = this.searchform.value;
      let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
      let splitdata = monthyeardata.split('-')
      let month = splitdata[1]
      let year = splitdata[0]
      this.send_value = ""
      if (month) {
        this.send_value = this.send_value + '&month=' + month
      }
      if (year) {
        this.send_value = this.send_value + '&year=' + year
      }
      if (formValue.filter) {
        this.send_value = this.send_value + '&query=' + formValue.filter
      }
      if (formValue.status) {
        this.send_value = this.send_value + '&paystatus=' + formValue.status
      }
      if (formValue.bs) {
        this.send_value = this.send_value + '&emp_bs=' + formValue.bs
      }
      if (formValue.cc) {
        this.send_value = this.send_value + '&emp_cc=' + formValue.cc
      }
      let page = 1;
      this.apiservice.getReviewSummarySpl(this.send_value, this.pagination.index).subscribe(results => {
        if (!results) {
          return false;
        }
        if (results['data'] && results['data'].length === 0) {
          // this.notification.showWarning("No Data Available for the selected Month and Year")
          this.isShowTable = false;
          this.showButtons = false;
          this.showRecords = true;
          this.isShowStd = false;
          this.isShowTableSpl = false;
          this.showFilter = true;

        }
        else {
          this.summarylist = results['data'];
          this.groupedData = this.groupAndSortByEmployeeIds(this.summarylist);
          this.apiservice.getDrafts(this.send_value, this.pagination.index).subscribe(res => {
            this.draftsList = res['data'];

          })
          this.dataSourceSpl = new MatTableDataSource<any>(this.groupedData);
          this.dataArray = this.groupedData;
          this.dataSourceSpl.sort = this.sortCol1;
          this.dataSourceSpl.paginator = this.pageCol1;
          this.pagination = results.pagination ? results.pagination : this.pagination;
          this.isShowTable = false;
          this.showButtons = true;
          this.showFilter = true
          this.showRecords = false
          this.isShowStd = false;
          this.isShowTableSpl = true;
        }
      })

    }

  }

  applyFilter(filterValue) {

  }
  filterGroupedData(groupedData: any[], draftsList: number[]): any[] {
    return groupedData.map(group => {
      return group.filter(item => draftsList.includes(item.id));
    }).filter(group => group.length > 0);
  }

  applyFilters(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValues.toLowerCase();
  }


  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }



  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  selectedRow(row) {

    // this.selection.selected.forEach(
    //   s => console.log("Selected Row", s.id)
    // )

  }

  groupAndSortByEmployeeId(data: Employee[]): Employee[][] {
    const employeeMap = new Map<number, Employee[]>();
    data.forEach((employee) => {
      const employeeId = employee.employee_id;
      if (employeeMap.has(employeeId)) {
        employeeMap.get(employeeId)!.push(employee);
      } else {
        employeeMap.set(employeeId, [employee]);
      }
    });
    const sortedGroups = Array.from(employeeMap.values()).map((employees) =>
      employees.sort((a, b) => a.payroll_date.localeCompare(b.payroll_date))
    );

    return sortedGroups;
  }

  compareTakeHomeValues(prevValue: number, currValue: number): boolean {
    return prevValue !== currValue;
  }
  getUniqueEmployeeIds(groupedData: any[]): number[] {
    const uniqueEmployeeIds: number[] = [];

    groupedData.forEach((group) => {
      group.forEach((entry) => {
        if (entry && entry.employee_id && !uniqueEmployeeIds.includes(entry.employee_id)) {
          uniqueEmployeeIds.push(entry.employee_id);
        }
      });
    });

    return uniqueEmployeeIds;
  }


  approvePay() {
    if (this.isAllCheckboxCheck == true) {

      let allSelect = this.draftsList;
      let payload = {
        "id": allSelect,
        "pay_status": 1
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Approved All");
          this.searchData();
         
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })

    }
    else {
      let payload = {
        "id": this.monthlySelect,
        "pay_status": 1
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Approved");
          this.searchData();
          this.monthlySelect = [];
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })
    }
  }

  holdPay() {
    if (this.isAllCheckboxCheck == true) {

      let allSelect = this.draftsList;
      let payload = {
        "id": allSelect,
        "pay_status": 4
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Updated All")
          this.searchData();
     
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })

    }
    else {
      let payload = {
        "id": this.monthlySelect,
        "pay_status": 4
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Updated")
          this.searchData();
          this.monthlySelect = [];
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })
    }
  }
  rejectPay() {
    if (this.isAllCheckboxCheck == true) {

      let allSelect = this.draftsList;
      let payload = {
        "id": allSelect,
        "pay_status": 3
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Updated All")
          this.searchData();
        
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })

    }
    else {
      let payload = {
        "id": this.monthlySelect,
        "pay_status": 3
      }
      this.apiservice.changePayStatus(payload).subscribe(result => {
        if (result.status == 'success') {
          this.notification.showSuccess("Successfully Rejected")
          this.searchData();
          this.monthlySelect = [];
        } else {
          this.notification.showError(result.description)
          return false;
        }
      })
    }
  }
  downloadData() {
    if(this.searchform.get('monthyear').value == '' || this.searchform.get('monthyear').value == null || this.searchform.get('monthyear').value == undefined || this.searchform.get('monthyear').value == 'None' )
    {
      this.notification.showError("Please Select Month and Year to Proceed");
      return false;
    }
    let formValue = this.searchform.value;
    let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
    let splitdata = monthyeardata.split('-')
    let month = splitdata[1]
    let year = splitdata[0]
    this.send_value = ""

    if (month) {
      this.send_value = this.send_value + '&month=' + month
    }
    if (year) {
      this.send_value = this.send_value + '&year=' + year
    }
    if (formValue.filter) {
      this.send_value = this.send_value + '&query=' + formValue.filter
    }
    if (formValue.status) {
      this.send_value = this.send_value + '&paystatus=' + formValue.status
    }
    let page = 1;


    this.apiservice.downloadPayReview(this.send_value, this.pagination.index).subscribe(results => {
      let newdate = new Date();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "PayReviewData" + ".xlsx";
      link.click();
    })
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.searchData();

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchData();
  }
  page() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    else if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    else {
      this.pagination.index
    }
    this.searchData();

  }

  updateMonths() {
    this.showButtons = false;
    this.isShowTable = false;
    if (this.selectedMonth && this.selectedYear) {
      const currDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
      const prevDate = new Date(currDate);
      prevDate.setMonth(currDate.getMonth() - 1);
      const oldDate = new Date(currDate);
      oldDate.setMonth(currDate.getMonth() - 2);

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      this.currMonth = `${monthNames[currDate.getMonth()]} ${this.selectedYear}`;
      this.prevMonth = `${monthNames[prevDate.getMonth()]} ${prevDate.getFullYear()}`;
      this.oldMonth = `${monthNames[oldDate.getMonth()]} ${oldDate.getFullYear()}`;
    }
  }
  onCheckboxChange(event: any) {
    if (event.checked) {
      this.isCheckboxChecked = true;
    } else {
      this.isCheckboxChecked = false;
    }
  }
  resetForm() {
    this.searchform.get('filter').reset();
    this.searchform.get('status').reset();
    this.searchform.get('bs').reset();
    this.searchform.get('cc').reset();
    this.searchform.get('functional_head').reset();
    this.searchData()
  }

  checkboxChanged(event: any, row: any) {
    if (event.checked) {
      this.selection.select(row);
    } else {
      this.selection.deselect(row);
      this.removeValueFromArray(row[0].id)

    }
  }
  removeValueFromArray(removeId: number): void {
    const index = this.draftsList.indexOf(removeId);
    if (index !== -1) {
      this.draftsList.splice(index, 1);
    } else {
    }
  }
  onMasterCheckboxClick(event: any) {
    if (event.target.checked) {
      this.isAllCheckboxCheck = true;
    }
    else {
      this.isAllCheckboxCheck = false;
    }
  }

  onSingleChecked(event: any, row) {
    if (event.target.checked) {
      this.checkedTableRows.push(row[0].id)
      for (let i = 0; i < row.length; i++) {
        if (row[i].headings === 'Current Month') {
          this.monthlySelect.push(row[i].empmonthly_payid)
        }
      }
    }
    else {
      const index = this.checkedTableRows.indexOf(row[0].id)
      if (index !== -1) {
        this.checkedTableRows.splice(index, 1);
      }
      for (let i = 0; i < row.length; i++) {
        if (row[i].headings === 'Current Month') {
          this.removeId = row[i].empmonthly_payid;
        }
      }
      const indexs = this.monthlySelect.indexOf(this.removeId)
      if (indexs !== -1) {
        this.monthlySelect.splice(indexs, 1);
      }
    }

  }


  monyear = new FormControl(moment())
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monyear.value;
    ctrlValue.year(normalizedYear.year());
    this.monyear.setValue(ctrlValue);


  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monyear.value;
    ctrlValue.month(normalizedMonth.month());
    this.monyear.setValue(ctrlValue);
    datepicker.close();
    this.searchform.patchValue({
      monthyear: this.monyear.value
    })

  }
  openSpecialAllowance() {

  }

  monyears = new FormControl(moment())
  chosenYearHandlers(normalizedYear: Moment) {
    const ctrlValue = this.monyears.value;
    ctrlValue.year(normalizedYear.year());
    this.monyears.setValue(ctrlValue);


  }
  chosenMonthHandlers(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monyears.value;
    ctrlValue.month(normalizedMonth.month());
    this.monyears.setValue(ctrlValue);
    datepicker.close();
    this.specialform.patchValue({
      monthyear: this.monyears.value
    })
  }

  searchSplData() {

  }
  downloadSplData() { }


  prevpages() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.searchSplData();

  }
  nextpages() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchSplData();
  }
  onToggle(evt: any) {
    // console.log("event Checkec or NOTTT", evt.checked)
    if (evt.checked == true) {
      this.splAllowance = true;
    }
    else {
      this.splAllowance = false;
    }
  }

  groupAndSortByEmployeeIds(data: Employee[]): Employee[][] {
    const employeeMap = new Map<number, Employee[]>();
    data.forEach((employee) => {
      const employeeId = employee.employee_id;
      if (employeeMap.has(employeeId)) {
        employeeMap.get(employeeId)!.push(employee);
      } else {
        employeeMap.set(employeeId, [employee]);
      }
    });
    const sortedGroups = Array.from(employeeMap.values()).map((employees) =>
      employees.sort((a, b) => a.payroll_date.localeCompare(b.payroll_date))
    );

    return sortedGroups;
  }

  functionalHead() {
    let gstkeyvalue: String = "";

    this.getFunctional(gstkeyvalue);

    this.searchform.get('functional_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.apiservice.getFunctionalHead(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),

          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;

      })
  }

  private getFunctional(gstkeyvalue) {
    this.apiservice.getFunctionalHead(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;
      })
  }

  public displayFnFunHead(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }

  get fn() {
    return this.searchform.value.get('functional_head');
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
                this.apiservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
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

  validation(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }

  employeecomponent_search(value) {
    this.apiservice.getFunctionalHead(value, 1).subscribe(data => {
      this.functionalHeadList = data['data'];
    });
  }
  // groupAndSortByEmployeeIds(data: Employee[]): Employee[][] {
  //   const employeeMap = new Map<number, Employee[]>();
  //   const bonusRecords: { amount: number, payroll_date: string }[] = [];
  
  //   data.forEach((employee) => {
  //     const employeeId = employee.employee_id;
  
  //     // Check if the employee has the specified heading
  //     if (employee.headings === "previous bonus record") {
  //       // Extract amount and payroll_date and store in bonusRecords array
  //       bonusRecords.push({
  //         amount: employee.amount,
  //         payroll_date: employee.payroll_date
  //       });
  //     }
      
  
  //     if (employeeMap.has(employeeId)) {
  //       employeeMap.get(employeeId)!.push(employee);
  //     } else {
  //       employeeMap.set(employeeId, [employee]);
  //     }
  //   });
  
  //   const sortedGroups = Array.from(employeeMap.values()).map((employees) =>
  //     employees.sort((a, b) => a.payroll_date.localeCompare(b.payroll_date))
  //   );
  
    // Do something with bonusRecords if needed
  
  //   return sortedGroups;
  // }
  

}


export const DATE_FORMAT_2 = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Directive({
  selector: '[dateFormat2]',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2 },
  ],
})
export class FullCustomDateFormat2 { }