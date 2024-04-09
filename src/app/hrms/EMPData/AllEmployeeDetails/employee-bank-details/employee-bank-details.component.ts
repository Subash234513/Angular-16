import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatInput } from '@angular/material/input';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-employee-bank-details',
  templateUrl: './employee-bank-details.component.html',
  styleUrls: ['./employee-bank-details.component.scss']
})
export class EmployeeBankDetailsComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;
  @ViewChild('closeButtons', { static: false }) closeButtons: ElementRef;
  @ViewChild('closebutton') closebutton: ElementRef

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  EmpId: any
  EmpBankDetails: any
  addingMode: boolean = true;
  bankBranchInput: any
  bankIfscInput: any


  BankTypeDropdownList: any
  BankIfscDropdownList: any
  selectedBankId: number
  BankDropdownNameList: any
  selectedBank: any;
  bankForms: FormGroup;
  addbank: FormGroup;
  bankbranchPatch: any;
  bankIdPatch: any;
  ifscform: FormGroup;
  bankInput: any;
  BankDropdownList: any;
  bankBranchsInput: any;
  BankBranchDropdownList: any;
  branchform: FormGroup;
  BranchValue: any;
  showBranch: boolean = false;
  ifscpatch: any;
  fileUploadForm: any;
  EmployeeDocuments: any;
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
  reuploadfileArr: any;
  fileupdate: boolean;
  docFunctionLists: any = [];

  displayBankName(bank: any): string {
    return bank && bank.text ? bank.text : '';
  }

  displayIfscName(ifsc: any): string {
    return ifsc && ifsc.ifsccode ? ifsc.ifsccode : '';
  }
  @ViewChild('bankInputs') bankInputs: MatInput;



  displayBankBranch(bankbranch: any): string {
    return bankbranch && bankbranch.name ? bankbranch.name : '';
  }
  constructor(private activateroute: ActivatedRoute, private hrmsService: MasterHrmsService, private toastr: ToastrService,
    private fb: FormBuilder, private renderer: Renderer2, private spinner: NgxSpinnerService) {

    this.bankForm = this.fb.group({
      account_name: [''],
      account_no: [''],
      bank_branch: [''],
      ifsc: ['']
    });
    this.bankForms = this.fb.group({
      account_name: [''],
      account_no: [''],
      bank_branch: [''],
      ifsc: ['']
    });

    this.account_type = this.fb.group({
      id: [''],
      text: [''],
    });

    this.bank_id = this.fb.group({
      code: [''],
      id: [''],
      name: ['']
    });

    this.branchform = this.fb.group({
      bank_id: "",
      name: '',
      ifsccode: '',
    })

    this.branch = this.fb.group({
      code: [''],
      id: [''],
      name: ['']
    });

    this.addbank = this.fb.group({
      name: ''
    })
    this.ifscform = this.fb.group({


      ifsc: '',
      bankname: '',
      branchname: '',


    })
  }

  get accType() {
    return this.account_type.get("text")
  }

  get ifscNum() {
    return this.bankForm.get("ifsc")
  }

  get bankName() {
    return this.bank_id.get("name")
  }

  get branchName() {
    return this.branch.get("name")
  }

  get accNum() {
    return this.bankForm.get("account_no")
  }

  get beneficiary() {
    return this.bankForm.get("account_name")
  }



  selectedIfsc: any
  selectedIfscBank: any
  onBankIfscSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIfsc = event.option.value;
    this.bank_id.get('name')?.setValue(this.selectedIfsc.bank.name);
    this.branch.get('name')?.setValue(this.selectedIfsc.branch.name);
  }



  bankForm: FormGroup = new FormGroup({
    // bank: new FormControl(),
    account_name: new FormControl(),
    account_no: new FormControl(),
    bank_branch: new FormControl(),
    // bank_id: new FormGroup({
    //   code: new FormControl(),
    //   id: new FormControl(),
    //   name: new FormControl(),
    // }),
    ifsc: new FormControl()
  });


  account_type: FormGroup = new FormGroup({
    id: new FormControl(),
    text: new FormControl(),
  })

  bank_id: FormGroup = new FormGroup({
    code: new FormControl(),
    id: new FormControl(),
    name: new FormControl(),

  })

  branch: FormGroup = new FormGroup({
    code: new FormControl(),
    id: new FormControl(),
    name: new FormControl(),

  })

  EmpObjects = {
    employeeList: null,
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null
  }

  ngOnInit(): void {
    this.activateroute.queryParams.subscribe((params) => {
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })
    this.getEmployeeBasicDetails();
    this.getEmpBankDetails();
    this.getBankTypeAutocomplete();
    // this.getBankIfscAutocomplete()
    this.getBankAutocomplete();
    this.getEmployee();
    this.initializeForm()
    this.getEmpDocs()
  }
  Emprole: any;
  getEmpBankDetails() {
    this.spinner.show();
    this.hrmsService.getEmpBankDetailsNew(this.EmpId)
      .subscribe(results => {
        if (results.code) {
          this.spinner.hide();
          this.toastr.error(results.code);
        }
        else {
          this.spinner.hide();
          this.EmpBankDetails = results['bank'];
        }
      });
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
  showSaveButton() {
    this.addingMode = true;
    this.bankForm.reset();
    this.account_type.reset();
    this.branch.reset();
    this.bank_id.reset();
  }
  selectedItem: any;
  editId: any;
  branchId: any
  branchIdValue: any;
  patchBranch: any
  bankNameQuery: string
  EmpBasicDetails: any;
  getEmployeeBasicDetails() {
    this.spinner.show();
    this.hrmsService.getEmpDetails(this.EmpId).subscribe(results => {
      this.spinner.hide();
      this.EmpBasicDetails = results;
    }
    )
  }
  editIfsc: any;
  editBankRow(item: any) {

    // Store the selected item
    this.addingMode = false;
    this.selectedItem = item;
    this.editId = item?.id
    this.editIfsc = item?.ifsc
    this.account_type.patchValue({
      text: item?.account_type
    });
    this.bank_id.patchValue({
      name: item?.bank_id?.name,
    })

    this.branch.patchValue({
      name: item?.bank_branch,
    })
    this.ifscpatch = item?.ifsc;

    this.bankForm.patchValue({
      account_name: item?.account_name,
      account_no: item?.account_no,
      ifsc:  { ifsccode: item?.ifsc },
      bank_branch: item?.bank_branch,
    });

    this.bankbranchPatch = item?.bank_branch;
    this.bankIdPatch = item?.bank_id?.id
    this.bankNameQuery = item?.account_type?.name
    this.branchIdValue = item?.branch?.id

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
  selectedBranchIfsc: any;
  selectedBranchId: any;
  selectedBranchIfscOptions: string[] = [];
  allBankBranch: any[];
  bankIdNumber: number
  getBankTypeAutocomplete() {
    this.bankBranchInput = "account_type";
    this.hrmsService.getBankTypeDropdownList(this.bankBranchInput).subscribe((results) => {
      this.BankTypeDropdownList = results;
    });
  }

  getBankIfscAutocomplete() {
    this.bankIfscInput = this.bankForm.value.ifsc;
    if (this.bankIfscInput.ifsccode) {
      this.bankIfscInput = this.bankIfscInput.ifsccode;
      this.hrmsService.getBankIfscList(this.bankIfscInput).subscribe((results) => {
        if (results['data'].length == 0) {
          // this.toastr.warning("IFSC Code not in Master, Please add IFSC code");
          this.BankIfscDropdownList = results["data"];
        }
        else {
          this.BankIfscDropdownList = results["data"];
        }
      });
    }
    else {
      this.bankIfscInput = this.bankForm.value.ifsc;
      this.hrmsService.getBankIfscList(this.bankIfscInput).subscribe((results) => {
        if (results['data'].length == 0) {
          this.toastr.warning("IFSC Code not in Master, Please add IFSC code");
          this.BankIfscDropdownList = results["data"];
        }
        else {
          this.BankIfscDropdownList = results["data"];
        }
      });
    }

    //   this.bankIfscInput = this.bankForm.value.ifsc;
    //   if(this.ifscpatch === '' || this.ifscpatch === null || this.ifscpatch === undefined)
    //   {
    //   this.hrmsService.getBankIfscList(this.bankIfscInput).subscribe((results) => {
    //     if (results['data'].length == 0) {
    //       this.toastr.warning("IFSC Code not in Master, Please add IFSC code")
    //     }
    //     else {
    //       this.BankIfscDropdownList = results["data"];
    //     }
    //   });
    // }
    // else
    // {
    //   this.hrmsService.getBankIfscList(this.ifscpatch).subscribe((results) => {
    //     if (results['data'].length == 0) {
    //       this.toastr.warning("IFSC Code not in Master, Please add IFSC code")
    //     }
    //     else {
    //       this.BankIfscDropdownList = results["data"];
    //     }
    //   });
    // }
  }


  selectedBankNameId: any
  getBankBranchNameAutocomplete() {
    this.bankBranchInput = this.bankForm.value.bank;
    if (this.selectedBankId !== undefined && this.selectedBankId !== null) {
      this.hrmsService.getBankBranchDropdownNameList(this.selectedBankId).subscribe((results) => {
        this.BankDropdownNameList = results['bankbranch'];
        if (this.BankDropdownNameList.length > 0) {
          this.selectedBankNameId = this.BankDropdownNameList[0].id;
        }

      });
    } else {
    }
  }


  bankFullName: any;

  onUpdate() {

    if (this.account_type.get('text').value == '' || this.account_type.get('text').value == null || this.account_type.get('text').value == undefined) {
      this.toastr.error("Please select the Account Type")
      return false;
    }
    if (this.bankForm.get('ifsc').value == '' || this.bankForm.get('ifsc').value == null || this.bankForm.get('ifsc').value == undefined) {
      this.toastr.error("Please select the IFSC Code ")
      return false;
    }


    if (this.bankForm.get("account_no").value == '' || this.bankForm.get("account_no").value == null || this.bankForm.get("account_no").value == undefined) {
      this.toastr.error("Please Enter the Account No")
      return false;
    }
    if (this.bankForm.get('account_name').value == '' || this.bankForm.get('account_name').value == null || this.bankForm.get('account_name').value == undefined) {
      this.toastr.error("Please Enter the Benificiary Name")
      return false;
    }

    if (this.bankForm.get('account_name').value !== null) {
      this.getBankIfscAutocomplete()
      let formValue = this.bankForm.value;
      const bankIdVal = this.account_type.value;
      formValue.id = this.editId
      let nameid = this.account_type.get('text').value;
      formValue.account_type = bankIdVal.text.id;
      let bankId = this.bankForm.get("bank_branch").value
      let newBankId = this.bankForm.get("ifsc").value
      if (newBankId.bank) {
        const formIntoJson = {
          account_type: formValue.account_type || null,
          account_name: formValue.account_name || null,
          bank_branch: newBankId.branch.name || null,
          account_no: formValue.account_no || null,
          bank_id: this.bankIdPatch || null,
          ifsc: newBankId.ifsccode || null,
          id: this.editId || null
        };
        const jsonData = JSON.stringify([formIntoJson]);
        this.spinner.show();
        this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, jsonData).subscribe(
          (response) => {
            this.spinner.hide();
            this.toastr.success('Successfully posted/updated bank info');
            this.getEmpBankDetails();
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();
          },
          (error) => {
            this.spinner.hide();
            this.toastr.error('Error while posting/updated bank info');
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();
          });
      }
      else {
        const formIntoJson = {
          account_type: formValue.account_type || null,
          account_name: formValue.account_name || null,
          bank_branch: this.bankbranchPatch || null,
          account_no: formValue.account_no || null,
          bank_id: this.bankIdPatch || null,
          ifsc: newBankId.ifsccode || null,
          id: this.editId || null
        };
        const jsonData = JSON.stringify([formIntoJson]);
        this.spinner.show();
        this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, jsonData).subscribe(
          (response) => {
            this.spinner.hide();
            this.toastr.success('Successfully posted/updated bank info');
            this.getEmpBankDetails();
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();
          },
          (error) => {
            this.spinner.hide();
            console.error('Error while posting/updated bank info:', error);
            this.toastr.error('Error while posting/updated bank info');
            this.renderer.selectRootElement(this.closeButton.nativeElement).click();
          });
      }
    } else {
      this.toastr.warning('All details need to be filled');
    }


  }
  formIntoJson: any;
  onSave() {
    if (this.account_type.get('text').value == '' || this.account_type.get('text').value == null || this.account_type.get('text').value == undefined) {
      this.toastr.error("Please select the Account Type")
      return false;
    }
    if (this.bankForm.get('ifsc').value == '' || this.bankForm.get('ifsc').value == null || this.bankForm.get('ifsc').value == undefined) {
      this.toastr.error("Please select the IFSC Code ")
      return false;
    }


    if (this.bankForm.get("account_no").value == '' || this.bankForm.get("account_no").value == null || this.bankForm.get("account_no").value == undefined) {
      this.toastr.error("Please Enter the Account No")
      return false;
    }
    if (this.bankForm.get('account_name').value == '' || this.bankForm.get('account_name').value == null || this.bankForm.get('account_name').value == undefined) {
      this.toastr.error("Please Enter the Benificiary Name")
      return false;
    }


    if (this.bankForm.get('account_name').value !== null) {
      const formValue = this.bankForm.value;
      let ifsc = this.bankForm.get('ifsc').value
      let textid = this.account_type.get('text').value;
      let bankBranch = this.bankForm.get('bank_branch').value
      this.formIntoJson = {
        account_type: textid.id || null,
        account_name: formValue.account_name || null,
        bank_branch: this.branch.get("name").value || null,
        account_no: this.bankForm.get("account_no").value || null,
        bank_id: ifsc.bank.id || null,
        ifsc: ifsc.ifsccode || null,
        branch_id: ifsc.branch.id || null,
      };
      const jsonData = JSON.stringify([this.formIntoJson]);
      this.spinner.show();
      this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, jsonData).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success('Successfully posted bank info');
          this.getEmpBankDetails();
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

        },
        (error) => {
          this.toastr.error('Error while posting bank info');
          this.renderer.selectRootElement(this.closeButton.nativeElement).click();

        }
      );
    } else {
      for (const control in this.bankForm.controls) {
        if (this.bankForm.controls.hasOwnProperty(control)) {
          this.bankForm.get(control).markAsTouched();
        }
        for (const control in this.account_type.controls) {
          if (this.account_type.controls.hasOwnProperty(control)) {
            this.account_type.get(control).markAsTouched();
          }
          for (const control in this.bank_id.controls) {
            if (this.bank_id.controls.hasOwnProperty(control)) {
              this.bank_id.get(control).markAsTouched();
            }

            for (const control in this.branch.controls) {
              if (this.branch.controls.hasOwnProperty(control)) {
                this.branch.get(control).markAsTouched();
              }
            }

          }

        }
      }
      this.toastr.warning('All details needed to be filled');
    }
  }
  deleteBankRecord(recordId: number) {
    if (confirm('Are you sure you want to delete this bank record?')) {
      this.spinner.show();
      this.hrmsService.deleteEmployeeBankRecord(recordId, this.EmpId).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success("Bank record deleted successfully")
          this.getEmpBankDetails();
        },
        (error) => {
          this.toastr.error("Error while deleting bank record")
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
  addIfsc() {
    this.ifscform.reset();
    this.bankInputs.value = ''

  }

  onSubmit() {
    this.spinner.show();
    this.hrmsService.checkIfsc(this.ifscform.get('ifsc').value).subscribe(
      (res) => {
        this.showBranch = true;
        this.BranchValue = res.BRANCH;
        this.ifscform.get('branchname')?.setValue(res.BRANCH);
        this.spinner.hide();
      },
      (error) => {
        if (error.status === 404) {
          this.toastr.error('Invalid IFSC Code');
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }

    )
  }
  getBankAutocomplete() {
    this.bankInput = this.ifscform.value.bankname;
    // this.bankBranchInput = "account_type";
    this.hrmsService.get_singleBank(this.bankInput).subscribe((results) => {
      this.BankDropdownList = results["data"];
    });
  }

  displayBankNames(ifsc: any): string {
    return ifsc.name ? ifsc.name : '';
  }

  getBankBranchAutocomplete() {
    this.bankBranchsInput = this.ifscform.value.branchname;
    // this.bankBranchInput = "account_type";
    this.hrmsService.get_singleBankBranch(this.bankBranchsInput).subscribe((results) => {
      this.BankBranchDropdownList = results["data"];
    });
  }

  displayBankBranchNames(ifsc: any): string {
    return ifsc.name ? ifsc.name : '';
  }

  AddBank() {
    let payload =
    {
      'name': this.addbank.get('name').value
    }
    this.hrmsService.createBankForm(payload).subscribe((res) => {
      this.toastr.success("Bank Added")
    })
  }

  newBranch() {
    let payload =
    {
      'bank_id': this.branchform.get('bank_id')?.value?.id,
      "name": this.branchform.get('name')?.value,
      "ifsccode": this.branchform.get('ifsccode')?.value,
      "microcode": ''
    }
    this.hrmsService.branchCreateForm(payload).subscribe((res) => {
      this.toastr.success("branch Added")
    })
  }
  onAdd() {
    if (this.ifscform.get('ifsc')?.value == '' || this.ifscform.get('ifsc')?.value == null) {
      this.toastr.error("Enter IFSC Code");
      return false;
    }
    if (this.ifscform.get('bankname')?.value == '' || this.ifscform.get('bankname')?.value == null) {
      this.toastr.error("Select Bank Name");
      return false;
    }
    if (this.ifscform.get('branchname')?.value == '' || this.ifscform.get('branchname')?.value == null) {
      this.toastr.error("Verify IFSC Code");
      return false;
    }
    let payload =
    {
      'bank_id': this.ifscform.get('bankname')?.value?.id,
      "name": this.ifscform.get('branchname')?.value,
      "ifsccode": this.ifscform.get('ifsc')?.value,

    }
    this.hrmsService.branchCreateForm(payload).subscribe((res) => {
      this.toastr.success("branch Added")
      // this.hrmsService.getBankIfscList(this.ifscform.get('ifsc')?.value).subscribe((results) => {
      //   this.BankIfscDropdownList = results["data"];
      this.ifscform.reset();
      this.ifscform.get('bankname').reset();
      this.closeButtons.nativeElement.click();
      this.bankForm.reset();
      this.account_type.reset();
      this.branch.reset();
      this.bank_id.reset();


      // });
    })
  }
  typeid() {
    const data = this.EmployeeDocuments.data.find(document => document.type.name === 'Bank proof')
    return data ? data?.type?.id : null
  }
  onSubmits(): void {
    console.log(this.fileUploadForm.value);
    const typeIdFromForm = this.fileUploadForm.get('type').value;
    // const typeIdFromMethod = this.getTypeId();

    // if (typeIdFromForm !== typeIdFromMethod) {
    //   this.fileUploadForm.get('type').setValue(typeIdFromMethod);
    // }
    if (this.fileUploadForm.valid) {

      const formDataArray: any[] = [];
      this.typeValue = this.typeid()

      const typeAndRemarksObject = {
        type: this.typeid(),
        remarks: this.fileUploadForm.get('remarks').value
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


    const formValue = this.bankForm.value;
    let ifsc = this.bankForm.get('ifsc').value
    let textid = this.account_type.get('text').value;
    let bankBranch = this.bankForm.get('bank_branch').value
    let data = {
      account_type: textid.id || null,
      account_name: formValue.account_name || null,
      bank_branch: this.branch.get("name").value || null,
      account_no: this.bankForm.get("account_no").value || null,
      bank_id: ifsc.bank.id || null,
      ifsc: ifsc.ifsccode || null,
      branch_id: ifsc.branch.id || null,
      type: 3,
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
    // this.SpinnerService.show();
    this.adddocformarray();

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
      this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, formData)
        .subscribe(res => {
          console.log("issue click", res)

          if (res.message == 'Successfully Created') {
            this.toastr.success("Created Successfully!...");
            this.docFunctionList = [];
            this.closeButton.nativeElement.click();
            this.getEmpBankDetails();
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
    let filedata = data.employee_document
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

  attachmentDelete(filedata) {
    const fileID = filedata.id
    this.hrmsService.getEmployeeDocumentDetails(this.EmpId, fileID)
      .subscribe(
        results => {
          // this.EmployeeDocuments = results;
          // console.log("Docs details", this.EmployeeDocuments);       
          this.fileupdate = true;
          this.toastr.success("File deleted successfully");
          this.getEmpBankDetails();
        },
        error => {
          console.error('Error deleting document:', error);

        }
      );
  }
  fileChanges(event) {
    // let imagesList = [];
    this.images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
    // this.adddocformarray();
  }

  adddocformarrays() {
   
    let formValue = this.bankForm.value;
    const bankIdVal = this.account_type.value;
    formValue.id = this.editId
    let nameid = this.account_type.get('text').value;
    formValue.account_type = bankIdVal.text.id;
    let bankId = this.bankForm.get("bank_branch").value
    let newBankId = this.bankForm.get("ifsc").value
    // newBankId = newBankId.replace(/'/g, '"');
    // const bankIdObject = JSON.parse(newBankId);
    // const ifsccodes = bankIdObject.ifsccode;    // console.log(ifsccode); // Output: IDIB000A013
    
    // if (newBankId.bank) {
    let data = {
      account_type: formValue.account_type || null,
      account_name: formValue.account_name || null,
      bank_branch: formValue.bank_branch || null,
      account_no: formValue.account_no || null,
      bank_id: this.bankIdPatch || null,
      ifsc: newBankId?.ifsccode || null,
      id: this.editId || null,
      type: 3,
      attachment: "",
      filekey: this.images
    };
    console.log("dataArray", data)
    this.docFunctionLists.push(data)
    console.log("array docs", this.docFunctionList)
  }

  // onUpdatebank() {

  //   this.adddocformarrays();
  //   console.log("submit", this.docFunctionLists);
  //   let count = 1;
  //   for (let i = 0; i < this.docFunctionLists.length; i++) {
  //     this.docFunctionLists[i].attachment = 'file' + count++;
  //   }
  //   console.log("ffff", this.docFunctionLists);
  //   console.log("docgp", this.docFunctionLists);
  //   let successfulSubmissions = 0;
  //   const processSubmission = (index) => {
  //     const dataset = this.docFunctionLists[index];
  //     const formData: FormData = new FormData();
  //     const Finaldata = [dataset];
  //     const datavalue = JSON.stringify(Finaldata);
  //     formData.append('data', datavalue);      const string_value = this.docFunctionLists[index].attachment;
  //     const file_list = this.docFunctionLists[index].filekey;
  //     formData.append(string_value, file_list[0]);
  //     this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, formData)
  //       .subscribe(res => {
  //         console.log("issue click", res)
  //         if (res.message == 'Successfully Created') {
  //           this.toastr.success("Created Successfully!...");
  //           this.docFunctionLists = [];
  //           this.closeButton.nativeElement.click();
  //           this.getEmpBankDetails();
            
  //         } else {

  //         }
  //       },
  //         error => {

  //         }

  //       )



  //   }
  //   for (let i = 0; i < this.docFunctionList.length; i++) {
  //     processSubmission(i);
  //   }

  // }

  onUpdatebank() {
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
  
      this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, formData) // Assuming this is an update operation
        .subscribe(res => {
          console.log("issue click", res)
          if (res.message == 'Successfully Updated') {
            this.toastr.success("Updated Successfully!...");
            this.docFunctionLists = [];
            this.getEmpBankDetails();
            this.bankForms.reset();
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
    // this.adddocformarrays();
  
    // if (this.docFunctionLists.length === 0) {
    //   this.toastr.error('Please Fill All Details');
    //   return;
    // }
  
    // this.docFunctionLists.forEach((doc, index) => {
    //   const formData: FormData = new FormData();
    //   formData.append('data', JSON.stringify([doc]));
    //   formData.append(doc.attachment, doc.filekey[0]);
  
    //   this.hrmsService.postEmployeeBankDetailsNew(this.EmpId, formData)
    //     .subscribe(res => {
    //       if (res.message === 'Successfully Created') {
    //         this.toastr.success("Created Successfully!...");
    //         this.docFunctionLists = [];
    //         this.closeButton.nativeElement.click();
    //         this.getEmpBankDetails();
    //       } else {
    //         // Handle error or notify user accordingly
    //       }
    //     },
    //     error => {
    //       // Handle error or notify user accordingly
    //     });
    // });
  }
  

  downloadfiles(data) {
    // this.spinner.show();
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
    // this.spinner.hide();
    // this.getEmpDocs();

  }

  deleteBank(recordId: number) {
    if (confirm('Are you sure you want to delete this bank record?')) {
      this.spinner.show();
      this.hrmsService.deleteBankInfo(recordId, this.EmpId).subscribe(
        (response) => {
          this.spinner.hide();
          this.toastr.success("Bank Record Deleted successfully")
          // this.getEmpExperienceInfo()
          this.getEmpBankDetails();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error("Delete failed")
        }
      );
    }
  }
  viewfiles(data) {
    let filedata = data;
    this.dataname = filedata.file_id;
    this.filenames = filedata.file_name
    this.spinner.show();
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
    this.spinner.hide();
    // this.getEmpDocs();
    this.filesrc = null;
  }
  deletefile(data) {
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


}






