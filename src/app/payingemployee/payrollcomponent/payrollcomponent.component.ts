import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from '../../service/notification.service';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, from } from 'rxjs';
import { PayingempShareService } from '../payingemp-share.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-payrollcomponent',
  templateUrl: './payrollcomponent.component.html',
  styleUrls: ['./payrollcomponent.component.scss']
})
export class PayrollcomponentComponent implements OnInit {
  
  setcolor = 'primary';
  allowanceTypeList:any;
  gradeList: any;
  task_Master_Menu_List: any
  clientSummary:boolean
  payrollSummary:boolean = true;
  employeePFStructurecreation:boolean;
  employeePFStructure:boolean = true;
  moduleSummary:boolean
  mappingSummary:boolean
  clientcreation:boolean
  payrollcreation:boolean
  modulecreation:boolean
  mappingcreation:boolean
  clientList:any;
  payrollList:any;
  PFStructureList:any;
  mappingList:any;
  // clientForm:FormGroup;
  payrollForm:FormGroup;
  PFForm:FormGroup;
  // moduleForm:FormGroup;
  // mappingForm:FormGroup;
  presentpageclient: number = 1;
  pagesizeclient=10;
  has_nextclient = true;
  has_previousclient = true;
  presentpagepayroll: number = 1;
  pagesizepayroll=10;
  has_nextpayroll = true;
  has_previouspayroll = true;
  presentpagepf: number = 1;
  pagesizepf=10;
  has_nextPF = true;
  has_previousPF = true;
  presentpagemapping: number = 1;
  pagesizemapping=10;
  has_nextmapping = true;
  has_previousmapping = true;
  isLoading : boolean;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  send_value:String="";
  fromDate:any;
  uploadForms: FormGroup;
  Action='payrollmaster_payrollcomponent_upload'
  inputs = document.querySelectorAll('.file-input')
  @ViewChild('labelImport')  labelImport: ElementRef;
  images: any;
  isFileUpload: boolean = false;

  @ViewChild('allow') matallowAutocomplete: MatAutocomplete;
  @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('getallowInput') getallowInput: any;
  @ViewChild('payroll') matpayrollAutocomplete: MatAutocomplete;
  Objects = {
    allowanceTypeList:[{id: 1, text: 'Percentage'}, {id: 2, text: 'Fixed'} ],
  }
  TypeOfForm:string;
  ID_Value_To_PFEdit: any = ''
  ID_Value_To_payrollEdit: any = ''
  datassearch: FormGroup;

  constructor(
    private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private payrollservice: PayingempService,
    private notification: NotificationService,private datePipe: DatePipe,private payrollShareService:PayingempShareService,public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    // payroll form
    this.payrollForm = this.fb.group({
      name: [''],
      allowance_type: [''],
      pf_include:[false],
      is_deduction:[false],
      is_default:[false],
      gradelevel:[''],
      percentage:[''],
      from_date:[''],
      to_date:['']
    })
      // pf form
      this.PFForm = this.fb.group({
        name: [''],
        percentage: [''],
        amount:[''],
        is_standard:[false],

      })
    // this.payrollSearch('');
    // this.getAllowance();
    // this.PFSearch('');
    if(this.payrollShareService.payroll.value == 'Payroll'){
     this.payrollSummary = true;
     this.employeePFStructure = false
    }
    if(this.payrollShareService.employeepf.value == 'EmployeePF'){
      this.payrollSummary = false;
      this.employeePFStructure = true;
    }

    this.get_payrollSummary(1);

    this.datassearch = this.fb.group({
      name: ''
    })
    this.getAllowance();
    this.getGrade();
  }

  
  oncancelPayroll(){
    this.payrollcreation = false;
    this.payrollSummary = true;
    this.employeePFStructurecreation = false;
    this.employeePFStructure = false;
    this.ID_Value_To_payrollEdit=''
  }


  

  addPayroll(formtype,data){
    this.TypeOfForm = formtype;
    this.payrollcreation = true;
    this.payrollSummary = false;
    if (data != '') {
      this.ID_Value_To_payrollEdit = data.id
      // const startdate = this.datePipe.transform(data.start_date, 'yyyy-MM-dd');
      // const enddate = this.datePipe.transform(data.end_date, 'yyyy-MM-dd');
      this.payrollForm.patchValue({
        name: data.name,
        allowance_type:{ name: data.allowance_type?.name, id: data.allowance_type?.id },
        pf_include:data.pf_include,
        is_deduction:data.is_deduction,
        is_default: false,
        gradelevel: { name: data.grade?.name, id: data.grade?.id },
        percentage: data.percentage,
        from_date:data.from_date,
        to_date:data.to_date
        
      })
    }
    else {
      // this.payrollForm.reset('')
      this.payrollForm = this.fb.group({
        name: [''],
        allowance_type:[''],
        pf_include:[false],
        is_deduction:[false],
        is_default:[false],
        gradelevel:[''],
        percentage:[''],
        from_date:[''],
        to_date:['']

      })
    }
  }

  deletepayroll(data) {
    this.SpinnerService.show();
    this.payrollservice.deletepayroll(data.id)
      .subscribe((res) => {
        if(res.status == 'success'){
          this.payrollSearch('');
          this.notification.showSuccess(res.message)
          this.SpinnerService.hide();
         } else {
          this.notification.showError(res.description)
          this.SpinnerService.hide();
          return false;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  payrollSearch(hint: any) {
    if (hint == 'next') {
      this.get_payrollSummary(this.presentpagepayroll + 1)
    }
    else if (hint == 'previous') {
      this.get_payrollSummary(this.presentpagepayroll - 1)
    }
    else {
      this.get_payrollSummary(1)
    }

  }

  
  // payroll component master
  get_payrollSummary(pageno) {
    this.SpinnerService.show();
    this.payrollservice.payrollSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.payrollList = result['data']
        this.fromDate=this.payrollList.from_date
        console.log('formdate',this.fromDate)
        console.log('Payroll',this.payrollList)
        let dataPagination = result['pagination'];
        if (this.payrollList.length > 0) {
          this.has_nextpayroll = dataPagination.has_next;
          this.has_previouspayroll = dataPagination.has_previous;
          this.presentpagepayroll = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  getAllowance() {

    let gstkeyvalue: String = "";
    this.getpayFunctional(gstkeyvalue);
    this.payrollForm.get('allowance_type').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('component')
      }),
      switchMap(value => this.payrollservice.getAllowance(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.allowanceTypeList = datas;
    })

  }

  private getpayFunctional(gstkeyvalue) {
    this.payrollservice.getAllowanceapi(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.allowanceTypeList = datas;
      })
  }
    // this.SpinnerService.show();
    // this.payrollservice.getAllowance()
    //   .subscribe((results: any[]) => {
    //     this.SpinnerService.hide();
    //     let datas = results['data'];
    //     this.allowanceTypeList = datas;
    //   },
    // error => {
    //   this.errorHandler.handleError(error);
    //   this.SpinnerService.hide();
    // }
    // )
  
  

    payrollSubmit() {
      this.SpinnerService.show();
      if (this.payrollForm.value.name === "" || this.payrollForm.value.name===null) {
        this.toastr.error('Please Enter Name');
        this.SpinnerService.hide();
        return false;
      }
      
      if (this.payrollForm.value.allowance_type === "" || this.payrollForm.value.allowance_type===null) {
        this.toastr.error('Please Select Allowance Type');
        this.SpinnerService.hide();
        return false;
      }
      else if (this.payrollForm.value.grade === "" || this.payrollForm.value.grade===null) {
        this.toastr.error('Please Select Grade');
        this.SpinnerService.hide();
        return false;
      }
      else if (this.payrollForm.value.percentage === "" || this.payrollForm.value.percentage===null) {
        this.toastr.error('Please Enter Percentage');
        this.SpinnerService.hide();
        return false;
      }
      else if (this.payrollForm.value.from_date === "" || this.payrollForm.value.from_date===null) {
        this.toastr.error('Please Select From Date');
        this.SpinnerService.hide();
        return false;
      }
      else if (this.payrollForm.value.to_date === "" || this.payrollForm.value.to_date===null) {
        this.toastr.error('Please Select To Date');
        this.SpinnerService.hide();
        return false;
      }
      else{
        let allowance = this.payrollForm.get('allowance_type').value.id;
        let from_date=this.datepipe.transform((this.payrollForm.get('from_date').value),'yyyy-MM-dd')
        let to_date=this.datepipe.transform((this.payrollForm.get('to_date').value),'yyyy-MM-dd')
        let type = this.payrollForm.get('gradelevel').value.id;
        let data = { ...this.payrollForm.value, allowance_type:allowance , gradelevel: type ,from_date:from_date,to_date:to_date};
        let dataToSubmit;
        if (this.ID_Value_To_payrollEdit !== '') {
          let id = this.ID_Value_To_payrollEdit;
          dataToSubmit = Object.assign({}, { 'id': id }, data);
        } else {
          dataToSubmit = data;
        }
        this.payrollservice.payrollForm(dataToSubmit).subscribe(
          res => {
            this.SpinnerService.hide();
            console.log("payroll click", res);
            if (res.status === 'success') {
              if (this.ID_Value_To_payrollEdit !== '') {
                this.notification.showSuccess('Successfully Updated');
              } else {
                this.notification.showSuccess('Successfully Created');
              }
              this.payrollForm.reset({
                allowance_type: '',
                pf_include: false,
                is_deduction: false,
                is_default: false,
                gradelevel: '',
                from_date:'',
                to_date:''
  
              });
      
              this.payrollSummary = true;
              this.payrollcreation = false;
              this.employeePFStructurecreation = false;
              this.employeePFStructure = false;
              this.payrollSearch('');
              this.ID_Value_To_payrollEdit = '';
            }
            else if(res.name_message){
              this.notification.showError(res.name_message)
            }
            else if(res.percentage_message){
              this.notification.showError(res.percentage_message)
            }
            else if(res.date_message){
              this.notification.showError(res.date_message)
            }
            
            else {
              this.notification.showError(res.description);
            }
          },
          error => {
            this.SpinnerService.hide();
            this.errorHandler.handleError(error);
          }
        );
      }
    
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
    this.payrollservice.searchpaycomp(this.send_value, page).subscribe(result =>{
      this.SpinnerService.hide();
      this.payrollList = result['data'];
      this.presentpagepayroll = page

    
    })
  }
  clearForm()
  {
    this.datassearch = this.fb.group({
      name: ''
    })
    // this.datassearch.reset();
    this.searchName();
  }

  getGrade() {
  
    let gstkeyvalue: String = "";
    this.getpaygradefunctional(gstkeyvalue);
    this.payrollForm.get('gradelevel').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('component')
      }),
      switchMap(value => this.payrollservice.getGrade(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.gradeList = datas;
    })

  }

  private getpaygradefunctional(gstkeyvalue) {
    this.payrollservice.getpayrollApi(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.gradeList = datas;
      })
  }
    public displayfnalowance(allow?: any): string | undefined {
      return allow ? allow.name : undefined;
    }

  autocompleteBonusScroll(){
    setTimeout(() => {
      if (
        this.matallowAutocomplete &&
        this.autocompleteTrigger &&
        this.matallowAutocomplete.panel
      ) {
        fromEvent(this.matallowAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map((x: Event) => (x.target as HTMLElement).scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((scrollTop) => {
            const scrollHeight = this.matallowAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matallowAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice
                  .getAllowanceapi(this.getallowInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.allowanceTypeList = this.allowanceTypeList.concat(data);
                    if (this.allowanceTypeList.length > 0) {
                      this.has_next = dataPagination.has_next;
                      this.has_previous = dataPagination.has_pagination;
                      this.currentpage = dataPagination.index;
                    }
                  });
              }
            }
          });
      }
    });
 
 
  }

  public displayfnpayroll(payroll?: any): string | undefined {
    return payroll ? payroll.name : undefined;
  }

  autocompletepayrollScroll(){
    setTimeout(() => {
      if (
        this.matpayrollAutocomplete &&
        this.autocompleteTrigger &&
        this.matpayrollAutocomplete.panel
      ) {
        fromEvent(this.matpayrollAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map((x: Event) => (x.target as HTMLElement).scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((scrollTop) => {
            const scrollHeight = this.matpayrollAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpayrollAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice
                  .getpayrollApi(this.getallowInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.gradeList = this.gradeList.concat(data);
                    if (this.gradeList.length > 0) {
                      this.has_next = dataPagination.has_next;
                      this.has_previous = dataPagination.has_pagination;
                      this.currentpage = dataPagination.index;
                    }
                  });
              }
            }
          });
      }
    });
 
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
    this.payrollcreation = false;
    this.payrollSummary = false;
  }
  uploadDocuments(){
    if(this.images === null || this.images ===  undefined)
    {
      this.notification.showError('Please Select File');
      return false;
    }
    this.SpinnerService.show()
    this.payrollservice.MasterUpload(this.Action,this.images).subscribe(data=>{
      this.SpinnerService.hide()
      this.notification.showSuccess(data.message)
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  downloadTemplate()
  {
    const download='payrollmaster_payrollcomponent_upload'
    this.SpinnerService.show()
    this.payrollservice.MasterUploadDownload(download,1).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrollmaster_payrollcomponent_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.payrollcreation = false;
    this.payrollSummary = true;

  }
}
