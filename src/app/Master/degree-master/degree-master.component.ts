import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { data } from 'jquery';
import { masterService } from 'src/app/Master/master.service';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-degree-master',
  templateUrl: './degree-master.component.html',
  styleUrls: ['./degree-master.component.scss']
})
export class DegreeMasterComponent implements OnInit {
  TitleDropdown: any;
  summaryData: any;

  constructor( private masterService:masterService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.getTitleDropdown()
    this.getSummarydata('',this.pagination.index)
  }
  isCreation:boolean=false;
  isSearch:boolean=true;
  isTable:boolean=true;
  isEdit:boolean=false
  CreateFormGroup=new FormGroup({
    TitleId:new FormControl(),
    DegreeName:new FormControl(),
  })
  EditFormGroup=new FormGroup({
    id:new FormControl(),
    TitleId:new FormControl(),
    DegreeName:new FormControl(),
  })
  maxValue=10
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  search=new FormControl()
  add(){
    this.isCreation=true;
    this.isSearch=false;
    this.isTable=false;
    this.isEdit=false;
  }
  Back(){
    this.isCreation=false;
    this.isSearch=true;
    this.isTable=true;
    this.isEdit=false;
    this.CreateFormGroup.reset();
    this.EditFormGroup.reset();
  }
  Edit(value){
    this.isCreation=false;
    this.isSearch=false;
    this.isTable=false;
    this.isEdit=true;
    this.masterService.MasterDegreeSummaryEdit(value).subscribe(data=>{
      this.EditFormGroup.patchValue({
        id:data.id,
        DegreeName:data.name,
        TitleId:data.title_id
      })
    })
  }
  getTitleDropdown(){
    this.masterService.getTitleDropdown().subscribe(data=>{
      this.TitleDropdown=data['data']
    })
  }
  getSummarydata(param,page){
    this.masterService.MasterDegreeSummary(param,page).subscribe(data=>{
      this.summaryData=data['data'];
     this.pagination.has_previous=data.pagination.has_previous
     this.pagination.has_next=data.pagination.has_next
     this.pagination.index=data.pagination.index
    })
  }
  Searchfun(){
    if(this.search.value!==null){
      this.getSummarydata(this.search.value,this.pagination.index)
    }

  }
  Submit(){
    
    if(this.CreateFormGroup.value.TitleId==='' || this.CreateFormGroup.value.TitleId===null || this.CreateFormGroup.value.TitleId===undefined){
      this.notification.showError('Please Select Title')
    }
    else if(this.CreateFormGroup.value.DegreeName==='' || this.CreateFormGroup.value.DegreeName===null || this.CreateFormGroup.value.DegreeName===undefined){
      this.notification.showError('Please Enter Degree')
    }
    else{
      const param={
        'name':this.CreateFormGroup.value.DegreeName,
        'title_id':this.CreateFormGroup.value.TitleId,
        'entity_id':1
    
  
      }
      this.masterService.MasterDegreeSubmit(param).subscribe(data=>{
        this.notification.showSuccess(data.message)
        this.getSummarydata('',this.pagination.index)
        this.isCreation=false;
        this.isSearch=true;
        this.isTable=true;
        this.isEdit=false;
        this.CreateFormGroup.reset()
      })
    }
   
  }
  clear(){
    this.search.reset();
    this.getSummarydata('',this.pagination.index)
  }
  Update(){
    if(this.EditFormGroup.value.TitleId==='' || this.EditFormGroup.value.TitleId===null || this.EditFormGroup.value.TitleId===undefined){
      this.notification.showError('Please Select Title')
    }
    else if(this.EditFormGroup.value.DegreeName==='' || this.EditFormGroup.value.DegreeName===null || this.EditFormGroup.value.DegreeName===undefined){
      this.notification.showError('Please Enter Degree')
    }
    else{
      const param={
        'id':this.EditFormGroup.value.id,
        'name':this.EditFormGroup.value.DegreeName,
        'title_id':this.EditFormGroup.value.TitleId,
        'entity_id':1
    
  
      }
      this.masterService.MasterDegreeSubmit(param).subscribe(data=>{
        this.notification.showSuccess(data.message)
        this.getSummarydata('',this.pagination.index)
        this.isCreation=false;
        this.isSearch=true;
        this.isTable=true;
        this.isEdit=false;
        this.EditFormGroup.reset()
      })
    }
   
  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getSummarydata('',this.pagination.index)
  
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getSummarydata('',this.pagination.index)
   

  }

}
