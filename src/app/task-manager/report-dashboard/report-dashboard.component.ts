import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MatDatepicker } from '@angular/material/datepicker/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
// import moment, { Moment } from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { TaskManagerService } from '../task-manager.service';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss']
})
export class ReportDashboardComponent implements OnInit {
  MonthValue: string;
  MonthDate=[]
  summaryData: any[];

  constructor(private service:TaskManagerService) { }
  monyear = new FormControl(moment())
  Month=[{key:'Jan',Value:1},{key:'Feb',Value:2},{key:'Mar',Value:3},{key:'Apr',Value:4},{key:'May',Value:5},{key:'June',Value:6},{key:'July',Value:7},{key:'Aug',Value:8},{key:'Sep',Value:9},{key:'Oct',Value:10},{key:'Nov',Value:11},{key:'Dec',Value:12}]
  ngOnInit(): void {
    const currentDate=new Date()
    const momentDate = moment(currentDate);
    this.monyear.setValue(momentDate)
    function getDaysInMonth(month: number, year: number): number {
      // Months are 0-indexed in JavaScript Date objects, so we need to subtract 1 from the month
      return new Date(year, month, 0).getDate();
  }
  this.Summary('')
  
  // Get the current date
  // const currentDate = new Date();
  
  // Extract the current month and year
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 to convert from 0-indexed to 1-indexed
  const currentYear = currentDate.getFullYear();
  console.log('currentMonth:',currentMonth)
  
  // Get the number of days in the current month
  const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
  
  console.log(`There are ${daysInCurrentMonth} days in the current month.`);
  for(let j=0;j<this.Month.length;j++){
    if(this.Month[j].Value===currentMonth){
      this.MonthValue=this.Month[j].key
    }
  }
  for(let i=1;i<=daysInCurrentMonth;i++){
 
    console.log('data',this.MonthValue+' '+i)
    this.MonthDate.push(this.MonthValue+' '+i)

  }
  
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

  }
  Summary(data){
    this.service.ReportDashboard('','','','',1,'','','').subscribe(result=>{
      this.summaryData=result['data']
    })
  }

}
