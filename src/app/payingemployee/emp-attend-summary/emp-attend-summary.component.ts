import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-emp-attend-summary',
  templateUrl: './emp-attend-summary.component.html',
  styleUrls: ['./emp-attend-summary.component.scss']
})
export class EmpAttendSummaryComponent implements OnInit {
  tableData: any=[];
  send_value: string;

  constructor(private payingservice:PayingempService, private spinner:NgxSpinnerService) {
    
   }

  ngOnInit(): void {
    this.Yearfunction()
    // this.Summary(this.pagination.index)
  }
  years=[]
  AttendanceGroup=new FormGroup({
    Name:new FormControl(''),
    Month:new FormControl(''),
    Year:new FormControl('')
  })
  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  Yearfunction(){
    let currYear = new Date().getFullYear();
    let startYear = currYear - 14;
    for(let year=startYear; year <= currYear + 17; year++)
    {
      this.years.push(year);
      console.log(this.years)
    }
  }
  Summary(index){
    this.spinner.show();
    let month=this.AttendanceGroup.get('Month').value
   
    const name=this.AttendanceGroup.get('Name').value
    const year=this.AttendanceGroup.get('Year').value
    const formValue=this.AttendanceGroup.value
    this.send_value=''
    if(formValue.Name)
    {
        this.send_value = this.send_value+'&employee='+formValue.Name
    }
    if(formValue.Month)
    {
      this.send_value = this.send_value+'&month='+formValue.Month
    }
    if(formValue.Year)
    {
      this.send_value = this.send_value+'&year='+formValue.Year
    }
    
    this.payingservice.AttendanceSummary(this.send_value,index).subscribe(data=>{
      console.log('success',data)
      this.tableData=data['data']
      this.spinner.hide();
      // for(let i=0;i<this.options.length;i++){
      //   const s=this.options[i].value=this.tableData.month
      //   console.log('name',s)
      // }
      this.pagination={
        has_next:data.pagination.has_next,
        has_previous:data.pagination.has_previous,
        index:data.pagination.index
      }
      
  
    })
  }
  Search(){
    this.spinner.show();

    let month=this.AttendanceGroup.get('Month').value
    const name=this.AttendanceGroup.get('Name').value
    
    let year=this.AttendanceGroup.get('Year').value
    const formValue=this.AttendanceGroup.value
    if(formValue.Name)
    {
        this.send_value = this.send_value+'&employeename='+formValue['name']
    }
    if(formValue.Month)
    {
      this.send_value = this.send_value+'&month='+formValue['month']
    }
    if(formValue.Year)
    {
      this.send_value = this.send_value+'&year='+formValue['year']
    }
   
    this.payingservice.AttendanceSummary(this.send_value,this.pagination.index).subscribe(data=>{
      console.log('success',data)
      this.tableData=data['data']
      this.spinner.hide();
      // for(let i=0;i<this.options.length;i++){
      //   const s=this.options[i].value=this.tableData.month
      //   console.log('name',s)
      // }
      // this.pagination={
      //   has_next:data.pagination.has_next,
      //   has_previous:data.pagination.has_previous,
      //   index:data.pagination.index
      // }
      
  
    })
    this.spinner.hide();
  }
  Clear(){
    this.AttendanceGroup.reset()
    this.Summary(this.pagination.index)
  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.Summary(this.pagination.index)
   
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.Summary(this.pagination.index)


  }
}
