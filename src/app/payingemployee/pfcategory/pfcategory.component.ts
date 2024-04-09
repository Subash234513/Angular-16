import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from '../../service/notification.service';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, from, fromEvent, } from 'rxjs';
import { PayingempShareService } from '../payingemp-share.service';
import { MatSelectChange } from '@angular/material/select';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



export interface paycomonent {
  id: number;
  name: string;
  map_id: number;
}

export interface iemployeeList {
  id: number;
  name: string;
  map_id: number;
}
@Component({
  selector: 'app-pfcategory',
  templateUrl: './pfcategory.component.html',
  styleUrls: ['./pfcategory.component.scss']
})
export class PfcategoryComponent implements OnInit {

  setcolor = 'primary';
  allowanceTypeList: any;
  task_Master_Menu_List: any
  clientSummary: boolean
  payrollSummary: boolean;
  employeePFStructurecreation: boolean;
  employeePFStructure: boolean = true;
  moduleSummary: boolean
  mappingSummary: boolean
  clientcreation: boolean
  payrollcreation: boolean
  modulecreation: boolean
  mappingcreation: boolean
  clientList: any;
  payrollList: any;
  PFStructureList: any;
  mappingList: any;
  // clientForm:FormGroup;
  payrollForm: FormGroup;
  PFForm: FormGroup;
  // moduleForm:FormGroup;
  // mappingForm:FormGroup;
  presentpageclient: number = 1;
  pagesizeclient = 10;
  has_nextclient = true;
  has_previousclient = true;
  presentpagepayroll: number = 1;
  pagesizepayroll = 10;
  has_nextpayroll = true;
  has_previouspayroll = true;
  presentpagepf: number = 1;
  pagesizepf = 10;
  has_nextPF = true;
  has_previousPF = true;
  presentpagemapping: number = 1;
  pagesizemapping = 10;
  has_nextmapping = true;
  has_previousmapping = true;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  datassearch: FormGroup;
  send_value: String = "";
  Action='payollmaster_employeepfstructure_upload'
  selectedOptions: any[] = [];

  Objects = {
    allowanceTypeList: [{ id: 1, text: 'Percentage' }, { id: 2, text: 'Fixed' }],
  }
  TypeOfForm: string;
  ID_Value_To_PFEdit: any = ''
  ID_Value_To_payrollEdit: any = ''
  filterCtrl = new FormControl();
  filteredOptions: Observable<any[]>;
  newData: any;
  uploadForms: FormGroup;
  inputs = document.querySelectorAll('.file-input')
  @ViewChild('labelImport')  labelImport: ElementRef;
  images: any;
  isFileUpload: boolean = false;

  constructor(
    private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private payrollservice: PayingempService,
    private notification: NotificationService, private datePipe: DatePipe, private payrollShareService: PayingempShareService
  ) {}
  public paycomponent_array=[]; 
  public chipSelectedemployee: iemployeeList[] = [];
  public chipSelectedemployeeid = [];
  public chipRemovedemployeeid = [];

  public separatorKeysCodes: number[] = [ENTER, COMMA];
 
  @ViewChild('employeeInput') employeeInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  
  ngOnInit(): void {
    // payroll form
    // this.paycomponent_search()
    this.payrollForm = this.fb.group({
      name: [''],
      allowance_type: [''],
      pf_include: [false],
      is_deduction: [false],
      
    })
    // pf form
    this.PFForm = this.fb.group({
      name: [''],
      percentage: [''],
      amount: [''],
      is_standard: [false],
      GlNo:[''],
      paycomponentflagmaster: [''],
      paycomponentflagmasters: [[{}]]
    })
   
    
    this.PFForm.get('paycomponentflagmaster').valueChanges.pipe(switchMap(value=>this.payrollservice.getpaycomponents(value,1))).subscribe(data=>{
      console.log('data',data)
      this.paycomponent_array=data['data']
    })
    
    if (this.PFForm.get('paycomponentflagmaster') !== null) {
    this.PFForm.get('paycomponentflagmaster').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.payrollservice.getpaycomponents(value, 1)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      ))
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.paycomponent_array = datas;
    console.log("allemployeelist", this.paycomponent_array);
  });
}
    // this.payrollSearch('');
    // this.getAllowance();
    this.PFSearch('');
    if (this.payrollShareService.payroll.value == 'Payroll') {
      this.payrollSummary = true;
      this.employeePFStructure = false
    }
    if (this.payrollShareService.employeepf.value == 'EmployeePF') {
      this.payrollSummary = false;
      this.employeePFStructure = true;
    }
    this.datassearch = this.fb.group({
      name: ''
    })

    this.getpaymentcomponentinfo();

    this.filteredOptions = this.filterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value))
    );
    this.uploadForms = this.fb.group({
      files: ['', Validators.required],
    })
  }

  filterOptions(value: string): any[] {
    // Implement your custom filter logic here
    const filterValue = value.toLowerCase();
    return this.paycomponent_array.filter(option => option.name.toLowerCase().includes(filterValue));
  }
      // paycomponentflagmaster: [[{}]],
  // control=this.PFForm.get('paycomponentflagmaster')

  get_pFSummary(pageno) {
    this.SpinnerService.show();
    this.payrollservice.pFSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.PFStructureList = result['data']
        let dataPagination = result['pagination'];
        if (this.PFStructureList.length > 0) {
          this.has_nextPF = dataPagination.has_next;
          this.has_previousPF = dataPagination.has_previous;
          this.presentpagepf = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  PFSearch(hint: any) {
    if (hint == 'next') {
      this.get_pFSummary(this.presentpagepf + 1)
      this.presentpagepayroll += 1
    }
    else if (hint == 'previous') {
      this.get_pFSummary(this.presentpagepf - 1)
      this.presentpagepayroll -= 1
    }
    else {
      this.get_pFSummary(1)
    }

  }


  addEmployeePF(formtype, data) {
    this.TypeOfForm = formtype;
    const selectedValues = this.PFForm.get('paycomponentflagmaster').value;
    console.log("Selected Values", selectedValues)
    // const selectedIds = selectedValues.map((type: any) => type.id);
    // const refIds = selectedValues.map((id: number) => ({ "ref_id": id }));
    // console.log("Selected comp", refIds)



    this.employeePFStructure = false;
    this.employeePFStructurecreation = true;
    if (data != '') {
      this.ID_Value_To_PFEdit = data.id
      this.SpinnerService.show()
      this.payrollservice.getPF_ParticularGet(data.id)

        .subscribe((res) => {
          this.SpinnerService.hide()
          console.log("API Response", res)
          const extractedId = res.paycomponentflagmaster.map(item => item.id);
          console.log(res)
          // this.paycomponent_array.forEach(item => {
          //   if (item.id === extractedId) {
          //     item.selected = true;
          //   }
          // });
          // const selectedValues = this.paycomponent_array.filter(item => item.selected).map(item => item.id);
          // this.PFForm.get('paycomponentflagmaster').setValue(selectedValues);
          // const selectedValues = this.paycomponent_array.filter(item => item.id === extractedId).map(item => item.id);
          this.PFForm.get('paycomponentflagmaster').setValue(extractedId);
          // this.PFForm.controls.paycomponentflagmaster.get('map_id').setValue(9);
          // const extractedId = datas.segment.map(segment => segment.name);
        this.chipSelectedemployee = data.paycomponentflagmaster
        const refIds = this.chipSelectedemployee.map((ids) => ({ "ref_id": ids.id }));
          console.log("Get Data", res);
          const percentageValue = res.percentage.replace('%', '');
          this.PFForm.patchValue({
            name: res.name,
            percentage: percentageValue,
            amount: res.amount,
            is_standard: res.is_standard,
            GlNo:res.glno,
            paycomponentflagmasters: refIds


          })
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

    }
    else if (data.is_standard === null || data.is_standard === undefined) {
      data.is_standard = false;
    }

    else {
      this.payrollForm.reset('')
      
      this.PFForm = this.fb.group({
        name: [''],
        percentage: [''],
        amount: [''],
        is_standard: [false],
        paycomponentflagmaster: [[{}]],
      })
    }
  }

  deletePFStructure(data) {
    this.SpinnerService.show();
    this.payrollservice.deletepf(data.id)
      .subscribe((res) => {
        if (res.status == 'success') {
          this.notification.showSuccess(res.message)
          this.PFSearch('');
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

  pfSubmit() {
    this.SpinnerService.show();
    if (this.PFForm.value.name === "" || this.PFForm.value.name===null) {
      this.toastr.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    else if (this.PFForm.value.percentage === "" || this.PFForm.value.percentage===null) {
      this.toastr.error('Please Enter Percentage');
      this.SpinnerService.hide();
      return false;
    }
    else if (this.PFForm.value.amount === "" || this.PFForm.value.amount===null) {
      this.toastr.error('Please Enter Amount');
      this.SpinnerService.hide();
      return false;
    }
    else if(this.chipSelectedemployee.length==0){
      this.toastr.error('Please Select Pay Component')
      this.SpinnerService.hide();
      return false;
    }
    // else if(this.PFForm.value.GlNo === "" || this.PFForm.value.GlNo === null){
    //   this.toastr.error('Please Enter GL No')
    //   this.SpinnerService.hide();
    //   return false;
    // }
   
    else{
      let data = this.PFForm.value
      console.log("PF Form Values", data)
      let dataToEdit;
      console.log("Submitted Data", data)
      // const selectedValues = this.PFForm.get('paycomponentflagmaster').value;
      // if (!Array.isArray(selectedValues)) {
      //   console.error('Selected values is not an array:', selectedValues);
      //   // Handle this situation according to your requirements
      //   return;
      // }
      this.PFForm.value.segment=this.chipSelectedemployee
      const selectedValues = this.PFForm.value.segment;
      // const refIds = selectedValues.map((id) => ({ "ref_id": id.id}));
      const refIds = selectedValues.map((ids) => ({ "ref_id": ids.id}));
      
      dataToEdit = {
        "name": data.name,
        "percentage": data.percentage,
        "amount": data.amount,
        // "is_standard": false,
        "paycomponentflagmaster": refIds,
        "glno":data.GlNo
  
      }
      console.log("Selected comp", refIds)
      let dataToSubmit;
      if (this.ID_Value_To_PFEdit != '') {
        let id = this.ID_Value_To_PFEdit
        dataToSubmit = Object.assign({}, { 'id': id }, dataToEdit)
      }
      else {
        dataToSubmit = {
          "name": data.name,
          "percentage": data.percentage,
          "amount": data.amount,
          // "is_standard": false,
          "paycomponentflagmaster": refIds,
          "glno":data.GlNo
        }
      }
      this.SpinnerService.show()
      this.payrollservice.pfForm(dataToSubmit)
        .subscribe(res => {
          this.SpinnerService.hide();
          console.log("pf  click", res)
        
          if (res.status == 'success') {
            if (this.ID_Value_To_PFEdit != '') {
              this.PFForm.reset();
              this.chipSelectedemployee=[]
              this.notification.showSuccess('Successfully Updated')
              
              this.ID_Value_To_PFEdit = ''
            } else {
              this.PFForm.reset();
              this.chipSelectedemployee=[]
              this.notification.showSuccess('Successfully Created')
            
              this.ID_Value_To_PFEdit = ''
            }
            this.PFForm = this.fb.group({
              name: [''],
              percentage: [''],
              amount: [''],
              GlNo:[''],
              is_standard: [false],
              paycomponentflagmaster: [refIds],
              paycomponentflagmasters: ['']
  
            })
            this.payrollSummary = false;
            this.payrollcreation = false;
            this.employeePFStructurecreation = false;
            this.employeePFStructure = true;
            this.PFSearch('');
            
          }
          else if(res.name_message){
            this.notification.showError(res.name_message)
          }
          else if(res.percentage_message){
            this.notification.showError(res.percentage_message)
          }
           else {
            this.notification.showError(res.description)
            
            return false;
          }
        },
          error => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          }
        )
       
    }


  }

  oncancelPF() {
    this.payrollcreation = false;
    this.payrollSummary = false;
    this.employeePFStructurecreation = false;
    this.employeePFStructure = true;
    this.clearMatChipInput();
    this.PFForm.reset();
  }

     
  clearMatChipInput() {
    this.chipSelectedemployee = [];
    this.PFForm.get('paycomponentflagmaster').setValue(null);
  }

  searchName() {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    console.log("Search Values", formValue)
    this.send_value = ""
    if (formValue.name) {
      this.send_value = this.send_value + '&query=' + formValue.name
    }
    let page = 1;
    this.payrollservice.searchpfcategory(this.send_value, page).subscribe(result => {
      this.SpinnerService.hide();
      this.PFStructureList = result['data'];
      this.presentpagepf = page;


    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  clearForm() {
    this.datassearch = this.fb.group({
      name: ''
    })
    // this.datassearch.reset();
    this.searchName();
  }
  getpaymentcomponentinfo() {

    this.payrollservice.getpaycomponents('', 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }
  paycomponent_search(value) {
    this.payrollservice.getpaycomponents(value, 1).subscribe(data => {
      this.paycomponent_array = data['data'];
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
  isOptionSelected(optionId: number): boolean {
    return this.selectedOptions.includes(optionId);
  }
  public pagination: any = {
    has_next: true,
    index: 1,
    limit: 10
  };


  public loadMoreOptions(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if (atBottom && this.pagination.has_next) {
      this.pagination.index++;
      this.payrollservice.getpaycomponents('', this.pagination.index).subscribe(data => {
        this.paycomponent_array = data['data'];
      });
    }
  }
  public onDropdownOpened(opened: boolean): void {
    if (opened && this.pagination.has_next) {
      this.pagination.index++;
      this.payrollservice.getpaycomponents('', this.pagination.index).subscribe(data => {
        // this.paycomponent_array = data['data'];
        const newOptions = data.data;
        this.paycomponent_array = [...this.paycomponent_array, ...newOptions];
        console.log("PayComponent Data", this.paycomponent_array)
        this.pagination.has_next = data.pagination.has_next;
      });
    }
  }

  previousSelection: any[] = [];

  onSelectionChange($event) {
    console.log("Selection Event", $event)

    console.log("flag master", this.PFForm.value)
    let apiresp = this.PFForm.get('paycomponentflagmasters').value;
    console.log("flags", apiresp)
    let mapid = apiresp[0].map_id;
    console.log("MAP ID", mapid)

    if ($event.isUserInput == true) {

      if ($event.source._selected == false) {
        this.SpinnerService.show()
        this.payrollservice.deletepfCategory($event.source.value, mapid).subscribe(res => {
          this.SpinnerService.hide()
          if (res.status == 'success') {
            this.notification.showSuccess("Updated Successfully")
          } else {
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            return false;
          }
        },
        error=>{
          this.SpinnerService.hide()
        })
      }
    }


  }
  public removedemployee(employee: iemployeeList): void {
    const index = this.chipSelectedemployee.indexOf(employee);
    if (index >= -1) {
      this.chipSelectedemployeeid.push(employee);
      this.chipSelectedemployee.splice(index, 1);
      this.chipSelectedemployeeid.splice(index, 1);
        this.employeeInput.nativeElement.value = '';
        const apiresp = this.chipSelectedemployee.map(res => res.map_id);
        console.log("flags", apiresp);
        const mapId = apiresp[0];
        if (mapId) {
          this.payrollservice.deletetemplate(employee.id, mapId).subscribe(res => {
           
          });
        }
      }
      
    
  }
  
  
  // public employeeSelected(event: MatAutocompleteSelectedEvent): void {
  //   this.selectemployeeByName(event.option.value.name);
  //   if (this.employeeInput) {
  //     this.employeeInput.nativeElement.value = '';
  //   }
  // }

  // public employeeSelected(event: MatAutocompleteSelectedEvent): void {
  //   const selectedEmployee = event.option.value;
  //   this.selectemployeeByName(selectedEmployee.name);
  //   if (this.employeeInput) {
  //     this.employeeInput.nativeElement.value = '';
  //   }
  // }

  public employeeSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedEmployee = event.option.value;
    this.selectemployeeByName(selectedEmployee.name);
  }
  
  
  
  public selectemployeeByName(employeeName) {
    let foundcompany1 = this.chipSelectedemployee.filter(employee => employee.name == employeeName);
    if (foundcompany1.length) {
      return;
    }
    let foundcompany = this.paycomponent_array.filter(employee => employee.name == employeeName);
    if (foundcompany.length) {
      this.chipSelectedemployee.push(foundcompany[0]);
      this.chipSelectedemployeeid.push(foundcompany[0].id);
      if (this.employeeInput) {
        this.employeeInput.nativeElement.value = '';
      }
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
    this.employeePFStructurecreation = false;
    this.employeePFStructure = false;
  }
  uploadDocuments(){
    if(this.images === null || this.images === undefined)
    {
      this.notification.showError("Please Select File");
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
    const download='payollmaster_employeepfstructure_upload'
    this.SpinnerService.show()
    this.payrollservice.MasterUploadDownload(download,2).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payollmaster_employeepfstructure_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.employeePFStructurecreation = false;
    this.employeePFStructure = true;

  }


}





