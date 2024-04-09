import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PayingempService } from 'src/app/payingemployee/payingemp.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { error } from 'console';

export interface designationdata {
  id: string;
  name: string;
}
export interface department {
  id: string;
  name: string;
}


@Component({
  selector: 'app-employee-basic-details',
  templateUrl: './employee-basic-details.component.html',
  styleUrls: ['./employee-basic-details.component.scss']
})
export class EmployeeBasicDetailsComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  EmpId: any
  EmpBasicDetails: any
  DropGrade: any;

  EmpObjects = {
    employeeList: null,
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null
  }
  isShowSummary: boolean = true;
  isShowEditForm: boolean = false;
  isNewEmplyee: boolean;
  newEmployeeCreate: FormGroup;
  DepartDrop: any;
  workmodeList: any;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  imageUrl: string | ArrayBuffer;
  EmployeeDocuments: any;
  filesrc: string;
  imageUrls = environment.apiURL;
  typeValue: number;
  callfromUpload: boolean = false;
  esiNumber: string = '';

  constructor(private hrmsService: MasterHrmsService, private activateroute: ActivatedRoute, private datePipe: DatePipe, private spinner: NgxSpinnerService,
    private fb: FormBuilder, private toastr: ToastrService, private renderer: Renderer2, private route: Router, private paying: PayingempService) {

    this.allDetailsForm = this.fb.group({
      code: ['', Validators.required],
      full_name: ['', Validators.required],
      designation: ['', Validators.required],
      grade: ['', Validators.required],
      gender: ['', Validators.required],
      department_id: ['', Validators.required],
      employee_branch_id: ['', Validators.required],
      branch_id: ['', Validators.required],
      functional_head: ['', Validators.required],
      dob: ['', Validators.required],
      phone_no: ['', Validators.required],
      costcentre: ['', { disabled: true }, Validators.required],
      businesssegment: ['', Validators.required],
      is_payroll: [false],
      workmode: ['', Validators.required],
      shift: [''],
      role: ['', Validators.required],
      email_id: ['', Validators.required],
      doj: ['', Validators.required],
      Pan_no:['', [Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)]],
      Pfno : ['',[Validators.required]]
    });
    this.address = this.fb.group({
      line1: ['', Validators.required],
      line2: ['', Validators.required],
      line3: ['', Validators.required],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
    })
    this.deactivateForm = this.fb.group({
      reg_notice_date: ['', Validators.required],
      exit_date: ['', Validators.required],
      buy_back: ['', Validators.required],
      notice_period_served: ['', Validators.required],
      reason: ['', Validators.required],

    });
  }
  // formatDate(date: any): string {
  //   const formattedDate = this.datePipe.transform(date, 'MMM dd yyyy');
  //   return formattedDate || '';
  // }
  formatDate(date: any): string {
    if (date == "None") {
      return ''
    }
    else {
      const formattedDate = this.datePipe.transform(date, 'MMM dd yyyy');
      return formattedDate || '';
    }
  }
  showEditForm: boolean = false;
  displayCard = true;
  showForm() {
    this.showEditForm = true;
    this.displayCard = false;
  }

  goBack() {
    this.showEditForm = false;
    this.displayCard = true;
  }

  //role autocomplete
  roleList: any[] = [];
  role: FormGroup = new FormGroup({
    text: new FormControl(),
  })

  //forms and formGroups
  allDetailsForm: FormGroup = new FormGroup({
    code: new FormControl(),
    full_name: new FormControl(),
    designation: new FormControl(),
    grade: new FormControl(),
    gender: new FormControl(),
    department_id: new FormControl(),
    employee_branch_id: new FormControl(),
    branch_id: new FormControl(),
    functional_head: new FormControl(),
    dob: new FormControl(),
    phone_no: new FormControl(),
    costcentre: new FormControl(),
    businesssegment: new FormControl(),
    is_payroll: new FormControl(false),
    workmode: new FormControl(),
    role: new FormControl(),
    email_id: new FormControl(),
    doj: new FormControl(),
    Height: new FormControl(),
    Weight: new FormControl(),
    nationality: new FormControl(),
    blood_grp: new FormControl(),
    marital_status: new FormControl(),
    disability: new FormControl(),
    Pan_no: new FormControl(),
    PfNo: new FormControl(),
    Esi: new FormControl(),
    uan_number : new FormControl(),
    aadhar_number: new FormControl()
  });

  address: FormGroup = new FormGroup({
    line1: new FormControl(),
    line2: new FormControl(),
    line3: new FormControl(),
    pincode: new FormControl(),
    city: new FormControl(),
    state: new FormControl(),
    district: new FormControl(),
  });

  //deactivate form

  deactivateForm: FormGroup = new FormGroup({
    reg_notice_date: new FormControl(),
    exit_date: new FormControl(),
    buy_back: new FormControl(),
    notice_period_served: new FormControl(),
    reason: new FormControl(),

  });


  //team lead and role autocomplete
  teamLeadList: any[] = [];
  teamLeadControl = new FormControl();
  filteredTeamLead: Observable<any[]>;
  newemployeeCreation: FormGroup;
  GenderList: any;
  maritalList: any;
  differentlyable: any;
  ngOnInit(): void {
    this.allDetailsForm = this.fb.group({
      code: new FormControl(),
      full_name: new FormControl(),
      designation: new FormControl(),
      grade: new FormControl(),
      gender: new FormControl(),
      department_id: new FormControl(),
      employee_branch_id: new FormControl(),
      branch_id: new FormControl(),
      functional_head: new FormControl(),
      dob: new FormControl(),
      phone_no: new FormControl(),
      costcentre: new FormControl(),
      businesssegment: new FormControl(),
      is_payroll: new FormControl(false),
      workmode: new FormControl(),
      shift: new FormControl(),
      role: new FormControl(),
      email_id: new FormControl(),
      doj: new FormControl(),
      Height: new FormControl(),
      Weight: new FormControl(),
      nationality: new FormControl(),
      blood_grp: new FormControl(),
      marital_status: new FormControl(),
      disability: new FormControl(),
      Pan_no: new FormControl(),
      PfNo: new FormControl(),
      Esi: new FormControl(),
      uan_number : new FormControl(),
      aadhar_number: new FormControl()



    });
    this.address = this.fb.group({
      line1: new FormControl(),
      line2: new FormControl(),
      line3: new FormControl(),
      pincode: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      district: new FormControl(),
    })

    //team lead and role autocomplete
    this.getTeamLeadVal();
    this.getRoleVal();
    this.getSegmentDropdown();
    this.getWorkShift();
    this.getBranchDropdown();
    this.GradeDrop();

    // this.GenderList = [{ id: "1", name: 'Male' }, { id: "2", name: 'Female' }, { id: "3", name: 'Others' }]
    // this.maritalList = [{ name: 'Single' }, { name: 'Married' }, { name: 'Widow' }, { name: 'Divorced' }, { name: 'Single Mother' },  { name: 'Single Father' },  { name: 'In Relationship' }]
    this.differentlyable = [{ id: 1, name: 'Yes' }, { id: 0, name: 'No' }]




    // this.getCcDropdown();
    // Filter teamLeadList based on user input
    this.filteredTeamLead = this.teamLeadControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterTeamLead(value))
    );

    this.activateroute.queryParams.subscribe((params) => {
      // let id: any = params.get('data')
      // console.log("summary call", params)
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })
    this.getEmployeeBasicDetails();
    // this.getEmpRoleValidation();
    this.getEmployee();
    this.getWorkMode();
    this.getImages();
    this.newEmployeeCreate = this.fb.group({
      "full_name": "",
      "first_name": "",
      "middle_name": "",
      "last_name": "",
      "grade": "",
      "email_id": "",
      "dob": "",
      "doj": "",
      "gender": "",
      "employment_type": "",
      "candidate_code": "",
      "designation": "",
      "branch": "",
      "srlno": "",
      "department_id": "",
      "employee_branch": "",
      "functional_head": "",
      "noticeperiod": "",
      "expected_doj": "",
      "effective_from": "",
      "phone_no": "",
      "employee_type": "",
      "costcenter": "",
      "businesssegment": "",
      "nationality": "",
      "marital_status": "",
      "height": "",
      "weight": "",
      "blood_grp": "",
      "org_id": "",
      "designation_id": "",
      "workmode": "",
      "approve_status": "",
      "approved_by": "",
      "disabality": "",
      "is_payroll": "",
      "pf_number": "",
      "esi_number": "",
      "payroll_date": "",
      "password": ""
    })
    this.getGender();
    this.getMarital();
  }
  // updateCheckboxValue(event: any) {
  //   const isChecked = event.target.checked;
  //   this.allDetailsForm.get('is_payroll').setValue(isChecked);

  //   console.log('Checkbox value:', this.allDetailsForm.get('is_payroll').value);
  // }
  // Assuming your FormGroup is named 'allDetailsForm'
  // Assuming your FormGroup is named 'allDetailsForm'
  // Assuming your FormGroup is named 'allDetailsForm'
  updateCheckboxValue(event: any) {
    const isPayrollControl = this.allDetailsForm.get('is_payroll');

    if (isPayrollControl) {
      isPayrollControl.setValue(event.target.checked);
    }
  }





  // Emprole:any;
  //   getEmpRoleValidation(){
  //     this.hrmsService.getEmployeeRoleValidation().subscribe(results => {
  //       this.Emprole = results.hr_admin;
  //       // this.EmpBankDetails.reverse();
  //       console.log("role validation", results)
  //       console.log("role validation", this.Emprole.hr_admin)
  //     }
  //     )
  //   }
  getEmployeeBasicDetails() {

    // console.log("emp id", this.EmpId)
    this.hrmsService.getEmployeeDetails(this.EmpId).subscribe(results => {
      if(results.code)
      {
        this.toastr.error(results.code);
      }
      else
      {
      this.EmpBasicDetails = results['data'];
      // this.EmpBankDetails.reverse();
      // console.log("basic details", results)
      // console.log("acc type details", this.EmpBasicDetails)
      // console.log("is payroll", this.EmpBasicDetails?.is_payroll)

      }
    }
    )
  
  }
  employeetypelist: Array<any> = [];
  getdepartmentinterface(data?: department): string | undefined {
    return data && data.name ? data.name : '';

  }
  getEmployeedepartmentdata(data) {
    let dataEmp = data
    this.hrmsService.getlistdepartment(dataEmp, 1).subscribe(results => {
      this.employeetypelist = results['data'];
    })
  }


  formatteddojDate: any;
  timeStamp: any;
  datedojObject: any
  formatteddobDate: any;
  editId: any

  timestamps: any;
  datedobObject: any;
  editDeptId: any
  editRown(item: any) {
    this.showForm();
    this.editEmployeeData();
    // console.log("all patch items", item)
    // console.log("edit id", item?.id)
    // console.log("phone", item?.phone_no)
    // console.log("fun head", item?.functional_head?.name)
    // console.log("report branch", item?.report_branch?.name)
    // console.log("emil id", item?.email_id)
    // console.log("dob")
    // console.log("doj")



    if (item?.doj !== 'None') {
      this.timeStamp = item?.doj;
      this.datedojObject = new Date(this.timeStamp);
      // console.log(this.datedojObject);
      this.formatteddojDate = this.datePipe.transform(this?.datedojObject, 'yyyy-MM-dd');
      // console.log("doj", this.formatteddojDate)
    } else {
      // console.log("doj is null");
    }

    if (item?.dob !== 'None') {
      this.timestamps = item?.dob;
      this.datedobObject = new Date(this.timestamps);
      // console.log(this.datedobObject);
      this.formatteddobDate = this.datePipe.transform(this?.datedobObject, 'yyyy-MM-dd');
      // console.log("dob", this.formatteddobDate);
    } else {
      // console.log("dob is null");
    }

    this.allDetailsForm.patchValue({
      id: item?.id,
      code: item?.code,
      full_name: item?.full_name,
      phone_no: item?.phone_no,
      email_id: item?.email_id,
      gender: item?.gender?.id,
      shift: item?.shift?.id,
      functional_head: item?.functional_head,
      designation: item?.designation,
      branch_id: item?.report_branch,
      grade: item?.grade?.id,
      role: { text: item?.role?.text },
      employee_branch_id: item?.employee_branch_id,
      department_id: item?.department_id,
      businesssegment: item?.businesssegment,
      costcentre: item?.costcentre,
      is_payroll: item?.is_payroll,
      doj: this.formatteddojDate,
      dob: this.formatteddobDate,
      workmode: item?.work_mode?.id,
      Height: item?.height,
      Weight: item?.weight,
      nationality: item?.nationality,
      blood_grp: item?.blood_grp,
      marital_status: item?.marital_status?.name,
      disability: (item.disability == true ? 1 : 0),
      Pan_no:item?.pan_number,
      Esi:item?.esi_number,
      PfNo:item?.pf_number,
      uan_number:item?.uan_number,
      aadhar_number:item?.aadhar_number
    });
    this.editId = item?.id
    // console.log('patch', item)
  }
  designationlist: Array<any> = [];
  getdatadesignation(data?: designationdata): string | undefined {
    return data ? data.name : undefined;
  }
  data: any
  getdesignation(data) {
    let dataDes = data
    this.hrmsService.getDesignationList(dataDes, 1).subscribe(data => {
      this.designationlist = data['data'];
    });
  }

  //notice period
  noticePeriod() {
    let dataConfirm = confirm("Are you sure this Employee start serving Notice Period?")
    if (dataConfirm) {
      this.hrmsService.postNoticePeriod(this.EmpId).subscribe(res => {
        // console.log("notice period", res)
        this.toastr.success(res.message);
      })
    }
  }


  //team lead
  designationVal: any;
  departmentVal: any;
  functionalHeadVal: any;
  teamLeadList1: any;
  bsVal: any;
  displayTeamLead(teamLead: any): string {
    return teamLead && teamLead.name ? teamLead.name : '';
  }
  displayRole(teamLead: any): string {
    return teamLead && teamLead.text ? teamLead.text : '';
  }
  displayBsSeg(seg: any): string {
    return seg && seg.name ? seg.name : '';
  }
  displayBranch(branch: any): string {
    return branch && branch.name ? branch.name : '';
  }
  displayPincode(pincode: any): string {
    return pincode && pincode.no ? pincode.no : '';
  }
  reportBranch(branch: any): string {
    return branch && branch.name ? branch.name : '';
  }
  displayCc(cc: any): string {
    return cc && cc.name ? cc.name : '';
  }

  private _filterTeamLead(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.teamLeadList.filter(lead => lead.name.toLowerCase().includes(filterValue));
  }

  getTeamLeadVal() {
    this.hrmsService.getTeamLead().subscribe(results => {
      this.teamLeadList = results.data;
      // console.log("Team lead details", this.teamLeadList);
    });
  }
  getRoleVal() {
    this.hrmsService.getRole().subscribe(results => {
      this.roleList = results;
      // console.log("role list", this.roleList);
    });
  }
  segmentInput: any;
  segmentArr: any
  getSegmentDropdown() {
    this.segmentInput = this.allDetailsForm.get("businesssegment").value
    this.hrmsService.getBusinessSegmentDropdownList(this.segmentInput, 1).subscribe(results => {
      // console.log('Business Segment Dropdown List:', results);
      this.segmentArr = results.data
    });
  }
  branchInput: any
  branchArr: any
  getBranchDropdown() {
    this.branchInput = this.allDetailsForm.get("employee_branch_id").value
    this.hrmsService.getBranchDropdownList(this.branchInput, 1).subscribe(results => {
      // console.log('Branch Dropdown List:', results);
      this.branchArr = results.data
    });
  }
  reportInput: any;
  reportArr: any;
  reportingBranchVal: any;
  getReportingBranchDropdown() {
    this.reportInput = this.allDetailsForm.get("branch_id").value
    this.hrmsService.getBranchDropdownList(this.reportInput, 1).subscribe(results => {
      // console.log('Reporting branch List:', results);
      this.reportArr = results.data
    });
  }

  pincodeInput: any;
  pincodeArr: any;
  getPincodeDropdown() {
    this.pincodeInput = this.address.get("pincode").value
    this.hrmsService.getPincodeList(this.pincodeInput, 1).subscribe(results => {
      // console.log('Pincode List:', results);
      this.pincodeArr = results.data
      // console.log("city", this.pincodeArr?.city?.name)
    });
  }
  selectedPincode: any
  selectedPincodeNum: any
  onPincodeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedPincode = event.option.value;
    // console.log("Selected pincode", this.selectedPincode);
    this.address.get('city')?.setValue(this.selectedPincode?.city?.name);
    this.address.get('state')?.setValue(this.selectedPincode?.state?.name);
    this.address.get('district')?.setValue(this.selectedPincode?.district?.name);
  }


  getWorkShift() {
    this.hrmsService.getWorkshiftData().subscribe(results => {
      // console.log("workshift list", results)
      this.workshiftList = results.data;

    })
  }

  workshiftList: any[] = [];
  selectedShift: string | undefined;
  onShiftSelect(event: any): void {
    this.selectedShift = event.value;
  }
  ccInput: string;
  ccArr: any
  page: any;
  getCcDropdown() {
    this.ccInput = this.allDetailsForm.get("costcentre").value
    this.page = 1;
    // console.log("typed cc", this.ccInput)
    this.hrmsService.getCcDropdownList(this.ccInput, this.page).subscribe(results => {
      // console.log('CC Dropdown List:', results);
      this.ccArr = results.data
    });
  }
  roleVal: any
  dobPipe: any
  dojPipe: any
  deployedBranchVal: any
  costCentreVal: any
  roleValue: any
  pincodeVal: any
  workmodeVal: any
  onUpdate() {
    if (this.allDetailsForm.valid) {
      this.dobPipe = this.allDetailsForm.value.dob;

      // console.log("all update form", this.allDetailsForm.value)
      // console.log("addressform", this.address.value)

      // console.log("role form", this.role.value)
      this.designationVal = this.allDetailsForm.get("designation").value
      this.departmentVal = this.allDetailsForm.get("department_id").value
      this.functionalHeadVal = this.allDetailsForm.get("functional_head").value
      this.reportingBranchVal = this.allDetailsForm.get("branch_id").value
      this.deployedBranchVal = this.allDetailsForm.get("employee_branch_id").value
      this.workmodeVal = this.allDetailsForm.get("workmode").value
      this.pincodeVal = this.address.get("pincode").value
      this.costCentreVal = this.allDetailsForm.get("costcentre").value
      this.bsVal = this.allDetailsForm.get("businesssegment").value
      this.roleVal = this.allDetailsForm.get("role").value
      this.dobPipe = this.datePipe.transform(this.allDetailsForm?.value?.dob, 'yyyy-MM-dd');
      // console.log('Formatted Date:', this.dobPipe);
      this.dojPipe = this.datePipe.transform(this.allDetailsForm.value.doj, 'yyyy-MM-dd');
      // console.log('Formatted Date:', this.dojPipe);
      const formIntoJson = {
        id: this.editId || null,
        full_name: this.allDetailsForm.value.full_name || null,
        email_id: this.allDetailsForm.value.email_id || null,
        designation: this.designationVal?.id || null,
        grade: 1,
        gender: this.allDetailsForm.value.gender || null,
        department_id: this.departmentVal?.id || null,
        employee_branch_id: this.deployedBranchVal?.id || null,
        branch_id: this.reportingBranchVal?.id || null,
        functional_head: this.functionalHeadVal?.id || null,
        dob: this.dobPipe || null,
        doj: this.dojPipe || null,

        phone_no: this.allDetailsForm.value.phone_no || null,
        //cost_centre
        costcentre: this.costCentreVal?.id || null,
        businesssegment: this.bsVal?.id || null,
        is_payroll: this.allDetailsForm.value.is_payroll || null,
        //old key work_mode
        workmode: this.workmodeVal?.id || null,
        role: this.roleVal?.id || null,

        address: {
          line1: this.address.value.line1,
          line2: this.address.value.line2,
          line3: this.address.value.line3,
          pincode: this.pincodeVal?.no,
          city: this.address.value.city,
          district: this.address.value.district,
          state: this.address.value.state
        }

      };

      const jsonData = JSON.stringify(formIntoJson);
      // console.log("json data to add id", jsonData)
      
      this.hrmsService.postEmpBasicDetails(jsonData).subscribe(
        (response) => {
          // Handle the response here if needed

          // console.log('Successfully posted/updated emp details info:', response);
          if(response.success)
          {
          this.toastr.success('Successfully posted/updated details info');
          this.getEmployeeBasicDetails();
          this.goBack();
          }
          else if(response.error)
          {
            this.toastr.success(response.error);


          }
        // (response.error) => {
          // console.error('Error while posting/updated details info:', error);
          // this.toastr.error('Error while posting/updated details info');

        });
    } else {

      // console.log("not valid");
      // this.toastr.warning('All details need to be filled');
    }
  }
  regDate: any;
  exitDate: any;
  onDeactivate() {

    // console.log("deactivate form", this.deactivateForm.value);
    if (this.deactivateForm.valid) {
      let deactivate = confirm("Are you sure to Deactivate Employee?")
      if (deactivate) {
        this.regDate = this.deactivateForm.value.reg_notice_date
        this.exitDate = this.deactivateForm.value.exit_date
        const inputDate = new Date(this.regDate);
        const datePipe = new DatePipe('en-US');
        const formattedRegDate = datePipe.transform(inputDate, 'yyyy-MM-dd');
        // console.log(formattedRegDate);

        this.regDate = this.deactivateForm.value.reg_notice_date
        const inputExitDate = new Date(this.exitDate);
        const dateExitPipe = new DatePipe('en-US');
        const formattedExitDate = dateExitPipe.transform(inputExitDate, 'yyyy-MM-dd');
        // console.log(formattedExitDate);
        const formIntoJson = {
          reg_notice_date: formattedRegDate || null,
          exit_date: formattedExitDate || null,
          buy_back: this.deactivateForm.value.buy_back || null,
          notice_period_served: this.deactivateForm.value.notice_period_served || null,
          reason: this.deactivateForm.value.reason || null
        };
        const jsonData = JSON.stringify(formIntoJson);
        // console.log("JSON Data:", jsonData);
        this.hrmsService.postDeactivate(this.EmpId, jsonData).subscribe(
          (response) => {
            // console.log('Successfully deactivated:', response);
            this.toastr.success('Successfully deactivated');
            // this.getEmpFamilyDetails();
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();
            this.route.navigate(['/hrms/hrmsview/empsummary']);


            // location.reload();
          },
          (error) => {
            // console.error('Error in deactivation:', error);
            this.toastr.error('Error in deactivation');
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();

          }
        );

      }
      //  else {
      //   for (const control in this.familyInfoForm.controls) {
      //     if (this.familyInfoForm.controls.hasOwnProperty(control)) {
      //      this.familyInfoForm.get(control).markAsTouched();
      //     }
      //  }
      //  console.log("not valid");
      //   this.toastr.warning('All details needed to be filled');
      //  }
    }
  }

  getEmployee() {

    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
    let id = idValue.employee_id;
    this.EmpObjects.empId = idValue.employee_id;
    this.hrmsService.getEmpDetails(id)
      .subscribe(res => {

        // console.log("employee data ", res)
        this.EmpObjects.employeeList = res
        if (res?.id) {
          this.gettingProfilename(res?.full_name)
        }
      }, error => {

      })
  }

  gettingProfilename(data) {
    let name: any = data
    let letter = name[0]
    // console.log(letter)
    this.EmpObjects.employeeFirstLetter = letter
  }

  editEmployeeData() {
    this.isShowSummary = false;
    this.isShowEditForm = true;
    this.isNewEmplyee = false;
  }

  newEmployeeCreation() {
    this.isShowSummary = false;
    this.isShowEditForm = false;
    this.isNewEmplyee = true;
  }
  back() {
    this.isShowSummary = true;
    this.isShowEditForm = false;
    this.isNewEmplyee = false;
  }
  updates() {

    let currValue = this.allDetailsForm.value;
    if(currValue.gender === null || currValue.gender === undefined || currValue.gender === '')
    {
      this.toastr.error("Please select gender");
      return false;
    }
    if(currValue.phone_no === null || currValue.phone_no === undefined || currValue.phone_no === '')
    {
      this.toastr.error("Please Enter Phone No");
      return false;
    }
    if(currValue.dob === null || currValue.dob === undefined || currValue.dob === '')
    {
      this.toastr.error("Please fill Date of Birth");
      return false;
    }

    let dobs = this.datePipe.transform(this.allDetailsForm.get('dob').value, "yyyy-MM-dd")
    let dojs = this.datePipe.transform(this.allDetailsForm.get('doj').value, "yyyy-MM-dd")

    // let expected_dojs = this.datePipe.transform(this.allDetailsForm.get('expected_doj').value, "yyyy-MM-dd")
    // let effective_froms = this.datePipe.transform(this.allDetailsForm.get('effective_from').value, "yyyy-MM-dd")
    // let payrolldatess = this.datePipe.transform(this.allDetailsForm.get('payroll_date').value, "yyyy-MM-dd")

    let id = this.EmpId

    if(this.allDetailsForm.get('phone_no')?.value?.length < 10)
    {
      this.toastr.error("Phone Number should be 10 digits");
      return false;
    }

    // let addresspay = {
    //   line1: this.address.get('line1').value,
    //   line2: this.address.get('line2').value,
    //   line3: this.address.get('line3').value,
    //   pincode: this.address.get('pincode').value.id,
    //   city: this.address.get('city').value.id,
    //   state: this.address.get('state').value.id,
    //   district: this.address.get('district').value.id,
    // }

    // if()
    else
    {
    let payload = {
      "id": id,
      "full_name": this.allDetailsForm.get('full_name')?.value,
      "email_id": this.allDetailsForm.get('email_id')?.value,
      "gender": this.allDetailsForm.get('gender')?.value,
      "phone_no": this.allDetailsForm.get('phone_no')?.value,
      "dob": dobs,
      "height": this.allDetailsForm.get('Height')?.value,
      "weight": this.allDetailsForm.get('Weight')?.value,

      "blood_grp": this.allDetailsForm.get('blood_grp')?.value,
      "disabality": this.allDetailsForm.get('disability')?.value,
      "nationality": this.allDetailsForm.get('nationality')?.value,
      "marital_status": this.allDetailsForm.get('marital_status')?.value,
      'pan_number':this.allDetailsForm.get('Pan_no')?.value,
      'esi_number':this.allDetailsForm.get('Esi')?.value,
      'pf_number':this.allDetailsForm.get('PfNo')?.value,
      'uan_number':this.allDetailsForm.get('uan_number')?.value,
      'aadhar_number':this.allDetailsForm.get('aadhar_number')?.value,

      // "branch": this.allDetailsForm.get('branch').value.id,

      // "department_id":  this.allDetailsForm.get('department_id').value.id,
      // "employee_branch":  this.allDetailsForm.get('employee_branch').value.id,

      // "noticeperiod":  this.allDetailsForm.get('noticeperiod').value,
      // "expected_doj":  expected_dojs,
      // "effective_from": effective_froms ,

      // "costcenter":  this.allDetailsForm.get('costcenter').value,
      // "businesssegment":  this.allDetailsForm.get('businesssegment').value,
      // "nationality":  this.allDetailsForm.get('nationality').value,
      // "marital_status":  this.allDetailsForm.get('marital_status').value,
      // "height":  this.allDetailsForm.get('height').value,
      // "weight":  this.allDetailsForm.get('weight').value,
      // "blood_grp":  this.allDetailsForm.get('blood_grp').value,
      // "designation_id":  this.allDetailsForm.get('designation_id').value,
      // "workmode":  this.allDetailsForm.get('workmode').value,
      // "disabality":  this.allDetailsForm.get('disabality').value,
      // "is_payroll": 1,
      // "pf_number":  this.allDetailsForm.get('pf_number').value,
      // "esi_number":  this.allDetailsForm.get('esi_number').value,
      // "payroll_date": payrolldatess,



    }
    console.log('params',payload)
    this.spinner.show();
    this.hrmsService.createNewEmployee(payload).subscribe(res => {
      if(res.status == "success")
      {
      this.spinner.hide();
      this.toastr.success(res.message);
      this.getEmployeeBasicDetails();
      this.isShowSummary = true;
      this.isShowEditForm = false;
      this.isNewEmplyee = false;
      }
      else
      {
        this.toastr.error(res.error);
        this.spinner.hide();
      }

      // this.route.navigate(['/hrms/hrmsview/empsummary']);
    },
    error=>{
      this.spinner.hide();

    })
  }
    // this.hrmsService.createNewEmployeeAddress(this.EmpId, addresspay).subscribe(res => {
    //   this.toastr.success(res.message);

    // this.route.navigate(['/hrms/hrmsview/empsummary']);
    // })
  }
  getSegmentDropdowns() {
    this.segmentInput = this.newEmployeeCreate.get("businesssegment").value
    this.hrmsService.getBusinessSegmentDropdownList(this.segmentInput, 1).subscribe(results => {
      // console.log('Business Segment Dropdown List:', results);
      this.segmentArr = results.data
    });
  }
  ccInputs: string;
  ccArrs: any
  pages: any;
  getCcDropdowns() {
    this.ccInputs = this.newEmployeeCreate.get("costcenter").value
    this.pages = 1;
    // console.log("typed cc", this.ccInput)
    this.hrmsService.getCcDropdownList(this.ccInputs, this.pages).subscribe(results => {
      // console.log('CC Dropdown List:', results);
      this.ccArrs = results.data
    });
  }

  branchInputs: any
  branchArrs: any
  getBranchDropdowns() {
    this.branchInputs = this.newEmployeeCreate.get("branch").value
    this.hrmsService.getBranchDropdownList(this.branchInputs, 1).subscribe(results => {
      // console.log('Branch Dropdown List:', results);
      this.branchArrs = results.data
    });
  }
  branchInpu: any
  branchAr: any
  getBranchDropdownss() {
    this.branchInpu = this.newEmployeeCreate.get("employee_branch").value
    this.hrmsService.getBranchDropdownList(this.branchInpu, 1).subscribe(results => {
      // console.log('Branch Dropdown List:', results);
      this.branchAr = results.data
    });
  }
  update() {

  }
  DepartmentDropdown() {
    this.paying.getOrgType('', 1).subscribe(data => {
      this.DepartDrop = data['data']
    })
  }
  getWorkMode() {
    this.paying.getWorkModeApi()
      .subscribe((results: any[]) => {
        let datas = results;
        this.workmodeList = datas;
      })
  }
  GradeDrop() {
    this.paying.searchGrades('', 1).subscribe(data => {
      this.DropGrade = data['data']
    })
  }
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }


  onIconClick() {

    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.spinner.show();
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile); 
      this.typeValue = 8
      const typeAndRemarksObject = {
        type: 8,
        remarks: ''
      };
      const formData = new FormData();
      formData.append(`${this.typeValue}`, selectedFile);
      this.callfromUpload = true;
      this.deleteProfilePics();
      this.hrmsService.postprofilepics(this.EmpId, typeAndRemarksObject, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.toastr.success("Profile Picture Uploaded Successfully");
          this.getImages();
          this.spinner.hide();
        },
        (error) => {
          console.error('Error uploading file', error);
          this.toastr.error("Error uploading file");

        }
      );
    } else {
      return false;
    }

  }




  displayImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imageUrl = e.target?.result;
      // console.log("IMageURL", this.imageUrl)
    };
    reader.readAsDataURL(file);
  }

  getImages() {
    this.hrmsService.getEmpDocuments(this.EmpId)
      .subscribe(results => {
       
        this.EmployeeDocuments = results;
        const fileInfo = this.getImageFileInfo();


        if (fileInfo.file_id !== '') {

          const file_id = fileInfo.file_id;
          const file_name = fileInfo.file_name;
          let option = 'view'
          this.spinner.show();
          this.hrmsService.viewDocumentDetails(this.EmpId, file_id)
            .subscribe(
              results => {
                const getToken = localStorage.getItem("sessionData");
                let tokenValue = JSON.parse(getToken);

                let token = tokenValue.token;


                this.filesrc = this.imageUrls + 'docserv/doc_download/' + file_id + '?entity_id=1&user_id=' + this.EmpId + "&token=" + token;
                console.log("File Image", this.filesrc)
                this.spinner.hide();
              

              })
        }
        else {
          this.filesrc = '';
          return false;
        
          this.spinner.hide();

        }
        this.spinner.hide();
      
      });
      
      this.spinner.hide()
  }

  getImageFileInfo(): { file_id: string, file_name: string, id : number } {
    const employeeImageType = this.EmployeeDocuments.data.find(doc => doc.type.name === 'Employee image');
    // this.EmployeeDocuments.data.find(document => document.type.name === 'pan card')



    if (employeeImageType && employeeImageType.file.length > 0) {
      const lastFileIndex = employeeImageType.file.length - 1;
      const lastImageFile = employeeImageType.file[lastFileIndex];
      return {
        file_id: lastImageFile.file_id,
        file_name: lastImageFile.file_name,
        id: lastImageFile.id
      };
    }
    
    else {

      return { file_id: '', file_name: '' , id : 0 };
    }
  }

  uploadImage() {

  }

  getGender() {
  
    this.hrmsService.getGenderDropDown().subscribe(results => {
      this.GenderList = results['data'];
    });
  }
  getMarital() {
  
    this.hrmsService.getMaritalDrop().subscribe(results => {
      this.maritalList = results['data'];
    });
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  deleteProfilePic()
  {
    const fileInfo = this.getImageFileInfo();
    if (fileInfo.file_id !== '') {
      const file_id : number = Number(fileInfo.file_id);
      const file_name = fileInfo.file_name;
      const fileID = fileInfo.id
      this.hrmsService.getEmployeeDocumentDetails(this.EmpId, fileID)
      .subscribe(
        results => {
          this.EmployeeDocuments = results;
          console.log("Docs details", this.EmployeeDocuments);        
          this.toastr.success("File deleted successfully");
          this.filesrc = '';
        },
        error => {
          console.error('Error deleting document:', error);
          this.toastr.error("Error deleting file", "Error");
        }
      );

      
    }
    else {
      // this.
      return false;
      this.spinner.hide();
    }
  }

  deleteProfilePics()
  {
    const fileInfo = this.getImageFileInfo();
    if (fileInfo.file_id !== '') {
      const file_id : number = Number(fileInfo.file_id);
      const file_name = fileInfo.file_name;
      const fileID = fileInfo.id
      this.hrmsService.getEmployeeDocumentDetails(this.EmpId, fileID)
      .subscribe(
        results => {
          this.EmployeeDocuments = results;
          console.log("Docs details", this.EmployeeDocuments);        
        },
        error => {
          console.error('Error deleting document:', error);
      
        }
      );

      
    }
    else {
      // this.
      return false;
      this.spinner.hide();
    }
  }
  onPanInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
      if (position < 5) {
        return /^[a-zA-Z]*$/.test(char);
      } else if (position < 9) {
        return /^[0-9]*$/.test(char);
      }
      else if (position < 10) {
        return /^[a-zA-Z]*$/.test(char);
      }
      return true;
    };

    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
    

    event.target.value = newValue;
  }

  formatEsiNumber(value: string) { 
    const numericValue = value.replace(/\D/g, '');
    this.esiNumber = numericValue.replace(/^(\d{2})(\d{2})(\d{7})(\d{3})(\d{4})$/, "$1-$2-$3-$4-$5");
  }

  formatEsi(value: string) {
    const cleanedValue = value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 2 || i === 4 || i === 11 || i === 14) {
        formattedValue += '-';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }



  customPfValidator() {
    return (control) => {
      const esiPattern = /^[A-Za-z]{2}\/[A-Za-z]{3}\/\d{7}\/\d{3}\/\d{7}$/; // Define your pattern
      if (!esiPattern.test(control.value)) {
        return { invalidEsi: true };
      } else {
        return null;
      }
    };
  }

  onPfInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
      if (position < 6) {
        return /^[a-zA-Z]*$/.test(char);
      } else if (position < 27) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
  
    const formattedValue = this.formatPf(newValue);
    event.target.value = formattedValue;
  }
  
  formatPf(value: string) {
    // Remove any non-digit or non-letter characters
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '');
    // Add slashes at appropriate positions
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 2 || i === 5 || i === 12 || i === 15) {
        formattedValue += '/';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }

  onUANInput(event: any) {
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
    if (position < 12) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');

    event.target.value = newValue;
  }

  onAadhaarInput(event:any){
    const input = event.target.value.toUpperCase();
    const isValidChar = (char: string, position: number) => {
    if (position < 15) {
        return /^[0-9]*$/.test(char);
      }
      return true;
    };
  
    const newValue = input
      .split('')
      .filter((char, index) => isValidChar(char, index))
      .join('');
  
    const formattedValue = this.formatAdhaar(newValue);
    event.target.value = formattedValue;
  }
  formatAdhaar(value: string) {
    // Remove any non-digit or non-letter characters
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '');
    // Add slashes at appropriate positions
    let formattedValue = '';
    for (let i = 0; i < cleanedValue.length; i++) {
      if (i === 4 || i === 8 || i === 12 ) {
        formattedValue += '-';
      }
      formattedValue += cleanedValue[i];
    }
    return formattedValue;
  }






}
