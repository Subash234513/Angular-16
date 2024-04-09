import { Component, OnInit,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterHrmsService } from 'src/app/hrms/master-hrms.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { error } from 'console';
import { runInThisContext } from 'vm';
import { environment } from 'src/environments/environment';

export interface pincode {
  id: string;
  no: string;
}

@Component({
  selector: 'app-employeeaddress',
  templateUrl: './employeeaddress.component.html',
  styleUrls: ['./employeeaddress.component.scss']
})
export class EmployeeaddressComponent implements OnInit {
  @ViewChild('closeButton', { static: false }) closeButton: ElementRef;
  @ViewChild('closeButtons', { static: false }) closeButtons: ElementRef;
    @ViewChild('titleInput') titleInput: any;
    @ViewChild('pincode') matcomponentAutocomplete: MatAutocomplete;
    @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;


EmpId:any;
EmpFamilyDetails:any;
addingMode: boolean = true;
RelationshipList:any;

EmpObjects = {
  employeeList: null, 
  employeeFirstLetter: null,
  ActivityStatus: null,
  TimeLogList: null,
  empId: null,
  pendingCounts: null   
}  
address : FormGroup;
addresse : FormGroup;
pincodelist: Array<any> = [];

  isLoading: boolean;
  EmpAddressDetails: any;

  EmpInfoObjects = {
    datafrom: null,
    booleanList: [{ text: "Yes", value: true }, { text: "No", value: false }]
  }
  // matcomponentAutocomplete: any;
  // autocompleteTrigger: any;
  has_next: boolean;
 addressReadOnly:boolean=true
 addressEditReadonly:boolean=true
has_previous = true;
  currentpage: number = 1;
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  addresspays: any;
  statePatch: any;
  cityPatch: any;
  districtPatch: any;

  addressTypes   = [{name :'Permanent Address', id: 1}, {name :'Temporary Address', id:2}];
  fileTypes   = [{name :'PAN', id: 1}, {name :'Aadhaar', id:2}, {name :'Bank Statement', id:3} ];

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
  docFunctionLists: any = [];
  fileupdate: boolean = false;
  idValue: any;
  EmployeeDocuments: any;
  // dataname: any;
  // filenames: any;
  // pincodelist: any;

constructor(private activateroute:ActivatedRoute,private hrmsService:MasterHrmsService,private datePipe: DatePipe,
  private toastr:ToastrService, private spinner : NgxSpinnerService,
 private fb:FormBuilder,private renderer: Renderer2 ) {
  let addressTypes   = [{name :'Permanent Address', id: 1}, {name :'Temporary Address', id:2}];

 }
 @ViewChild('pincodeinfoCon') matpincodeCon: MatAutocomplete;
  @ViewChild('pincodeInputCon') pincodeinputCon: ElementRef;
  @ViewChild('pincodeinfoCons') matpincodeCons: MatAutocomplete;
  @ViewChild('pincodeInputCons') pincodeinputCons: ElementRef;

  ngOnInit(): void {
  

    this.activateroute.queryParams.subscribe((params) => {
      this.EmpInfoObjects.datafrom = params['datafrom'];
      this.EmpId = params['id'];
    })

    this.address = this.fb.group({
      "line1": "",
      "line2": "",
      "line3": "",
      "pincode": "",
      "city": "",
      "district": "",
      "state": "",
      "type": "",
      "filetype":''
    })
    this.addresse = this.fb.group({
      "line1": "",
      "line2": "",
      "line3": "",
      "pincode": "",
      "city": "",
      "district": "",
      "state": "",
      "type": "",
      "id":'',
      "filetype":''

    })

    this.getEmployee();
    this.getEmpFamilyDetails();
  }

  getEmpFamilyDetails(){
    this.hrmsService.getEmpAddressInfoNew(this.EmpId)
    .subscribe(results => {
      this.EmpAddressDetails = results['address'];
      this.EmpAddressDetails.reverse();
    });
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

showSaveButton() {
  this.addingMode = true;
  // this.familyInfoForm.reset();
}

pincodename(i){
  let pincodekeyvalue: String = "";
}
// this.getPinCode(pincodekeyvalue);

// // this.empAddForm.controls.address.get('pincode_id').valueChanges
// (this.addressForm.get('pincode_id').valueChanges
//   .pipe(
//     debounceTime(100),
//     distinctUntilChanged(),
//     tap(() => {
//       this.isLoading = true;
//       console.log('inside tap')

//     }),

//     switchMap(value => this.payrollservice.get_pinCode(value,1)
//       .pipe(
//         finalize(() => {
//           this.isLoading = false
//         }),
//       )
//     )
//   )
//   .subscribe((results: any[]) => {
//     let datas = results["data"];
//     this.pinCodeList = datas;

//   })

// }


// private getPinCode(pincodekeyvalue) {
//   this.payrollservice.get_pinCode(pincodekeyvalue,1)
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.pinCodeList = datas;
//       // console.log("pincode", datas)
//     })
// }

// private getCity(citykeyvalue) {
//   this.payrollservice.getCitySearch(citykeyvalue)
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.cityList = datas;
//       // console.log("city", datas)

//     })
// }

// private getDistrict(districtkeyvalue) {
//   this.payrollservice.districtdropdown(this.stateID,districtkeyvalue)
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.districtList = datas;
//     })
// }

// private getState(statekeyvalue) {
//   this.payrollservice.getStateSearch(statekeyvalue)
//     .subscribe((results: any[]) => {
//       let datas = results["data"];
//       this.stateList = datas;
//       // console.log("state", datas)

//     })
// }

pincodeInput: any;
pincodeArr: any;
// getPincodeDropdown() {
//   this.pincodeInput = this.address.get("pincode").value
//   this.hrmsService.getPincodeList(this.pincodeInput, 1).subscribe(results => {
//     console.log('Pincode List:', results);
//     this.pincodeArr = results.data
//     console.log("city", this.pincodeArr?.city?.name)
//   });
// }
getPincodeDropdown(pageNumber: number = 1) {
  this.pincodeInput = this.address.get("pincode").value;
  this.hrmsService.getPincodeList(this.pincodeInput, pageNumber).subscribe(results => {
    this.pincodeArr = results.data;
    if ( results.pagination.has_next == true) {

      // this.getPincodeDropdown(pageNumber + 1);
    }
  });
}

getPincodeDropdowns() {
  this.pincodeInput = this.addresse.get("pincode").value
  this.hrmsService.getPincodeList(this.pincodeInput, 1).subscribe(results => {

    this.pincodeArr = results.data
  
  });
}
selectedPincode: any
selectedPincodes: any
selectedPincodeNum: any
onPincodeSelected(event: MatAutocompleteSelectedEvent): void {
  this.selectedPincode = event.option.value;
  this.address.get('city')?.setValue(this.selectedPincode?.city?.name);
  this.address.get('state')?.setValue(this.selectedPincode?.state?.name);
  this.address.get('district')?.setValue(this.selectedPincode?.district?.name);
}
displayPincode(pincode: any): string {
  // return pincode && pincode.no ? pincode.no : '';
  return pincode ? pincode.no : undefined;
}

saves()
{
  if(!this.address.get('line1').value){
    this.toastr.error('Please Enter Line1')
  }
  // else if(!this.address.get('line2').value){
  //   this.toastr.error('Please Enter Line2')
  // }
  // else if(!this.address.get('line3').value){
  //   this.toastr.error('Please Enter Line3')
  // }
  else if(!this.address.get('pincode').value.id){
    this.toastr.error('Please Select Pincode')
  }
  else{
    let id = this.EmpId
    this.spinner.show();
    let addresspay = [{
      line1: this.address.get('line1').value,
      line2: this.address.get('line2').value,
      line3: this.address.get('line3').value,
      pincode_id: this.address.get('pincode').value.id,
      city_id: this.selectedPincode?.city?.id,
      state_id: this.selectedPincode?.state?.id,
      district_id: this.selectedPincode?.district?.id,
    }]
  
      this.hrmsService.createNewEmployeeAddress(this.EmpId, addresspay).subscribe(res => {
        this.spinner.hide();
        this.toastr.success(res.message);
        this.closeButton.nativeElement.click();
        this.getEmpFamilyDetails();
  
        // this.route.navigate(['/hrms/hrmsview/empsummary']);
      },
      error=>{
        this.spinner.hide();
        this.toastr.error('500')
      })
  }

}

editRow(item: any) {
  this.statePatch = item.state_id.id;
  this.cityPatch = item.city_id.id;
  this.districtPatch = item.district_id.id;
  this.idValue = item.id
  this.addresse.patchValue({
    "line1": item.line1,
      "line2": item.line2,
      "line3": item.line3,
      "pincode": item.pincode_id,
      "city":  item.city_id.name,
      "district": item.district_id.name,
      "state": item.state_id.name,
      "type": item?.type?.id,
      "id": item.id,
      
  })

  this.reuploadfileArr  = item?.employee_document;
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
updates()
{
  if(!this.addresse.get('line1').value){
    this.toastr.error('Please Enter Line1')
  }
  // else if(!this.addresse.get('line2').value){
  //   this.toastr.error('Please Enter Line2')
  // }
  // else if(!this.addresse.get('line3').value){
  //   this.toastr.error('Please Enter Line3')
  // }
  else if(!this.addresse.get('pincode').value.id){
    this.toastr.error('Please Select Pincode')
  }
  else{
    let id = this.EmpId
    this.spinner.show();
    if(!this.selectedPincodes?.city?.id || !this.selectedPincodes?.state?.id || !this.selectedPincodes?.district?.id)
    {
      let patchVal = this.addresse.value;
      this.addresspays = [{
        id: this.addresse.get('id').value,
        line1: this.addresse.get('line1').value,
        line2: this.addresse.get('line2').value,
        line3: this.addresse.get('line3').value,
        pincode_id: this.addresse.get('pincode').value.id,
        city_id: this.cityPatch,
        state_id: this.statePatch,
        district_id: this.districtPatch,
      }]
    }
    else
    {
    this.addresspays = [{
      id: this.addresse.get('id').value,
      line1: this.addresse.get('line1').value,
      line2: this.addresse.get('line2').value,
      line3: this.addresse.get('line3').value,
      pincode_id: this.addresse.get('pincode').value.id,
      city_id: this.selectedPincodes?.city?.id,
      state_id: this.selectedPincodes?.state?.id,
      district_id: this.selectedPincodes?.district?.id,
    }]
  }
  
      this.hrmsService.createNewEmployeeAddress(this.EmpId, this.addresspays).subscribe(res => {
        this.spinner.hide();
        this.toastr.success(res.message);
        // this.renderer.selectRootElement(this.closeButton.nativeElement).click();
        this.closeButtons.nativeElement.click();
        this.getEmpFamilyDetails();
  
        // this.route.navigate(['/hrms/hrmsview/empsummary']);
      })
  }

}


onPincodeSelecteds(event: MatAutocompleteSelectedEvent): void {
  this.selectedPincodes = event.option.value;
  this.addresse.get('city')?.setValue(this.selectedPincodes?.city?.name);
  this.addresse.get('state')?.setValue(this.selectedPincodes?.state?.name);
  this.addresse.get('district')?.setValue(this.selectedPincodes?.district?.name);
}

getpincodes()
{
  let gstkeyvalue: String = "";
  this.getFunctional(gstkeyvalue);
  this.address.get("pincode").valueChanges

  .pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
  
    }),
    switchMap(value => this.hrmsService.getPincodeList(value, 1)
      .pipe(
        finalize(() => {
          this.isLoading = false
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.pincodeArr = datas;
  })
}
private getFunctional(gstkeyvalue) {
  this.hrmsService.getPincodeLists(gstkeyvalue)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.pincodeArr = datas;
    })
}
autocompletecomponentScroll() {
  setTimeout(() => {
    if (
      this.matcomponentAutocomplete &&
      this.autocompleteTrigger &&
      this.matcomponentAutocomplete.panel
    ) {
      fromEvent(this.matcomponentAutocomplete.panel.nativeElement, 'scroll')
        .pipe(
          map(x => this.matcomponentAutocomplete.panel.nativeElement.scrollTop),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
        .subscribe(scrollTop => {
          const scrollHeight = this.matcomponentAutocomplete.panel.nativeElement.scrollHeight;
          const elementHeight = this.matcomponentAutocomplete.panel.nativeElement.elementHeight;
          const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;

          if (atBottom) {
            if (this.has_next === true) {
              this.hrmsService.getPincodeList(
                this.titleInput.nativeElement.value,
                this.currentpage + 1
              ).subscribe((results: any[]) => {
                let data = results['data'];
                let dataPagination = results['pagination'];
                this.pincodeArr = this.pincodeArr.concat(data);
                if (this.pincodeArr.length > 0) {
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
getpincodedata(data) {
  let searchdata: any = data;
  this.hrmsService.getPinCodeDropDownscroll(searchdata, 1).subscribe(data => {
    this.pincodelist = data['data'];
  });
}
getpincodeinterface(data?: pincode): string | undefined {
  return data ? data.no : undefined;
}

getpinlistfocus(data: any) {
  this.selectedPincode = data
  this.address.get('city')?.setValue(data['city'].name);
  this.address.get('state')?.setValue(data['state'].name);
  this.address.get('district')?.setValue(data['district'].name);
  this.addressReadOnly=false;
}
getpinlistfocuss(data: any) {
  this.selectedPincodes = data
  this.addresse.get('city')?.setValue(data['city'].name);
  this.addresse.get('state')?.setValue(data['state'].name);
  this.addresse.get('district')?.setValue(data['district'].name);
  this.addressEditReadonly=false
}

fileChange(event) {
  // let imagesList = [];
  this.images = [];
  for (var i = 0; i < event.target.files.length; i++) {
    this.images.push(event.target.files[i]);
  }
  // this.adddocformarray();
}

// adddocformarray() {
//   let data = {
//     line1: this.address.get('line1').value,
//     line2: this.address.get('line2').value,
//     line3: this.address.get('line3').value,
//     pincode_id: this.address.get('pincode').value.id,
//     city_id: this.selectedPincode?.city?.id,
//     state_id: this.selectedPincode?.state?.id,
//     district_id: this.selectedPincode?.district?.id,
//     type: this.address.get('filetype').value,
//     address_type : this.address.get('type').value,
//     attachment: "",
//     filekey: this.images
//   }
 

//   console.log("dataArray", data)
//   this.docFunctionList.push(data)
//   console.log("array docs", this.docFunctionList)
// }

// onSubmitss() {

//   this.adddocformarray();
 
//   console.log("submit", this.docFunctionList);
//   let count = 1;
//   for (let i = 0; i < this.docFunctionList.length; i++) {
//     this.docFunctionList[i].attachment = 'file' + count++;
//   }
//   console.log("ffff", this.docFunctionList);
//   console.log("docgp", this.docFunctionList);
//   let successfulSubmissions = 0;
//   const processSubmission = (index) => {
//     const dataset = this.docFunctionList[index];
//     const formData: FormData = new FormData();
//     const Finaldata = [dataset];
//     const datavalue = JSON.stringify(Finaldata);
//     formData.append('data', datavalue);
//     const string_value = this.docFunctionList[index].attachment;
//     const file_list = this.docFunctionList[index].filekey;
//     formData.append(string_value, file_list[0]);
//     this.hrmsService.createNewEmployeeAddress(this.EmpId, formData)
//       .subscribe(res => {
//         console.log("issue click", res)

//         if (res.message == 'Successfully Created') {
//           this.toastr.success("Created Successfully!...");
//           this.docFunctionList = [];
//           this.getEmpFamilyDetails();
//           this.address.reset();
//           this.closeButton.nativeElement.click();        
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


adddocformarray() {
  let data = {
    line1: this.address.get('line1').value,
    line2: this.address.get('line2').value,
    line3: this.address.get('line3').value,
    pincode_id: this.address.get('pincode').value.id,
    city_id: this.selectedPincode?.city?.id,
    state_id: this.selectedPincode?.state?.id,
    district_id: this.selectedPincode?.district?.id,
    type: this.address.get('filetype').value,
    address_type: this.address.get('type').value,
    attachment: "", // Initially set to empty string
    filekey: this.images,
    // hr_approval : true
  };

  console.log("dataArray", data);
  this.docFunctionList.push(data);
  console.log("array docs", this.docFunctionList);
}

onSubmitss() {
  this.adddocformarray();
  console.log("submit", this.docFunctionList);

  let count = 1;
  for (let i = 0; i < this.docFunctionList.length; i++) {
    this.docFunctionList[i].attachment = this.docFunctionList[i].filekey.length > 0 ? 'file' + count++ : ""; // Check if filekey exists to set attachment
  }

  console.log("ffff", this.docFunctionList);

  let successfulSubmissions = 0;

  const processSubmission = (index) => {
    const dataset = this.docFunctionList[index];
    const formData: FormData = new FormData();
    const Finaldata = [dataset];
    const datavalue = JSON.stringify(Finaldata);
    formData.append('data', datavalue);

    // Append file only if it exists
    if (dataset.attachment !== "") {
      formData.append(dataset.attachment, dataset.filekey[0]);
    }

    this.hrmsService.createNewEmployeeAddress(this.EmpId, formData)
      .subscribe(res => {
        console.log("issue click", res)

        if (res.message == 'Successfully Created') {
          this.toastr.success("Created Successfully!...");
          this.docFunctionList = [];
          this.getEmpFamilyDetails();
          this.address.reset();
          this.closeButton.nativeElement.click();
        } else {
          // Handle error condition if required
        }
      },
        error => {
          // Handle error condition if required
        }
      );
  };

  for (let i = 0; i < this.docFunctionList.length; i++) {
    processSubmission(i);
  }
}


viewfile(data)
{
  let filedata =  data.employee_document
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

attachmentDelete(filedata)
{
  const fileID = filedata.id
  this.hrmsService.getEmployeeDocumentDetails(this.EmpId, fileID)
  .subscribe(
    results => {
      // this.EmployeeDocuments = results;
      // console.log("Docs details", this.EmployeeDocuments);       
      this.fileupdate = true; 
      this.toastr.success("File deleted successfully");
      this.getEmpFamilyDetails();
    },
    error => {
      console.error('Error deleting document:', error);
  
    }
  );
}

fileChanges(event) {
  // let imagesList = [];
  // this.fileupdate = true;
  this.images = [];
  for (var i = 0; i < event.target.files.length; i++) {
    this.images.push(event.target.files[i]);
  }
  // this.adddocformarrays();
}

// adddocformarrays() {
//   let data = {
//     line1: this.addresse.get('line1').value,
//     line2: this.addresse.get('line2').value,
//     line3: this.addresse.get('line3').value,
//     pincode_id: this.addresse.get('pincode').value.id,
//     city_id: this.cityPatch,
//     state_id: this.statePatch,
//     district_id: this.districtPatch,
//     type: this.addresse.get('filetype').value,
//     address_type : (this.addresse.get('type').value),
//     attachment: "",
//     filekey: this.images,
//     id: this.idValue
//   }
//   console.log("dataArray", data)
//   this.docFunctionLists.push(data)
//   console.log("array docs", this.docFunctionList)
// }

// onUpdates() {
//   this.adddocformarrays();
//   console.log("submit", this.docFunctionList);
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
//     formData.append('data', datavalue);
//     const string_value = this.docFunctionLists[index].attachment;
//     const file_list = this.docFunctionLists[index].filekey;
//     formData.append(string_value, file_list[0]);
//     this.hrmsService.createNewEmployeeAddress(this.EmpId, formData)
//       .subscribe(res => {
//         console.log("issue click", res)
//         if (res.message == 'Successfully Updated') {
//           this.toastr.success("Updated Successfully!...");
//           this.docFunctionLists = [];
//           this.getEmpFamilyDetails();
//           this.addresse.reset();
//           this.closeButton.nativeElement.click();
        
//         } else {
         
//         }
//       },
//         error => {
         
//         })
//   }
//   for (let i = 0; i < this.docFunctionLists.length; i++) {
//     processSubmission(i);
//   }
// }
deleteAddress(recordId: number) {
  if (confirm('Are you sure you want to delete this education record?')) {
    this.spinner.show();
    this.hrmsService.deleteAddressInfo(recordId, this.EmpId).subscribe(
      (response) => {
        this.spinner.hide();
        this.toastr.success("Address Record Deleted successfully")
        // this.getEmpExperienceInfo()
        this.getEmpFamilyDetails();
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
  this.spinner.show();
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
  this.spinner.hide();
  // this.getEmpDocs();
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
deletefile(data)
{
  
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



adddocformarrays() {
  let data = {
    line1: this.addresse.get('line1').value,
    line2: this.addresse.get('line2').value,
    line3: this.addresse.get('line3').value,
    pincode_id: this.addresse.get('pincode').value.id,
    city_id: this.cityPatch,
    state_id: this.statePatch,
    district_id: this.districtPatch,
    type: this.addresse.get('filetype').value,
    address_type: this.addresse.get('type').value,
    attachment: "", 
    filekey: this.images,
    id: this.idValue,
    // hr_approval : true 

  };

  console.log("dataArray", data);
  this.docFunctionLists.push(data);
  console.log("array docs", this.docFunctionLists);
}

onUpdates() {
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

    this.hrmsService.createNewEmployeeAddress(this.EmpId, formData) // Assuming this is an update operation
      .subscribe(res => {
        console.log("issue click", res)
        if (res.message == 'Successfully Updated') {
          this.toastr.success("Updated Successfully!...");
          this.docFunctionLists = [];
          this.getEmpFamilyDetails();
          this.addresse.reset();
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



}

