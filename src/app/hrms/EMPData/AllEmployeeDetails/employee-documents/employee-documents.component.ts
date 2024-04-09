import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';// Adjust the path
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


const HRMS_Url = environment.apiURL

@Component({
  selector: 'app-employee-documents',
  templateUrl: './employee-documents.component.html',
  styleUrls: ['./employee-documents.component.scss']
})
export class EmployeeDocumentsComponent implements OnInit {
  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  @ViewChild('closebutton', { static: false }) closebutton: ElementRef;
  EmpId: any
  EmployeeDocuments: any
  EmployeeDocumentNames: any
  fileUploadForm: FormGroup;


  showPanCardDetails = false;
  showAadharCardDetails = false;
  showBankProofDetails = false;
  showEducationDetails = false;
  showDisabilityDetails = false;
  showWorkExpDetails = false;
  showPastPaySlips = false;
  showEmpImage = false;
  base64data: string;
  fileextension: any;
  file_ext: string[];
  filesrc: string;
  pdfshow: boolean = false;
  imgshow: boolean = false;
  dataname: any;
  filenames: any;

  canUploadFiles(): boolean {
    // Add your conditions here based on the flags
    return (
      this.showWorkExpDetails ||
      this.showPanCardDetails ||
      this.showAadharCardDetails ||
      this.showBankProofDetails ||
      this.showEducationDetails ||
      this.showDisabilityDetails ||
      this.showPastPaySlips ||
      this.showEmpImage
    );
  }
  togglePanCardDetails() {
    this.showPanCardDetails = !this.showPanCardDetails;
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showDisabilityDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  toggleAadharCardDetails() {
    this.showAadharCardDetails = !this.showAadharCardDetails;
    this.showPanCardDetails = false
    // this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showDisabilityDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  toggleBankProofDetails() {
    this.showBankProofDetails = !this.showBankProofDetails;
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showEducationDetails = false;
    this.showDisabilityDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  toggleEducationDetails() {
    this.showEducationDetails = !this.showEducationDetails;
    // this.showPanCardDetails=false
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showDisabilityDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  toggleDisabilityDetails() {
    this.showDisabilityDetails = !this.showDisabilityDetails;
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  toggleWorkExpDetails() {
    this.showWorkExpDetails = !this.showWorkExpDetails;
    // this.showPanCardDetails=false
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showDisabilityDetails = false;
    this.showPastPaySlips = false;
    this.showEmpImage = false;
  }
  togglePastPaySlipsDetails() {
    this.showPastPaySlips = !this.showPastPaySlips;
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showWorkExpDetails = false;
    this.showDisabilityDetails = false;
    this.showEmpImage = false;
  }
  toggleEmpImgDetails() {
    this.showEmpImage = !this.showEmpImage;
    this.showPanCardDetails = false
    this.showAadharCardDetails = false;
    this.showBankProofDetails = false;
    this.showEducationDetails = false;
    this.showWorkExpDetails = false;
    this.showPastPaySlips = false;
    this.showDisabilityDetails = false;
  }
  constructor(private hrmsService: MasterHrmsService, private activateroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder, private toastr: ToastrService) {

  }

  getEmpDocs() {
    this.hrmsService.getEmpDocuments(this.EmpId)
      .subscribe(results => {
        if(results.code)
        {
          this.toastr.error(results.code);
        }
        else
        {
        this.EmployeeDocuments = results;

        console.log("docs details", this.EmployeeDocuments)
        }
      });

  }
  ngOnInit(): void {

    this.initializeForm();

    this.activateroute.queryParams.subscribe((params) => {
      // let id: any = params.get('data')
      console.log("summary call", params)
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })

    this.getEmpDocs();


    this.initializeForm();

  }

  initializeForm(): void {
    const typeValue = this.getTypeId();

    this.fileUploadForm = this.fb.group({
      type: [null],
      remarks: [null, Validators.required],
      file: [null, Validators.required]
    });
    this.fileUploadForm.patchValue({
      type: typeValue
    });
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

  hasPanCardFiles(): boolean {
    // console.log("Employee Documents", this.EmployeeDocuments)
    // const panCardType = this.EmployeeDocuments.data.find(document => document.type.name === 'pan card');
    // return panCardType && panCardType.file && panCardType.file.length > 0;
    // console.log("Employee Documents", this.EmployeeDocuments);
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const panCardType = this.EmployeeDocuments.data.find(document => document.type.name === 'pan card');
      return panCardType && panCardType.file && panCardType.file.length > 0;
    }
    return false;
  }

  hasAadharFiles(): boolean {


    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const aadharType = this.EmployeeDocuments.data.find(document => document.type.name === 'Aadhar card');
      return aadharType && aadharType.file && aadharType.file.length > 0;
    }
    return false;
  }

  hasBankFiles(): boolean {
    // const bankType = this.EmployeeDocuments.data.find(document => document.type.name === 'Bank proof');
    // return bankType && bankType.file && bankType.file.length > 0;
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const bankType = this.EmployeeDocuments.data.find(document => document.type.name === 'Bank proof');
      return bankType && bankType.file && bankType.file.length > 0;
    }
    return false;
  }

  hasEducationFiles(): boolean {
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const bankType = this.EmployeeDocuments.data.find(document => document.type.name === 'Educational certificate');
      return bankType && bankType.file && bankType.file.length > 0;
    }
    return false;
  }

  hasDisabilityFiles(): boolean {
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const disabilityType = this.EmployeeDocuments.data.find(document => document.type.name === 'Disability certificate');
      return disabilityType && disabilityType.file && disabilityType.file.length > 0;
    }
    return false;
  }



  hasExpFiles(): boolean {
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const workExpType = this.EmployeeDocuments.data.find(document => document.type.name === 'Work experience');
      return workExpType && workExpType.file && workExpType.file.length > 0;
    }
    return false;
  }

  hasPayslipFiles(): boolean {
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const payslipType = this.EmployeeDocuments.data.find(document => document.type.name === 'Past payslips');
      return payslipType && payslipType.file && payslipType.file.length > 0;
    }
    return false;
  }

  hasImageFiles(): boolean {
    if (this.EmployeeDocuments && this.EmployeeDocuments.data) {
      const imageType = this.EmployeeDocuments.data.find(document => document.type.name === 'Address Proof');
      return imageType && imageType.file && imageType.file.length > 0;
    }
    return false;
  }


  typeValue: number;

  onSubmit(): void {
    console.log(this.fileUploadForm.value);
    const typeIdFromForm = this.fileUploadForm.get('type').value;
    const typeIdFromMethod = this.getTypeId();

    if (typeIdFromForm !== typeIdFromMethod) {
      this.fileUploadForm.get('type').setValue(typeIdFromMethod);
    }
    if (this.fileUploadForm.valid) {
      this.spinner.show();
      const formDataArray: any[] = [];
      this.typeValue = parseInt(this.fileUploadForm.get('type').value, 10);

      const typeAndRemarksObject = {
        type: this.typeValue,
        remarks: this.fileUploadForm.get('remarks').value
      };

      formDataArray.push(typeAndRemarksObject);

      const formData = new FormData();
      formData.append(`${this.typeValue}`, this.fileUploadForm.get('file').value);

      console.log('Formatted Array:', formDataArray);

      this.hrmsService.postDocumentDetails(this.EmpId, formDataArray, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.spinner.hide();
          this.toastr.success("File uploaded Successfully");
          this.closebutton.nativeElement.click()
          this.fileUploadForm.reset()
          this.hasPanCardFiles();
          this.hasAadharFiles();
          this.hasBankFiles();
          this.hasEducationFiles();
          this.hasDisabilityFiles();
          this.hasExpFiles();
          this.hasPayslipFiles();
          this.hasImageFiles();


          this.getEmpDocs();
        },
        (error) => {
          console.error('Error uploading file', error);
          this.toastr.error("Error uploading file");
          this.spinner.hide();

        }

      );
      this.spinner.hide();
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

  type: any;

  formatFormData(formData: FormData): any {
    const type = formData.get('type');
    const remarks = formData.get('remarks');
    const file = formData.get('file');
    const formattedFormData = new FormData();
    formattedFormData.append('file', file);
    formattedFormData.append('type', type);
    formattedFormData.append('remarks', remarks);
    return formattedFormData;
  }

  imageUrls = environment.apiURL;
  imageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      this.displayImage(selectedFile);
    }
  }

  displayImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imageUrl = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  onDelete(fileId: number): void {
    console.log('File ID:', fileId);

    this.hrmsService.getEmployeeDocumentDetails(this.EmpId, fileId)
      .subscribe(
        results => {
          this.EmployeeDocuments = results;
          console.log("Docs details", this.EmployeeDocuments);
          this.toastr.success("File deleted successfully");
          this.getEmpDocs();
        },
        error => {
          console.error('Error deleting document:', error);
          this.toastr.error("Error deleting file", "Error");
        }
      );
  }


  panCardId: any
  getTypeId(): number {
    if (this.showPanCardDetails) {
      const panCardType = this.EmployeeDocuments.data.find(document => document.type.name === 'pan card');
      this.panCardId = panCardType.type.id
      return panCardType ? panCardType.type.id : null;
    }

    if (this.showAadharCardDetails) {
      const aadharCardType = this.EmployeeDocuments.data.find(document => document.type.name === 'Aadhar card');
      return aadharCardType ? aadharCardType.type.id : null;
    }

    if (this.showBankProofDetails) {
      const bankProofType = this.EmployeeDocuments.data.find(document => document.type.name === 'Bank proof');
      return bankProofType ? bankProofType.type.id : null;
    }

    if (this.showEducationDetails) {
      const educationType = this.EmployeeDocuments.data.find(document => document.type.name === 'Educational certificate');
      return educationType ? educationType.type.id : null;
    }

    if (this.showDisabilityDetails) {
      const disabilityType = this.EmployeeDocuments.data.find(document => document.type.name === 'Disability certificate');
      return disabilityType ? disabilityType.type.id : null;
    }

    if (this.showWorkExpDetails) {
      const expType = this.EmployeeDocuments.data.find(document => document.type.name === 'Work experience');
      return expType ? expType.type.id : null;
    }

    if (this.showPastPaySlips) {
      const payslipType = this.EmployeeDocuments.data.find(document => document.type.name === 'Past payslips');
      return payslipType ? payslipType.type.id : null;
    }

    if (this.showEmpImage) {
      const empImgType = this.EmployeeDocuments.data.find(document => document.type.name === 'Address Proof');
      return empImgType ? empImgType.type.id : null;
    }
    return null; // Handle other cases as needed
  }

  viewfile(data, filename) {
    this.dataname = data;
    this.filenames = filename
    this.spinner.show();
    let option = 'view'
    let msg = this.filetype_check2(filename);
    this.hrmsService.viewDocumentDetails(this.EmpId, data)
      .subscribe(
        results => {
          const getToken = localStorage.getItem("sessionData");
          let tokenValue = JSON.parse(getToken);

          let token = tokenValue.token;
          if (this.file_ext.includes(this.fileextension.toLowerCase())) {
            // this.filesrc =  this.hrmsService.viewDocumentDetails(this.EmpId, data);
            this.filesrc = this.imageUrls + 'docserv/doc_download/' + data + '?entity_id=1&user_id=' + this.EmpId + "&token=" + token;

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
    this.getEmpDocs();
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

  onDownload() {
    this.spinner.show();
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
    this.getEmpDocs();
    // this.filesrc = null;
  }

}
