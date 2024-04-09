import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';
// import { Paytable } from '../models/paytable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { CurrencyFormatPipe } from '../currency-format.pipe';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { DatePipe } from '@angular/common';

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

@Component({
  selector: 'app-paysummary',
  templateUrl: './paysummary.component.html',
  styleUrls: ['./paysummary.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})

export class PaysummaryComponent implements OnInit {
  years: number[] = [];
  enabledownbtn: boolean;
  constructor(private fb: FormBuilder, private apiservice: PayingempService, private notification: NotificationService, private datePipe: DatePipe, private SpinnerService: NgxSpinnerService) {
    let currenYear = new Date().getFullYear();
    let currYear = new Date().getFullYear();
    let startYear = currYear - 25;
    for (let year = startYear; year <= currYear + 15; year++) {
      this.years.push(year);
    }
  }
  summarylist: [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  searchform: FormGroup;
  send_value: String = "";

  columnNames: any;
  // displayedColumns: string[] = ['employee_id_y', 'full_name', 'doj', 'Basic&Da', 'Conveyance', 'LTA', 'MEDICAL', 'Telephone', 'Test Data', 'Dearness', 'House_Rent', 'Special', 'Annual_bonus_paid_Monthly', 'Others', 'PF', 'payable_days', 'paid_days', 'gross_pay', 'take_home', 'standard_ctc'];
  displayedColumns: string[] = [];
  public dataArray: any;
  public dataSource: MatTableDataSource<any>;
  @ViewChild('sortCol1') sortCol1 = new MatSort();
  @ViewChild('pageCol1') pageCol1: MatPaginator;
  takeHome: any;
  stdCTC: any;
  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
  isShowTable: boolean = false;

  ngOnInit(): void {

    // this.getPaySummary();
    this.searchform = this.fb.group({

      month: '',
      year: '',
      monthyear: [moment()],
    })
    this.searchform.get('month').valueChanges.subscribe((value: number) => {

      this.isShowTable = false;
    });
    this.searchform.get('year').valueChanges.subscribe((value: number) => {

      this.isShowTable = false;
    });

  }

  getPaySummary() {
    this.SpinnerService.show();
    this.apiservice.getPaystmtSummary(this.pagination.index).subscribe(results => {
      this.SpinnerService.hide();
      if (!results) {
        return false;
      }
      let apiDataArray = results['data'];
      // let apiData = apiDataArray.map(data => {

      //   return data[0];
      // });
      // let apiData = results['data'];
      let apiData = apiDataArray.flat();
      // this.displayedColumns = ["employee_id", "full_name","doj", ...Object.keys(apiData[0]).filter(col => col !== "employee_id" && col !== "full_name"  && col !== "doj")];
      this.displayedColumns = Object.keys(apiData[0]);

      apiData.forEach(item => {
        // item.doj = this.datePipe.transform(item?.doj, 'dd-MMM-yyyy');
        if (item.doj !== 'None') {
          item.doj = this.datePipe.transform(item.doj, 'dd-MMM-yyyy');
      } else {
        
          item.doj = null; 
      }
  
      });


      this.dataSource = new MatTableDataSource(apiData);
      this.dataArray = apiData;


      // this.summarylist = results['data'];
      // this.dataArray = results['data'];
      // this.dataSource = new MatTableDataSource<Paytable>(this.dataArray);
      this.dataSource.sort = this.sortCol1;
      this.dataSource.paginator = this.pageCol1;
      this.pagination = results.pagination ? results.pagination : this.pagination;
      // let amt = this.summarylist;
    },
    error=>{
      this.SpinnerService.hide()
    })
  }

  prevpage() {
    if (this.send_value == null || this.send_value == '') {
      if (this.pagination.has_previous) {
        this.pagination.index = this.pagination.index - 1
      }
      this.getPaySummary();
    }
    else {
      if (this.pagination.has_previous) {
        this.pagination.index = this.pagination.index - 1
      }
      this.searchData();
    }
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchData();
  }
  getBasicAndDAValue(summary: any): string {
    return summary['Basic&Da'];
  }

  downloadPayData() {
    if (this.searchform.get('monthyear').value == '' || this.searchform.get('monthyear').value == null || this.searchform.get('monthyear').value == undefined || this.searchform.get('monthyear').value == 'None') {
      this.notification.showError("Please Select Month and Year to Proceed");
      return false;
    }
    this.enabledownbtn = true;
   
    let formValue = this.searchform.value;
    let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
    let splitdata = monthyeardata.split('-')
    // console.log("Spilt Data",splitdata)
    let month = splitdata[1]
    let year = splitdata[0]
    this.send_value = ""

    if (month) {
      this.send_value = this.send_value + '&month=' + month
    }
    if (year) {
      this.send_value = this.send_value + '&year=' + year
    }
    let page = 1;

    this.apiservice.downloadPaySummary(this.pagination.index, this.send_value).subscribe(results => {
      let newdate = new Date();
      let binaryData = [];
      binaryData.push(results)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "Salary Statement for the Month" + ".xlsx";
      link.click();
      this.enabledownbtn = false;
      
    })
    
  }
  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  applyFilter(event: Event) {
    const filterValues = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValues.trim().toLowerCase();
  }

  searchData() {
    if (this.searchform.get('monthyear').value == '' || this.searchform.get('monthyear').value == null || this.searchform.get('monthyear').value == undefined || this.searchform.get('monthyear').value == 'None') {
      this.notification.showError("Please Select Month and Year to Proceed");
      return false;
    }
    let formValue = this.searchform.value;
    let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
    let splitdata = monthyeardata.split('-')
    // console.log("Spilt Data",splitdata)
    let month = splitdata[1]
    let year = splitdata[0]
    // console.log("Month",splitdata[1])
    // console.log("Year",splitdata[0])
    this.send_value = ""

    if (month) {
      this.send_value = this.send_value + '&month=' + month
    }
    if (year) {
      this.send_value = this.send_value + '&year=' + year
    }
    let page = 1;
    this.SpinnerService.show();
    this.apiservice.getPaystmtSummarySearch(this.pagination.index, this.send_value).subscribe(results => {
      this.SpinnerService.hide();
      if (!results) {
        return false;
      }
      // if (results['data'] && results['data'].length === 0) {
      //   this.notification.showWarning("No Data Available for the selected Month and Year")
      //   this.isShowTable = false;
      // }
      // else {
      //   this.isShowTable = true;
      //   let apiDataArray = results['data'];
      //   let apiData = apiDataArray.flat();
      //   // this.displayedColumns = Object.keys(apiData[0]);
      //   this.displayedColumns = [
      //     "Name",
      //     "Code",
      //     "PF Number",
      //     "ESI Number",
      //     "UAN",
      //     "doj",
      //     "Designation",
      //     "Bank A/C No.",
      //     "Std Basic",
      //     "Std HRA",       
      //     "Std Conveyance",
      //     "Std Medical",
      //     "Std LTA",
      //     "Std TELEPHONE",
      //     "Std OTHERS",
      //     "Std Annual Monthly Bonus",
      //     "Std Emp deductions  PF",
      //     "Std Emp deductions  ESI",
      //     "Std Emp deductions  nan",
      //     "Std CmpPF",
      //     "Std CmpESI",
      //     "Gross pay_std",
      //     "Std_NetSalary",
      //     "payable days",
      //     "paid days",  
      //     "Basic",
      //     "HRA",
      //     "Conveyance",
      //     "Medical",
      //     "LTA",
      //     "TELEPHONE",
      //     "OTHERS",
      //     "Annual Monthly Bonus",  
      //     "PF",  
      //     "ESI",   
      //     "Custom Deduction",
      //     "Cmpy contStd CmpPF", 
      //     "Cmpy contStd CmpESI", 
      //     "Gross pay",
      //     "NetSalary" 
        
       
      //   ]
      //   console.log("Displayed COLS", this.displayedColumns);
      //   apiData.forEach(item => {
      //     item.doj = this.datePipe.transform(item.doj, 'dd-MMM-yyyy');
      //   });
      //   this.dataSource = new MatTableDataSource(apiData);
      //   this.dataArray = apiData;
      //   this.dataSource.sort = this.sortCol1;
      //   this.dataSource.paginator = this.pageCol1;
      //   this.pagination = results.pagination ? results.pagination : this.pagination;
      // }
      if (results['data'] && results['data'].length === 0) {
        this.notification.showWarning("No Data Available for the selected Month and Year")
        this.isShowTable = false;
    } else {
        this.isShowTable = true;
        let apiDataArray = results['data'];
        let apiData = apiDataArray.flat();
    
        let allKeys : any = Array.from(new Set(apiData.flatMap(item => Object.keys(item))));   
        let staticColumns = [
            "Name",
            "Code",
            "PF Number",
            "ESI Number",
            "uan_number",
            "doj",
            "Designation",
            "Bank A/C No.",
            "Std Basic",
            "Std HRA",
            "Std Conveyance",
            "Std Medical",
            "Std LTA",
            "Std TELEPHONE",
            "Std OTHERS",
            "Std Annual Monthly Bonus",
            "Std Emp deductions  PF",
            "Std Emp deductions  ESI",
            "Std Emp deductions  nan",
            "Std CmpPF",
            "Std CmpESI",
            "Gross pay_std",
            "Std_NetSalary",
            "payable days",
            "paid days",
            "Basic",
            "HRA",
            "Conveyance",
            "Medical",
            "LTA",
            "TELEPHONE",
            "OTHERS",
            "Annual Monthly Bonus",
            "PF",
            "ESI",
            "Custom Deduction",
            "Cmpy contPF",
            "Cmpy contESI",
        
        ];
    

        this.displayedColumns = staticColumns.concat(allKeys.filter(key => !staticColumns.includes(key)));

        this.displayedColumns.push("Gross pay", "NetSalary");

        this.displayedColumns =  Array.from(new Set(this.displayedColumns));

        console.log("Displayed COLS", this.displayedColumns);
        apiData.forEach(item => {
            // item.doj = this.datePipe.transform(item?.doj, 'dd-MMM-yyyy');
            if (item.doj !== 'None') {
              item.doj = this.datePipe.transform(item.doj, 'dd-MMM-yyyy');
          } else {
             
              item.doj = null; 
          }
      
        });
        this.dataSource = new MatTableDataSource(apiData);
        this.dataArray = apiData;
        this.dataSource.sort = this.sortCol1;
        this.dataSource.paginator = this.pageCol1;
        this.pagination = results.pagination ? results.pagination : this.pagination;
    }
    

    },
    error=>{
      this.SpinnerService.hide()
    })

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
