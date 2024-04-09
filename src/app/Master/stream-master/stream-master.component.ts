import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { masterService } from '../master.service';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-stream-master',
  templateUrl: './stream-master.component.html',
  styleUrls: ['./stream-master.component.scss']
})
export class StreamMasterComponent implements OnInit {
  summaryData: any;
  StreamDropdowndata: any;
  AutocompleteId: any;

  constructor(private masterService:masterService,private notification:NotificationService) { }
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  ngOnInit(): void {
    this.Summary('',this.pagination.index)
    this.StreamDropdown()
    this.CreateGroup.get('Degreeid').valueChanges.pipe(switchMap(value=>this.masterService.MasterDegreeSummary(value,1))).subscribe(data=>{
      this.StreamDropdowndata=data.data
    })
    this.EditGroup.get('Degreeid').valueChanges.pipe(switchMap(value=>this.masterService.MasterDegreeSummary(value,1))).subscribe(data=>{
      this.StreamDropdowndata=data.data
    })
  }
  isTable:boolean=true;
  isSearch:boolean=true;
  isCreate:boolean=false;
  isEdit:boolean=false
  Search=new FormControl()
  CreateGroup=new FormGroup({
    Degreeid:new FormControl(),
    StreamName:new FormControl()
  })
  EditGroup=new FormGroup({
    id:new FormControl(),
    Degreeid:new FormControl(),
    StreamName:new FormControl()
  })
  add(){
    this.isTable=false;
    this.isSearch=false;
    this.isCreate=true;
    this.isEdit=false
  }
  Edit(Data){
 
    this.masterService.MasterStreamSummaryEdit(Data.id).subscribe(data=>{
      this.EditGroup.patchValue({
        id:data.id,
        StreamName:data.name,
        Degreeid:data.degree_id?.name
      })
      this.AutocompleteId=data?.degree_id?.id
      this.isTable=false;
      this.isSearch=false;
      this.isCreate=false;
      this.isEdit=true
    })
  }
  Back(){
    this.isTable=true;
    this.isSearch=true;
    this.isCreate=false;
    this.isEdit=false
    this.CreateGroup.reset();
    this.AutocompleteId=''
    this.EditGroup.reset();
  }
  Summary(data,page){
    this.masterService.MasterStreamSummary(data,page).subscribe(data=>{
      this.summaryData=data.data
      this.pagination.has_next=data.pagination.has_next
      this.pagination.has_previous=data.pagination.has_previous
      this.pagination.index=data.pagination.index
    })
  }
  SearchData(){
    if(this.Search.value!==null){
      this.Summary(this.Search.value,this.pagination.index)
    }
    
  }
  prevpage(){
    if(this.pagination.has_previous){
      this.pagination.index=this.pagination.index-1
    }
    this.Summary('',this.pagination.index)
  }
  nextpage(){
    if(this.pagination.has_next){
      this.pagination.index=this.pagination.index-1
    }
    this.Summary('',this.pagination.index)
  }
  StreamDropdown(){
    this.masterService.MasterDegreeSummary('',1).subscribe(data=>{
      this.StreamDropdowndata=data.data
    })
  }
  Autocomplete(data){
    this.AutocompleteId=data

  }
  clear(){
    this.Search.reset()
    this.Summary('',this.pagination.index)
  }
  Submit(){
    if(!this.AutocompleteId){
      this.notification.showError('Please Select Degree')
    }
    else if(this.CreateGroup.get('StreamName').value==='' || this.CreateGroup.get('StreamName').value===null){
      this.notification.showError('Please Enter Stream')
    }
    else{
      const params={
        'degree_id':this.AutocompleteId,
        'name':this.CreateGroup.get('StreamName').value,
        'entity_id':1
      }
      this.masterService.MasterStreamSubmit(params).subscribe(data=>{
        if(data.message){
          this.notification.showSuccess(data.message)
          this.Summary('',this.pagination.index)
          this.isTable=true;
          this.isSearch=true;
          this.isCreate=false;
          this.isEdit=false
        }
      })
      this.AutocompleteId=''
      this.CreateGroup.reset()
    }
 
  }
  Update(){
    if(!this.AutocompleteId){
      this.notification.showError('Please Select Degree')
    }
    else if(this.EditGroup.get('StreamName').value==='' || this.EditGroup.get('StreamName').value===null){
      this.notification.showError('Please Enter Stream')
    }
    else{
      const params={
        'degree_id':this.AutocompleteId,
        'name':this.EditGroup.get('StreamName').value,
        'id':this.EditGroup.get('id').value,
        'entity_id':1
      }
      this.masterService.MasterStreamSubmit(params).subscribe(data=>{
        if(data.message){
          this.notification.showSuccess(data.message)
          this.Summary('',this.pagination.index)
          this.isTable=true;
          this.isSearch=true;
          this.isCreate=false;
          this.isEdit=false
        } 
      })
      this.AutocompleteId=''
      this.EditGroup.reset()
    }
    
  }
}
