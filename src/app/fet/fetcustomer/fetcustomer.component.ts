import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FetserviceService } from '../fetservice.service';

@Component({
  selector: 'app-fetcustomer',
  templateUrl: './fetcustomer.component.html',
  styleUrls: ['./fetcustomer.component.scss']
})
export class FetcustomerComponent implements OnInit {

  constructor(private fb:FormBuilder,private fetservice:FetserviceService,private router:Router) { }

  executiveform:FormGroup
  executivesummarydata:any

  executivepagination={
    has_next:true,
    has_previous:true,
    index:1
  }


  ngOnInit(): void {

    this.executiveform=this.fb.group({
      period:[''],
      designation:[''],
      grade:['']
    })

    this.summarysearch(1)
  }

  summarysearch(page){

    this.fetservice.getexecutivesummary(page).subscribe(
      result=>{
        this.executivesummarydata=result?.data;
        let pagination=result?.pagination
        if(this.executivesummarydata?.length > 0){
          this.executivepagination={
            has_next:pagination?.has_next,
            has_previous:pagination?.has_previous,
            index:pagination?.index
          }
        }
      }
    )

  }


  clear(){

  }

  navigatetoexecutivetask(){
    this.router.navigate(['/fet/main/executivetask'])
  }

  editexecutivesummary(value){
    console.log(value,value.id)
    this.router.navigate(['fet/main/executivetask'],{ queryParams: { executiveid: value.id}})
  }

  paginationexecutivesummary(value){
    (value == 'next')? this.summarysearch(this.executivepagination.index+1):this.summarysearch(this.executivepagination.index-1)
  }

  summarybuttonsearch(){
    this.summarysearch(1)
  }
 
  

}
