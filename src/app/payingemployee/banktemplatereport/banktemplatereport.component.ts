import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempShareService } from '../payingemp-share.service';
import { Router } from '@angular/router';
import { Subscription, combineLatest, forkJoin, of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Action } from 'rxjs/internal/scheduler/Action';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-banktemplatereport',
  templateUrl: './banktemplatereport.component.html',
  styleUrls: ['./banktemplatereport.component.scss']
})
export class BanktemplatereportComponent implements OnInit {
  BankList: any;
  SelectedId: any;
  years: number[] = [];
  currenYear: number;
  formGroup: FormGroup; 
  uploadForms : FormGroup;
  options = [{ key: 'Jan', value: '1' }, { key: 'Feb', value: '2' }, { key: 'Mar', value: 3 }, { key: 'Apr', value: 4 }, { key: 'May', value: 5 }, { key: 'Jun', value: 6 }, { key: 'Jul', value: 7 }, { key: 'Aug', value: 8 }, { key: 'Sep', value: 9 }, { key: 'Oct', value: 10 }, { key: 'Nov', value: 11 }, { key: 'Dec', value: 12 }]
  images:any = [] ;
  @ViewChild('labelImport')  labelImport: ElementRef;
  btndiable: boolean;
  @ViewChild('closebtn') closebtn : ElementRef;


  constructor(private router: Router, private payrollShareService: PayingempShareService, private fb: FormBuilder, private apiservice: PayingempService, private Notification: NotificationService, private Error: ErrorHandlingServiceService, private spinners: NgxSpinnerService)
   {
    let currenYear = new Date().getFullYear();
    let currYear = new Date().getFullYear();
    let startYear = currYear - 14;
    for(let year=startYear; year <= currYear + 17; year++)
    {
      this.years.push(year);
    }
    this.formGroup = this.fb.group({
      pay_change: [] 
    });
    }
  
  bankForm : FormGroup;
  ngOnInit(): void {
    this.bankForm = this.fb.group({
      bankname: ['', Validators.required],
      month:'',
      year:''
    })
    this.bank()
    this.bankForm.get('bankname').valueChanges.pipe(switchMap(value=>this.apiservice.get_bank(value,1))).subscribe(data=>{
      this.BankList=data.data
    })
    this.uploadForms = this.fb.group({
      files: ['', Validators.required],
      month:'',
      year :''
    })
  }

  bank(){
    this.apiservice.get_bank('',1).subscribe(data=>{
      this.BankList=data.data
    })
  }
  bankId(bank){
    this.SelectedId=bank.id
  }

  Search()
  {
    if(this.SelectedId === undefined || this.SelectedId === null || this.SelectedId === "")
    {
      this.Notification.showError("Please select Bank");
      return false;
    }
    if(this.bankForm.get('month').value === undefined || this.bankForm.get('month').value === null || this.bankForm.get('month').value === "")
    {
      this.Notification.showError("Please select Month");
      return false;
    }
    if(this.bankForm.get('year').value === undefined || this.bankForm.get('year').value === null || this.bankForm.get('year').value === "" )
    {
      this.Notification.showError("Please select Year");
      return false;
    }
    this.spinners.show();
    this.btndiable = true;
    let month = this.bankForm.get('month').value;
    let year = this.bankForm.get('year').value;
    this.apiservice.downloadBankTemplate(this.SelectedId, month, year).subscribe(data=>{
    
      let binaryData=[]
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "BankTemplateData" + ".xlsx";
      link.click();
      this.btndiable = false;
    })
    this.spinners.hide();
  }
  resetEmpSearchk()
  {
    this.bankForm.reset();
  }

  uploadBanks()
  {

  }

  uploadDocuments()
  {
    
    let month = this.uploadForms.get('month').value;
    if(month == null || month == undefined || month == "")
    {
      this.Notification.showError('Please Select Month');
      return false;
    }
    let year = this.uploadForms.get('year').value;
    if(year == null || year == undefined || year == "")
    {
      this.Notification.showError('Please Select Year');
      return false;
    }
    if(this.images == null || this.images == undefined)
    {
      this.Notification.showError('Please Select File');
      return false;
    }
    this.spinners.show();
    this.apiservice.uploadBankTemplate(this.images, this.SelectedId, month, year )
    .subscribe((results: any) => {

      if (results?.status == 'INVALID DATA') {

        this.Notification.showError("INVALID DATA")
      }
      else if(results?.code == 'CHECK YOUR ID')
      {
        this.Notification.showError("You DO NOT have permission to perform this operation")
      }
      else {

        this.Notification.showSuccess('File Upload Successfull')
        this.uploadForms.reset();
        this.closebtn.nativeElement.click();
        this.images = [];
        if (this.labelImport) {
          this.labelImport.nativeElement.innerText = 'Choose file';
        }
        this.spinners.hide();
      }
      this.spinners.hide();

    })
  }
  fileChange(file, files:FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
    .map(f => f.name)
    .join(', ');
    this.images = <File>file.target.files[0];
  }

  downloadTemplate()
  {
    
    
    let month = this.uploadForms.get('month').value;
    if(month == null || month == undefined || month == "")
    {
      this.Notification.showError('Please Select Month');
      return false;
    }
    let year = this.uploadForms.get('year').value;
    if(year == null || year == undefined || year == "")
    {
      this.Notification.showError('Please Select Year');
      return false;
    }
    this.apiservice.bankSampleTemplate(month, year).subscribe(data=>{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payollmaster_reporttemplate_upload" + ".xlsx";
      link.click();
    })
  }

}
