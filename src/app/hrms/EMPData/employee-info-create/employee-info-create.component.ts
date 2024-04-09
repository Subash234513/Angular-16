import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { MasterHrmsService } from '../../master-hrms.service';
import { SharedHrmsService } from '../../shared-hrms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NativeDateAdapter } from '@angular/material/core';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
export interface pincode {
  id: string;
  no: string;
}
export interface city {
  id: string;
  name: string;
}
export interface disrict {
  id: string;
  name: string;
}
export interface state {
  id: string;
  name: string;
}
export interface codedesignation {
  id: string;
  name: string;
}
export interface hirerarchy {
  id: string;
  layer: string;
}
export interface department {
  id: string;
  name: string;
}
export interface supervisor {
  id: string;
  full_name: string;
}
export interface designationdata {
  id: string;
  name: string;
}
export interface branchdata {
  id: string;
  name: string;
}
export interface bankdata {
  id: string;
  name: string;
}
export interface bankbranchdata {
  id: string;
  name: string;
}
export interface titledata {
  id: string;
  name: string;
}
export interface streamdata {
  id: string;
  name: string;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};


class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-employee-info-create',
  templateUrl: './employee-info-create.component.html',
  styleUrls: ['./employee-info-create.component.scss'],
  providers: [imp.HrmsAPI, imp.Userserv, imp.Master]
})
export class EmployeeInfoCreateComponent implements OnInit {

  Obj = {
    'Emp Info': true,
    'Education': true,
    'Experience': true,
    'Family Details': true,
    'Emergency Contacts': true,
    'Bank Details': true,
    'Photo Upload': true
  }
  GenderList = [{ id: 1, text: 'Male' }, { id: 2, text: 'Female' }, { id: 3, text: 'Others' }]
  ContactTypeList = [{ id: 1, text: 'EMPLOYEE' }, { id: 2, text: 'GROUP123' }, { id: 3, text: 'Individual' }]
  ScreenView: any

  EmpEducation: FormGroup;
  EmpExperience: FormGroup;
  EmpFamilyDetails: FormGroup;
  EmpEmergencyDetails: FormGroup;
  EmpBankDetails: FormGroup;
  createemploys: FormGroup;
  EmpProfile : FormGroup;
  empid: any

  PatchEmpDetails: any = {
    'Emp Info': '',
    'Education': '',
    'Experience': '',
    'Family Details': '',
    'Emergency Contacts': '',
    'Bank Details': ''
  }
  minLength: number = 10;
  maxLength: number = 10;
  today = new Date()

  @ViewChild('designauto') matdesign: MatAutocomplete;
  @ViewChild('designInput') designinput: ElementRef;
  @ViewChild('branchinfo') matbranch: MatAutocomplete;
  @ViewChild('branchInput') branchinput: ElementRef;
  @ViewChild('bsinfo') matbsdata: MatAutocomplete;
  @ViewChild('bsInput') bsinput: ElementRef;
  @ViewChild('ccinfo') matccdata: MatAutocomplete;
  @ViewChild('ccInput') ccinput: ElementRef;
  @ViewChild('pincodeinfo') matpincode: MatAutocomplete;
  @ViewChild('pincodeInput') pincodeinput: ElementRef;
  @ViewChild('cityinfo') matcity: MatAutocomplete;
  @ViewChild('cityInput') cityinput: ElementRef;
  @ViewChild('districtinfo') matdistrict: MatAutocomplete;
  @ViewChild('districtInput') districtinput: ElementRef;
  @ViewChild('stateinfo') matstate: MatAutocomplete;
  @ViewChild('stateInput') stateinput: ElementRef;
  @ViewChild('condesigninfo') matcondesign: MatAutocomplete;
  @ViewChild('condesignInput') condesigninput: ElementRef;
  @ViewChild('hierarchyinfo') mathierchy: MatAutocomplete;
  @ViewChild('hirarchyInput') hierarchyinput: ElementRef;
  @ViewChild('deptinfo') matdept: MatAutocomplete;
  @ViewChild('deptInput') deptinput: ElementRef;
  @ViewChild('superinfo') matsuper: MatAutocomplete;
  @ViewChild('superInput') superinput: ElementRef;
  @ViewChild('titleInput') titleinput: ElementRef;
  @ViewChild('titleauto') titleauto: MatAutocomplete;
  @ViewChild('streamInput') streaminput: ElementRef;
  @ViewChild('streamauto') streamauto: MatAutocomplete;

  empObjects = {
    routedata: null
  }

  imageSrc: string;
  url: any = '';


  constructor(private fb: FormBuilder, private notify: NotificationService,
    private masterHrms: MasterHrmsService, private error: ErrorHandlingServiceService, private datepipe: DatePipe,
    private share: SharedHrmsService, private route: Router, private activateroute: ActivatedRoute,
    private apiserv: ApicallserviceService, private hrmsapi: imp.HrmsAPI,
    private master: imp.Master, private userserv: imp.Userserv) { }


  ngOnInit(): void {
    // let dataFomParentEmpView = this.DisplayScreenIn
    // console.log("dataFomParentEmpView", dataFomParentEmpView)

    // let data: any = this.masterHrms.TypeOfCreateEmp
    console.log("genderlist data====>", this.GenderList)
    let data = null;
    this.activateroute.queryParams.subscribe(params => {
      console.log("data for edit", params)
      data = params
      this.empObjects.routedata = params
    })

    console.log("data typeOf Create", data)
    this.empid = data.empid

    this.getMenus(data)
    this.getEMP_Details()


    this.EmpEducation = this.fb.group({
      EducationDetails: new FormArray([
      ])
    })

    this.EmpExperience = this.fb.group({
      ExperienceDetails: new FormArray([
      ])
    })


    this.EmpFamilyDetails = this.fb.group({
      FamilyDetails: new FormArray([
      ])
    })

    this.EmpEmergencyDetails = this.fb.group({
      EmgContactDetails: new FormArray([
      ])
    })

    this.EmpBankDetails = this.fb.group({
      BankDetails: new FormArray([
      ])
    })


    this.createemploys = this.fb.group({
      'code': ['', Validators.required],
      'first_name': ['', Validators.required],
      'middle_name': ['', Validators.required],
      'last_name': ['', Validators.required],

      'dob': '',
      'doj': '',
      'gender': '',
      // 'employeetype': new FormControl(''),
      'designation': '',
      'mobilenumber': ['', [Validators.minLength(10), Validators.maxLength(10)]],
      'emailid': ['', [Validators.email]],
      // 'supervisor':new FormControl(''),
      // 'hierarchy':new FormControl(''),
      'branch': '',
      'department_id': '',
      // 'bsname':new FormControl(''),
      // 'ccname':new FormControl(''),
      'line1': '',
      'line2': '',
      'line3': '',
      'pincode': '',
      'city': '',
      'district': '',
      'state': '',
      'contacttype': '',
      'personname': '',
      'condesignation': '',
      'landline1': ['', [Validators.minLength(10), Validators.maxLength(10)]],
      'landline2': ['', [Validators.minLength(10), Validators.maxLength(10)]],
      'contactnumber': ['', [Validators.minLength(10), Validators.maxLength(10)]],
      'contactnumber2': ['', [Validators.minLength(10), Validators.maxLength(10)]],
      'conemailid': ['', [Validators.email]],
      'condob': '',
      'conwedday': '',
      'id': '',
      "addressid": '',
      "contactid": ''
    });






    this.getRelationship()

    this.EmpProfile = this.fb.group({
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    })

  }
  RelationshipList: any
  getRelationship() {
    this.masterHrms.getrelationship('relationship')
      .subscribe(results => {
        console.log(results)
        this.RelationshipList = results['data']
      })

  }

  menusList: any
  SelectedView: any

  getMenus(data) {
    let keysObjs = Object.keys(this.Obj)
    this.menusList = keysObjs
    this.SelectedView = data.data
    console.log("keyObjs keys seperate", keysObjs, data, this.SelectedView)
    if (data.routes) {
      let objs = this.Obj
      for (let i in objs) {
        if (!(i == data.data)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        }
        this.ScreenView = objs
      }
      console.log("this. OBJS", this.Obj, this.ScreenView)
    }
  }




  ////////////////////////////////////////////////////////////////////  EMP Details Based On type  
  getEMP_Details() {
    let dataList = this.PatchEmpDetails
    console.log("data list for patch emp details ", dataList)

    let objs = this.PatchEmpDetails
    for (let i in objs) {
      console.log(i)
      // this.masterHrms.EmpDetails(i, this.empid, 'get', '')
      // this.userserv.userserv.employee
      // this.apiserv.ApiCall('get', this.userserv.userserv.employee+'/'+this.empid)
      //   .subscribe(results => {
      //     let dataForEmpDetailsBasic = results
      //     let dataResults = results['data']
      //     this.PatchEmpDetails[i] = dataResults
      //     console.log("data for patch data for each tab", dataResults, i)
      if (i == 'Education') {
        this.patchEMP_Education()
      }
      if (i == 'Family Details') {
        this.patchEMP_Family()
      }
      if (i == 'Experience') {
        this.patchEMP_Experience()
      }
      if (i == 'Emergency Contacts') {
        this.patchEMP_Emg()
      }
      if (i == 'Emp Info') {
        // this.PatchEmpDetails[i] = dataForEmpDetailsBasic
        this.patchEMPBasicDetails()
      }
      if (i == 'Bank Details') {
        // this.PatchEmpDetails[i] = dataForEmpDetailsBasic
        this.patchEMPBankDetails()
      }
      // })
      // return true 
    }

    console.log("patch emp details ", this.PatchEmpDetails);


  }

  ////////////////////////////////////////////////////////////////////// Emp Details Patch 


  patchEMP_Education() {
    this.apiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.empEducation + this.empid).subscribe(res => {
      let EMPEducation = res['data']
      console.log("empeducation on patch ", EMPEducation)
      let control = this.EmpEducation.get('EducationDetails') as FormArray
      if (EMPEducation?.length > 0) {
        for (let dataarr of EMPEducation) {
          let arrdata = new FormGroup({
            inst_name: new FormControl(dataarr.inst_name),
            passing_year: new FormControl(dataarr.passing_year),
            passing_month: new FormControl(dataarr.passing_month),
            percentage: new FormControl(dataarr.percentage),
            city: new FormControl(dataarr.city),
            title: new FormControl(dataarr.title),
            stream: new FormControl(dataarr.stream),
            id: new FormControl(dataarr.id)
          })

          control.push(arrdata)
        }
      }

    })
  }


  patchEMP_Family() {
    this.apiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.empFamilyInfo + this.empid).subscribe(res => {
      let EMPFamily = res['data']
      console.log("EmpFamilyDetails on patch ", EMPFamily)
      let control = this.EmpFamilyDetails.get('FamilyDetails') as FormArray
      if (EMPFamily?.length > 0) {
        for (let dataarr of EMPFamily) {
          let arrdata = new FormGroup({
            name: new FormControl(dataarr.name),
            relationship: new FormControl(dataarr.relationship.id),
            dob: new FormControl(dataarr.dob),
            no: new FormControl(dataarr.no),
            id: new FormControl(dataarr.id)
          })
          control.push(arrdata)
        }
      }
    })


  }
  // [{"company":"vsolv","work_experience":2.0,"doj":"2005-03-23",
  // "dor":"2007-04-04","role":"developer","city":"chennai"}]
  patchEMP_Experience() {

    // let EMPEXP = this.PatchEmpDetails['Experience']
    // console.log("EMPEXP on patch ", EMPEXP)
    this.apiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.empExperience + this.empid).subscribe(res => {
      let EMPEXP = res['data']
      let control = this.EmpExperience.get('ExperienceDetails') as FormArray
      if (EMPEXP?.length > 0) {
        for (let dataarr of EMPEXP) {
          let arrdata = new FormGroup({
            company: new FormControl(dataarr.company),
            work_experience: new FormControl(dataarr.work_experience),
            doj: new FormControl(dataarr.doj),
            dor: new FormControl(dataarr.dor),
            role: new FormControl(dataarr.role),
            city: new FormControl(dataarr.city),
            id: new FormControl(dataarr.id)
          })

          control.push(arrdata)
        }
      }
    })



  }
  ///////////////////////////////////////////////////////////////////
  patchEMP_Emg() {

    // let EMP_EMG = this.PatchEmpDetails['Emergency Contacts']
    // console.log(EMP_EMG)
    this.apiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.empEmergencyContact + this.empid).subscribe(res => {
      let EMP_EMG = res['data']
      let control = this.EmpEmergencyDetails.get('EmgContactDetails') as FormArray
      if (EMP_EMG?.length > 0) {
        for (let dataarr of EMP_EMG) {
          let arrdata = new FormGroup({
            "name": new FormControl(dataarr?.name),
            "phone_no": new FormControl(dataarr?.phone_no),
            "relationship": new FormControl(dataarr?.relationship?.id),
            "line1": new FormControl(dataarr?.address_id?.line1),
            "line2": new FormControl(dataarr?.address_id?.line2),
            "line3": new FormControl(dataarr?.address_id?.line3),
            "pincode": new FormControl(dataarr?.address_id?.pincode),
            "city": new FormControl(dataarr?.address_id?.city),
            "district": new FormControl(dataarr?.address_id?.district),
            "state": new FormControl(dataarr?.address_id?.state),
            "addressid": new FormControl(dataarr?.address_id?.id),
            "id": new FormControl(dataarr?.id)
          })

          control.push(arrdata)
        }

      }
    })

  }

  patchEMPBasicDetails() {

    console.log("basic info patch value >>>>>>>>>>>>>>>>>>> 1")
    this.apiserv.ApiCall('get', this.userserv.userserv.employee + '/' + this.empid).subscribe(res => {
      // let basicInfo = this.PatchEmpDetails['Emp Info']
      let basicInfo = res
      console.log("basic info patch value >>>>>>>>>>>>>>>>>>> 1 after API", basicInfo)

      this.createemploys.patchValue({
        'code': basicInfo?.code ? basicInfo?.code : '',
        'first_name': basicInfo?.first_name ? basicInfo?.first_name : '',
        'middle_name': basicInfo?.middle_name ? basicInfo?.middle_name : '',
        'last_name': basicInfo?.last_name ? basicInfo?.last_name : '',
        'dob': basicInfo?.dob ? basicInfo?.dob : '',
        'doj': basicInfo?.doj ? basicInfo?.doj : '',
        'gender': basicInfo?.gender ? basicInfo?.gender : '',
        'employeetype': basicInfo?.employeetype ? basicInfo?.employeetype : '',
        'designation': basicInfo?.designation ? basicInfo?.designation : '',
        'mobilenumber': basicInfo?.mobilenumber ? basicInfo?.mobilenumber : '',
        'emailid': basicInfo?.emailid ? basicInfo?.emailid : '',
        'branch': basicInfo?.branch ? basicInfo?.branch : '',
        'id': basicInfo?.id,

        'line1': basicInfo?.address_id?.line1 ? basicInfo?.address_id?.line1 : '',
        'line2': basicInfo?.address_id?.line2 ? basicInfo?.address_id?.line2 : '',
        'line3': basicInfo?.address_id?.line3 ? basicInfo?.address_id?.line3 : '',
        'pincode': basicInfo?.address_id?.pincode ? basicInfo?.address_id?.pincode : '',
        'city': basicInfo?.address_id?.city ? basicInfo?.address_id?.city : '',
        'district': basicInfo?.address_id?.district ? basicInfo?.address_id?.district : '',
        'state': basicInfo?.address_id?.state ? basicInfo?.address_id?.state : '',
        "addressid": basicInfo?.address_id?.id ? basicInfo?.address_id?.id : '',

        'contacttype': basicInfo?.contact_id?.contacttype,
        'personname': basicInfo?.contact_id?.personname,
        'condesignation': basicInfo?.contact_id?.condesignation,
        'landline1': basicInfo?.contact_id?.landline1 ? basicInfo?.contact_id?.landline1 : '',
        'landline2': basicInfo?.contact_id?.landline2 ? basicInfo?.contact_id?.landline2 : '',
        'contactnumber': basicInfo?.contact_id?.contactnumber ? basicInfo?.contact_id?.contactnumber : '',
        'contactnumber2': basicInfo?.contact_id?.contactnumber2 ? basicInfo?.contact_id?.contactnumber2 : '',
        'conemailid': basicInfo?.contact_id?.conemailid ? basicInfo?.contact_id?.conemailid : '',
        "contactid": basicInfo?.contact_id?.id ? basicInfo?.contact_id?.id : ''
      });

    })

  }


  patchEMPBankDetails() {

    this.apiserv.ApiCall('get', this.hrmsapi.HRMS_API.api.empBank + this.empid).subscribe(res => {
      let EMP_bank = res['data']
      let control = this.EmpEmergencyDetails.get('BankDetails') as FormArray
      if (EMP_bank?.length > 0) {
        for (let dataarr of EMP_bank) {
          let arrdata = new FormGroup({
            "account_name": new FormControl(dataarr?.account_name),
            "bank_id": new FormControl(dataarr?.bank_id),
            "bank_branch": new FormControl(dataarr?.bank_branch),
            "account_no": new FormControl(dataarr?.account_no),
            "ifsc": new FormControl(dataarr?.ifsc),
            "id": new FormControl(dataarr?.id)
            
          })
          control.push(arrdata)
        }
      }
    })

  }


  ///////////////////////////////////////////////////////////////////////////////// EMP Education 

  getControlEmpEducation() {
    let dataEdu = new FormGroup({
      inst_name: new FormControl(""),
      passing_year: new FormControl(""),
      passing_month: new FormControl(""),
      percentage: new FormControl(""),
      city: new FormControl(""),
      title: new FormControl(""),
      stream: new FormControl("")
    })
    return dataEdu
  }


  AddEducation() {
    const control = this.EmpEducation.get('EducationDetails') as FormArray;
    console.log("control", control)
    control.push(this.getControlEmpEducation());
  }
  deleteEMPEducation(index) {
    console.log("index of education ", index)
    let controls = this.EmpEducation.get('EducationDetails') as FormArray;
    console.log("control of education employee", controls)

    controls.removeAt(index);

  }

  ////////////////////////////////////////////////////////////////////////////////////// EMP Experience 
  // this.EmpExperience = this.fb.group({
  //   ExperienceDetails: new FormArray([

  getControlEmpExperience() {
    let dataExp = new FormGroup({
      company: new FormControl(""),
      work_experience: new FormControl(""),
      doj: new FormControl(new Date()),
      dor: new FormControl(new Date()),
      role: new FormControl(""),
      city: new FormControl("")
    })
    return dataExp
  }

  AddExperience() {
    const control = this.EmpExperience.get('ExperienceDetails') as FormArray;
    console.log("control", control)
    control.push(this.getControlEmpExperience());
  }
  deleteEMPExperience(index) {
    console.log("index of EmpExperience ", index)
    let controls = this.EmpExperience.get('ExperienceDetails') as FormArray;
    console.log("control of EmpExperience employee", controls)

    controls.removeAt(index);

  }







  ///////////////////////////////////////////////////////////////////////////////////////// EMP Family 
  getControlEmpFamily() {
    let dataFam = new FormGroup({
      name: new FormControl(""),
      relationship: new FormControl(""),
      dob: new FormControl(new Date()),
      no: new FormControl("")
    })
    return dataFam
  }



  AddFamily() {
    const control = this.EmpFamilyDetails.get('FamilyDetails') as FormArray;
    console.log("control", control)
    control.push(this.getControlEmpFamily());
  }
  deleteEMPFamily(index) {
    console.log("index of FamilyDetails ", index)
    let controls = this.EmpFamilyDetails.get('FamilyDetails') as FormArray;
    console.log("control of FamilyDetails employee", controls)

    controls.removeAt(index);

  }



  /////////////////////////////////////////////////////////////////////  EMP EMergency details

  getControlEmpEMG() {
    let dataFam = new FormGroup({
      name: new FormControl(""),
      relationship: new FormControl(""),
      phone_no: new FormControl(""),
      line1: new FormControl(""),
      line2: new FormControl(""),
      line3: new FormControl(""),
      pincode: new FormControl(""),
      district: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl("")
    })
    return dataFam
  }



  AddEmg() {
    const control = this.EmpEmergencyDetails.get('EmgContactDetails') as FormArray;
    console.log("control", control)
    control.push(this.getControlEmpEMG());
  }
  deleteEMP_Emg(index) {
    console.log("index of FamilEmgContactDetailsyDetails ", index)
    let controls = this.EmpEmergencyDetails.get('EmgContactDetails') as FormArray;
    console.log("control of EmgContactDetails employee", controls)

    controls.removeAt(index);

  }

  ///////////////////////////////////////////////////////////////////////////////// Bank details 
  getControlEmpBankDetails() {
    let dataBank = new FormGroup({
      account_name: new FormControl(""),
      bank_id: new FormControl(""),
      bank_branch: new FormControl(""),
      account_no: new FormControl(""),
      ifsc: new FormControl("")
    })
    return dataBank
  }
  AddBankDetails() {
    const control = this.EmpBankDetails.get('BankDetails') as FormArray;
    console.log("control", control)
    control.push(this.getControlEmpBankDetails());
  }
  deleteEMP_BankDetails(index) {
    console.log("index of bank ", index)
    let controls = this.EmpBankDetails.get('BankDetails') as FormArray;
    console.log("control of bankdet employee", controls)
    controls.removeAt(index);
    this.bank_branchlist.splice(index, 1);
  }





  ////////////////////////////////////// Submit part 


  EMP_EDU_Submit() {
    let dataToSubmitEmpEdu = this.EmpEducation.value.EducationDetails
    console.log("data to submit EMP", dataToSubmitEmpEdu)
    // this.masterHrms.EmpDetails('Education', this.empid, 'post', dataToSubmitEmp)
    this.apiserv.ApiCall('post', this.hrmsapi.HRMS_API.api.empEducation + this.empid, dataToSubmitEmpEdu)
      .subscribe(results => {
        console.log(results)
        this.notify.showSuccess("Successfully created")
      })
  }


  EMP_Fam_Submit() {
    let dataToSubmitEmp = this.EmpFamilyDetails.value.FamilyDetails
    let Objdata = []
    for (let dataset of dataToSubmitEmp) {
      let obj = {
        name: dataset.name,
        dob: this.datepipe.transform(dataset.dob, 'yyyy-MM-dd'),
        no: dataset.no,
        relationship: dataset.relationship
      }

      if ('id' in dataset) {
        Object.assign(obj, { id: dataset?.id })
      }

      // if ('id' in dataset) {
      //   obj = {
      //     name: dataset.name,
      //     dob: this.datepipe.transform(dataset.dob, 'yyyy-MM-dd'),
      //     no: dataset.no,
      //     relationship: dataset.relationship,
      //     id: dataset.id
      //   }
      // }
      // else {
      //   obj = 
      // }

      console.log("obj for data loop before submit ", obj)
      Objdata.push(obj)
    }
    console.log("data to submit Fam", Objdata)
    this.apiserv.ApiCall('post', this.hrmsapi.HRMS_API.api.empFamilyInfo + this.empid, Objdata)
      .subscribe(results => {
        console.log(results)
        this.notify.showSuccess("Successfully created")
      })
    // this.masterHrms.EmpDetails('Family Details', this.empid, 'post', Objdata)
    //   .subscribe(results => {
    //     console.log(results)
    //     this.notify.showSuccess("Successfully created")
    //   })
  }


  EMP_EXP_Submit() {
    let dataToSubmitEmp = this.EmpExperience.value.ExperienceDetails
    console.log("data to submit EMP", dataToSubmitEmp)
    let Objdata = []
    for (let dataset of dataToSubmitEmp) {
      let obj
      if ('id' in dataset) {
        obj = {
          company: dataset.company,
          work_experience: dataset.work_experience,
          doj: this.datepipe.transform(dataset.doj, 'yyyy-MM-dd'),
          dor: this.datepipe.transform(dataset.dor, 'yyyy-MM-dd'),
          role: dataset.role,
          city: dataset.city,
          id: dataset.id
        }
      } else {
        obj = {
          company: dataset.company,
          work_experience: dataset.work_experience,
          doj: this.datepipe.transform(dataset.doj, 'yyyy-MM-dd'),
          dor: this.datepipe.transform(dataset.dor, 'yyyy-MM-dd'),
          role: dataset.role,
          city: dataset.city
        }

      }
      console.log("obj for data loop before submit ", obj)
      Objdata.push(obj)
    }
    this.apiserv.ApiCall('post', this.hrmsapi.HRMS_API.api.empExperience + this.empid, Objdata)
      .subscribe(results => {
        console.log(results)
        this.notify.showSuccess("Successfully created")
      })
    // this.masterHrms.EmpDetails('Experience', this.empid, 'post', Objdata)
    //   .subscribe(results => {
    //     console.log(results)
    //     this.notify.showSuccess("Successfully created")
    //   })
  }




  EMP_EMG_Submit() {

    let dataToSubmitEmp = this.EmpEmergencyDetails.value.EmgContactDetails
    console.log("data to submit EMP", dataToSubmitEmp)
    let Objdata = []
    for (let dataset of dataToSubmitEmp) {
      let obj = {
        "name": dataset.name,
        "phone_no": dataset.phone_no,
        "relationship": dataset.relationship,
        "address": {
          "line1": dataset.line1,
          "line2": dataset.line2,
          "line3": dataset.line3,
          "pincode_id": dataset.pincode?.id,
          "city_id": dataset?.city?.id,
          "district_id": dataset?.district?.id,
          "state_id": dataset?.state?.id
        }
      }



      if ('id' in dataset) {
        Object.assign(obj, { "id": dataset?.id })
        //  Object.assign(obj, {obj[address] : dataToSubmitEmp?.addressid })

        Object.assign({}, obj, {
          address: Object.assign(obj.address, {
            id: dataset?.addressid
          })
        })


      }
      console.log("obj for data loop before submit ", obj)
      Objdata.push(obj)
    }
    console.log("submit for employee info data", Objdata)
    this.apiserv.ApiCall('post', this.hrmsapi.HRMS_API.api.empEmergencyContact + this.empid, Objdata)
      .subscribe(results => {
        console.log(results)
        this.notify.showSuccess("Successfully created")
      })
    // this.masterHrms.EmpDetails('Emergency Contacts', this.empid, 'post', Objdata)
    //   .subscribe(results => {
    //     console.log(results)
    //     this.notify.showSuccess("Successfully created")
    //   })

  }

  //////////////////////////////////////////////////////////////
  EMP_bank_Submit() {
    let dataToSubmitEmp = this.EmpBankDetails.value.BankDetails
    let Objdata = []
    for (let dataset of dataToSubmitEmp) {
      let obj
      if ('id' in dataset) {
        obj = {
          "account_name": dataset?.account_name,
          "bank_id": dataset?.bank_id?.id,
          "bank_branch": dataset?.bank_branch,
          "account_no": dataset?.account_no,
          "ifsc": dataset?.ifsc,
          "id": dataset.id
        }
      }
      else {
        obj = {
          "account_name": dataset?.account_name,
          "bank_id": dataset?.bank_id?.id,
          "bank_branch": dataset?.bank_branch,
          "account_no": dataset?.account_no,
          "ifsc": dataset?.ifsc
        }
      }

      console.log("obj for data loop before submit ", obj)
      Objdata.push(obj)
    }
    console.log("data to submit Fam", Objdata)
    this.masterHrms.EmpDetails('Bank Details', this.empid, 'post', Objdata)
      .subscribe(results => {
        console.log(results)
        this.notify.showSuccess("Successfully created")
      })
  }












































  ////////////////////////////////////////////// Address Details 
  @ViewChild('pincodeinfoCon') matpincodeCon: MatAutocomplete;
  @ViewChild('pincodeInputCon') pincodeinputCon: ElementRef;
  @ViewChild('cityinfoCon') matcityCon: MatAutocomplete;
  @ViewChild('cityInputCon') cityinputCon: ElementRef;
  @ViewChild('districtinfoCon') matdistrictCon: MatAutocomplete;
  @ViewChild('districtInputCon') districtinputCon: ElementRef;
  @ViewChild('stateinfoCon') matstateCon: MatAutocomplete;
  @ViewChild('stateInputCon') stateinputCon: ElementRef;

  @ViewChild('bankInput') bankInput: MatAutocomplete;
  @ViewChild('bank_branchInput') bank_branchInput: MatAutocomplete;

  pincodelist: Array<any> = [];
  citylist: Array<any> = [];
  districtlist: Array<any> = [];
  statelist: Array<any> = [];
  hierarchylist: Array<any> = [];
  employeetypelist: Array<any> = [];
  supervisorlist: Array<any> = [];
  designationlist: Array<any> = [];
  branchdatalist: Array<any> = [];
  departmentdatalist: Array<any> = []
  titlelist: Array<any> = []
  streamlist: Array<any> = []

  banklist: Array<any> = [];
  bank_branchlist: Array<any> = [];

  getpincodeinterface(data?: pincode): string | undefined {
    return data ? data.no : undefined;
  }
  getcityinterface(data?: city): string | undefined {
    return data ? data.name : undefined;
  }
  getdistrictinterface(data?: disrict): string | undefined {
    return data ? data.name : undefined;
  }
  getstateinterface(data?: state): string | undefined {
    return data ? data.name : undefined;
  }
  gethierarchyinterface(data?: hirerarchy): string | undefined {
    return data ? data.layer : undefined;
  }
  getdepartmentinterface(data?: department): string | undefined {
    return data ? data.name : undefined;
  }
  getsupervisorinterface(data?: supervisor): string | undefined {
    return data ? data.full_name : undefined;
  }
  getdatadesignation(data?: designationdata): string | undefined {
    return data ? data.name : undefined;
  }
  getdatabranch(data?: branchdata): string | undefined {
    return data ? data.name : undefined;
  }
  getdatadepartment(data?: branchdata): string | undefined {
    return data ? data.name : undefined;
  }
  getbankinterface(data?: bankdata): string | undefined {
    return data ? data.name : undefined;
  }
  getbank_branchinterface(data?: bankbranchdata): string | undefined {
    return data ? data.name : undefined;
  }
  getdatatitle(data?: titledata): string | undefined {
    return data ? data.name : undefined;
  }

  getdatastream(data?: streamdata): string | undefined {
    return data ? data.name : undefined;
  }
  


  getpincodedata(data) {
    let searchdata: any = data;
    this.masterHrms.getPinCodeDropDownscroll(searchdata, 1).subscribe(data => {
      this.pincodelist = data['data'];
    });
  }
  getpinlistfocus(data: any, index) {
    console.log("data for patch from pincode", data);

    this.EmpEmergencyDetails.get('EmgContactDetails')['controls'][index].get('city').setValue(data['city'])
    this.EmpEmergencyDetails.get('EmgContactDetails')['controls'][index].get('district').setValue(data['district'])
    this.EmpEmergencyDetails.get('EmgContactDetails')['controls'][index].get('state').setValue(data['state'])

  }
  getpinlistfocusEMPInfo(data: any) {
    console.log(data);
    this.createemploys.get('city').patchValue(data['city']);
    this.createemploys.get('district').patchValue(data['district']);
    this.createemploys.get('state').patchValue(data['state']);
  }

  getcitydata(data) {
    let searchData: any = data;
    this.masterHrms.getCityDropDownscroll(searchData, 1).subscribe(data => {
      this.citylist = data['data'];
    });

  }
  getdistrictdata(data) {
    let searchData: any = data
    this.masterHrms.getDistrictList(searchData, 'asc', 1, 10).subscribe(data => {
      this.districtlist = data['data'];
    });
  }
  getstatedata(data) {
    let searchData: any = data;
    this.masterHrms.getStateList(searchData, 'asc', 1, 10).subscribe(data => {
      this.statelist = data['data'];
    });
  }

  gethierarchydata(data) {
    let searchHirachy: any = data
    this.masterHrms.getHierarchyList("", 'asc', 1, searchHirachy).subscribe(data => {
      this.hierarchylist = data['data'];
    });
  }
  ///////////////////////////////////////////////////////////////////////Employee Type 
  getEmployeedepartmentdata(data) {
    let dataEmp = data
    this.masterHrms.getlistdepartment(dataEmp, 1).subscribe(results => {
      this.employeetypelist = results['data'];
    })
  }
  getsupervisorlist(data) {
    let searchdata: any = data
    this.masterHrms.getlistdepartmentsenoor(1, searchdata).subscribe(data => {
      this.supervisorlist = data['data'];
    });
  }

  getdesignation(data) {
    let dataDes = data
    this.masterHrms.getDesignationList(dataDes, 1).subscribe(data => {
      this.designationlist = data['data'];
    });
  }


  getbranchsdata(data) {
    let searchBranch: any = data
    this.masterHrms.getbranchdatafilter(searchBranch, 1).subscribe(data => {
      this.branchdatalist = data['data'];
    });

  }
  searchTextChanged = new Subject<string>();
  getDepartmentdata(data) {


    // let searchBranch: any = data 
    // this.searchTextChanged = data.valueChanges.pipe(
    //  debounceTime(5000),
    //  console.log("pipe", data)
    // )
    // console.log("outside pipe", data)  

    this.masterHrms.getbranchdatafilter(data, 1).subscribe(data => {
      this.branchdatalist = data['data'];
    });

  }


  getbank(data) { 
    console.log("bank search key", data)
    this.apiserv.ApiCall('get', this.master.masters.bank+data)
    .subscribe(res=>{
      this.banklist = res['data'] 
      console.log("this.banklist", this.banklist)
    })


    // this.masterHrms.getbank(databank, 1).subscribe(data => {
    //   this.banklist = data['data'];
    // });
  }


  getbank_branchdata(bankId, index?:any ) {
    console.log("bank data for branch list", bankId)
    this.bank_branchlist = [] 
    if(bankId == '' || bankId == null || bankId == undefined){ 
      return false 
    }
    this.apiserv.ApiCall('get', this.master.masters.bankbranch+bankId?.id)
    .subscribe(res=>{
      this.bank_branchlist.push(res.bankbranch)
      console.log("this.banklist", this.bank_branchlist)
      // return this.bank_branchlist[index]
      // this.getBankBranchlistData(bankId, index)
    })
    // let searchBranch: any = data
    // this.masterHrms.getbank_branchdata(searchBranch, 1).subscribe(data => {
    //   this.branchdatalist = data['data'];
    // });
  }

  getBankBranchlistData( index){ 
    console.log(this.bank_branchlist[index])
    return this.bank_branchlist[index]
  }











  keypress(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }




  employeecreatedata() {

    console.log("emp basic data for submit ", this.createemploys.value);

    if (this.createemploys.value.first_name == null || this.createemploys.value.first_name  == '') {
      this.notify.showError('Please enter First Name')
      
    }
    if (this.createemploys.value.middle_name == null || this.createemploys.value.middle_name  == '') {
      this.notify.showError('Please enter Middle Name')
      
    }
    if (this.createemploys.value.last_name == null || this.createemploys.value.last_name  == '') {
      this.notify.showError('Please enter Last Name')
      
    }
    if (this.createemploys.value.dob == null || this.createemploys.value.dob  == '' || this.createemploys.value.dob  == 'None') {
      this.notify.showError('Please select Date of Birth')
      
    }
    if (this.createemploys.value.doj == null || this.createemploys.value.doj  == '' || this.createemploys.value.doj  == 'None') {
      this.notify.showError('Please select Date of Join')
      
    }
    if (this.createemploys.value.gender == null || this.createemploys.value.gender  == '') {
      this.notify.showError('Please select Gender')
      
    }
    if (this.createemploys.value.department_id.id == null || this.createemploys.value.department_id.id  == '') {
      this.notify.showError('Please select Department')
      
    }
    if (this.createemploys.value.designation.id == null || this.createemploys.value.designation.id  == '') {
      this.notify.showError('Please select Designation')
      
    }
    if (this.createemploys.value.mobilenumber == null || this.createemploys.value.mobilenumber  == '') {
      this.notify.showError('Please enter Mobile Number')
      
    }
    if (this.createemploys.value.emailid == null || this.createemploys.value.emailid  == '') {
      this.notify.showError('Please enter Mail Id')
      
    }
    if (this.createemploys.value.branch.id == null || this.createemploys.value.branch.id  == '') {
      this.notify.showError('Please select Branch')
      
    }
    if (this.createemploys.value.line1 == null || this.createemploys.value.line1  == '') {
      this.notify.showError('Please enter Address Line1')
      
    }
    if (this.createemploys.value.line2 == null || this.createemploys.value.line2  == '') {
      this.notify.showError('Please enter Address Line2')
      
    }
    if (this.createemploys.value.line3 == null || this.createemploys.value.line3  == '') {
      this.notify.showError('Please enter Address Line3')
      
    }
    if (this.createemploys.value.personname == null || this.createemploys.value.personname  == '') {
      this.notify.showError('Please enter Contact Person Name')
      
    }
    if (this.createemploys.value.conemailid == null || this.createemploys.value.conemailid  == '') {
      this.notify.showError('Please enter Contact Mail Id')
      
    }

    let data: any = {
      "code": this.createemploys.value.code.trim(),
      "first_name": this.createemploys.value.first_name.trim(),
      "middle_name": this.createemploys.value.middle_name.trim(),
      "last_name": this.createemploys.value.last_name.trim(),
      "dob": this.createemploys.value.dob,
      "doj": this.createemploys.value.doj,
      "department_id": this.createemploys.value.department_id.id == '' ? '' : this.createemploys.value.department_id.id,
      "gender": this.createemploys.value.gender,
      "designation_id": this.createemploys.value.designation?.id,
      "phone_no": this.createemploys.value.mobilenumber,
      "email_id": this.createemploys.value.emailid,
      "emp_branch": this.createemploys.value.branch.id == '' ? '' : this.createemploys.value.branch.id,
      "id": this.createemploys.value.id == '' ? null : this.createemploys.value?.id,
      "contact": {
        "type_id": this.createemploys.value?.contacttype,
        "name": this.createemploys.value.personname.trim(),
        "designation_id": this.createemploys.value.condesignation.id == '' ? '' : this.createemploys.value.condesignation.id,
        "landline": this.createemploys.value.landline1,
        "landline2": this.createemploys.value.landline2,
        "mobile": this.createemploys.value.contactnumber,
        "mobile2": this.createemploys.value.contactnumber2,
        "email": this.createemploys.value.conemailid.trim(),
        "dob": this.createemploys.value.condob,
        "wedding_date": this.createemploys.value.conwedday,
        "status": 1,
        "id": this.createemploys.value.contactid == '' ? null : this.createemploys.value.contactid
      },
      "address": {
        "line1": this.createemploys.value.line1.trim(),
        "line2": this.createemploys.value.line2.trim(),
        "line3": this.createemploys.value.line3.trim(),
        "pincode_id": this.createemploys.value.pincode.id == '' ? '' : this.createemploys.get('pincode').value.id,
        "city_id": this.createemploys.get('city').value.id == '' ? '' : this.createemploys.get('city').value.id,
        "district_id": this.createemploys.get('district').value.id == '' ? '' : this.createemploys.get('district').value.id,
        "state_id": this.createemploys.get('state').value.id == '' ? '' : this.createemploys.get('state').value.id,
        "id": this.createemploys.get('addressid').value == '' ? null : this.createemploys.get('addressid').value

      }
    };
    if (data?.id == null || data?.id == '' || data?.id == undefined) {
      delete data?.id
    }
    if (data?.contacts?.contactid == null || data?.contacts?.contactid == '' || data?.contacts?.contactid == undefined) {
      delete data?.contacts?.contactid
    }
    if (data?.address?.addressid == null || data?.address?.addressid == '' || data?.address?.addressid == undefined) {
      delete data?.address?.addressid
    }

    // this.masterHrms.EmpDetails('Emp Info', this.empid, 'post', data)
    this.apiserv.ApiCall('post', this.userserv.userserv.employee, data)
      .subscribe(datas => {
        console.log(datas);
        this.notify.showSuccess('Created Successfully')
      },
        (error) => {
          this.notify.showError(error.status + error.statusText);
        }
      );
  }







  backtoInfo() {
    // this.backToSummary.emit() 
    // if(this.EmpInfoObjects.datafrom == 'empview'){
    //   this.route.navigate(['/hrms/empdetails'])
    // }
    console.log("this.empObjects.routedata?.empid", this.empObjects.routedata)
    this.route.navigate(['/hrms/employeeInfo'], { queryParams: { id: this.empObjects.routedata?.empid, datafrom: this.empObjects.routedata?.datafrom } })






  }


  dateformatchange(form, key, fromarrayname?: any, index?: any) {
    this.createemploys.patchValue({ [key]: this.datepipe.transform(this[form].value[key], 'yyyy-MM-dd') })
  }

  gettitle(data) {
    let dataDes = data
    this.masterHrms.getTitleList(dataDes, 1).subscribe(data => {
      this.titlelist = data['data'];
    });
  }

  getstream(data) {
    let dataDes = data
    this.masterHrms.getStreamList(dataDes, 1).subscribe(data => {
      this.streamlist = data['data'];
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
        console.log(this.url);
      };
    }
  }
  public delete() {
    this.url = null;
  }


}


