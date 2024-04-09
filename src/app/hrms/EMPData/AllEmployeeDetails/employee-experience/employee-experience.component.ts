import { Component, OnInit ,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { NgxSpinnerService } from 'ngx-spinner';
// import { viewClassName } from '@angular/compiler';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-employee-experience',
  templateUrl: './employee-experience.component.html',
  styleUrls: ['./employee-experience.component.scss']
})
export class EmployeeExperienceComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;
  @ViewChild('closebutton')closebutton:ElementRef

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  //check box
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  dor = new FormControl(new Date());

  // Define a custom date format
  customDateFormat = 'yyyy-MM-dd';
  EmpId: any;
  EmpExperienceInfo: any
  addingMode: boolean = true;
  // Inside your component class
  isCurrentlyWorking: boolean = false;
  fileUploadForm: any;
  EmployeeDocuments: any=[];
  typeValue: any;
  images: string[] = [];
  docFunctionList = [];
  dataname: any;
  filenames: any;
  fileextension: any;
  file_ext: string[];
  filesrc: string;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  imageUrls = environment.apiURL;
  imageUrl: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  reuploadfileArr: any;
  fileupdate: boolean = false;
  docFunctionLists: any = [];
  patchid: any;
  addnewdata: boolean = true;

  // Function to toggle the "Currently working" state
  toggleCurrentlyWorking() {
    this.isCurrentlyWorking = !this.isCurrentlyWorking;
  }

  displayCity(city: any): string {
    return city && city.name ? city.name : '';
  }
  // Initialize your educationForm
  experienceForm: FormGroup = new FormGroup({
    company: new FormControl(),
    work_experience: new FormControl(),
    doj: new FormControl(),
    dor: new FormControl(),
    role: new FormControl(),
    city: new FormControl(),
   
    disableField: new FormControl(false)
  });


  constructor(private hrmsService: MasterHrmsService, private activateroute: ActivatedRoute, private fb: FormBuilder,
    private datePipe: DatePipe, private toastr: ToastrService,private renderer: Renderer2, private spinner : NgxSpinnerService) {

    this.experienceForm = this.fb.group({
      company: [''],
      work_experience: [''],
      doj: [''],
      dor: [''],
      role: [''],
      city: [''],
      disableField: [false],

    });
  }


  get companyName() {
    return this.experienceForm.get("company")
  }

  get joiningDate() {
    return this.experienceForm.get("doj")
  }

  get expRole() {
    return this.experienceForm.get("role")
  }
  get expCity() {
    return this.experienceForm.get("city")
  }
  selectedItem: any;
  editId: any;
  dojDate: any
  dorDate: any
  dateObject: any
  formattedDoj: any
  formattedDor: any
  dateObjDoj: any
  dateObjDor: any
  EmpObjects = {
    employeeList: null, 
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null   
  }  

  editRowExp(expitem: any) {
    this.patchid = expitem?.id;
    this.addingMode = false;
    this.selectedItem = expitem;
    this.editId = expitem.id;
    this.dojDate = new Date(expitem.doj);
    const dorIsInvalid = expitem.dor === 'undefined NaN NaN';
    const dorValue = dorIsInvalid ? null : new Date(expitem.dor);
    this.formattedDoj = this.datePipe.transform(this.dojDate, 'MM/dd/yyyy');
    const formattedDor = dorIsInvalid ? null : this.datePipe.transform(dorValue, 'MM/dd/yyyy');
    this.dateObjDoj = new Date(this.formattedDoj);
    const dateObjDor = dorIsInvalid ? null : new Date(formattedDor);

    this.experienceForm.patchValue({
      company: expitem.company,
      work_experience: expitem.work_experience,
      doj: this.dateObjDoj,
      dor: dateObjDor,
      role: expitem.role,
      city: { name: expitem.city },
    });
    this.reuploadfileArr  = expitem?.employee_document;
    if(this.reuploadfileArr == undefined  || this.reuploadfileArr == null || this.reuploadfileArr == '') {
    {
      this.fileupdate = true;
    }
  }
    else
    {
      this.fileupdate = false;
    }
  }
  


  showSaveButton() {
    this.addingMode = true;
    this.experienceForm.reset();
  }
  streamInput: any
  CityDropdownList: any
  isDateValid(dateString: string): boolean {
    return !isNaN(Date.parse(dateString));
  }
  getCityAutocomplete() {
    this.streamInput = this.experienceForm.get('city').value;
    this.hrmsService.getCitySearchResults(this.streamInput).subscribe((results) => {
      this.CityDropdownList = results['data'];
    });

  }
  formatDate(date: Date): string {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day} ${year}`;
  }

  ngOnInit(): void {
    this.experienceForm = new FormGroup({
      company: new FormControl(""),
      work_experience: new FormControl(),
      doj: new FormControl(""),
      dor: new FormControl(),
      role: new FormControl(""),
      city: new FormControl(""),
      disableField: new FormControl(false)
    });
    this.activateroute.queryParams.subscribe((params) => {
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })
this.getEmpExperienceInfo()
this.getEmployeeBasicDetails();
this.getEmployee();
this.initializeForm()
this.getEmpDocs()
  }
  EmpBasicDetails:any;
  getEmployeeBasicDetails(){
    this.spinner.show();
   this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
    this.spinner.hide();
     this.EmpBasicDetails = results;
   }
   )
 }
  getEmpExperienceInfo(){
    this.spinner.show();
    this.hrmsService.getEmpExperienceInfoNew(this.EmpId)
    .subscribe(results => {
      if(results.code)
      {
        this.spinner.hide();
        this.toastr.error(results.code);
      }
      else
      {
      this.spinner.hide();
      this.EmpExperienceInfo = results['experience']
   
      this.EmpExperienceInfo.reverse();
      this.EmpExperienceInfo.forEach((experience: any) => {
        const dojDate = new Date(experience.doj);
        experience.doj = this.formatDate(dojDate);
        const dorDate = new Date(experience.dor);
        experience.dor = this.formatDate(dorDate);
      });
    }
    })
  }
  dojVal: any;
  dorVal: any;
  formattedDateDoj: any;
  formattedDateDor: any;
  jsonDataExp: any

  onCheckboxChange(event: MatCheckboxChange) {
    if (event.checked) {
      this.experienceForm.get('dor').setValue(null); 
    }
  }
  onSave() {
    if(this.experienceForm.value.company == '' || this.experienceForm.value.company == null || this.experienceForm.value.company == undefined)
    {
      this.toastr.error("Please Enter Company Name");
      return false;
    }
    if(this.experienceForm.value.doj == '' || this.experienceForm.value.doj == null || this.experienceForm.value.doj == undefined)
    {
      this.toastr.error("Please Select Date of Joining");
      return false;
    }
    if(this.experienceForm.value.dor == '' || this.experienceForm.value.dor == null || this.experienceForm.value.dor == undefined)
    {
      this.toastr.error("Please Select Date of Relieving");
      return false;
    }
    if(this.experienceForm.value.role == '' || this.experienceForm.value.role == null || this.experienceForm.value.role == undefined)
    {
      this.toastr.error("Please Enter Role");
      return false;
    }
    if(this.experienceForm.value.city == '' || this.experienceForm.value.city == null || this.experienceForm.value.city == undefined)
    {
      this.toastr.error("Please Select City");
      return false;
    }
    if(!this.fileUploadForm.get('file').value){
      this.toastr.error('Please Select File')
      return false;
    }
    if (this.experienceForm.valid ||
      (this.experienceForm.get('dor').value === '')) {
      this.dojVal = this.experienceForm.get('doj').value
      this.dorVal = this.experienceForm.get('dor').value
      this.formattedDateDoj = this.datePipe.transform(this.dojVal, 'yyyy-MM-dd');
      this.formattedDateDor = this.datePipe.transform(this.dorVal, 'yyyy-MM-dd')
      const formValue = this.experienceForm.value;
      const formIntoJson = {
        company: formValue.company || null,
        work_experience: formValue.work_experience || null,
        doj: this.formattedDateDoj || null,
        dor: this.formattedDateDor || null,
        role: formValue.role || null,
        city: formValue.city.name || null,
      };
      this.jsonDataExp = JSON.stringify([formIntoJson]);
      this.hrmsService.postEmployeeExperienceInfoNew(this.EmpId, this.jsonDataExp).subscribe(
        (response) => {
          this.toastr.success('Successfully posted experience info');
          this.getEmpExperienceInfo()
          this.onSubmit()
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

          // setTimeout(() => {
          //   location.reload();
          // }, 3000);
        },
        (error) => {
          this.toastr.error('Error while posting experience info');
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

        }
      );
    } else {
      for (const control in this.experienceForm.controls) {
        if (this.experienceForm.controls.hasOwnProperty(control)) {
          this.experienceForm.get(control).markAsTouched();
        }
      }
      this.toastr.warning('All required details needed to be filled');
    }
  }

  editDojVal: any;
  editDorVal: any;
  editFormattedDateDoj: any;
  editFormattedDateDor: any;

  onUpdate() {
    if(this.experienceForm.value.company == '' || this.experienceForm.value.company == null || this.experienceForm.value.company == undefined)
    {
      this.toastr.error("Please Enter Company Name");
      return false;
    }
    if(this.experienceForm.value.doj == '' || this.experienceForm.value.doj == null || this.experienceForm.value.doj == undefined)
    {
      this.toastr.error("Please Select Date of Joining");
      return false;
    }
    if(this.experienceForm.value.dor == '' || this.experienceForm.value.dor == null || this.experienceForm.value.dor == undefined)
    {
      this.toastr.error("Please Select Date of Relieving");
      return false;
    }
    if(this.experienceForm.value.role == '' || this.experienceForm.value.role == null || this.experienceForm.value.role == undefined)
    {
      this.toastr.error("Please Enter Role");
      return false;
    }
    if(this.experienceForm.value.city == '' || this.experienceForm.value.city == null || this.experienceForm.value.city == undefined)
    {
      this.toastr.error("Please Select City");
      return false;
    }
    // if(this.experienceForm.value.city.id == '' || this.experienceForm.value.city.id == null || this.experienceForm.value.city.id == undefined)
    // {
    //   this.toastr.error("Please Select City from DropDown");
    //   return false;
    // }
    if (this.experienceForm.valid) {
      const formValue = this.experienceForm.value;
      formValue.id = this.editId
      formValue.city = formValue.city.name;
      this.editDojVal = this.experienceForm.get('doj').value
      this.editDorVal = this.experienceForm.get('dor').value
      this.editFormattedDateDoj = this.datePipe.transform(this.editDojVal, 'yyyy-MM-dd');
      this.editFormattedDateDor = this.datePipe.transform(this.editDorVal, 'yyyy-MM-dd')
      formValue.doj = this.editFormattedDateDoj;
      formValue.dor = this.editFormattedDateDor;
      const jsonData = JSON.stringify([formValue]);
      this.spinner.show();
      this.hrmsService.postEmployeeExperienceInfoNew(this.EmpId, jsonData).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success('Successfully updated experience info');
          this.getEmpExperienceInfo()
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

          // setTimeout(() => {
          //   location.reload();
          // }, 3000);
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error('Error while posting/updated experience info');
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

        });
    } else {
      this.spinner.hide();
      this.toastr.warning('All details need to be filled');
    }
  }


  deleteExperienceRecord(recordId: number) {
    if (confirm('Are you sure you want to delete this education record?')) {
      this.spinner.show();
      this.hrmsService.deleteEmployeeExperienceRecord(recordId, this.EmpId).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success("Experience Record Deleted successfully")
          this.getEmpExperienceInfo()
          this.fileupdate = true;
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error("Delete failed")
        }
      );
    }
  }
  getEmployee(){

    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
    let id = idValue.employee_id;
    this.EmpObjects.empId = idValue.employee_id;
    this.hrmsService.getEmpDetails( id )
    .subscribe(res=>{
      this.EmpObjects.employeeList = res 
      if(res?.id){ 
        this.gettingProfilename(res?.full_name) 
      }
    }, error=>{
      
    })
  }
  
  gettingProfilename(data){
    let name:any = data 
    let letter = name[0]
    this.EmpObjects.employeeFirstLetter = letter 
  }
  typeid(){
    const data=this.EmployeeDocuments.data.find(document=>document.type.name==='Work experience')
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
      this.toastr.warning('All details needed to be filled');
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
    // this.adddocformarray();
  }

  adddocformarray() {
    //  const formValue = this.experienceForm.value;
     this.dojVal = this.experienceForm.get('doj').value
     this.dorVal = this.experienceForm.get('dor').value
     this.formattedDateDoj = this.datePipe.transform(this.dojVal, 'yyyy-MM-dd');
     this.formattedDateDor = this.datePipe.transform(this.dorVal, 'yyyy-MM-dd')
     const formValue = this.experienceForm.value;
     let data = {
       company: formValue.company || null,
       work_experience: formValue.work_experience || null,
       doj: this.formattedDateDoj || null,
       dor: this.formattedDateDor || null,
       role: formValue.role || null,
       city: formValue.city.name || null,
       type: 6,
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
      this.hrmsService.postEmployeeExperienceInfoNew(this.EmpId, formData)
        .subscribe(res => {
          console.log("issue click", res)

          if (res.message == 'Successfully Created') {
            this.toastr.success("Created Successfully!...");
            this.docFunctionList = [];
            this.getEmpExperienceInfo();
            this.closeButton.nativeElement.click();
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

  viewfile(data)
  {
    let filedata =  data.employee_document
    this.dataname = filedata.file_id;
    this.filenames = filedata.file_name
    // this.spinner.show();
    let option = 'view'
    let msg = this.filetype_check2(this.filenames);
    this.hrmsService.viewDocumentDetails(this.EmpId, this.dataname )
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

  deleteExperience(recordId: number) {
    if (confirm('Are you sure you want to delete this Experience record?')) {
      this.spinner.show();
      this.hrmsService.deleteExperienceInfo(recordId, this.EmpId).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success("Experience Record Deleted successfully")
          // this.getEmpExperienceInfo()
          this.getEmpExperienceInfo();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error("Delete failed")
        }
      );
    }
  }

  downloadfiles(data)
{
  // this.spinner.show();
  let filedata =  data.employee_document
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
  // this.spinner.hide();
  // this.getEmpDocs();

}

deletefile(data)
{
  

  console.log('File ID:', data?.id);

  this.hrmsService.getEmployeeDocumentDetails(this.EmpId, data?.id)
    .subscribe(
      results => {
        this.EmployeeDocuments = results;
        console.log("Docs details", this.EmployeeDocuments);
        this.toastr.success("File deleted successfully");
        this.getEmpDocs();
        this.fileupdate = true;
      },
      error => {
        console.error('Error deleting document:', error);
        this.toastr.error("Error deleting file", "Error");
      }
    );
}

viewfiles(data)
{
  let filedata =  data;
  this.dataname = filedata.file_id;
  this.filenames = filedata.file_name
  this.spinner.show();
  let option = 'view'
  let msg = this.filetype_check2(this.filenames);
  this.hrmsService.viewDocumentDetails(this.EmpId, this.dataname )
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
  this.spinner.hide();
  // this.getEmpDocs();
  this.filesrc = null;
}

onUpdateVals()
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

    this.hrmsService.postEmployeeExperienceInfoNew(this.EmpId, formData) // Assuming this is an update operation
      .subscribe(res => {
        console.log("issue click", res)
        if (res.message == 'Successfully Updated') {
          this.toastr.success("Updated Successfully!...");
          this.docFunctionLists = [];
          this.getEmpExperienceInfo();
          this.experienceForm.reset();
          this.closeButton.nativeElement.click();
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
  //  const formValue = this.experienceForm.value;
   this.dojVal = this.experienceForm.get('doj').value
   this.dorVal = this.experienceForm.get('dor').value
   this.formattedDateDoj = this.datePipe.transform(this.dojVal, 'yyyy-MM-dd');
   this.formattedDateDor = this.datePipe.transform(this.dorVal, 'yyyy-MM-dd')
   const formValue = this.experienceForm.value;
   let data = {
     company: formValue.company || null,
     work_experience: formValue.work_experience || null,
     doj: this.formattedDateDoj || null,
     dor: this.formattedDateDor || null,
     role: formValue.role || null,
     city: formValue.city.name || null,
     type: 6,
    attachment: "",
    filekey: this.images,
    id: this.patchid 
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


