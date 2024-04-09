import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-report-columns',
  templateUrl: './report-columns.component.html',
  styleUrls: ['./report-columns.component.scss']
})
export class ReportColumnsComponent implements OnInit {
  @ViewChild('labelImport')  labelImport: ElementRef;
  isFileUpload: boolean=false;
  images: File;
  Action='payrollmaster_reportcolumns_upload';
uploadForms: FormGroup;

  constructor(private service:PayingempService,private notification:NotificationService,private SpinnerService:NgxSpinnerService) { }
  Searchform=true
  Createform=false
  Editform=false
  Summarytable=true
  SummaryData:any
  DropdownData:any
  linkeddata:any
  pagination={
    has_previous:false,
    has_next:false,
    index:1

  }
  has_next = true;
  isLoading = false;
  has_previous = true;
  presentpage:any=1;
  ngOnInit(): void {
    this.Summary(this.pagination.index)
    this.dropdown()
  }

  NameSearch=new FormControl('')
  CreateForm=new FormGroup({
    name:new FormControl('',[Validators.required]),
    type:new FormControl('',[Validators.required]),
    link_columns :new FormControl('',[Validators.required])
  })
  EditForm=new FormGroup({
    name:new FormControl('',[Validators.required]),
    type:new FormControl('',[Validators.required]),
    link_columns :new FormControl('',[Validators.required]),
    id:new FormControl('')
  })
  Add(){
    this.Searchform=false
  this.Createform=true
  // this.Editform=false
  this.Summarytable=false
  }
  edit(i){
    this.Searchform=false
    // this.Createform=true
    this.Editform=true
    this.Summarytable=false
    // let id=this.EditForm.get('id').value
    this.service.reportEditSummary(i).subscribe(data=>{
      this.onSelectionChange(data.type.id)
      this.EditForm.patchValue({
        name:data.name,
        type:data.type.id,
        id:data.id,
        link_columns:data.link_columns
      })
    })
    this.Search()
  }
  cancel(){
    this.Searchform=true
    this.Createform=false
    this.Editform=false
    this.Summarytable=true
    this.CreateForm.reset();
    this.EditForm.reset();
  }
  submit(){
    if(this.CreateForm.value.name=='' || this.CreateForm.value.name==null){
      this.notification.showError('Please Enter Name')
    }
    if(this.CreateForm.value.type=='' || this.CreateForm.value.type==null){
      this.notification.showError('Please Select Type')
    }
    if(this.CreateForm.value.link_columns=='' || this.CreateForm.value.link_columns==null){
      this.notification.showError('Please Select Linked Columns')
    }
    else{
      this.SpinnerService.show()
      this.service.reportSubmit(this.CreateForm.value).subscribe(data=>{
        this.SpinnerService.hide()
        if(data.status=='success'){
          this.SpinnerService.hide()
          this.notification.showSuccess('Successfully Created')
          this.Searchform=true
          this.Createform=false
          this.Editform=false
          this.Summarytable=true
          this.Search()
          this.CreateForm.reset();
          
        }
        else if(data.name_message){
          this.notification.showError(data.name_message)
        }
      },
      error=>{
        this.SpinnerService.hide()
      })
    }
  
 
  }
  prevpage(){
    // if(this.pagination.has_previous){
    //   this.pagination.index=this.pagination.index-1
    // }
    // this.Summary(this.pagination.index)
    if (this.has_previous === true) {
      this.presentpage=this.presentpage-1;
    }
    this.Summary(this.presentpage)
     

  }
  nextpage(){
    // if(this.pagination.has_next){
    //   this.pagination.index=this.pagination.index+1
    // }
    // this.Summary(this.pagination.index)
    if (this.has_next === true) {
      this.presentpage=this.presentpage+1;
    }
    this.Summary(this.presentpage)
     
  }
  update(){
    if(this.EditForm.value.name=='' || this.EditForm.value.name==null){
      this.notification.showError('Please Enter Name')
    }
    else if(this.EditForm.value.type=='' || this.EditForm.value.type==null){
      this.notification.showError('Please Select Type')
    }
    else if(this.EditForm.value.link_columns=='' || this.EditForm.value.link_columns==null){
      this.notification.showError('Please Select Linked Column')
    }
    else{
      this.SpinnerService.show()
      this.service.reportSubmit(this.EditForm.value).subscribe(data=>{
        this.SpinnerService.hide()
        if(data.status=='success'){
          this.notification.showSuccess('Successfully Updated')
          this.Searchform=true
          this.Createform=false
          this.Editform=false
          this.Summarytable=true
          this.Search()
          this.EditForm.reset();
        }
        else if(data.name_message){
          this.notification.showError(data.name_message)
        }
      },
      error=>{
        this.SpinnerService.hide()
      })
    }
   
    
  }
  Search(){
    this.service.reportSummary(this.NameSearch.value,this.pagination.index).subscribe(data=>{
      this.SummaryData=data['data']
    })
  }
  Summary(page){
    this.service.reportSummary(this.NameSearch.value,page).subscribe(data=>{
      this.SummaryData=data['data']
      let datapagination = data["pagination"];
      // this.spinner.hide();
      // if (this.SummaryData.length > 0) {
      //   this.has_next = data.pagination.has_next;
      //   this.has_previous = data.pagination.has_previous;
      //   this.presentpage = data.pagination.index;
      // }
      this.pagination={
        has_next:data.pagination.has_next,
        has_previous:data.pagination.has_previous,
        index:data.pagination.index
      }

    })
  }
  delete(i){
    this.service.reportDeleteSummary(i).subscribe(data=>{
      if(data.status=='success'){
        this.notification.showSuccess('Successfully Deleted')
        this.Search()
      }
    })
   
    
  }
  clear(){
    this.NameSearch.reset();
    this.Search()
  }
  dropdown(){
    this.service.reportDropdowntype().subscribe(data=>{
      this.DropdownData=data['data']
    })
  }  
  fileChange(file, files:FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
    .map(f => f.name)
    .join(', ');
    this.images = <File>file.target.files[0];
  }
  uploadfile()
  {
    this.isFileUpload = true;
    this.Searchform=false
    this.Createform=false
    this.Editform=false
    this.Summarytable=false

  }
  uploadDocuments(){
    if(this.images === null || this.images ===  undefined)
    {
      this.notification.showError('Please Select File');
      return false;
    }
    this.SpinnerService.show()
    this.service.MasterUpload(this.Action,this.images).subscribe(data=>{
      this.SpinnerService.hide()
      this.notification.showSuccess(data.message)
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  downloadTemplate()
  {
    const download='payrollmaster_reportcolumns_upload'
    this.SpinnerService.show()
    this.service.MasterUploadDownload(download,1).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrollmaster_reportcolumns_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancelupload(){
    this.Searchform=true
    this.Createform=false
    this.Editform=false
    this.Summarytable=true
    this.isFileUpload=false
  }

  onSelectionChange(selectedValue: any) {
    // Call your service method with the selected value
    this.service.getLinkColumns(selectedValue).subscribe(
      (response) => {
        this.linkeddata=response
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
