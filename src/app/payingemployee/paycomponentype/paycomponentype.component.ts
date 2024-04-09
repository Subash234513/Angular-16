import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { error } from 'console';
@Component({
  selector: 'app-paycomponentype',
  templateUrl: './paycomponentype.component.html',
  styleUrls: ['./paycomponentype.component.scss']
})
export class PaycomponentypeComponent implements OnInit {

  datassearch: FormGroup;
  editForm: FormGroup;
  addForm: FormGroup;

  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService) { }

  summarylist = [];
  summaryslist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  isSummaryPage: boolean = true;
  isTypeCreation: boolean;
  isNewCreation: boolean;
  send_value:String="";
  DropDowndata:any;
  uploadForms: FormGroup;
  Action='payollmaster_componenttype_upload'
  inputs = document.querySelectorAll('.file-input')
  @ViewChild('labelImport')  labelImport: ElementRef;
  images: any;
  isFileUpload: boolean = false;
  ngOnInit(): void {

    this.datassearch = this.fb.group({
      name: ''
    })
    this.getDropDown()
    this.getComponentSummary();

    this.editForm = this.fb.group({
      name: [''],
      percentage: [''],
      id: [''],
      category:['']

    })

    this.addForm = this.fb.group({
      name: [''],
      percentage: '',
      category:''


    })

  }
  list=[
    {id:1,name:'subash'},
    {id:2,name:'ramesh'},
    {id:3,name:'Ari'}
  ]

  getComponentSummary() {

    this.payrollService.getComponentType(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
      // this.archstatus = this.vendorarchivallist[0].archival_status.value;
      // console.log(this.archstatus)
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }
  getDropDown(){
    this.payrollService.getDropDownApi().subscribe(data=>{
      this.DropDowndata=data['data']
      console.log('getDropDown',data)
    })
  }
  deletecompType(id) {
    this.payrollService.deletepaycomponenttype(id).subscribe(results => {
      if (results.status == 'success') {

        this.notification.showSuccess("Deleted Successfully")
        this.getComponentSummary();
      } else {
        this.notification.showError(results.description)

        return false;
      }
    })
  }

  onCancel() {
    this.isSummaryPage = true;
    this.isTypeCreation = false;
    this.isNewCreation = false;
  }
  onSubmit() {
    if(this.editForm.value.name==='' || this.editForm.value.name===null){
      this.notification.showError('Please Enter Name')
    }
    else if(this.editForm.value.category==='' || this.editForm.value.category===null){
      this.notification.showError('Please Select Category')
    }
    else{
      this.SpinnerService.show()
      this.payrollService.getcurrentComptype(this.editForm.value).subscribe(result => {
        this.SpinnerService.hide()
        if (result.status == 'success') {
  
          this.notification.showSuccess("Updated Successfully")
          this.getComponentSummary();
          this.isSummaryPage = true;
          this.isTypeCreation = false;
          this.isNewCreation= false;
  
        }
        else if(result.name_message){
          this.notification.showError(result.name_message)
        }
        else {
          this.notification.showError(result.description)
  
          return false;
        }
      },
      error=>{
        this.SpinnerService.hide()
      })
    }
 

  }
  editComponentType(data) {
    this.isSummaryPage = false;
    this.isTypeCreation = true;
    this.isNewCreation = false;
    this.editForm.patchValue({
      name: data.name,
      percentage: data.percentage,
      category:data.category.id,
      id: data.id
     

    })

  }
  onCancelAdd()
  {
    this.isSummaryPage = true;
    this.isTypeCreation = false;
    this.isNewCreation = false;
    this.addForm.reset();
  }

  onSubmitAdd()
  {
    if(this.addForm.value.name==='' || this.addForm.value.name===null){
      this.notification.showError('Please Enter Name')
    }
    else if(this.addForm.value.category==='' || this.addForm.value.category===null){
      this.notification.showError('Please Select Category')
    }
    else{
      this.SpinnerService.show();
      const payload={
        name:this.addForm.get('name').value,
        percentage:'',
        category:this.addForm.get('category').value
      }
      this.payrollService.addnewcomptype(payload).subscribe(result => {
        this.SpinnerService.hide();
        if (result.status == 'success') {
  
          this.notification.showSuccess("Added Successfully")
          this.getComponentSummary();
          this.isSummaryPage = true;
          this.isTypeCreation = false;
          this.isNewCreation= false;
          this.addForm.reset();
  
        }
        else if(result.name_message){
          this.notification.showError(result.name_message)
        } else {
          this.notification.showError(result.description)
  
          return false;
        }
      },
      error=>{
        this.SpinnerService.hide()
      })
    }
   

  }
  addNew()
  {
    this.isSummaryPage = false;
    this.isTypeCreation = false;
    this.isNewCreation= true;
  }
  clearForm()
  {
    this.datassearch = this.fb.group({
      name: ''
    })

    // this.datassearch.reset();
    // this.getComponentSummary();
    this.searchName();
  }

  searchName()
  {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    console.log("Search Values", formValue)
    this.send_value = ""
    if(formValue.name)
    {
        this.send_value = this.send_value+'&name='+formValue.name
    }
    let page = 1;
    this.payrollService.searchpaycomponent(this.send_value, page).subscribe(result =>{
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      this.pagination.index = page;

    
    })
  }

  prevpage()
  {
    if(this.pagination.has_previous){
      this.pagination.index = this.pagination.index-1
    }
    this.getComponentSummary();
  }
  nextpage()
  {
    if(this.pagination.has_next){
      this.pagination.index = this.pagination.index+1
    }
    this.getComponentSummary();

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
    this.isSummaryPage = false;
    this.isTypeCreation = false;
    this.isNewCreation = false;
  }
  uploadDocuments(){
    if(this.images === null || this.images ===  undefined)
    {
      this.notification.showError('Please Select File');
      return false;
    }
    this.SpinnerService.show()
    this.payrollService.MasterUpload(this.Action,this.images).subscribe(data=>{
      this.SpinnerService.hide()
      this.notification.showSuccess(data.message)
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  downloadTemplate()
  {
    const download='payollmaster_componenttype_upload'
    this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,1).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payollmaster_componenttype_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.isSummaryPage = true;
    this.isTypeCreation = false;
    this.isNewCreation = false;
  }

  }


