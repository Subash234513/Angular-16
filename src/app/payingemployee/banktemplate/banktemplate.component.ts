import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap, catchError } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

export interface FunctionHead {
  id: number;
  name: string;
}
export interface Function{
  column_name: string
  id: number,
  // order: number
}

@Component({
  selector: 'app-banktemplate',
  templateUrl: './banktemplate.component.html',
  styleUrls: ['./banktemplate.component.scss']
})

export class BanktemplateComponent implements OnInit {
  @ViewChild('labelImport')  labelImport: ElementRef;
  isFileUpload: boolean=false;
  images: File;
  Action='payollmaster_reporttemplate_upload';
uploadForms: FormGroup;

  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

    searchform : FormGroup;
    templateCreate: FormGroup;
    templateEdit:FormGroup;
    BankList:any=[]
    BankTemplate=false;
    main=true;
    BankTemplateEdit=false;
    chipList:any
    fieldDropdown=[]
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    FieldChiplist= []
    FieldChiplistEdit=[]
    SelectedId:any
    SelectedSearchId:number;
    SummaryList:any
    details:any;
    DeleteMain:number;
    DeleteChipList =[]
    pagination = {
      has_next: false,
      has_previous: false,
      index: 1
    }
    @ViewChild('companyInput') companyInput: any;
    @ViewChild('companyInputEdit') companyInputEdit: any;

  ngOnInit(): void {

    this.searchform = this.fb.group({
      bankname:''
    })
    this.templateCreate = this.fb.group({
      bankname:new FormControl('',[Validators.required]),
      // bankname:('',[Validators.required]),
      fields:new FormControl('')
    })
    this.templateEdit=this.fb.group({
      bankname:new FormControl('',[Validators.required]),
      fields:[{}],
      id:''
    })
    this.Summary(this.pagination.index)
    this.SearchBank()
    this.bank()
    this.searchform.get('bankname').valueChanges.pipe(switchMap(value=>this.payrollService.get_bank(value,1))).subscribe(data=>{
      this.BankList=data.data
    })
    this.templateCreate.get('bankname').valueChanges.pipe(switchMap(value=>this.payrollService.get_bank(value,1))).subscribe(data=>{
      this.BankList=data.data
    })
    this.templateEdit.get('bankname').valueChanges.pipe(switchMap(value=>this.payrollService.get_bank(value,1))).subscribe(data=>{
      this.BankList=data.data
    })
    this.templateCreate.get('fields').valueChanges.pipe(switchMap(value=>this.payrollService.reportSummary(value,1))).subscribe(data=>{
      this.fieldDropdown=data['data']
    })
    this.templateEdit.get('fields').valueChanges.pipe(switchMap(value=>this.payrollService.reportSummary(value,1))).subscribe(data=>{
      this.fieldDropdown=data['data']
    })
   
   
  }

  

  clear(){
    this.searchform.get('bankname').reset();
    this.SelectedSearchId=null
    this.Summary(this.pagination.index)
  }
  bank(){
    this.payrollService.get_bank('',1).subscribe(data=>{
      this.BankList=data.data
    })
  }
  bankId(bank){
    this.SelectedId=bank.id
  }
  bankSearchId(bank){
    this.SelectedSearchId=bank.id
  }
  Add(){
    this.BankTemplate=true
    this.main=false
    this.BankTemplateEdit=false
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      // this.FieldChiplist.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(chip): void {
    const index = this.FieldChiplist.indexOf(chip);
    

    if (index >= 0) {
      this.FieldChiplist.splice(index, 1);
    }
  }
  removeEdit(chip):void{
    const index = this.FieldChiplistEdit.indexOf(chip);
    chip['isdelete']=true
    if(chip.id){
      this.DeleteChipList.push(chip);
    }
    if (index >= 0) {
      this.FieldChiplistEdit.splice(index, 1);
    }

  }
  NameSelected(event:MatAutocompleteSelectedEvent){
    this.companyInput.nativeElement.value=''
    let events=event.option.value.name
    let id=event.option.value.id
    let found=this.FieldChiplist.filter(event=>event.name==events)
    let foundPush=this.fieldDropdown.filter(event=>event.name==events)
    if(found.length){
      return
    }
    if(foundPush.length){
      this.FieldChiplist.push({column_id:id,name:events})
    }
  }
  NameSelectedEdit(event:MatAutocompleteSelectedEvent){
    this.companyInputEdit.nativeElement.value=''
    let events=event.option.value.name
    let id=event.option.value.id
    let found=this.FieldChiplistEdit.filter(event=>event.name==events)
    let foundPush=this.fieldDropdown.filter(event=>event.name==events)
    if(found.length){
      return
    }
    if(foundPush.length){
      this.FieldChiplistEdit.push({column_id:id,name:events})
    }
  }
  public displayfunc(fn?:FunctionHead):string | undefined{
    return fn ? fn.name:undefined;
  }
  SearchBank(){
    this.payrollService.reportSummary('',1).subscribe(data=>{
    this.fieldDropdown=data['data']

    })
  }
  submit(){
    if(this.templateCreate.value.bankname=='' || this.templateCreate.value.bankname==null){
      this.notification.showError('Please Select Bankname')
    }
    else if(this.FieldChiplist.length===0){
      this.notification.showError('Please Select Fields')
    }
    else{
      const columnId=this.FieldChiplist.map((id,index)=>({'column_id':id.column_id,'order':index+1}))
    const payload={
      name:'',
      bank_id:this.SelectedId,
      details:columnId
    }
    this.SpinnerService.show()
    this.payrollService.BankSubmit(payload).subscribe(data=>{
      this.SpinnerService.hide()
      if(data.status=='success'){
        this.notification.showSuccess(data.message)
      }
      else{
        this.notification.showError(data.description)
      }
    },
    error=>{
      this.SpinnerService.hide()
    })
    this.BankTemplate=false
    this.BankTemplateEdit=false
    this.main=true
    this.templateCreate.reset();
    this.FieldChiplist=[]
    this.SelectedId=''
    // this.FieldChiplist=[]
    // this.SelectedId=null
    this.Summary(this.pagination.index)
    }
    
  }
  columnId:any=[]
  Update(){
    if(this.templateEdit.value.bankname=='' || this.templateEdit.value.bankname==null){
      this.notification.showError('Please Select Bankname')
    }
    else if(this.FieldChiplistEdit.length===0){
      this.notification.showError('Please Select Fields')
    }
    else{
      this.columnId=this.FieldChiplistEdit.map((id,index)=>({'column_id':id.column_id,'order':index+1,'id':id?.id}))
      if(this.DeleteChipList){
        for(let i=0;i<this.DeleteChipList.length;i++){
          this.columnId.push(this.DeleteChipList[i])
        }
      }
      const payload={
        name:'',
        bank_id:this.SelectedId,
        details:this.columnId,
        id:this.templateEdit.get('id').value
      }
      this.SpinnerService.show()
      this.payrollService.BankSubmit(payload).subscribe(data=>{
        this.SpinnerService.hide()
        if(data.status=='success'){
          this.notification.showSuccess(data.message)
        }
        else{
          this.notification.showError(data.description)
        }
      },
      error=>{
        this.SpinnerService.hide()
      })
      this.BankTemplate=false
      this.BankTemplateEdit=false
      this.main=true
      this.templateEdit.reset();
      this.FieldChiplistEdit=[]
      this.DeleteChipList=[]
      this.SelectedId=''
      // this.SelectedId=null
      this.Summary(this.pagination.index)
    }
  
  }
  close(){
    this.BankTemplate=false
    this.BankTemplateEdit=false
    this.main=true
    this.FieldChiplist=[]
    this.FieldChiplistEdit=[]
    this.Summary(this.pagination.index)

  }
  Summary(page){
    this.payrollService.BankSummary('',page).subscribe(data=>{
      this.SummaryList=data['data']
      for(let i in this.SummaryList){
        this.details=this.SummaryList[i].details
      }
      this.pagination = data.pagination ? data.pagination : this.pagination;
    })
  }
  search(){
    this.payrollService.BankSummary(this.SelectedSearchId,this.pagination.index).subscribe(data=>{
      this.SummaryList=data['data']
    })
  }
  Icon(data){
    this.DeleteMain=data.id
  }
  Delete(){
    this.payrollService.DeleteBank(this.DeleteMain).subscribe(data=>{
      if(data.status=='success'){
        this.notification.showSuccess(data.message)
      }
      else{
        this.notification.showError(data.description)
      }
    })
    this.Summary(this.pagination.index)
  }
  aa:any
  Edit(data){
    this.BankTemplate=false
    this.BankTemplateEdit=true
    this.main=false
  this.FieldChiplistEdit=data.details
  const a=this.FieldChiplistEdit.map(id=>id.column_id)
  this.templateEdit.get('fields').setValue(a)
  const refId=this.FieldChiplistEdit.map((id)=>({'column_id':id.column_id}))
    this.payrollService.EditBank(data.id).subscribe(result=>{
      this.SelectedId=result.bank?.id
      const s=result.details.map((id)=>({'column_id':id.column_id}))
      this.templateEdit.patchValue({
        id:result.id,
        bankname:result?.bank?.name,
        fields:refId
      })
    })
  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.Summary(this.pagination.index)
    // this.getComponentSummary();
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.Summary(this.pagination.index)
    // this.getComponentSummary();

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
    this.BankTemplate=false
    this.BankTemplateEdit=false
    this.main=false

  }
  uploadDocuments()
  {
    if(this.images === null || this.images === undefined)
    {
      this.notification.showError("Please select the file to upload");
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
    const download='payollmaster_reporttemplate_upload'
    this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,2).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payollmaster_reporttemplate_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel(){
    this.BankTemplate=false
    this.BankTemplateEdit=false
    this.main=true
    this.isFileUpload=false
  }
  downloadExcel(datas){
    this.payrollService.BankDowload(datas.id).subscribe(data=>{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = datas?.bank?.name + ".xlsx";
      link.click();
    })
  }
}
