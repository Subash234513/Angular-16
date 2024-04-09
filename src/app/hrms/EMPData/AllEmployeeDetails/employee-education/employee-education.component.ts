import { Component, OnInit, Inject, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterHrmsService } from '../../../master-hrms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import * as imp from '../../../../AppAutoEngine/import-services/CommonimportFiles'
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'



@Component({
  selector: 'app-employee-education',
  templateUrl: './employee-education.component.html',
  styleUrls: ['./employee-education.component.scss'],
  providers: [
    { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
    { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }, imp.HrmsAPI, imp.Userserv
  ]
})
export class EmployeeEducationComponent implements OnInit {
  @Output() saveSuccess: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef
  @ViewChild('closeButtons') closeButtons: ElementRef;

  EmpEducationInfo: any
  EmpId: any

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }

  TitleDropdownList: any
  MappedDegreeList: any
  StreamDropdownList: any
  CityDropdownList: any
  EducationFormShow: boolean = true

  addingMode: boolean = true;

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  selectedDegreeIds: any;
  selectedtitleIds: any;
  degreepatch: any;
  fileUploadForm: FormGroup;
  typeValue: any;
  EmployeeDocuments: any = [];
  images: string[] = [];
  docFunctionList = [];
  docFunctionLists = [];

  dataname: any;
  filenames: any;
  fileextension: any;
  file_ext: string[];
  filesrc: string;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  imageUrls = environment.apiURL;
  imageUrl: string | ArrayBuffer | null = null;
  reuploadfileArr: any;
  fileupdate: boolean = false;
  idPatch: any;
  displayFnEmp(title: any): string {
    return title && title.name ? title.name : '';
  }
  displayDegree(degree: any): string {
    return degree && degree.name ? degree.name : '';
  }
  displayStream(stream: any): string {
    return stream && stream.name ? stream.name : '';
  }
  displayCity(city: any): string {
    return city && city.name ? city.name : '';
  }


  monyear = new FormControl(new Date());

  constructor(private _formBuilder: FormBuilder, private http: HttpClient,
    private hrmsService: MasterHrmsService, private activateroute: ActivatedRoute,
    public dialog: MatDialog, private modalService: MasterHrmsService, private spinner: NgxSpinnerService,
    private toastr: ToastrService, private fb: FormBuilder, private router: Router,
    private location: Location, private renderer: Renderer2) {

    this.educationForm = this.fb.group({
      degree: [{ value: '', disabled: true }],
      title: [''],
      inst_name: [
        '',
        [

          Validators.pattern("[A-Za-z ]+"),
          Validators.maxLength(50)
        ]],
      stream: [{ value: '', disabled: true }],
      city: [''],
      monthyear: [''],
      percentage: ['', [this.percentageValidator()]],
    });
  }

  get titleName() {
    return this.educationForm.get("title")
  }

  get degreeName() {
    return this.educationForm.get("degree")
  }

  get streamName() {
    return this.educationForm.get("stream")
  }

  get instituteName() {
    return this.educationForm.get("inst_name")
  }

  get cityName() {
    return this.educationForm.get("city")
  }

  get date() {
    return this.educationForm.get("monthyear")
  }

  get percent() {
    return this.educationForm.get("percentage")
  }
  isFormValid() {
    return this.educationForm.valid;
  }
  percentageValidator() {
    return (control) => {
      if (control.value !== '' && (isNaN(control.value) || +control.value < 0 || +control.value >= 100)) {
        return { invalidPercentage: true };
      }
      return null;
    };
  }

  LeaveTrackerReportsearchForm: FormGroup;
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monyear.value;
    const yearDate=normalizedYear.toDate()
    ctrlValue.setFullYear(yearDate.getFullYear());
    this.monyear.setValue(ctrlValue);
  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monyear.value;
    const monthDate=normalizedMonth.toDate()
    ctrlValue.setMonth(monthDate.getMonth());
    this.monyear.setValue(ctrlValue);
    datepicker.close();
    this.LeaveTrackerReportsearchForm.patchValue({
      monthyear: this.monyear.value
    })
  }
  ChangeDateFormat(key) {

  }
  dateItem = {
    passing_year: 2014,
    passing_month: 2
  };
  getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }
  EmpObjects = {
    employeeList: null,
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null
  }
  ngOnInit(): void {
    this.educationForm.get('title').valueChanges.subscribe((titleValue) => {
      if (titleValue) {
        this.educationForm.get('degree').enable();
      } else {
        this.educationForm.get('degree').disable();
        this.educationForm.get('stream').disable();
      }
    });
    this.educationForm.get('degree').valueChanges.subscribe((degreeValue) => {
      if (degreeValue) {
        this.educationForm.get('stream').enable();
      } else {
        this.educationForm.get('stream').disable();
      }
    });
    this.activateroute.queryParams.subscribe((params) => {
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })
    this.getEmpEducationInfo();
    this.getTitleAutocomplete();
    this.getCityAutocomplete();
    this.getDegreeAutocomplete();
    this.getStreamAutocomplete();
    this.getEmployeeBasicDetails();
    this.getEmployee();
    this.initializeForm()
    this.getEmpDocs()
  }
  EmpBasicDetails: any;
  getEmployeeBasicDetails() {
    this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
      this.EmpBasicDetails = results;
    }
    )
  }
  getEmpEducationInfo() {
    this.hrmsService.getEmpEducationInfoNew(this.EmpId)
      .subscribe(results => {
        if (results.code) {
          this.toastr.error(results.code);
        }
        else {
          this.EmpEducationInfo = results['education'];
          this.EmpEducationInfo.reverse();
          let instNames = this.EmpEducationInfo.map(item => item.inst_name);
          let displayMonth = this.EmpEducationInfo.map(item => item.passing_month);
          let displayYear = this.EmpEducationInfo.map(item => item.passing_year);
        }
      });
  }
  degreeUserInput: any
  titleUserInput: any
  selectedTitleId: any
  streamInput: any
  selectedDegreeId: any
  normalDateFormat: any

  getTitleAutocomplete() {
    this.titleUserInput = this.educationForm.value.title;
    this.hrmsService.getTitleDropdownList(this.titleUserInput).subscribe((results) => {
      this.TitleDropdownList = results['data'];
      if (this.TitleDropdownList.length > 0) {
        this.selectedTitleId = this.TitleDropdownList[0].id;
      }
    });
  }
  getDegreeAutocomplete() {
    this.degreeUserInput = this.educationForm.get('degree').value;
    if (this.selectedtitleIds !== undefined && this.selectedtitleIds !== null) {
      this.hrmsService.getMappedDegreeList(this.selectedtitleIds, this.degreeUserInput).subscribe((results) => {
        this.MappedDegreeList = results['data'];
        if (this.MappedDegreeList.length > 0) {
          this.selectedDegreeId = this.MappedDegreeList[0].id;
        }
      });
    } else if (this.degreepatch !== '' && this.degreepatch !== undefined && this.degreepatch !== null) {
      this.hrmsService.getMappedDegreeList(this.degreepatch, this.degreeUserInput).subscribe((results) => {
        this.MappedDegreeList = results['data'];
      });
    }


    else {

    }
  }

  getInstituteAutocomplete() {
    this.hrmsService.getEmpEducationInfo(this.EmpId)
      .subscribe(results => {
        this.EmpEducationInfo = results['data'];
        this.EmpEducationInfo.reverse();
      });
  }
  getStreamAutocomplete() {
    this.streamInput = this.educationForm.get('stream').value;
    if (this.selectedDegreeIds !== undefined && this.selectedDegreeIds !== null && this.selectedDegreeIds !== '') {
      this.hrmsService.getStreamAutList(this.selectedDegreeIds, this.streamInput).subscribe((results) => {
        this.StreamDropdownList = results['data'];
      });
    } else if (this.degreepatch !== '' && this.degreepatch !== undefined && this.degreepatch !== null) {
      this.hrmsService.getStreamAutList(this.degreepatch, this.streamInput).subscribe((results) => {
        this.StreamDropdownList = results['data'];
      });
    }

    else {
    }
  }

  getCityAutocomplete() {
    this.streamInput = this.educationForm.get('city').value;
    this.hrmsService.getCitySearchResults(this.streamInput).subscribe((results) => {
      this.CityDropdownList = results['data'];
    });
  }
  selectedItem: any;
  inputDate: any;
  formattedDate: any;
  educationForm: FormGroup = new FormGroup({
    degree: new FormControl(),
    title: new FormControl(),
    stream: new FormControl(),
    inst_name: new FormControl(),
    city: new FormControl(),
    passing_year: new FormControl(),
    passing_month: new FormControl(),
    percentage: new FormControl(),
    monthyear: new FormControl()
  });
  year: any
  month: any
  editId: any
  dateObj: any
  editRow(item: any) {
    this.addingMode = false;
    this.selectedItem = item;
    this.year = item.passing_year;
    this.month = item.passing_month - 1;
    this.editId = item.id
    const dateObject = new Date(this.year, this.month, 1);
    this.formattedDate = dateObject.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    this.dateObj = new Date(this.formattedDate)
    this.educationForm.patchValue({
      title: { name: item?.title?.name },
      stream: { name: item?.stream?.name },
      inst_name: item?.inst_name,
      city: { name: item?.city },
      passing_year: item?.passing_year,
      passing_month: item?.passing_month,
      percentage: item?.percentage,
      monthyear: this.dateObj,
      degree: { name: item?.degree?.name },
      id: item?.id

    });
    this.idPatch = item?.id;
    this.degreepatch = item.title.id;

    this.reuploadfileArr = item?.employee_document;
    if (this.reuploadfileArr == undefined || this.reuploadfileArr == null || this.reuploadfileArr == '') {
      {
        this.fileupdate = true;
      }
    }
    else {
      this.fileupdate = false;
    }
  }
  showSaveButton() {
    this.addingMode = true;
    this.educationForm.reset();
  }
  updateyear: any;
  updatemonth: any;
  monthYearDate: any;
  onUpdate() {

    const formValue = this.educationForm.value;
    if (formValue.title == '' || formValue.title == null || formValue.title == undefined) {
      this.toastr.error("Please Select Title");
      return false;
    }
    // if(formValue.title.id == '' || formValue.title.id == null || formValue.title.id == undefined)
    // {
    //   this.toastr.error("Please Select Title from Dropdown");
    //   return false;
    // }
    if (formValue.degree == '' || formValue.degree == null || formValue.degree == undefined) {
      this.toastr.error("Please Select Degree");
      return false;
    }
    if (formValue.stream == '' || formValue.stream == null || formValue.stream == undefined) {
      this.toastr.error("Please Select Stream");
      return false;
    }
    if (formValue.stream.id == '' || formValue.stream.id == null || formValue.stream.id == undefined) {
      this.toastr.error("Please Select Stream from Dropdown");
      return false;
    }
    if (formValue.inst_name == '' || formValue.inst_name == null || formValue.inst_name == undefined) {
      this.toastr.error("Please Enter Institute Name");
      return false;
    }
    if (formValue.city == '' || formValue.city == null || formValue.city == undefined) {
      this.toastr.error("Please Select City");
      return false;
    }
    if (formValue.monthyear == '' || formValue.monthyear == null || formValue.monthyear == undefined) {
      this.toastr.error("Please Select Passing Year");
      return false;
    }
    if (formValue.percentage == '' || formValue.percentage == null || formValue.percentage == undefined) {
      this.toastr.error("Please Select Percentage");
      return false;
    }
    if (this.educationForm.valid) {
      const formValue = this.educationForm.value;
      formValue.id = this.editId
      formValue.title = formValue.title.name;
      formValue.degree = formValue.degree.name;
      formValue.stream = formValue.stream.name;
      formValue.city = formValue.city.name;
      this.monthYearDate = new Date(formValue.monthyear);
      this.updateyear = this.monthYearDate.getFullYear();
      this.updatemonth = this.monthYearDate.getMonth() + 1;
      formValue.passing_month = this.updatemonth;
      formValue.passing_year = this.updateyear;
      const jsonData = JSON.stringify([formValue]);
      this.hrmsService.postEmployeeEducationInfoNew(this.EmpId, jsonData).subscribe(
        (response) => {
          this.toastr.success('Successfully posted/updated education info');
          this.getEmpEducationInfo();
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();
        },
        (error) => {
          this.toastr.error('Error while posting/updated education info');
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();
        });
    } else {
      this.toastr.warning('All details need to be filled');
    }
  }
  dateString: string
  onSave() {
    const formValue = this.educationForm.value;
    if (formValue.title == '' || formValue.title == null || formValue.title == undefined) {
      this.toastr.error("Please Select Title");
      return false;
    }
    if (formValue.title.id == '' || formValue.title.id == null || formValue.title.id == undefined) {
      this.toastr.error("Please Select Title from Dropdown");
      return false;
    }
    if (formValue.degree == '' || formValue.degree == null || formValue.degree == undefined) {
      this.toastr.error("Please Select Degree");
      return false;
    }
    if (formValue.degree.id == '' || formValue.degree.id == null || formValue.degree.id == undefined) {
      this.toastr.error("Please Select Degree from the Dropdown");
      return false;
    }
    if (formValue.stream == '' || formValue.stream == null || formValue.stream == undefined) {
      this.toastr.error("Please Select Stream");
      return false;
    }
    if (formValue.degree.id == '' || formValue.degree.id == null || formValue.degree.id == undefined) {
      this.toastr.error("Please Select Degree from the Dropdown");
      return false;
    }
    if (formValue.stream.id == '' || formValue.stream.id == null || formValue.stream.id == undefined) {
      this.toastr.error("Please Select Stream from Dropdown");
      return false;
    }

    if (formValue.inst_name == '' || formValue.inst_name == null || formValue.inst_name == undefined) {
      this.toastr.error("Please Enter Institute Name");
      return false;
    }
    if (formValue.city == '' || formValue.city == null || formValue.city == undefined) {
      this.toastr.error("Please Select City");
      return false;
    }
    if (formValue.monthyear == '' || formValue.monthyear == null || formValue.monthyear == undefined) {
      this.toastr.error("Please Select Passing Year");
      return false;
    }
    if (formValue.percentage == '' || formValue.percentage == null || formValue.percentage == undefined) {
      this.toastr.error("Please Select Percentage");
      return false;
    }
    // if(!this.fileUploadForm.get('file').value){
    //   this.toastr.error("Please Select File");
    //   return false
    // }
    if (this.educationForm.valid ||
      (this.educationForm.get('stream').value === '' && this.educationForm.get('percentage').value === '')) {
      const monthYearValue = this.educationForm.get('monthyear').value;
      this.normalDateFormat = monthYearValue._d;
      this.dateString = this.normalDateFormat.toString();

      const formIntoJson = {
        inst_name: formValue.inst_name || null,
        passing_year: monthYearValue._i.year || null,
        passing_month: monthYearValue._i.month + 1 || null,
        percentage: formValue.percentage || null,
        city: formValue.city.name || null,
        title: formValue.title.name || null,
        stream: formValue.stream.name || null,
        degree: formValue.degree.name || null
      };
      const jsonData = JSON.stringify([formIntoJson]);
      this.hrmsService.postEmployeeEducationInfoNew(this.EmpId, jsonData).subscribe(
        (response) => {
          this.toastr.success('Successfully posted education info');
          this.getEmpEducationInfo();
          this.onSubmit()
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();
        },
        (error) => {
          this.toastr.error('Error while posting education info');
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();
        }
      );
    } else {
      for (const control in this.educationForm.controls) {
        if (this.educationForm.controls.hasOwnProperty(control)) {
          this.educationForm.get(control).markAsTouched();
        }
      }
      this.toastr.warning('All details needed to be filled');
      console.log('All details needed to be filled')
    }
  }
  deleteEducationRecord(recordId: number) {
    if (confirm('Are you sure you want to delete this education record?')) {
      this.hrmsService.deleteEmployeeEducationRecord(recordId, this.EmpId).subscribe(
        (response) => {
          this.toastr.success("Education Record Deleted Successfully")
          this.getEmpEducationInfo();
        },
        (error) => {
          console.error('Error while deleting education record:', error);
        }
      );
    }
  }
  getEmployee() {
    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
    let id = idValue.employee_id;
    this.EmpObjects.empId = idValue.employee_id;
    this.hrmsService.getEmpDetails(id)
      .subscribe(res => {
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
    this.EmpObjects.employeeFirstLetter = letter
  }
  public titleSelected(event: any): void {
    this.selectedDegreeIds = event.option.value.id;
    this.educationForm.get('stream').setValue('');
  }
  getDegreeAutocompletes() {
    this.degreeUserInput = this.educationForm.get('degree').value;

    this.hrmsService.getMappedDegreeList(this.selectedtitleIds, '').subscribe((results) => {
      this.MappedDegreeList = results['data'];
      if (this.MappedDegreeList.length > 0) {
        this.selectedDegreeId = this.MappedDegreeList[0].id;
      }
    });

  }
  getStreamAutocompletes() {
    this.streamInput = this.educationForm.get('stream').value;
    if (this.selectedDegreeIds !== undefined && this.selectedDegreeIds !== null && this.selectedDegreeIds !== '') {
      this.hrmsService.getStreamAutList(this.selectedDegreeIds, this.streamInput).subscribe((results) => {
        this.StreamDropdownList = results['data'];
      });
    } else if (this.degreepatch !== '' && this.degreepatch !== undefined && this.degreepatch !== null) {
      this.hrmsService.getStreamAutList(this.degreepatch, this.streamInput).subscribe((results) => {
        this.StreamDropdownList = results['data'];
      });
    }
    else {
      this.toastr.warning('Please Choose Title first');
    }
  }
  public titleSelecteds(event: any): void {
    this.selectedtitleIds = event.option.value.id;
  }
  typeid() {
    const data = this.EmployeeDocuments.data.find(document => document.type.name === 'Educational certificate')
    return data ? data?.type?.id : null
  }
  onSubmit(): void {
    console.log(this.fileUploadForm.value);
    const typeIdFromForm = this.fileUploadForm.get('type').value;
    // const typeIdFromMethod = this.getTypeId();

    // if (typeIdFromForm !== typeIdFromMethod) {
    //   this.fileUploadForm.get('type').setValue(typeIdFromMethod);
    // }
    if (this.fileUploadForm.get('file').value) {

      const formDataArray: any[] = [];
      this.typeValue = this.typeid()

      const typeAndRemarksObject = {
        type: this.typeid(),
        remarks: ''
      };

      formDataArray.push(typeAndRemarksObject);

      const formData = new FormData();
      formData.append(`${this.typeValue}`, this.fileUploadForm.get('file').value);

      console.log('Formatted Array:', formDataArray);

      this.hrmsService.postDocumentDetails(this.EmpId, formDataArray, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.getEmpDocs()
          this.toastr.success("File uploaded Successfully");
          this.closebutton.nativeElement.click()
          this.fileUploadForm.reset()

        },
        (error) => {
          console.error('Error uploading file', error);
          this.toastr.error("Error uploading file");


        }

      );

    } else {
      for (const control in this.fileUploadForm.controls) {
        if (this.fileUploadForm.controls.hasOwnProperty(control)) {
          this.fileUploadForm.get(control).markAsTouched();
        }
      }
      console.log("not valid");
      // this.toastr.warning('All details needed to be filled');
    }
  }
  getEmpDocs() {
    this.hrmsService.getEmpDocuments(this.EmpId)
      .subscribe(results => {
        this.EmployeeDocuments = results;

        console.log("docs details", this.EmployeeDocuments)
      });

  }
  initializeForm(): void {
    // const typeValue = this.getTypeId();

    this.fileUploadForm = this.fb.group({
      type: [null],
      remarks: [null, Validators.required],
      file: [null, Validators.required]
    });
    // this.fileUploadForm.patchValue({
    //   type: 4
    // });
  }
  get remarkInfo() {
    return this.fileUploadForm.get("remarks")
  }
  get docsFile() {
    return this.fileUploadForm.get("file")
  }
  onFileChange(event): void {
    const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 5 * 1024 * 1024;

    const fileInput = event.target;
    const selectedFiles = fileInput.files;


    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      if (!allowedFileTypes.includes(file.type)) {
        this.toastr.error('Invalid file type. Please select a PDF, JPEG, PNG, or JPG file.');
        fileInput.value = '';
        return;
      }
      if (file.size > maxFileSize) {
        this.toastr.error('File size exceeds the maximum limit (5 MB). Please select a smaller file.');
        fileInput.value = '';
        return;
      }


      console.log('File is valid:', file.name);
    }
    const file = (event.target as HTMLInputElement).files[0];
    this.fileUploadForm.patchValue({
      file
    });
  }

  fileChange(event) {
    // let imagesList = [];
    this.images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }

  }

  adddocformarray() {
    // this.addData = true;
    // if (this.issueForm.value.description == undefined || this.issueForm.value.description == null) {
    //   this.notify.error('Please Enter Description');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.issueForm.value.project === "") {
    //   this.notify.error('Please Select Project');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    //  if(this.images.length == 0){
    //    this.notify.error('', 'Choose Upload Files ', { timeOut: 1500 });
    //    this.SpinnerService.hide();
    //    return false;
    //  }
    // let dataArray = this.issueForm.value
    // let data = {
    //   project_id: dataArray.project_map_id.mapping_id,
    //   description: dataArray.description,
    //   priority_type: dataArray.priority_type,
    //   attachment: "",
    //   filekey: this.images
    // } 


    const formValue = this.educationForm.value;
    const monthYearValue = this.educationForm.get('monthyear').value;
    this.normalDateFormat = monthYearValue._d;
    this.dateString = this.normalDateFormat.toString();

    let data = {
      inst_name: formValue.inst_name || null,
      passing_year: monthYearValue._i.year || null,
      passing_month: monthYearValue._i.month + 1 || null,
      percentage: formValue.percentage || null,
      city: formValue.city.name || null,
      title: formValue.title.name || null,
      stream: formValue.stream.name || null,
      degree: formValue.degree.name || null,
      type: 4,
      attachment: "",
      filekey: this.images
    };


    console.log("dataArray", data)
    this.docFunctionList.push(data)
    console.log("array docs", this.docFunctionList)

    // this.issueForm.controls["description"].reset('');
    // this.issueForm.controls["priority_type"].reset('');
    // this.images = [];
    // this.fileInput.nativeElement.value = ""


  }

  onSubmitss() {
    this.adddocformarray();
    // this.SpinnerService.show();
    console.log("submit", this.docFunctionList);

    // if (this.docFunctionList.length === 0) {
    //   this.notify.error('Please Fill All Details');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    let count = 1;
    for (let i = 0; i < this.docFunctionList.length; i++) {
      this.docFunctionList[i].attachment = 'file' + count++;
    }
    console.log("ffff", this.docFunctionList);
    console.log("docgp", this.docFunctionList);
    let successfulSubmissions = 0;
    const processSubmission = (index) => {
      const dataset = this.docFunctionList[index];
      const formData: FormData = new FormData();
      const Finaldata = [dataset];
      const datavalue = JSON.stringify(Finaldata);
      formData.append('data', datavalue);

      const string_value = this.docFunctionList[index].attachment;
      const file_list = this.docFunctionList[index].filekey;

      formData.append(string_value, file_list[0]);
      // this.SpinnerService.show();
      // this.taskmanagerservice.issueCreation(formData)
      this.hrmsService.postEmployeeEducationInfoNew(this.EmpId, formData)
        .subscribe(res => {
          console.log("issue click", res)

          if (res.message == 'Successfully Created') {
            this.toastr.success("Created Successfully!...");
            this.docFunctionList = [];
            this.educationForm.reset();
            this.getEmpEducationInfo();
            this.closeButtons.nativeElement.click();
            // this.OnSubmit.emit();
            // this.SpinnerService.hide();
            // this.issueForm.reset();

            this
          } else {
            // this.notify.error(res.description)
            // this.SpinnerService.hide();
            // return false;
          }
        },
          error => {
            // this.errorHandler.handleError(error);
            // this.SpinnerService.hide();
          }

        )

      // this.SpinnerService.hide();

    }
    for (let i = 0; i < this.docFunctionList.length; i++) {
      processSubmission(i);
    }
    // this.SpinnerService.hide();
    // this.issueForm.reset();
  }

  viewfile(data) {
    let filedata = data;
    this.dataname = filedata.file_id;
    this.filenames = filedata.file_name
    // this.spinner.show();
    let option = 'view'
    let msg = this.filetype_check2(this.filenames);
    this.hrmsService.viewDocumentDetails(this.EmpId, this.dataname)
      .subscribe(
        results => {
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);

          let token = tokenValue.token;
          if (this.file_ext.includes(this.fileextension.toLowerCase())) {
            // this.filesrc =  this.hrmsService.viewDocumentDetails(this.EmpId, data);
            this.filesrc = this.imageUrls + 'docserv/doc_download/' + this.dataname + '?entity_id=1&user_id=' + this.EmpId + "&token=" + token;

          }
          else {
            let binaryData = [];
            binaryData.push(results)
            let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
            this.filesrc = downloadUrl;

          }

          if (msg == 1) {
            this.pdfshow = false;
            this.imgshow = true;


          }
          else {
            this.pdfshow = true;
            this.imgshow = false
          }

        })
    // this.spinner.hide();
    // this.getEmpDocs();
    this.filesrc = null;

  }

  filetype_check2(i) {
    let file_name = i;
    let stringValue = file_name.split('.')
    this.fileextension = stringValue.pop();
    this.file_ext = ['jpg', 'png', 'JPG', 'JPEG', 'jpeg', 'image']
    if (this.file_ext.includes(this.fileextension)) {
      var msg = 1;
    }
    else {
      var msg = 0;
    }
    return msg


  }

  onUpdates() {

  }

  deleteAddress(recordId: number) {
    if (confirm('Are you sure you want to delete this education record?')) {
      this.spinner.show();
      this.hrmsService.deleteEducationInfo(recordId, this.EmpId).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success("Education Record Deleted successfully")
          // this.getEmpExperienceInfo()
          this.getEmpEducationInfo();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error("Delete failed")
        }
      );
    }
  }

  downloadfiles(data) {
    this.spinner.show();
    let filedata = data.employee_document
    this.dataname = filedata.file_id;
    this.filenames = filedata.file_name
    let option = 'view'
    let msg = this.filetype_check2(this.filenames);
    this.hrmsService.viewDocumentDetails(this.EmpId, this.dataname)
      .subscribe(
        results => {


          let binaryData = [];
          binaryData.push(results)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = this.filenames;
          link.click();
        })
    this.spinner.hide();
    // this.getEmpDocs();
  }
  deletefile() {

  }

  delete(data) {
     
  console.log('File ID:', data?.id);

  this.hrmsService.getEmployeeDocumentDetails(this.EmpId, data?.id)
    .subscribe(
      results => {
        this.EmployeeDocuments = results;
        console.log("Docs details", this.EmployeeDocuments);
        this.toastr.success("File deleted successfully");
        this.fileupdate = true;
      },
      error => {
        console.error('Error deleting document:', error);
        this.toastr.error("Error deleting file", "Error");
      }
    );
  }

  onUpdateValue()
  {
    this.adddocformarrays();
    console.log("submit", this.docFunctionLists);
    let count = 1;
    for (let i = 0; i < this.docFunctionLists.length; i++) {
      this.docFunctionLists[i].attachment = this.docFunctionLists[i].filekey.length > 0 ? 'file' + count++ : ""; // Check if filekey exists to set attachment
    }
    console.log("ffff", this.docFunctionLists);
    console.log("docgp", this.docFunctionLists);
    let successfulSubmissions = 0;
    const processSubmission = (index) => {
      const dataset = this.docFunctionLists[index];
      const formData: FormData = new FormData();
      const Finaldata = [dataset];
      const datavalue = JSON.stringify(Finaldata);
      formData.append('data', datavalue);
  
      // Append file only if it exists
      if (dataset.attachment !== "") {
        formData.append(dataset.attachment, dataset.filekey[0]);
      }
  
      this.hrmsService.postEmployeeEducationInfoNew(this.EmpId, formData) // Assuming this is an update operation
        .subscribe(res => {
          console.log("issue click", res)
          if (res.message == 'Successfully Updated') {
            this.toastr.success("Updated Successfully!...");
            this.docFunctionLists = [];
            this.getEmpEducationInfo();
            this.educationForm.reset();
            this.closeButtons.nativeElement.click();
          } else {
            // Handle error condition if required
          }
        },
        error => {
          // Handle error condition if required
        });
    };
  
    for (let i = 0; i < this.docFunctionLists.length; i++) {
      processSubmission(i);
    }
  }
  adddocformarrays() {
    // this.addData = true;
    // if (this.issueForm.value.description == undefined || this.issueForm.value.description == null) {
    //   this.notify.error('Please Enter Description');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.issueForm.value.project === "") {
    //   this.notify.error('Please Select Project');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    //  if(this.images.length == 0){
    //    this.notify.error('', 'Choose Upload Files ', { timeOut: 1500 });
    //    this.SpinnerService.hide();
    //    return false;
    //  }
    // let dataArray = this.issueForm.value
    // let data = {
    //   project_id: dataArray.project_map_id.mapping_id,
    //   description: dataArray.description,
    //   priority_type: dataArray.priority_type,
    //   attachment: "",
    //   filekey: this.images
    // } 


    const formValue = this.educationForm.value;
    const monthYearValue = this.educationForm.get('monthyear').value;
    // this.normalDateFormat = monthYearValue._d;
    this.dateString = monthYearValue.toString();
    const yearVal = monthYearValue.getFullYear();
    const monthVal = monthYearValue.getMonth() + 1; 

    let data = {
      inst_name: formValue.inst_name || null,
      passing_year: yearVal || null,
      passing_month: monthVal || null,
      percentage: formValue.percentage || null,
      city: formValue.city.name || null,
      title: formValue.title.name || null,
      stream: formValue.stream.name || null,
      degree: formValue.degree.name || null,
      type: 4,
      attachment: "",
      filekey: this.images,
      id: this.idPatch || null,
    };


    console.log("dataArray", data)
    this.docFunctionLists.push(data)
    console.log("array docs", this.docFunctionList)

    // this.issueForm.controls["description"].reset('');
    // this.issueForm.controls["priority_type"].reset('');
    // this.images = [];
    // this.fileInput.nativeElement.value = ""


  }
}


