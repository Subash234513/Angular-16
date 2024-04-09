import { Component, OnInit,ViewChild,Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempService } from '../payingemp.service';
import { DataService } from 'src/app/service/data.service';
import { AmountPipePipe } from '../amount-pipe.service';
import { MatStepper } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

export interface district {
  id: string;
  name: string;
}
export interface city {
  id: string;
  name: string;
}
export interface pincode {
  no: string;
  id: number;
}
export interface state {
  name: string;
  id: number;
}
export interface orgtype {
  id: string;
  name: string;
}
export interface Designation {
  id: string;
  name: string;
}
export interface Grade {
  id: string;
  name: string;
}
export interface FunctionHead {
  id: string;
  full_name: string;
}
export interface EmployeeBranch {
  id: string;
  name: string;
}
export interface BusinessSegment {
  id: string;
  name: string;
}
export interface CostCenter {
  id: string;
  name: string;
}
export interface Candidate {
  id: string;
  full_name: string;
}

export interface bank {
  id: string;
  name: string;
}
export interface bankbranch {
  id: string;
  name: string;
}
@Component({
  selector: 'app-empdetail-creation',
  templateUrl: './empdetail-creation.component.html',
  styleUrls: ['./empdetail-creation.component.scss']
})
export class EmpdetailCreationComponent implements OnInit {
  genderList =[{id: "1",text: "Male"},{id: "2",text: "Female"}];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('autocit') matcityAutocomplete: MatAutocomplete;
  @ViewChild('cityInput') cityInput: any;

  @ViewChild('autodis') matdistrictAutocomplete: MatAutocomplete;
  @ViewChild('districtInput') districtInput: any;

  @ViewChild('statetype') matstateAutocomplete: MatAutocomplete;
  @ViewChild('stateInput') stateInput: any;

  @ViewChild('pintype') matpincodeAutocomplete: MatAutocomplete;
  @ViewChild('pinCodeInput') pinCodeInput: any;

  @ViewChild('desg') matdesignationAutocomplete: MatAutocomplete;
  @ViewChild('designationInput') designationInput: any;

  @ViewChild('fn') matFHAutocomplete: MatAutocomplete;
  @ViewChild('fnInput') fnInput: any;

  @ViewChild('orgtype') matorgAutocomplete: MatAutocomplete;
  @ViewChild('orgtypesInput') orgtypesInput: any;


  @ViewChild('rmemp') matAutocomplete: MatAutocomplete;
  @ViewChild('rmInput') rmInput: any;

  @ViewChild('empbranch') matAutocompleteempbranch: MatAutocomplete;
  @ViewChild('empbranchInput') empbranchInput: any;

  @ViewChild('bs') matAutocompletebs: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;

  @ViewChild('cc') matAutocompletecc: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;

  @ViewChild('candidate') matAutocompletecandidate: MatAutocomplete;
  @ViewChild('candidateInput') candidateInput: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  empAddForm:FormGroup;
  AddressForm:FormGroup;
  BankForm:FormGroup;
  candidateForm:FormGroup;
  maxlength=18;
  isLoading = false;
  pinCodeList: Array<pincode>;
  cityList: Array<city>;
  stateList: Array<state>;
  districtList: Array<district>;
  orgtypeList: Array<orgtype>;
  designationList: Array<Designation>;
  gradeList: Array<Grade>;
  functionalHeadList: Array<FunctionHead>;
  empBranchList: Array<EmployeeBranch>;
  bsList: Array<BusinessSegment>;
  ccList: Array<CostCenter>;
  candidateList: Array<Candidate>;
  bankList: Array<bank>;
  bankbranchList: Array<bankbranch>;
  workmodeList:any;
  cityId: number;
  districtId: number;
  stateId: number;
  pincodeId: number;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  pan_status: any;
  gst_status: any;
  stateID= 0;
  has_districtnext = false;
  has_districtprevious = true;
  districtcurrentpage: number = 1;
  has_citynext = true;
  has_cityprevious = true;
  citycurrentpage: number = 1;
  addressarray:any;
  bankInfoarray:any;
  entityList: any;
  pfamountList: any;
  setcolor = 'primary';
  isLinear = true;
  employmentTypeList: any;

  constructor(private formBuilder: FormBuilder,private router: Router,private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService,
    private payrollservice: PayingempService,private notification: NotificationService,private dataService: DataService
    
    //  private toastr: ToastrService, 
    // private shareService: ShareService
    ) { }
    
    personalInformation:boolean
    address:boolean
    employeeBank:boolean
  ngOnInit(): void {
    this.personalInformation=true;
    this.address=true;
    this.employeeBank=true;
    
    this.candidateForm = this.formBuilder.group({
      candidate_id:[''],
    })
    this.empAddForm  = this.formBuilder.group({
      first_name:[''],
      middle_name:[''],
      last_name:[''],
      full_name:[''],
      email_id:['', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      gender:[''],
      phone_no:[''],
      // accountnumber:[''],
      dob:[''],
      doj:['',[Validators.required]],
      // actual_doj:[''],
      entity_id:[''],
      designation_id:['',[Validators.required]],
      grade:['',[Validators.required]],
      functional_head:['',[Validators.required]],
      emp_branch:['',[Validators.required]],
      businesssegment:['',[Validators.required]],
      costcentre:['',[Validators.required]],
      workmode:['',[Validators.required]],
      department_id:['',[Validators.required]],
      employment_type:['', [Validators.required]],
      disability:[false],
      pf_type:[''],
      pf_percentage:[''],
      standard_ctc:[''],
      payroll_date:'',

      // effective_from:[''],
      // address: this.formBuilder.group({
      //   line1: [''],
      //   line2: [''],
      //   line3: [''],
      //   pincode_id: [''],
      //   city_id: [''],
      //   district_id: [''],
      //   state_id: [''],
      // }),

      
      
      
  });
  this.AddressForm=this.formBuilder.group({
    address: new FormArray([
      this.getcandidateInfoAddressType(1),
      this.getcandidateInfoAddressType(2)
    ]),
  })
  this.BankForm=this.formBuilder.group({
    employeebankinfo: new FormArray([
      this.getdetails()
    ]),
  })

  
  this.getWorkMode();
  this.entity_List();
  this.PF_amount();

   
  }
  //  PersonalVar=document.querySelector('.PersonalInfo');
  // AddressVar=document.querySelector('.Address');
  //  EmployeeVar=document.querySelector('.EmployeeBank');
  PersonalInfo(){
    const PersonalVar=document.querySelector('.PersonalInfo');
    const AddressVar=document.querySelector('.Address');
    const EmployeeVar=document.querySelector('.EmployeeBank');
    this.personalInformation=true;
    this.address=false;
    this.employeeBank=false;
    PersonalVar.classList.add('click');
    AddressVar.classList.remove('click');
    EmployeeVar.classList.remove('click');
  }
  // PersonalNext(){
  //   this.personalInformation=false;
  //   this.address=true;
  //   this.employeeBank=false;
  // }
  // AddressNext(){
  //   this.personalInformation=false;
  //   this.address=false;
  //   this.employeeBank=true;
  // }
  Address(){
    const PersonalVar=document.querySelector('.PersonalInfo');
    const AddressVar=document.querySelector('.Address');
    const EmployeeVar=document.querySelector('.EmployeeBank');
    this.personalInformation=false;
    this.address=true;
    this.employeeBank=false;
    PersonalVar.classList.remove('click');
    AddressVar.classList.add('click');
    EmployeeVar.classList.remove('click');
  }
  EmployeeBank(){
    const PersonalVar=document.querySelector('.PersonalInfo');
    const AddressVar=document.querySelector('.Address');
    const EmployeeVar=document.querySelector('.EmployeeBank');
    this.personalInformation=false;
    this.address=false;
    this.employeeBank=true;
    PersonalVar.classList.remove('click');
    AddressVar.classList.remove('click');
    EmployeeVar.classList.add('click');
  }
  // PersonalInfo(){

  // }
  // Address(){
  //   this.AddressVar.classList.add('click')
  // }
  // EmployeeBank(){

  // }
 
  getcandidateInfoAddressType(type){
    let address = this.formBuilder.group({
      line1: new FormControl(''),
      line2:  new FormControl(''),
      line3:  new FormControl(''),
      type:  new FormControl(type),
      state_id: new FormControl(''),
      district_id: new FormControl(''),
      city_id:  new FormControl(''),
      pincode_id:  new FormControl('')
    })
    return address
    }



    getCandidateBio() {
      this.payrollservice.getCandidate_bio(this.candidate_Id)
        .subscribe(result => {
          console.log("get candidate bio-data",result)
          let details = result
          // address
          while ((this.AddressForm.get('address') as FormArray).length) {
            (this.AddressForm.get('address') as FormArray).removeAt(0);
            (this.AddressForm.get('address') as FormArray).removeAt(1);
          }
        for (let detail of details.address ) {
          let line1: FormControl = new FormControl('');
          let line2: FormControl = new FormControl('');
          let line3: FormControl = new FormControl('');
          let type: FormControl = new FormControl('');
          let state_id: FormControl = new FormControl('');
          let district_id: FormControl = new FormControl('')
          let city_id: FormControl = new FormControl('')
          let pincode_id: FormControl = new FormControl('')

          line1.setValue(detail.line1);
          line2.setValue(detail.line2);
          line3.setValue(detail.line3);
          type.setValue(detail.type.id);
          state_id.setValue(detail.state_id);
          district_id.setValue(detail.district_id);
          city_id.setValue(detail.city_id);
          pincode_id.setValue(detail.pincode_no);
          this.getaddressFormArray().push(new FormGroup({
            line1: line1,
            line2: line2,
            line3: line3,
            type: type,
            state_id: state_id,
            district_id: district_id,
            city_id: city_id,
            pincode_id: pincode_id,
          }))
        }
          // personal info
          let date_dob = this.datePipe.transform(result.dob, 'yyyy-MM-dd');
          this.empAddForm.patchValue({
            first_name:result.first_name,
            middle_name:result.middle_name,
            last_name:result.last_name,
            full_name:result.full_name,
            gender:result.gender.id,
            email_id:result.email_id,
            dob: date_dob,
            phone_no:result.phone_no
          })   

        })
  
    }

    getaddressFormArray(): FormArray {
      return this.AddressForm.get('address') as FormArray;
    }




  onEmp_detailCancelClick(){
    this.onCancel.emit()
  }


  createFormate() {
    let data = this.empAddForm.controls;
    // let datas = this.empAddForm.controls.address
    let vendorclass = new employee();
    vendorclass.first_name = data['first_name'].value;
    vendorclass.middle_name = data['middle_name'].value;
    vendorclass.last_name = data['last_name'].value;
    vendorclass.full_name = data['full_name'].value;
    vendorclass.email_id = data['email_id'].value;
    vendorclass.gender = data['gender'].value;
    vendorclass.phone_no = data['phone_no'].value;
    // vendorclass.accountnumber = data['accountnumber'].value;
    vendorclass.entity_id=1
    vendorclass.dob = data['dob'].value;
    vendorclass.doj = data['doj'].value;
    vendorclass.entity_id = data['entity_id'].value;
    vendorclass.designation_id = data['designation_id'].value.id;
    vendorclass.grade = data['grade'].value.id;
    vendorclass.functional_head = data['functional_head'].value.id;
    vendorclass.emp_branch = data['emp_branch'].value.id;
    vendorclass.businesssegment = data['businesssegment'].value.id;
    vendorclass.costcentre = data['costcentre'].value.id;
    vendorclass.workmode = data['workmode'].value;
    vendorclass.department_id = data['department_id'].value.id;

    vendorclass.disability = data['disability'].value;
    vendorclass.pf_type = data['pf_type'].value;
    vendorclass.pf_percentage = data['pf_percentage'].value;
    vendorclass.standard_ctc = data['standard_ctc'].value;
    vendorclass.employment_type = data['employment_type'].value;

    
    let dateValue = this.empAddForm.value;
    vendorclass.dob = this.datePipe.transform(dateValue.dob, 'yyyy-MM-dd');
    vendorclass.doj = this.datePipe.transform(dateValue.doj, 'yyyy-MM-dd'); 
    vendorclass.payroll_date = this.datePipe.transform(dateValue.payroll_date,'yyyy-MM-dd');
    vendorclass.org_id = 1
    console.log("empdetail", vendorclass)
    return vendorclass;
  }


  isShowPF_percentage=false;
  regStatusDropDown(data) {
    if (data.id == 3) {
      this.isShowPF_percentage = true;
    } else {
      this.isShowPF_percentage = false;
    }
  }

 

  onSubmitEmp_detailClick() {
    this.SpinnerService.show();
    
    let details = this.AddressForm.value
    let Bank=this.BankForm.value
    this.addressarray = details.address
    this.bankInfoarray = Bank.employeebankinfo

    for(let i=0;i<this.addressarray.length;i++){
      this.addressarray[i].pincode_id = this.addressarray[i].pincode_id.id
      this.addressarray[i].city_id = this.addressarray[i].city_id.id
      this.addressarray[i].district_id = this.addressarray[i].district_id.id
      this.addressarray[i].state_id = this.addressarray[i].state_id.id
    }

    for(let i=0;i<this.bankInfoarray.length;i++){
      this.bankInfoarray[i].bank_id = this.bankInfoarray[i].bank_id.id
      this.bankInfoarray[i].branch_id = this.bankInfoarray[i].branch_id.id
    }
    
   
      console.log("address",this.addressarray)
      this.payrollservice.empdetailCreateForm(this.createFormate(),this.AddressForm.value.address,this.BankForm.value.employeebankinfo)
        .subscribe(res => {
          console.log("vendor", res)
          if(res.id === undefined){
            this.notification.showError(res.description)
            this.SpinnerService.hide();
            return false;
          } 
          else {
            this.notification.showSuccess("saved Successfully!...")
            this.SpinnerService.hide();
            this.onSubmit.emit();
          }
        },
        error => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
        ) 
  }



  districtname(i){
    let districtkeyvalue: String = "";
  this.getDistrict(districtkeyvalue);

  // this.empAddForm.controls.address.get('district_id').valueChanges
  (this.empAddForm.get('address') as FormArray).at(i).get('district_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.payrollservice.get_districtValue(this.stateID,value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.districtList = datas;

    })

  }
  cityname(i){
    let citykeyvalue: String = "";
  this.getCity(citykeyvalue);

  // this.empAddForm.controls.address.get('city_id').valueChanges
  (this.empAddForm.get('address') as FormArray).at(i).get('city_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.payrollservice.get_city(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.cityList = datas;

    })
  }
  pincodename(i){
    let pincodekeyvalue: String = "";
  this.getPinCode(pincodekeyvalue);

  // this.empAddForm.controls.address.get('pincode_id').valueChanges
  (this.empAddForm.get('address') as FormArray).at(i).get('pincode_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.payrollservice.get_pinCode(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.pinCodeList = datas;

    })

  }
  statename(i){
    let statekeyvalue: String = "";
  this.getState(statekeyvalue);

  // this.empAddForm.controls.address.get('state_id').valueChanges
  (this.empAddForm.get('address') as FormArray).at(i).get('state_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),

      switchMap(value => this.payrollservice.get_state(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.stateList = datas;

    })
  }
  orgtypename(){
    let orgkeyvalue: String = "";
    this.getOrgType(orgkeyvalue);

    this.empAddForm.get('department_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.payrollservice.getOrgType(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
            
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.orgtypeList = datas;

      })
  }
  designationname(){
    let desgkeyvalue: String = "";
  this.getDesignation(desgkeyvalue);
  this.empAddForm.get('designation_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.payrollservice.get_designation(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.designationList = datas;

    })
  }
  gradeName(){
    let rmkeyvalue: String = "";
      this.getGrade(rmkeyvalue);
  
      this.empAddForm.get('grade').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.payrollservice.getGradeApi(value,1)
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

      functionalHead(){
        let gstkeyvalue: String = "";
       
        this.getFunctional(gstkeyvalue);
    
        this.empAddForm.get('functional_head').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.payrollservice.getFunctionalHead(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
                
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.functionalHeadList = datas;
    
          })
      }


      employeeBranchName(){
        let gstkeyvalue: String = "";
       
        this.getEmpBranch(gstkeyvalue);
    
        this.empAddForm.get('emp_branch').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.payrollservice.getEmpBranchApi(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
                
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.empBranchList = datas;
    
          })
      }

      businessSegmentName(){
        let gstkeyvalue: String = "";
       
        this.getBS(gstkeyvalue);
    
        this.empAddForm.get('businesssegment').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.payrollservice.getBSApiUserService(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
                
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.bsList = datas;
    
          })
      }

      costCenterName(){

        if(this.businessSeg_id == 0){
          this.notification.showError('Please Select Business Segment');
          this.SpinnerService.hide();
          return false
        }

        let gstkeyvalue: String = "";
       
        this.getCC(gstkeyvalue);
    
        this.empAddForm.get('costcentre').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.payrollservice.getCCApiUserService(value,this.businessSeg_id,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
                
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.ccList = datas;
    
          })
      }

      // candidtae
      candidateName(){
        let gstkeyvalue: String = "";
       
        this.getCandidate(gstkeyvalue);
    
        this.candidateForm.get('candidate_id').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.payrollservice.getCandidateApi(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
                
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.candidateList = datas;
    
          })
      }



      businessSeg_id=0;
      candidate_Id:number
        FocusOut_select_businessSegment(data){
          console.log("bs",data);
          this.businessSeg_id = data.id;
        }

        FocusOut_select_Candidate(data){
          this.candidate_Id = data.id;
          console.log("candidate id",this.candidate_Id)
          this.getCandidateBio();
        }


  pinCode(data) {
    this.cityId = data.city;
    this.districtId = data.district;
    this.stateId = data.state;
    this.pincodeId = data
    this.empAddForm.patchValue({
      address: {
        city_id: this.cityId,
        district_id: this.districtId,
        state_id: this.stateId,
        pincode_id: this.pincodeId
      }
    })
  }


  cityScroll() {
    setTimeout(() => {
      if (
        this.matcityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcityAutocomplete.panel
      ) {
        fromEvent(this.matcityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.get_city(this.cityInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.cityList = this.cityList.concat(datas);
                    if (this.cityList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  districtScroll() {
    setTimeout(() => {
      if (
        this.matdistrictAutocomplete &&
        this.autocompleteTrigger &&
        this.matdistrictAutocomplete.panel
      ) {
        fromEvent(this.matdistrictAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdistrictAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdistrictAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdistrictAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdistrictAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.get_districtValue(this.stateID,this.districtInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.districtList = this.districtList.concat(datas);
                    if (this.districtList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  stateScroll() {
    setTimeout(() => {
      if (
        this.matstateAutocomplete &&
        this.autocompleteTrigger &&
        this.matstateAutocomplete.panel
      ) {
        fromEvent(this.matstateAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matstateAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matstateAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matstateAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matstateAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.get_state(this.stateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.stateList = this.stateList.concat(datas);
                    if (this.stateList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  pinCodeScroll() {
    setTimeout(() => {
      if (
        this.matpincodeAutocomplete &&
        this.autocompleteTrigger &&
        this.matpincodeAutocomplete.panel
      ) {
        fromEvent(this.matpincodeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matpincodeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matpincodeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matpincodeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matpincodeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.get_pinCode(this.pinCodeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.pinCodeList = this.pinCodeList.concat(datas);
                    if (this.pinCodeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  designationScroll() {
    setTimeout(() => {
      if (
        this.matdesignationAutocomplete &&
        this.autocompleteTrigger &&
        this.matdesignationAutocomplete.panel
      ) {
        fromEvent(this.matdesignationAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdesignationAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdesignationAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdesignationAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdesignationAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.get_designation(this.designationInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.designationList = this.designationList.concat(datas);
                    if (this.designationList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteFunctionalHeadScroll() {
    setTimeout(() => {
      if (
        this.matFHAutocomplete &&
        this.autocompleteTrigger &&
        this.matFHAutocomplete.panel
      ) {
        fromEvent(this.matFHAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matFHAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matFHAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matFHAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matFHAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.getFunctionalHead(this.fnInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.functionalHeadList = this.functionalHeadList.concat(datas);
                    if (this.functionalHeadList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteorgScroll() {
    setTimeout(() => {
      if (
        this.matorgAutocomplete &&
        this.autocompleteTrigger &&
        this.matorgAutocomplete.panel
      ) {
        fromEvent(this.matorgAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matorgAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matorgAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matorgAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matorgAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.getOrgType(this.orgtypesInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.orgtypeList = this.orgtypeList.concat(datas);
                    if (this.orgtypeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteGradeScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.getGradeApi(this.rmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.gradeList = this.gradeList.concat(datas);
                    if (this.gradeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  autocompleteCanScroll() {
    setTimeout(() => {
      if (
        this.matAutocompletecandidate &&
        this.autocompleteTrigger &&
        this.matAutocompletecandidate.panel
      ) {
        fromEvent(this.matAutocompletecandidate.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompletecandidate.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompletecandidate.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompletecandidate.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompletecandidate.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollservice.getCandidateApi(this.candidateInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.candidateList = this.candidateList.concat(datas);
                    if (this.candidateList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }


  private getPinCode(pincodekeyvalue) {
    this.payrollservice.get_pinCode(pincodekeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.pinCodeList = datas;
        // console.log("pincode", datas)
      })
  }

  private getCity(citykeyvalue) {
    this.payrollservice.getCitySearch(citykeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        // console.log("city", datas)

      })
  }

  private getDistrict(districtkeyvalue) {
    this.payrollservice.districtdropdown(this.stateID,districtkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
      })
  }

  private getState(statekeyvalue) {
    this.payrollservice.getStateSearch(statekeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        // console.log("state", datas)

      })
  }

  private getOrgType(orgkeyvalue) {
    this.payrollservice.getOrgType(orgkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.orgtypeList = datas;
      })
  }
  private getDesignation(desgkeyvalue) {
    this.payrollservice.getDesignationSearch(desgkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.designationList = datas;
      })
  }
  private getGrade(rmkeyvalue) {
    this.payrollservice.getGradeApi(rmkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.gradeList = datas;
      })
  }

  private getFunctional(gstkeyvalue) {
    this.payrollservice.getFunctionalHead(gstkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.functionalHeadList = datas;
      })
  }
  private getEmpBranch(gstkeyvalue) {
    this.payrollservice.getEmpBranchApi(gstkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empBranchList = datas;
      })
  }

  private getBS(rmkeyvalue) {
    this.payrollservice.getBSApiUserService(rmkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
      })
  }

  private getCC(gstkeyvalue) {
    this.payrollservice.getCCApiUserService(gstkeyvalue,this.businessSeg_id,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
      })
  }

  getCandidate(key) {
    this.payrollservice.getCandidateApi(key,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.candidateList = datas;
      })
  }

  getWorkMode() {
    this.payrollservice.getWorkModeApi()
      .subscribe((results: any[]) => {
        let datas = results;
        this.workmodeList = datas;
      })
  }

  entity_List() {
    this.dataService.getEntity_List()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("enty-list", datas)
        this.entityList = datas;
      })
  }

  
  PF_amount() {
    this.payrollservice.getPF_amount()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("pf_amount", datas)
        this.pfamountList = datas;
      })
  }

   // Only Numbers with Decimals
 keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}
  
  


  public displaydis(autodis?: district): string | undefined {
    return autodis ? autodis.name : undefined;
  }

  get autodis() {
    return this.empAddForm.controls.address.get('district_id');
  }

  public displaycit(autocit?: city): string | undefined {
    return autocit ? autocit.name : undefined;
  }
  
  get autocit() {
    return this.empAddForm.controls.address.get('city_id');
  }

  public displayFnpin(pintype?: pincode): string | undefined {
    return pintype ? pintype.no : undefined;
  }
  
  get pintype() {
    return this.empAddForm.controls.address.get('pincode_id');
  }

  public displayFnstate(statetype?: state): string | undefined {
    return statetype ? statetype.name : undefined;
  }
  
  get statetype() {
    return this.empAddForm.controls.address.get('state_id');
  }

  public displayFnorgtypes(orgtype?: orgtype): string | undefined {
    return orgtype ? orgtype.name : undefined;
  }
  
  get orgtype() {
    return this.empAddForm.get('department_id');
  }
  
  public displayFnDesg(desg?: Designation): string | undefined {
    return desg ? desg.name : undefined;
  }

  get desg() {
    return this.empAddForm.value.get('designation_id');
  }

  public displayFnGrade(rmemp?: Grade): string | undefined {
    return rmemp ? rmemp.name : undefined;
  }

  get rmemp() {
    return this.empAddForm.value.get('grade');
  }
  public displayFnFunHead(fn?: FunctionHead): string | undefined {
    return fn ? fn.full_name : undefined;
  }

  get fn() {
    return this.empAddForm.value.get('functional_head');
  }

  public displayFnEmpbranch(empbranch?: EmployeeBranch): string | undefined {
    return empbranch ? empbranch.name : undefined;
  }

  get empbranch() {
    return this.empAddForm.value.get('emp_branch');
  }

  public displayFnBs(bs?: BusinessSegment): string | undefined {
    return bs ? bs.name : undefined;
  }

  get bs() {
    return this.empAddForm.value.get('businesssegment');
  }

  public displayFnCc(cc?: CostCenter): string | undefined {
    return cc ? cc.name : undefined;
  }

  get cc() {
    return this.empAddForm.value.get('costcentre');
  }


  public displayFnCan(candidate?: Candidate): string | undefined {
    return candidate ? candidate.full_name : undefined;
  }

  get candidate() {
    return this.candidateForm.value.get('candidate_id');
  }




  address_copy(){
    let index = 1;
    let datas = this.empAddForm.value.address[0]

    console.log("dd", datas)
    let oneline = datas.line1;
    let twoline = datas.line2;
    let threeline = datas.line3;
    let city = datas.city_id;
    let dis = datas.district_id;
    let state = datas.state_id;
    let pin = datas.pincode_id;

    this.empAddForm.get("address")['controls'][index].get("line1").setValue(oneline)
    this.empAddForm.get("address")['controls'][index].get("line2").setValue(twoline)
    this.empAddForm.get("address")['controls'][index].get("line3").setValue(threeline)
    this.empAddForm.get("address")['controls'][index].get("city_id").setValue(city)
    this.empAddForm.get("address")['controls'][index].get("district_id").setValue(dis)
    this.empAddForm.get("address")['controls'][index].get("state_id").setValue(state)
    this.empAddForm.get("address")['controls'][index].get("pincode_id").setValue(pin)
  }

  













  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  addressvalidation(event){
    
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-_#@.', &/]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getSections(forms) {
    return forms.controls.employeebankinfo.controls;
  }
  addSection() {
    const control = <FormArray>this.BankForm.get('employeebankinfo');
    control.push(this.getdetails());
  }
  removeSection(i){
    const control = <FormArray>this.BankForm.get('employeebankinfo');
    control.removeAt(i);
  }

  getdetails() {
    let group = new FormGroup({
      bank_id: new FormControl(''),
      branch_id: new FormControl(''),
      account_no: new FormControl(''),
      ifsc: new FormControl('')
    })
  
  
    return group
  }


  // bank
  bankName(i){
  let statecodekey: String = "";
  this.getbank(statecodekey);
  
  (this.empAddForm.get('employeebankinfo') as FormArray).at(i).get('bank_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')
  
      }),
  
      switchMap(value => this.payrollservice.get_bank(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bankList = datas;
    })
  
}
// branch
bankbranchname(i){
  let rmkeyvalue: String = "";
    this.getbankbranch(rmkeyvalue);

    (this.empAddForm.get('employeebankinfo') as FormArray).at(i).get('branch_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.payrollservice.get_bankbranch(value,1,this.bank_Id)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["bankbranch"];
        this.bankbranchList = datas;
      })

}

private getbank(gstkeyvalue) {
  this.payrollservice.get_bank(gstkeyvalue,1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.bankList = datas;
    })
}
private getbankbranch(statecodekey) {
  this.payrollservice.get_bankbranch(statecodekey,1,this.bank_Id)
    .subscribe((results: any[]) => {
      let datas = results["bankbranch"];
      this.bankbranchList = datas;
    })
}


public displayFnbank(banktype?: bank): string | undefined {
  return banktype ? banktype.name : undefined;
}
// get banktype() {
//   return this.empAddForm.controls.address.get('pin_code');
// }
public displayFnbankbranch(bankbranchtype?: bankbranch): string | undefined {
  return bankbranchtype ? bankbranchtype.name : undefined;
}
// get statetype() {
//   return this.businessUserForm.controls.address.get('state_code');
// }

bank_Id:any;
bankFocusOut(data){
  this.bank_Id = data.id;
}
getEmploymentType()
{
  this.payrollservice.getEmploymentType()
 .subscribe((results: any[]) => {
      let datas = results["data"];
      this.employmentTypeList = datas;
    })
}

}



class employee {
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  email_id: any;
  gender: any;
  phone_no: any;
  // accountnumber: any;
  dob: any;
  doj: any;
  entity_id:any;
  designation_id:any;
  grade:any;
  functional_head:any;
  emp_branch:any;
  businesssegment:any;
  costcentre:any;
  workmode:any;
  department_id:any;
  employment_type: any;
  pf_type:any;
  pf_percentage:any;
  disability:any;
  standard_ctc:any;
  payroll_date: string;
  org_id : any;

  // address: {
  //   line1: string;
  //   line2: string;
  //   line3: string;
  //   pincode_id: any;
  //   city_id: any;
  //   district_id: any;
  //   state_id: any;
  // }

}
