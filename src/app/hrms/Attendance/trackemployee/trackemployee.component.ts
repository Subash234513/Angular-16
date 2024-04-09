import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { AttendanceMasterServiceService } from '../../attendance-master-service.service';
import { AttendanceService } from '../../attendance.service';
import { MasterHrmsService } from '../../master-hrms.service';
import { SharedHrmsService } from '../../shared-hrms.service';


export interface designationdata {
  id: string;
  name: string;
}
export interface branchdata {
  id: string;
  name: string;
}
export interface bsdata {
  id: string;
  name: string;
}
export interface ccdata {
  id: string;
  name: string;
}
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

export interface typelistss {
  id: string;
  name: any;
  code: any;
  full_name: any;
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
  selector: 'app-trackemployee',
  templateUrl: './trackemployee.component.html',
  styleUrls: ['./trackemployee.component.scss']
})
export class TrackemployeeComponent implements OnInit {
  points:any=[];
  currentPos:any = [];
  employeecomments=[];
  employeesearchdata: any;

  constructor(private fb: FormBuilder, private notify: NotificationService, private datepipe: DatePipe,
    private masterservice: MasterHrmsService, private error: ErrorHandlingServiceService, private SpinnerService: NgxSpinnerService,
    private route: Router, private share: SharedHrmsService, private attendanceService:AttendanceMasterServiceService
    // private apis: MasterServicesService
    ) { }

  EmployeeSummarySearch: FormGroup
  createemploys: FormGroup

  EmployeeSummaryPart: boolean = true 
  EmployeeViewPart: boolean = false 

  minLength: number = 10;
  maxLength: number = 10;
  today = new Date();

  // points=[
  //   {
  //     lat: 12.973880208109474,
  //     lng:  80.24956391195023
  //   },
  //   {
  //     lat: 12.97367005517881,
  //     lng:  80.24961555640975,
  //   },
  //   {
  //     lat: 12.973433385294094,
  //     lng:  80.24982146744344,
  //   },
  //   {
  //     lat: 12.972479741434496,
  //     lng:  80.2496513974263
  //   },
  //   {
  //     lat: 12.97195278670074,
  //     lng:  80.24910906273227
  //   }
  // ]
  // currentPos = {
  //   lat:  12.973880208109474,
  //   lng:  80.24956391195023
  // }

  employeelistpagination={
    has_next:true,
    has_false:true,
    index:1
  }

  ngOnInit(): void {
    
    this.EmployeeSummarySearch = this.fb.group({
      codename: '',
      logdate:''
    })

    this.createemploys = this.fb.group({
      'code': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'dob': new FormControl(''),
      'doj': new FormControl(''),
      'gender': new FormControl(''),
      'employeetype': new FormControl(''),
      'designation': new FormControl(''),
      'mobilenumber': new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      'emailid': new FormControl('', [Validators.email]),
      // 'supervisor':new FormControl(''),
      // 'hierarchy':new FormControl(''),
      'branch': new FormControl(''),
      // 'bsname':new FormControl(''),
      // 'ccname':new FormControl(''),
      'line1': new FormControl(''),
      'line2': new FormControl(''),
      'line3': new FormControl(''),
      'pincode': new FormControl(''),
      'city': new FormControl(''),
      'district': new FormControl(''),
      'state': new FormControl(''),
      'contacttype': new FormControl(''),
      'personname': new FormControl(''),
      'condesignation': new FormControl(''),
      'landline1': new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      'landline2': new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      'contactnumber': new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      'contactnumber2': new FormControl('', [Validators.minLength(10), Validators.maxLength(10)]),
      'conemailid': new FormControl('', [Validators.email]),
      'condob': new FormControl(''),
      'conwedday': new FormControl('')
    });
    // this.EmployeeSearch('')
    this.serviceCallEmployeeSummary(this.presentpageEmployee=1)
  }

  EmployeeList: any
  has_nextEmployee: boolean
  has_previousEmployee: boolean
  presentpageEmployee: any = 1

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
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
  isLoading: boolean = false;
  designationlist: Array<any> = [];
  hiearchylist: Array<any> = [];
  bsdatalist: Array<any> = [];
  ccdatalist: Array<any> = [];
  branchdatalist: Array<any> = [];
  pincodelist: Array<any> = [];
  citylist: Array<any> = [];
  districtlist: Array<any> = [];
  statelist: Array<any> = [];
  codedesignationlist: Array<any> = [];
  employeetypelist: Array<any> = [];
  hierarchylist: Array<any> = [];
  supervisorlist: Array<any> = [];
  designpage: number = 1;
  has_designpre: boolean = false;
  has_designnext: boolean = false;
  date: any = new Date();
  has_bsnxt: boolean = true;
  has_bspre: boolean = false;
  has_bspage: number = 1;

  has_ccnxt: boolean = true;
  has_ccpre: boolean = false;
  has_ccpage: number = 1;

  has_branchnxt: boolean = true;
  has_bracchpre: boolean = false;
  has_branchpage: number = 1;
  has_pincodenxt: boolean = true;
  has_pincodepre: boolean = false;
  has_pincodepage: number = 1;
  has_citynxt: boolean = true;
  has_citypre: boolean = false;
  has_citypage: number = 1;
  has_districtnxt: boolean = true;
  has_districtpre: boolean = false;
  has_districtpage: number = 1;
  has_statenxt: boolean = true;
  has_statepre: boolean = false;
  has_statepage: number = 1;
  has_hiernxt: boolean = true;
  has_hierpre: boolean = false;
  has_hierpage: number = 1;
  has_deptnxt: boolean = true;
  has_deptpre: boolean = false;
  has_deptpage: number = 1;
  has_supernxt: boolean = true;
  has_superpre: boolean = false;
  has_superpage: number = 1;


  serviceCallEmployeeSummary(page) {
    // let datas = this.apis.Employee_Search_Summary(search, pageno)
    // console.log("data summary employee APIS", datas)

    let emp=this.EmployeeSummarySearch.value.codename?.id ? this.EmployeeSummarySearch.value.codename?.id:'' 
    let date= this.EmployeeSummarySearch.value.logdate != '' ? this.datepipe.transform(this.EmployeeSummarySearch.value.logdate, 'yyyy-MM-dd'):''

    console.log('date',this.EmployeeSummarySearch.value.logdate)

    this.SpinnerService.show()
    this.masterservice.getemployeetrackdetails(emp,date,page)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("Employee summary", result)
        // this.EmployeeList = result['data']
        this.EmployeeList =result['data']
        let dataPagination = result['pagination'];
        if (this.EmployeeList.length > 0) {
          this.has_nextEmployee = dataPagination.has_next;
          this.has_previousEmployee = dataPagination.has_previous;
          this.presentpageEmployee = dataPagination.index;
        }
      }, (error) => {
        this.error.handleError(error);
        this.SpinnerService.hide();
      })
  }

  paginationsearch(value){

    (value == 'next')? this.serviceCallEmployeeSummary(this.presentpageEmployee+1):this.serviceCallEmployeeSummary(this.presentpageEmployee-1)

  }


  getemployeelog(emp){
    this.SpinnerService.show();
    const now = emp?.log_date
    // console.log(now.toISOString().slice(0, 10));
    // let date=now.toISOString().slice(0, 10)
    let date= this.datepipe.transform(emp?.log_date, 'yyyy-MM-dd')

    this.masterservice.emplevellogdata(emp?.employee_id.id,date).subscribe(result => {
    console.log("Employee summary", result['data'])
    // this.EmployeeList = result['data']
    this.points =result?.data[0]
    this.points=this.points?.tracker
    // this.getemployeetrackdetails(this.points)
    this.currentPos=this.points[0]

    console.log('test',this.points)
    this.SpinnerService.hide();

    
  }, (error) => {
    this.error.handleError(error);
    this.SpinnerService.hide();
    
  })}


  EmployeeSearch(hint: any) {
    let search = this.EmployeeSummarySearch.value;
    let obj = {
      codename: search?.codename
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    // this.SpinnerService.show();

    // if (hint == 'next') {
    //   this.serviceCallEmployeeSummary(obj, this.presentpageEmployee + 1, 10)
    // }
    // else if (hint == 'previous') {
    //   this.serviceCallEmployeeSummary(obj, this.presentpageEmployee - 1, 10)
    // }
    // else {
    //   this.serviceCallEmployeeSummary(obj, 1, 10)
    // }

  }

  resetEmployee() {
    this.EmployeeSummarySearch.patchValue({
      logdate:'',
      codename:''
    })
    this.serviceCallEmployeeSummary(this.presentpageEmployee=1)
  }


  // AddEmployee() {
  //   // this.route.navigate(['hrms/employeeInfo'])
  //   // return true 
  //   this.EmployeeCreateFormpart = true
  //   this.EmployeeSummaryPart = false
  //   this.EmployeeViewPart = false 

  // }



  getdatadesignation(data?: designationdata): string | undefined {
    return data ? data.name : undefined;
  }
  getdatabranch(data?: branchdata): string | undefined {
    return data ? data.name : undefined;
  }
  getbsdatainterface(data?: bsdata): string | undefined {
    return data ? data.name : undefined;
  }
  gerccdatainterface(data?: ccdata): string | undefined {
    return data ? data.name : undefined;
  }
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

  //////////////////////////////////////////////////////////////// Designation 
  getdesignation(data) {
    let dataDes = data
    this.masterservice.getDesignationList(dataDes, 1).subscribe(data => {
      this.designationlist = data['data'];
    });
  }


  getbranchsdata(data) {
    let searchBranch: any = data
    this.masterservice.getbranchdatafilter(searchBranch, 1).subscribe(data => {
      this.branchdatalist = data['data'];
    });

  }
  getbsdata(data) {
    let bssearch: any = data
    this.masterservice.getbsdatafilter(bssearch, 1).subscribe(data => {
      this.bsdatalist = data['data'];
    });
  }
  getccdata(bs, cc) {

    if (bs == null || bs == '' || bs == undefined) {
      this.notify.showWarning("Please fill BS")
      return false
    }

    this.masterservice.getccdatafilter(bs, cc, 1).subscribe(data => {
      this.ccdatalist = data['data'];
    });

  }
  getpincodedata(data) {
    let searchdata: any = data;
    this.masterservice.getPinCodeDropDownscroll(searchdata, 1).subscribe(data => {
      this.pincodelist = data['data'];
    });
  }
  getpinlistfocus(data: any) {
    console.log(data);
    this.createemploys.get('city').patchValue(data['city']);
    this.createemploys.get('district').patchValue(data['district']);
    this.createemploys.get('state').patchValue(data['state']);
  }
  getcityfocus(data: any) {
    console.log(data);
    this.createemploys.get('pincode').patchValue(data['pincode']);
    this.createemploys.get('district').patchValue(data['district']);
    this.createemploys.get('state').patchValue(data['state']);
  }
  getcitydata(data) {
    let searchData: any = data;
    this.masterservice.getCityDropDownscroll(searchData, 1).subscribe(data => {
      this.citylist = data['data'];
    });

  }
  getdistrictdata(data) {
    let searchData: any = data
    this.masterservice.getDistrictList(searchData, 'asc', 1, 10).subscribe(data => {
      this.districtlist = data['data'];
    });
  }
  getstatedata(data) {
    let searchData: any = data;
    this.masterservice.getStateList(searchData, 'asc', 1, 10).subscribe(data => {
      this.statelist = data['data'];
    });
  }
  gethierarchydata(data) {
    let searchHirachy: any = data
    this.masterservice.getHierarchyList("", 'asc', 1, searchHirachy).subscribe(data => {
      this.hierarchylist = data['data'];
    });
  }
  ///////////////////////////////////////////////////////////////////////Employee Type 
  getEmployeedepartmentdata(data) {
    let dataEmp = data
    this.masterservice.getlistdepartment(dataEmp, 1).subscribe(results => {
      this.employeetypelist = results['data'];
    })
  }
  getsupervisorlist(data) {
    let searchdata: any = data
    this.masterservice.getlistdepartmentsenoor(1, searchdata).subscribe(data => {
      this.supervisorlist = data['data'];
    });
  }
  autocompleteDeptScrolldesign() {
    // setTimeout(() => {
    //   if (
    //     this.matdesign &&
    //     this.autocompleteTrigger &&
    //     this.matdesign.panel
    //   ) {
    //     fromEvent(this.matdesign.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matdesign.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matdesign.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matdesign.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matdesign.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_designnext === true) {
    //             this.masterservice.getDesignationList('','asc',this.designpage+1,this.designinput.nativeElement.value)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.designationlist = this.designationlist.concat(datas);
    //                 if (this.designationlist.length >= 0) {
    //                   this.has_designnext = datapagination.has_next;
    //                   this.has_designpre = datapagination.has_previous;
    //                   this.designpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteDeptScrollbranch() {
    // setTimeout(() => {
    //   if (
    //     this.matbranch &&
    //     this.autocompleteTrigger &&
    //     this.matbranch.panel
    //   ) {
    //     fromEvent(this.matbranch.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matbranch.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matbranch.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matbranch.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matbranch.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_branchnxt === true) {
    //             this.masterservice.getbranchdatafilter(this.branchinput.nativeElement.value,this.has_branchpage+1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.branchdatalist = this.branchdatalist.concat(datas);
    //                 if (this.branchdatalist.length >= 0) {
    //                   this.has_branchnxt = datapagination.has_next;
    //                   this.has_bracchpre = datapagination.has_previous;
    //                   this.has_branchpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollbs() {
    // setTimeout(() => {
    //   if (
    //     this.matbsdata &&
    //     this.autocompleteTrigger &&
    //     this.matbsdata.panel
    //   ) {
    //     fromEvent(this.matbsdata.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matbsdata.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matbsdata.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matbsdata.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matbsdata.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_branchnxt === true) {
    //             this.masterservice.getbsdatafilter(this.bsinput.nativeElement.value,this.has_bspage+1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.bsdatalist = this.bsdatalist.concat(datas);
    //                 if (this.bsdatalist.length >= 0) {
    //                   this.has_bsnxt = datapagination.has_next;
    //                   this.has_bspre = datapagination.has_previous;
    //                   this.has_bspage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollpincode() {
    // setTimeout(() => {
    //   if (
    //     this.matpincode &&
    //     this.autocompleteTrigger &&
    //     this.matpincode.panel
    //   ) {
    //     fromEvent(this.matpincode.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matpincode.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matpincode.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matpincode.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matpincode.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_pincodenxt === true) {
    //             this.masterservice.getPinCodeDropDownscroll(this.pincodeinput.nativeElement.value,this.has_pincodepage+1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.pincodelist = this.pincodelist.concat(datas);
    //                 if (this.pincodelist.length >= 0) {
    //                   this.has_pincodenxt = datapagination.has_next;
    //                   this.has_pincodepre = datapagination.has_previous;
    //                   this.has_pincodepage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollcity() {
    // setTimeout(() => {
    //   if (
    //     this.matcity &&
    //     this.autocompleteTrigger &&
    //     this.matcity.panel
    //   ) {
    //     fromEvent(this.matcity.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matcity.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matcity.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matcity.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matcity.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_citynxt === true) {
    //             this.masterservice.getCityDropDownscroll(this.cityinput.nativeElement.value,this.has_citypage+1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.citylist = this.citylist.concat(datas);
    //                 if (this.citylist.length >= 0) {
    //                   this.has_citynxt = datapagination.has_next;
    //                   this.has_citypre = datapagination.has_previous;
    //                   this.has_citypage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrolldistrict() {
    // setTimeout(() => {
    //   if (
    //     this.matdistrict &&
    //     this.autocompleteTrigger &&
    //     this.matdistrict.panel
    //   ) {
    //     fromEvent(this.matdistrict.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matdistrict.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matdistrict.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matdistrict.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matdistrict.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_districtnxt === true) {
    //             this.masterservice.getDistrictList('','asc',this.has_districtpage+1,10)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.districtlist = this.districtlist.concat(datas);
    //                 if (this.districtlist.length >= 0) {
    //                   this.has_districtnxt = datapagination.has_next;
    //                   this.has_districtpre = datapagination.has_previous;
    //                   this.has_districtpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollstate() {
    // setTimeout(() => {
    //   if (
    //     this.matstate &&
    //     this.autocompleteTrigger &&
    //     this.matstate.panel
    //   ) {
    //     fromEvent(this.matstate.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matstate.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matstate.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matstate.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matstate.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_statenxt === true) {
    //             this.masterservice.getStateList('','asc',this.has_statepage+1,10)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.statelist = this.statelist.concat(datas);
    //                 if (this.statelist.length >= 0) {
    //                   this.has_statenxt = datapagination.has_next;
    //                   this.has_statepre = datapagination.has_previous;
    //                   this.has_statepage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollhierarchy() {
    // setTimeout(() => {
    //   if (
    //     this.mathierchy &&
    //     this.autocompleteTrigger &&
    //     this.mathierchy.panel
    //   ) {
    //     fromEvent(this.mathierchy.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.mathierchy.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.mathierchy.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.mathierchy.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.mathierchy.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_hiernxt === true) {
    //             this.masterservice.getHierarchyList("",'asc', this.has_hierpage+1, this.hierarchyinput.nativeElement.value)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.hierarchylist = this.hierarchylist.concat(datas);
    //                 if (this.hierarchylist.length >= 0) {
    //                   this.has_hiernxt = datapagination.has_next;
    //                   this.has_hierpre = datapagination.has_previous;
    //                   this.has_hierpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrolldept() {
    // setTimeout(() => {
    //   if (
    //     this.matdept &&
    //     this.autocompleteTrigger &&
    //     this.matdept.panel
    //   ) {
    //     fromEvent(this.matdept.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matdept.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matdept.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matdept.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matdept.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_deptnxt === true) {
    //             this.masterservice.getlistdepartment(this.has_deptpage+1,this.deptinput.nativeElement.value)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.employeetypelist = this.employeetypelist.concat(datas);
    //                 if (this.employeetypelist.length >= 0) {
    //                   this.has_deptnxt = datapagination.has_next;
    //                   this.has_deptpre = datapagination.has_previous;
    //                   this.has_deptpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }
  autocompleteScrollsuper() {
    // setTimeout(() => {
    //   if (
    //     this.matsuper &&
    //     this.autocompleteTrigger &&
    //     this.matsuper.panel
    //   ) {
    //     fromEvent(this.matsuper.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matsuper.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matsuper.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matsuper.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matsuper.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         if (atBottom) {
    //           if (this.has_supernxt === true) {
    //             this.masterservice.getEmployee('','asc', this.has_superpage+1,10)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.supervisorlist = this.supervisorlist.concat(datas);
    //                 if (this.supervisorlist.length >= 0) {
    //                   this.has_supernxt = datapagination.has_next;
    //                   this.has_superpre = datapagination.has_previous;
    //                   this.has_superpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }

  keypress(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }






  employeecreatedata() {
    console.log(this.createemploys.value)
    if (this.createemploys.get('code').value.trim() == '' || this.createemploys.get('code').value == null || this.createemploys.get('code').value == undefined) {
      this.notify.showError('Please Select The Code');
      return false;
    }
    if (this.createemploys.get('name').value.trim() == '' || this.createemploys.get('name').value == null || this.createemploys.get('name').value == undefined) {
      this.notify.showError('Please Select The Name');
      return false;
    }
    if (this.createemploys.get('dob').value == '' || this.createemploys.get('dob').value == null || this.createemploys.get('dob').value == undefined) {
      this.notify.showError('Please Select The DOB');
      return false;
    }
    if (this.createemploys.get('doj').value == '' || this.createemploys.get('doj').value == null || this.createemploys.get('doj').value == undefined) {
      this.notify.showError('Please Select The Date Of Joining');
      return false;
    }
    if (this.createemploys.get('gender').value == '' || this.createemploys.get('gender').value == null || this.createemploys.get('gender').value == undefined) {
      this.notify.showError('Please Select The Gender');
      return false;
    }
    if (this.createemploys.get('employeetype').value == '' || this.createemploys.get('employeetype').value.id == null || this.createemploys.get('employeetype').value.id == undefined) {
      this.notify.showError('Please Select The Department');
      return false;
    }
    if (this.createemploys.get('designation').value == '' || this.createemploys.get('designation').value.id == null || this.createemploys.get('designation').value.id == undefined) {
      this.notify.showError('Please Select The Designation');
      return false;
    }
    if (this.createemploys.get('mobilenumber').value.length != 10 || this.createemploys.get('mobilenumber').value == null || this.createemploys.get('mobilenumber').value == undefined) {
      this.notify.showError('Please Select The MobileNumber and 10 digits');
      return false;
    }
    if (this.createemploys.get('emailid').valid == false || this.createemploys.get('emailid').value == null || this.createemploys.get('name').value == undefined) {
      this.notify.showError('Please Enter The Emailid');
      return false;
    }
    // if(this.createemploys.get('supervisor').value.id==null || this.createemploys.get('supervisor').value.id==null || this.createemploys.get('supervisor').value==undefined || this.createemploys.get('supervisor').value==''){
    //   this.notify.showError('Please Enter The Supervisor');
    //   return false;
    // }
    // if(this.createemploys.get('hierarchy').value.id==null || this.createemploys.get('hierarchy').value.id==null || this.createemploys.get('hierarchy').value==undefined || this.createemploys.get('hierarchy').value==''){
    //   this.notify.showError('Please Enter The Hierarchy');
    //   return false;
    // }
    if (this.createemploys.get('branch').value.id == null || this.createemploys.get('branch').value.id == null || this.createemploys.get('branch').value == undefined || this.createemploys.get('branch').value == '') {
      this.notify.showError('Please Enter The Branch');
      return false;
    }
    // if(this.createemploys.get('bsname').value.id==null || this.createemploys.get('bsname').value.id==null || this.createemploys.get('bsname').value==undefined || this.createemploys.get('bsname').value==''){
    //   this.notify.showError('Please Enter The BS Name');
    //   return false;
    // }
    // if(this.createemploys.get('ccname').value.id==null || this.createemploys.get('ccname').value.id==null || this.createemploys.get('ccname').value==undefined || this.createemploys.get('ccname').value==''){
    //   this.notify.showError('Please Enter The CC Name');
    //   return false;
    // }
    if (this.createemploys.get('line1').value == null || this.createemploys.get('line1').value == null || this.createemploys.get('line1').value == undefined || this.createemploys.get('line1').value == '') {
      this.notify.showError('Please Enter The Line1');
      return false;
    }
    if (this.createemploys.get('line2').value == null || this.createemploys.get('line2').value == null || this.createemploys.get('line2').value == undefined || this.createemploys.get('line2').value == '') {
      this.notify.showError('Please Enter The Line2');
      return false;
    }
    if (this.createemploys.get('line3').value == null || this.createemploys.get('line3').value == null || this.createemploys.get('line3').value == undefined || this.createemploys.get('line3').value == '') {
      this.notify.showError('Please Enter The Line3');
      return false;
    }
    if (this.createemploys.get('pincode').value.id == null || this.createemploys.get('pincode').value.id == undefined || this.createemploys.get('pincode').value == undefined || this.createemploys.get('pincode').value == '') {
      this.notify.showError('Please Enter The Pincode');
      return false;
    }
    if (this.createemploys.get('city').value.id == null || this.createemploys.get('city').value.id == undefined || this.createemploys.get('city').value == undefined || this.createemploys.get('city').value == '') {
      this.notify.showError('Please Enter The City');
      return false;
    }
    if (this.createemploys.get('district').value.id == null || this.createemploys.get('district').value.id == undefined || this.createemploys.get('district').value == undefined || this.createemploys.get('district').value == '') {
      this.notify.showError('Please Enter The District');
      return false;
    }
    if (this.createemploys.get('state').value.id == null || this.createemploys.get('state').value.id == undefined || this.createemploys.get('state').value == undefined || this.createemploys.get('state').value == '') {
      this.notify.showError('Please Enter The State');
      return false;
    }
    if (this.createemploys.get('contacttype').value == null || this.createemploys.get('contacttype').value == undefined || this.createemploys.get('contacttype').value == "" || this.createemploys.get('contacttype').value == '') {
      this.notify.showError('Please Enter The ContactType');
      return false;
    }
    if (this.createemploys.get('landline1').value.length != 10 || this.createemploys.get('landline1').value == undefined || this.createemploys.get('landline1').value == "" || this.createemploys.get('landline1').value == '') {
      this.notify.showError('Please Enter The landline1');
      return false;
    }
    if (this.createemploys.get('landline2').value.length != 10 || this.createemploys.get('landline2').value == undefined || this.createemploys.get('landline2').value == "" || this.createemploys.get('landline2').value == '') {
      this.notify.showError('Please Enter The landline2');
      return false;
    }
    if (this.createemploys.get('contactnumber').value.length != 10 || this.createemploys.get('contactnumber').value == undefined || this.createemploys.get('contactnumber').value == "" || this.createemploys.get('contactnumber').value == '') {
      this.notify.showError('Please Enter The Contactnumber');
      return false;
    }
    if (this.createemploys.get('contactnumber2').value.length != 10 || this.createemploys.get('contactnumber2').value == undefined || this.createemploys.get('contactnumber2').value == "" || this.createemploys.get('contactnumber2').value == '') {
      this.notify.showError('Please Enter The Contactnumber');
      return false;
    }
    if (this.createemploys.get('conemailid').valid == false || this.createemploys.get('conemailid').value == undefined || this.createemploys.get('conemailid').value == "" || this.createemploys.get('conemailid').value == '') {
      this.notify.showError('Please Enter The Contact mailId');
      return false;
    }
    if (this.createemploys.get('condob').value == null || this.createemploys.get('condob').value == undefined || this.createemploys.get('condob').value == "" || this.createemploys.get('condob').value == '') {
      this.notify.showError('Please Enter The Contact DOB');
      return false;
    }
    if (this.createemploys.get('conwedday').value == null || this.createemploys.get('conwedday').value == undefined || this.createemploys.get('conwedday').value == "" || this.createemploys.get('conwedday').value == '') {
      this.notify.showError('Please Enter The Contact DOB');
      return false;
    }
    console.log(this.createemploys.value);
    let Gender: any = { 'Male': 1, "Female": 2, "TransGender": 3 };
    let contactType = { 'EMPLOYEE': 5, 'GROUP123': 10, 'Individual': 10 };
    let data: any = {
      "code": this.createemploys.get('code').value.trim(),
      "full_name": this.createemploys.get('name').value.trim(),
      "first_name": "Dwayne",
      "middle_name": "Rock",
      "last_name": "Johnson",
      "dob": this.datepipe.transform(this.createemploys.get('dob').value, 'yyyy-MM-dd'),
      "doj": this.datepipe.transform(this.createemploys.get('doj').value, 'yyyy-MM-dd'),
      "department_id": this.createemploys.get('employeetype').value.id,
      "gender": Gender[this.createemploys.get('gender').value],
      "employee_type": this.createemploys.get('employeetype').value.id,
      "designation": this.createemploys.get('designation').value.name,
      "phone_no": this.createemploys.get('mobilenumber').value,
      "email_id": this.createemploys.get('emailid').value,
      // "supervisor":this.createemploys.get('supervisor').value.id,
      // "hierarchy":this.createemploys.get('hierarchy').value.id,
      "branch": this.createemploys.get('branch').value.id,
      // "businesssegment":this.createemploys.get('bsname').value.id,
      // "costcentre":this.createemploys.get('ccname').value.id,
      "contact": {
        "type_id": contactType[this.createemploys.get('contacttype').value],
        "name": this.createemploys.get('personname').value.trim(),
        "designation_id": this.createemploys.get('condesignation').value.id,
        "landline": this.createemploys.get('landline1').value,
        "landline2": this.createemploys.get('landline1').value,
        "mobile": this.createemploys.get('contactnumber').value,
        "mobile2": this.createemploys.get('contactnumber2').value,
        "email": this.createemploys.get('conemailid').value.trim(),
        "dob": this.datepipe.transform(this.createemploys.get('condob').value, 'yyyy-MM-dd'),
        "wedding_date": this.datepipe.transform(this.createemploys.get('conwedday').value, 'yyyy-MM-dd'),
        "status": 1
      },
      "address": {
        "line1": this.createemploys.get('line1').value.trim(),
        "line2": this.createemploys.get('line2').value.trim(),
        "line3": this.createemploys.get('line3').value.trim(),
        "pincode_id": this.createemploys.get('pincode').value.id,
        "city_id": this.createemploys.get('city').value.id,
        "district_id": this.createemploys.get('district').value.id,
        "state_id": this.createemploys.get('state').value.id
      }
    };
    this.masterservice.getlistdepartmentcreate(data).subscribe(datas => {
      console.log(datas);
      this.createemploys.reset(''); 
      this.EmployeeSummaryPart = true
      this.EmployeeViewPart = false 
      this.notify.showSuccess('Created Successfully')
    },
      (error) => {
        this.notify.showError(error.status + error.statusText);
      }
    );
  }

  BackEmployeeAdd() {
    this.createemploys.reset('') 
    this.EmployeeSummaryPart = true
    this.EmployeeViewPart = false 
  }

  employeeViewPage(view){
    console.log("view data", view)
    let dataID = view.id 
    this.masterservice.getEmpDetails(dataID)
    .subscribe(results=>{
      console.log("result data for single emp get", results)
      let obj: any={
        id: dataID,
        data: results 
      }
      this.share.employeeview.next(obj)
      this.EmployeeViewPart = true  
      this.EmployeeSummaryPart = false 
    })

  }

  backSummary(){

    this.EmployeeViewPart = false   
    this.EmployeeSummaryPart = true  

  }

  getemployeetrackdetails(data){
    // this.masterservice.getemployeetrackdetails().subscribe(
    //   result=>{
    //     console.log('employeetrack',result)
    //   }
    // )

    // this.currentPos=data?.tracker[0]
    // this.points=data?.tracker

    // this.points=[]
    console.log('aaaaaaaaaaa',data)


    // for(let i=0;i<data.length;i++){
    //   console.log()
    //   let obj={
    //     lat: /[a-zA-Z]/g.test(data[i]?.latitude)? this.converttodegree(data[i]?.latitude):data[i]?.latitude,
    //     lng: /[a-zA-Z]/g.test(data[i]?.longitude)? this.converttodegree(data[i]?.longitude):data[i]?.longitude,
    //   }
    //   console.log("obj for lat long", obj)
    //   this.points.push(obj)
    // }
    this.currentPos=data[0]

    console.log('aaaaaaaaaaa2', data,this.currentPos)


  }

  converttodegree(value){
    let data=value.split(/[^\d\w\.]+/); 
    
    var dd = Number(data[0]) + Number(data[1])/60 + Number(data[2])/(60*60);
    if (data[3] == "S" || data[3] == "W") {
      dd = dd * -1;
  } 
  return dd
  }

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
}

onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
}

getemployeecomment(id){
  this.masterservice.employeecomments(id).subscribe(
    result=>{
      this.employeecomments=result['data']
    }
  )
}


ShiftMappingEmployeeget(data) {
  this.attendanceService.getShiftMappingEmployee(data)
    .subscribe((results) => {
      this.employeesearchdata = results["data"];
      console.log(results);
    });
}

public displayShiftmapping(typ?: typelistss): string | undefined {
  return typ ? typ.full_name : undefined;
}

}
  

























