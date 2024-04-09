import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { DatePipe } from '@angular/common';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';

export interface paycomonent {
  id: number;
  name: string;
}

export interface icompanyList {
  id: number;
  name: string;
}


export interface iseditcompanylist{
  name: string;
  id: number;
  map_id: number;
}
@Component({
  selector: 'app-companycontrib',
  templateUrl: './companycontrib.component.html',
  styleUrls: ['./companycontrib.component.scss']
})
export class CompanycontribComponent implements OnInit {

  datassearch: FormGroup;
  send_value: String = "";
  addForm: FormGroup;
  editForm: FormGroup;
  isFileUpload: boolean = false;
  images : any;
  uploadForms: FormGroup;
  inputs = document.querySelectorAll('.file-input')
  


  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

  summarylist = [];
  summaryslist = [];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  extractedId: any;
  isLoading : boolean 
  isSummaryContent: boolean = true;
  isNewContribution: boolean;
  isEditContribution: boolean;
  Action='payollmaster_companycontribution_upload'
  
  public allcompanylist: icompanyList[]; 
    public chipSelectedcompany: icompanyList[] = [];
    public chipSelectedcompanyid = [];
    public chipRemovedcompanyid = [];

    public separatorKeysCodes: number[] = [ENTER, COMMA];
   

    public paycomponent_array: iseditcompanylist[]; 
    public chipeditSelectedcompany: iseditcompanylist[] = [];
    public chipeditSelectedcompanyid = [];
    public chipeditRemovedcompanyid = [];
    @ViewChild('companyInput') companyInput: any;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('labelImport')  labelImport: ElementRef;
   
    // public segment = new FormControl();

    @ViewChild('editcompanyInputName') editcompanyInputName: any;
    @ViewChild('auto') editmatAutocomplete: MatAutocomplete;


  ngOnInit(): void {

    this.datassearch = this.fb.group({
      name: ''
    })

    this.getComponentSummary();
    this.paycomponent_search('');

    this.addForm = this.fb.group({
      name: [''],
      percentage: [''],
      effective_from: [''],
      GlNo:[''],
      amount: [''],
      paycomponentflagmaster: ['']


    })
    this.editForm = this.fb.group({
      name: [''],
      percentage: [''],
      effective_from: [''],
      amount: [''],
      GlNo:[''],
      paycomponentflagmaster: [{}],
      id: [''],
      paycomponentflagmasters: [{}]


    })
    if (this.addForm.get('paycomponentflagmaster') !== null) {
      this.addForm.get('paycomponentflagmaster').valueChanges
             .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
              }),
              switchMap(value => this.payrollService.getpaycomponents(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false;
                }),
              ))
             )  
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allcompanylist = datas;
          console.log("alllemployeeeisttt", this.allcompanylist)
  
        })
    }
    this.editForm.get('paycomponentflagmaster').valueChanges.pipe(switchMap(value=>this.payrollService.getpaycomponents(value,1))).subscribe(data=>{
      this.paycomponent_array=data['data']
    })

    
    this.getpaymentcomponentinfo();

  }

  getComponentSummary() {

    this.payrollService.getCompanyContribution(this.pagination.index).subscribe(results => {
      if (!results) {
        return false;
      }
      this.summarylist = results['data'];
     
      this.pagination = results.pagination ? results.pagination : this.pagination;
    })

  }
  deleteEntry(id) {
    this.payrollService.delcompanycontn(id).subscribe(results => {
      if (results.status == 'success') {

        this.notification.showSuccess("Deleted Successfully")
        this.getComponentSummary();
      } else {
        this.notification.showError(results.description)

        return false;
      }
    })
  }
  cleardata() {
    this.datassearch = this.fb.group({
      name: ''
    })
    // this.datassearch.reset();
    this.searchData();
  }

  searchData() {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    console.log("Search Values", formValue)
    this.send_value = ""
    if (formValue.name) {
      this.send_value = this.send_value + '&name=' + formValue.name
    }
    let page = 1;
    this.payrollService.searchcompcontrib(this.send_value, page).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      this.pagination.index = page;


    })
  }

  newContribution() {
    this.isSummaryContent = false;
    this.isNewContribution = true;
    this.isEditContribution = false;
  }
  onCancelAdd() {
    this.isSummaryContent = true;
    this.isNewContribution = false;
    this.isEditContribution = false;
    this.clearMatChipInput();
    this.addForm.reset();

  }
  clearMatChipInput(){
    this.chipSelectedcompany = [];
      this.addForm.get('paycomponentflagmaster').setValue(null);
  }

  onSubmitAdd() {
    if (this.addForm.value.name == "" || this.addForm.value.name == null) {
      this.notification.showError("Please Add Name")

    }
    else if (this.addForm.value.percentage == "" || this.addForm.value.percentage == null) {
      this.notification.showError("Please Add Percentage");

    }
    else if (this.addForm.value.effective_from == "" || this.addForm.value.effective_from == null) {
      this.notification.showError("Please Select Effective From Date");

    }
    else if (this.addForm.value.amount == "" || this.addForm.value.amount == null) {
      this.notification.showError("Please Add Amount");

    }
    else if(this.chipSelectedcompany.length==0){
      this.notification.showError("Please Select Pay Component")
    }
    else{
      this.addForm.value.paycomponentflagmaster=this.chipSelectedcompany
      const selectedValues = this.addForm.value.paycomponentflagmaster;
      const refIds = selectedValues.map((id) => ({ "ref_id": id.id}));
  
      // const selectedValues = this.addForm.get('paycomponentflagmaster').value;
      // const selectedIds = selectedValues.map((type: any) => type.id);
      // const refIds = selectedValues.map((ids) => ({ "ref_id": ids.id}));
      const payload = {
        name: this.addForm.value.name,
        percentage: this.addForm.value.percentage,
        effective_from: this.datepipe.transform((this.addForm.controls['effective_from'].value), 'yyyy-MM-dd'),
        amount: this.addForm.value.amount,
        paycomponentflagmaster: refIds,
        glno:this.addForm.value.GlNo
      };
      this.SpinnerService.show()
      this.payrollService.addnewcompcontribution(payload).subscribe(result => {
        this.SpinnerService.hide()
        if (result.status == 'success') {
  
          this.notification.showSuccess("Added Successfully")
          this.getComponentSummary();
          this.isSummaryContent = true;
          this.isNewContribution = false;
          this.isEditContribution = false;
          // this.isNewCreation= false;
          this.addForm.reset();
          this.chipSelectedcompany=[]
  
        }
        else if(result.name_message){
          this.notification.showError(result.name_message)
        }
        else if(result.percentage_message){
          this.notification.showError(result.percentage_message)
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
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getComponentSummary();
  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getComponentSummary();

  }

  editContribution(data) {

console.log('dat', data)
    this.isSummaryContent = false;
    this.isEditContribution = true;
    this.isNewContribution = false;
    this.payrollService.getCompany_ParticularGet(data.id).subscribe(res => {
      const extractedId = res.paycomponentflagmaster.map(item => item.id);

      // const selectedValues = this.paycomponent_array.filter(item => extractedId.includes(item.id));
      this.editForm.get('paycomponentflagmaster').setValue(extractedId);
      this.chipeditSelectedcompany = data.paycomponentflagmaster;
      const refIds = this.chipeditSelectedcompany.map((ids) => ({ "ref_id": ids.id }));
      const percentageValue = res.percentage.replace('%', '');
      let pay = this.editForm.get('paycomponentflagmaster').value.name
      this.editForm.patchValue({
        name: res.name,
        percentage: percentageValue,
        GlNo:res.glno,
        id: res.id,
        effective_from: res.effective_from,
        amount: res.amount,
        paycomponentflagmaster: refIds

        // paycomponentflagmaster: extractedId


      })
    })

  }

  public removedcompany(company: icompanyList): void {
    const index = this.chipSelectedcompany.indexOf(company);
    if (index >= 0) {
      this.chipSelectedcompanyid.splice(index, 1);
      this.chipSelectedcompany.splice(index, 1);
      this.companyInput.nativeElement.value = '';
    }
  }
  
  public companySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectcompanyByName(event.option.value.name);
    this.companyInput.nativeElement.value = '';
  }
  
  public selectcompanyByName(companyName) {
    let foundcompany1 = this.chipSelectedcompany.filter(company => company.name == companyName);
    if (foundcompany1.length) {
      return;
    }
    let foundcompany = this.allcompanylist.filter(company => company.name == companyName);
    if (foundcompany.length) {
      this.chipSelectedcompany.push(foundcompany[0]);
      this.chipSelectedcompanyid.push(foundcompany[0].id);
      this.companyInput.nativeElement.value = ''; 
    }
  }
  
  
  onEdit() {
    // this.SpinnerService.show();
    if (this.editForm.value.name == "" || this.editForm.value.name == null) {
      this.notification.showError("Please Add Name")

    }
    else if (this.editForm.value.percentage == "" || this.editForm.value.percentage == null) {
      this.notification.showError("Please Add Percentage");

    }
    else if (this.editForm.value.effective_from == "" || this.editForm.value.effective_from == null) {
      this.notification.showError("Please Select Effective From Date");

    }
    else if (this.editForm.value.amount == "" || this.editForm.value.amount == null) {
      this.notification.showError("Please Add Amount");

    }
    else if(this.chipeditSelectedcompany.length==0){
      this.notification.showError('Please Select Pay Component')
    }
    
    // const selectedValues = this.paycomponent_array.filter(item => extractedId.includes(item.id));
    // this.editForm.get('paycomponentflagmaster').setValue(this.extractedId);
    // const selectedValues = this.editForm.get('paycomponentflagmaster').value;
    // const selectedIds = selectedValues.map((type: any) => type.id);
    else{
      this.editForm.value.paycomponentflagmaster=this.chipeditSelectedcompany
      const selectedValues = this.editForm.value.paycomponentflagmaster;
      const refIds = selectedValues.map((ids) => ({ "ref_id": ids.id }));
  
      const payload = {
        name: this.editForm.value.name,
        percentage: this.editForm.value.percentage,
        effective_from: this.datepipe.transform((this.editForm.controls['effective_from'].value), 'yyyy-MM-dd'),
        amount: this.editForm.value.amount,
        paycomponentflagmaster: refIds,
        glno:this.editForm.value.GlNo,
        id: this.editForm.value.id
      };
      this.SpinnerService.show()
      this.payrollService.addnewcompcontribution(payload).subscribe(result => {
        this.SpinnerService.hide();
        if (result.status == 'success') {
  
          this.notification.showSuccess("Updated Successfully")
          this.getComponentSummary();
          this.isSummaryContent = true;
          this.isNewContribution = false;
          this.isEditContribution = false;
          // this.isNewCreation= false;
         
          this.addForm.reset();
          this.chipeditSelectedcompany=[]
  
        }
        else if(result.name_message){
          this.notification.showError(result.name_message)
        }
        else if(result.percentage_message){
          this.notification.showError(result.percentage_message)
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
  

  onCancel() {
    this.isSummaryContent = true;
    this.isNewContribution = false;
    this.isEditContribution = false;
    this.editForm.reset();
  }

  getpaymentcomponentinfo() {
    // let values = 'is_deduction=true';
    this.payrollService.getpaycomponent('', 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }
  paycomponent_search(value) {
    this.payrollService.getpaycomponents(value, 1).subscribe(data => {
      this.paycomponent_array = data['data'];
      this.allcompanylist = data['data'];
    });
  }
  validation(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }
  public displaycom(data?: paycomonent): any | undefined {
    return data ? data.name : undefined;
  }
  // public onDropdownOpened(opened: boolean): void {
  //   if (opened && this.pagination.has_next) {
  //     this.pagination.index++;
  //     this.payrollService.getpaycomponents('', this.pagination.index).subscribe(data => {
  //       // this.paycomponent_array = data['data'];
  //       const newOptions = data.data;
  //       this.paycomponent_array = [...this.paycomponent_array, ...newOptions];
  //       this.pagination.has_next = data.pagination.has_next;
  //     });
  //   }
  // }

  onSelectionChange($event) {
    console.log("Selection Event", $event)

    console.log("flag master", this.editForm.value)
    let apiresp = this.editForm.get('paycomponentflagmasters').value;
    console.log("flags", apiresp)
    let mapid = apiresp[0].map_id;
    console.log("MAP ID", mapid)

    if ($event.isUserInput == true) {

      if ($event.source._selected == false) {
        this.payrollService.deletepfCategory($event.source.value, mapid).subscribe(res => {
          if (res.status == 'success') {
            this.notification.showSuccess("Updated Successfully")
          } else {
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            return false;
          }
        })
      }
    }


  }

  public editremovedcompany(company: iseditcompanylist): void {
    const index = this.chipeditSelectedcompany.indexOf(company);
    if(index !== -1){
    this.chipeditSelectedcompanyid.push(company.id);
    this.chipeditSelectedcompany.splice(index, 1);
    this.chipeditSelectedcompanyid.splice(index, 1);
    
    const apiresp = this.chipeditSelectedcompany.map(res => res.map_id);
    console.log("flags", apiresp);
    const mapId = apiresp[0];
    if (mapId) {
      this.payrollService.deletetemplate(company.id, mapId).subscribe(res => {
       
      });
    }
    }
  }
  public editcompanySelected(event: MatAutocompleteSelectedEvent): void {
    this.editselectcompanyByName(event.option.value.name);
    this.editcompanyInputName.nativeElement.value = '';
    console.log('value', event.option.value)
    
  }
  public editselectcompanyByName(companyName) {
    let foundsegment1 = this.chipeditSelectedcompany.filter(company => company.name == companyName);
    if (foundsegment1.length) {
      return;
    }
    let foundsegment = this.paycomponent_array.filter(company => company.name == companyName);
    if (foundsegment.length) {
      this.chipeditSelectedcompany.push(foundsegment[0]);
      this.chipeditSelectedcompanyid.push(foundsegment[0].id)
    //  this.editcompanyInput = this.chipeditSelectedcompanyid;
    }
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
    this.isSummaryContent = false;
    this.isNewContribution = false;
    this.isEditContribution = false;

  }
  uploadDocuments()
  {
    if(this.images === undefined || this.images === null)
    {
      this.notification.showError("Please Select File")
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
    const download='payollmaster_companycontribution_upload'
    this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,2).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payollmaster_companycontribution_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.isSummaryContent = true;
    this.isNewContribution = false;
    this.isEditContribution = false;

  }
}
