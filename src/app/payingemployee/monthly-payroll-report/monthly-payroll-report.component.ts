import { Component, OnInit,Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
// import moment from 'moment';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { DatePipe } from '@angular/common';
import { PayingempService } from '../payingemp.service';

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


const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-monthly-payroll-report',
  templateUrl: './monthly-payroll-report.component.html',
  styleUrls: ['./monthly-payroll-report.component.scss'],
  providers:[
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps:[MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS,useValue: MY_FORMATS}
  ],
})

export class MonthlyPayrollReportComponent implements OnInit {
  constructor(private router:Router,private datepipe:DatePipe,private service:PayingempService) { }
  monyear = new FormControl(moment())


  ngOnInit(): void {
  }
  startDate = new Date(1990, 0, 1);
  DateFormgroup=new FormGroup({
    DatePicker:new FormControl('')
  })
  datepickerdata=[]
  data=[
    {name:'subash',age:20,Place:'London',Pincode:612662},
    {name:'ramesh',age:22,Place:'America',Pincode:612663},
    {name:'aravinth',age:20,Place:'India',Pincode:612632},
    {name:'ravi',age:25,Place:'antartica',Pincode:612662},
  ]
  Previous(){
    this.router.navigate(['/payingemployee/empnav'])
  }
  search(){
    console.log('datepicker',this.datepipe.transform(this.monyear.value.toDate(),'yyyy-MM'))
     let Date=this.datepipe.transform(this.monyear.value.toDate(),'yyyy-MM')
    let splitData=Date.split('-')
    let Month=splitData[1]
    let Year=splitData[0]
    console.log('Month',Month)
    console.log("Year",Year)
    this.service.DatePicker(Month,Year).subscribe(result=>{
      this.datepickerdata=result['data']
      console.log('Data',this.data)
    })
  }
  
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
    // this.searchform.patchValue({
    //   monthyear: this.monyear.value
    // })
   
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
