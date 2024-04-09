import { Component, OnInit,Output, EventEmitter, ViewChild, Injectable} from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate, DatePipe } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { AttendanceMasterServiceService } from "../attendance-master-service.service";

export interface typelistss {
  id: string;
  name: any;
  code: any;
  full_name: any;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: "short", year: "numeric", day: "numeric" } },
  display: {
    dateInput: "input",
    monthYearLabel: { year: "numeric", month: "short" },
    dateA11yLabel: { year: "numeric", month: "long", day: "numeric" },
    monthYearA11yLabel: { year: "numeric", month: "long" },
  },
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === "input") {
      return formatDate(date, "dd-MMM-yyyy", this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: "app-attendance-master",
  templateUrl: "./attendance-master.component.html",
  styleUrls: ["./attendance-master.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class AttendanceMasterComponent implements OnInit {
  @ViewChild("IPInput") ip_section;
  attendancecheck: any[] = [
    { value: true, display: "YES" },
    { value: false, display: "NO" },
  ];
  salarycheck: any[] = [
    { value: true, display: "YES" },
    { value: false, display: "NO" },
  ];
  attendance_Master_Menu_List: any;
  holidaytype: any;
  pagesize = 10;
  holiday_Id: any = "";
  leave_Id: any = "";
  attendance_Id: any = "";
  orgdetails_Id: any = "";
  orgip_Id: any = "";
  grade_Id: any = "";
  gradeleave_Id: any = "";
  employee_id: any = "";

  holidaySearchForm: FormGroup;
  LeaveSearchForm: FormGroup;
  orgSearchForm: FormGroup;
  orgIPSearchForm: FormGroup;
  GradeSearchForm: FormGroup;
  gradeleavemappingSearchForm: FormGroup;
  ShiftmappingSearchForm: FormGroup;
  ShiftHistry: FormGroup;

  HolidayForm: FormGroup;
  LeaveForm: FormGroup;
  AttendanceForm: FormGroup;
  OrgDetailsForm: FormGroup;
  Org_IPForm: FormGroup;
  GradeForm: FormGroup;
  GradeLeaveForm: FormGroup;
  ShiftMappingForm: FormGroup;

  isHoliday: boolean;
  isHolidayCreate: boolean;
  isHolidayUpdate: boolean;
  isLeaveType: boolean;
  isLeaveTypeCreate: boolean;
  isLeaveTypeUpdate: boolean;
  isattendanceType: boolean;
  isattendanceTypeCreate: boolean;
  isattendanceTypeUpdate: boolean;
  isOrgDetails: boolean;
  isOrgDetailsCreate: boolean;
  isOrgDetailsUpdate: boolean;
  isOrg_IP: boolean;
  isOrg_IPCreate: boolean;
  isOrg_IPUpdate: boolean;
  isOrgIPView: boolean;
  isGrade: boolean;
  isGradeCreate: boolean;
  isGradeLeaveMapping: boolean;
  isGradeLeaveCreate: boolean;
  isShiftMapping: boolean;
  isShiftMappingCreate: boolean;
  isPenalty: boolean 

  // holiday
  isHolidayPage: boolean = true;
  holidayList: any;
  StateList: any;
  has_nextholi = false;
  has_previousholi = false;
  presentpageholi = 1;

  // leave
  isLeavePage: boolean = true;
  LeaveList: any;
  has_nextLeave = false;
  has_previousLeave = false;
  presentpageLeave = 1;

  // attendance
  isAttendancePage: boolean = true;
  attendanceList: any;
  has_nextAttend = false;
  has_previousAttend = false;
  presentpageAttend = 1;

  // Org Details
  isOrgDetailsPage: boolean = true;
  OrgDetailsList: any;
  has_nextOrgDetails = false;
  has_previousOrgDetails = false;
  presentpageOrgDetails = 1;

  // Org IP
  isOrg_IPPage: boolean = true;
  Org_IPList: any;
  has_nextOrg_IP = false;
  has_previousOrg_IP = false;
  presentpageOrg_IP = 1;

  // Grade
  isGradePage: boolean = true;
  gradeList: any;
  has_nextGrade = false;
  has_previousGrade = false;
  PresentPageGrade = 1;
  // GradeLeaveMapping
  MappingList: any;
  gradeleaveMappingList: any;
  GradeMappingList: any;
  LeaveMappingList: any;
  // ShiftMapping
  isShiftMappingPage: true;
  shiftmappingList: any;
  has_previousshift: false;
  has_nextshift: false;
  presentpageshift: 1;

  // shiftHistry
  CreateshiftmapList: any;
  isShiftMappingCreatePage: true;
  has_previousshiftmapping: false;
  has_nextshiftmapping: false;
  presentpageShiftmapping: 1;
  EmployeeList: any;
  isSpecialPermission: boolean = false 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private shareService: SharedService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingServiceService,
    private notify: ToastrService,
    private attendanceService: AttendanceMasterServiceService
  ) // private attendanceShareService: AttendanceShareService
  {}

  ngOnInit(): void {
    this.holidaySearchForm = this.fb.group({
      name: "",
      state: "",
    });
    this.LeaveSearchForm = this.fb.group({
      name: "",
    });
    this.orgSearchForm = this.fb.group({
      name: "",
    });
    this.orgIPSearchForm = this.fb.group({
      name: "",
    });
    this.GradeSearchForm = this.fb.group({
      name: "",
    });
    this.gradeleavemappingSearchForm = this.fb.group({
      codename: "",
    });
    this.ShiftmappingSearchForm = this.fb.group({
      employe: "",
      fromdate: "",
      Todate: "",
    });

    this.HolidayForm = this.fb.group({
      year: "",
      state: "",
      arr: new FormArray([]),
    });
    this.LeaveForm = this.fb.group({
      name: [""],
      has_attendance: [""],
      has_salary: [""],
    });
    this.AttendanceForm = this.fb.group({
      check_in_mode: [""],
    });
    this.OrgDetailsForm = this.fb.group({
      name: [""],
      radius: [""],
      latitude: [""],
      longitude: [""],
    });
    this.Org_IPForm = this.fb.group({
      org_detail_id: [""],
      ip_arr: [""],
    });
    this.GradeForm = this.fb.group({
      code: [""],
      name: [""],
      points: [""],
    });
    this.GradeLeaveForm = this.fb.group({
      grade: [""],
      leave: [""],
      count: [""],
      effective_from: new Date(),
    });
    this.ShiftMappingForm = this.fb.group({
      shift: 0,
      effective_from: new Date(),
    });

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Attendance Master") {
        this.attendance_Master_Menu_List = subModule;
        // console.log("security master component value",this.prpomasterList)
        // this.isCommodity = subModule[0].name;
      }
    });

    // this.attendance_Master_Menu_List = [{ name: 'Holiday' }, { name: 'Leave Type' }, { name: 'Attendance Mode' },
    // { name : 'Organization details' },{ name : 'Organization IP' }]
  }

  createItem() {
    let fg = this.fb.group({
      name: new FormControl(""),
      date: new FormControl(new Date()),
    });
    return fg;
    console.log(fg);
  }

  AddholidayForm() {
    const add = this.HolidayForm.get("arr") as FormArray;
    console.log("add controls ", add);

    add.push(this.createItem());
  }

  deleteholidaydetail(index) {
    const add = this.HolidayForm.get("arr") as FormArray;
    add.removeAt(index);
  }

  // holidaytypeList() {
  //   // this.SpinnerService.show();
  //   this.attendanceService.holidaytypeList().subscribe(
  //     (results: any[]) => {
  //       // this.SpinnerService.hide();
  //       let datass = results["data"];
  //       this.holidaytype = datass;
  //     },
  //     (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }

  org_detail_nameList;

  subModuleData(submodule) {
    console.log("submodule names ", submodule);
    if (submodule.name == "Holiday") {
      this.isHoliday = true;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.holidaySearch("");
    }
    if (submodule.name == "Leave Type") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = true;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.LeaveSearch("");
    }
    if (submodule.name == "Attendance Mode") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = true;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.getAttendancedetails();
    }
    if (submodule.name == "Org Details") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = true;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.orgSearch("");
    }
    if (submodule.name == "Org IP") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = true;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.orgSearch("");
    }

    if (submodule.name == "Grade") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = true;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.GradeSearch("");
    }

    if (submodule.name == "Grade Leave Mapping") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = true;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false 
      this.gradeleavemappingget("");
    }
    if (submodule.name == "Shift Mapping") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = true;
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = false  
      this.ShiftMappingSearch("");
    }
    if (submodule.name == "Penalty") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false; 
      this.isShiftMappingCreate = false;
      this.isPenalty = true 
      this.isSpecialPermission = false 
    }
    if (submodule.name == "Special Permission") {
      this.isHoliday = false;
      this.isHolidayCreate = false;
      this.isHolidayUpdate = false;
      this.isLeaveType = false;
      this.isLeaveTypeCreate = false;
      this.isLeaveTypeUpdate = false;
      this.isattendanceType = false;
      this.isattendanceTypeCreate = false;
      this.isattendanceTypeUpdate = false;
      this.isOrgDetails = false;
      this.isOrgDetailsCreate = false;
      this.isOrgDetailsUpdate = false;
      this.isOrg_IP = false;
      this.isOrg_IPCreate = false;
      this.isOrg_IPUpdate = false;
      this.isOrgIPView = false;
      this.isGrade = false;
      this.isGradeCreate = false;
      this.isGradeLeaveMapping = false;
      this.isGradeLeaveCreate = false;
      this.isShiftMapping = false; 
      this.isShiftMappingCreate = false;
      this.isPenalty = false  
      this.isSpecialPermission = true  
    }
  }

  // holiday summary List
  getholidaydetails(data, page) {
    console.log(data);
    this.attendanceService.getholidaydetails(data, page).subscribe(
      (result) => {
        // this.SpinnerService.hide();
        console.log("holiday", result);
        let datass = result["data"];
        this.holidayList = datass;
        let datapagination = result["pagination"];
        if (this.holidayList.length > 0) {
          this.has_nextholi = datapagination.has_next;
          this.has_previousholi = datapagination.has_previous;
          this.presentpageholi = datapagination.index;
          this.isHolidayPage = true;
        }
        if (this.holidayList.length === 0) {
          this.isHolidayPage = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  public displayholiday(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  public displayState(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  holidaySearch(hint: any) {
    let search = this.holidaySearchForm.value;
    // let obj = {
    //   name: search.name,
    // };
    // for (let i in obj) {
    //   if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
    //     obj[i] = "";
    //   }
    // }
    // this.SpinnerService.show();

    if (hint == "next") {
      this.getholidaydetails(search, this.presentpageholi + 1);
    } else if (hint == "previous") {
      this.getholidaydetails(search, this.presentpageholi - 1);
    } else {
      this.getholidaydetails(search, 1);
    }
  }
  holidayget(data) {
    this.attendanceService.getState(data).subscribe((results) => {
      this.StateList = results["data"];
    });
  }

  // Stateget(data){
  //   this.attendanceService.getState(data)
  //  .subscribe(results =>{
  //   this.StateList = results["data"]
  // })

  // }

  resetHoliday() {
    this.holidaySearchForm.reset("");
    // this.holidaySearch("");
  }

  // holinextClick() {
  //   if (this.has_nextholi === true) {
  //     this.getholidaydetails(this.presentpageholi + 1)
  //   }
  // }

  // holipreviousClick() {
  //   if (this.has_previousholi === true) {
  //     this.getholidaydetails(this.presentpageholi - 1)
  //   }
  // }

  // leave summary List
  getLeaveDetails(data, pagenumber = 1) {
    this.attendanceService
      .getLeavedetails(data, pagenumber)
      .subscribe((result) => {
        console.log("leave", result);
        let datass = result["data"];
        this.LeaveList = datass;
        let datapagination = result["pagination"];
        if (this.LeaveList.length > 0) {
          this.has_nextLeave = datapagination.has_next;
          this.has_previousLeave = datapagination.has_previous;
          this.presentpageLeave = datapagination.index;
          this.isLeavePage = true;
        }
        if (this.LeaveList.length === 0) {
          this.isLeavePage = false;
        }
      });
  }

  LeaveSearch(hint: any) {
    let obj = this.LeaveSearchForm.value.name;

    // for (let i in obj) {
    //   if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
    //     obj[i] = "";
    //   }
    // }

    if (hint == "next") {
      this.getLeaveDetails(obj, this.presentpageLeave + 1);
    } else if (hint == "previous") {
      this.getLeaveDetails(obj, this.presentpageLeave - 1);
    } else {
      this.getLeaveDetails(obj, 1);
    }
  }

  resetLeaveType() {
    this.LeaveSearchForm.reset("");
    this.LeaveSearch("");
  }

  // attendance summary List
  getAttendancedetails(pagenumber = 1) {
    this.attendanceService
      .getAttendancedetails(pagenumber)
      .subscribe((result) => {
        console.log("attendance", result);
        let datass = result["data"];
        this.attendanceList = datass;
        let datapagination = result["pagination"];
        if (this.attendanceList.length > 0) {
          this.has_nextAttend = datapagination.has_next;
          this.has_previousAttend = datapagination.has_previous;
          this.presentpageAttend = datapagination.index;
          this.isAttendancePage = true;
        }
        if (this.attendanceList.length === 0) {
          this.isAttendancePage = false;
        }
      });
  }

  attendancenextClick() {
    if (this.has_nextAttend === true) {
      this.getAttendancedetails(this.presentpageAttend + 1);
    }
  }

  attendancepreviousClick() {
    if (this.has_previousAttend === true) {
      this.getAttendancedetails(this.presentpageAttend - 1);
    }
  }

  //orgdetail summary List
  getOrgDetails(search, pageno, pagesize) {
    this.attendanceService.getOrgDetails(search, pageno).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("org detail", result);
        let datass = result["data"];
        this.OrgDetailsList = datass;
        let datapagination = result["pagination"];
        if (this.OrgDetailsList.length > 0) {
          this.has_nextOrgDetails = datapagination.has_next;
          this.has_previousOrgDetails = datapagination.has_previous;
          this.presentpageOrgDetails = datapagination.index;
          this.isOrgDetailsPage = true;
        }
        if (this.OrgDetailsList.length === 0) {
          this.isOrgDetailsPage = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  //  orgDetailnextClick() {
  //     if (this.has_nextOrgDetails === true) {
  //       this.getOrgDetails(this.presentpageOrgDetails + 1)
  //     }
  //   }

  //   orgDetailpreviousClick() {
  //     if (this.has_previousOrgDetails === true) {
  //       this.getOrgDetails(this.presentpageOrgDetails - 1)
  //     }
  //   }

  orgSearch(hint: any) {
    let search = this.orgSearchForm.value;
    let obj = {
      name: search.name,
    };
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = "";
      }
    }
    this.SpinnerService.show();

    if (hint == "next") {
      this.getOrgDetails(obj, this.presentpageOrgDetails + 1, 10);
    } else if (hint == "previous") {
      this.getOrgDetails(obj, this.presentpageOrgDetails - 1, 10);
    } else {
      this.getOrgDetails(obj, 1, 10);
    }
  }

  resetOrg() {
    this.orgSearchForm.reset("");
    this.orgSearch("");
  }

  // org ip summary List
  getOrg_IP(search, pageno, pagesize) {
    this.attendanceService.getOrg_IP(search, pageno).subscribe(
      (result) => {
        this.SpinnerService.hide();
        console.log("org ip", result);
        let datass = result["data"];
        this.Org_IPList = datass;
        let datapagination = result["pagination"];
        if (this.Org_IPList.length > 0) {
          this.has_nextOrg_IP = datapagination.has_next;
          this.has_previousOrg_IP = datapagination.has_previous;
          this.presentpageOrg_IP = datapagination.index;
          this.isOrg_IPPage = true;
        }
        if (this.Org_IPList.length === 0) {
          this.isOrg_IPPage = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  //  org_IpnextClick() {
  //     if (this.has_nextOrg_IP === true) {
  //       this.getOrg_IP(this.presentpageOrg_IP + 1)
  //     }
  //   }

  //   org_IppreviousClick() {
  //     if (this.has_previousOrg_IP === true) {
  //       this.getOrg_IP(this.presentpageOrg_IP - 1)
  //     }
  //   }

  orgIPSearch(hint: any) {
    let search = this.orgIPSearchForm.value;
    let obj = {
      name: search.name,
    };
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = "";
      }
    }
    this.SpinnerService.show();

    if (hint == "next") {
      this.getOrg_IP(obj, this.presentpageOrg_IP + 1, 10);
    } else if (hint == "previous") {
      this.getOrg_IP(obj, this.presentpageOrg_IP - 1, 10);
    } else {
      this.getOrg_IP(obj, 1, 10);
    }
  }

  resetOrgIP() {
    this.orgIPSearchForm.reset("");
    this.orgIPSearch("");
  }

  getGrade(data, pageno) {
    this.attendanceService.getGrade(data, pageno).subscribe(
      (results) => {
        let dataList = results["data"];
        this.gradeList = dataList;
        console.log(this.gradeList);
        let page = results["pagination"];
        if (this.gradeList.length > 0) {
          console.log(results);
          this.has_nextGrade = page.has_next;
          this.has_previousGrade = page.has_previous;
          this.PresentPageGrade = page.index;
          this.isGradePage = true;
        }
        if (this.gradeList.length === 0) {
          this.isGradePage = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
    );
  }

  GradeSearch(hint: any) {
    let obj = this.GradeSearchForm.value.name;
    // let obj = {
    //   name: search.name,
    // };
    // for (let i in obj) {
    //   if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
    //     obj[i] == '';
    //   }
    // }
    // this.SpinnerService.show();
    if (hint == "next") {
      this.getGrade(obj, this.PresentPageGrade + 1);
    } else if (hint == "previous") {
      this.getGrade(obj, this.PresentPageGrade - 1);
    } else {
      this.getGrade(obj, 1);
    }
  }

  resetGrade() {
    this.GradeSearchForm.reset("");
    this.GradeSearch("");
  }

  gradeleavemappingget(data) {
    this.attendanceService.getGrade(data, 1).subscribe((results) => {
      this.MappingList = results["data"];
    });
  }

  public displaygradeleave(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  public displaygradeleavemapping(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  public displaygradeleavmap(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }

  public displayShiftmapping(typ?: typelistss): string | undefined {
    return typ ? typ.full_name : undefined;
  }

  getGradeLeave(data) {
    console.log("getting grade", data);
    let code = data.code;

    this.attendanceService.getleavemappingsum(code).subscribe((results) => {
      this.gradeleaveMappingList = results;
  
      console.log(this.gradeleaveMappingList)
    });
  }

  getShiftMapping(data, pageno) {
    console.log(data);
    console.log(pageno);
    this.attendanceService.getShiftMapping(data, pageno).subscribe(
      (results) => {
        let dataList = results["data"];
        this.shiftmappingList = dataList;
        console.log(this.shiftmappingList);
        let page = results["pagination"];
        if (this.shiftmappingList.length > 0) {
          console.log(results);
          this.has_nextshift = page.has_next;
          this.has_previousshift = page.has_previous;
          this.presentpageshift = page.index;
          this.isShiftMappingPage = true;
        }
        if (this.shiftmappingList.length === 0) {
          // this.isShiftMappingPage= false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
    );
  }
  resetgradeleavemapping() {
    this.gradeleavemappingSearchForm.reset("");
  }

  ShiftMappingSearch(hint: any) {
    let obj = this.ShiftmappingSearchForm.value.employe;
    console.log(obj);

    let dataempty;
    if (obj.id == "" || obj.id == undefined || obj.id == null) {
      dataempty = [];
    } else {
      dataempty = [obj.id];
    }

    let dataObj = {
      arr: dataempty,
    };
    // let dataObj = {
    //  arr:[]
    // }

    if (hint == "next") {
      this.getShiftMapping(dataObj, this.presentpageshift + 1);
    } else if (hint == "previous") {
      this.getShiftMapping(dataObj, this.presentpageshift - 1);
    } else {
      this.getShiftMapping(dataObj, 1);
    }
  }
  resetShiftMapping() {
    this.ShiftmappingSearchForm.reset("");
  }

  ShiftMappingEmployeeget(data) {
    this.attendanceService
      .getShiftMappingEmployee(data)
      .subscribe((results) => {
        this.EmployeeList = results["data"];
        console.log(results);
      });
  }

  getShiftMappingHistry(data, pageno) {
    this.attendanceService.getShiftMappingHistry(data, pageno).subscribe(
      (results) => {
        let dataList = results["data"];
        this.CreateshiftmapList = dataList;
        console.log("this.CreateshiftmapList", this.CreateshiftmapList);
        let page = results["pagination"];
        if (this.CreateshiftmapList.length > 0) {
          console.log("full results data", results);
          this.has_nextshiftmapping = page.has_next;
          this.has_previousshiftmapping = page.has_previous;
          this.presentpageShiftmapping = page.index;
          this.isShiftMappingCreatePage = true;
        }
        if (this.CreateshiftmapList.length === 0) {
          // this.isShiftMappingCreatePage = false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
    );
  }

  // ShiftMappinHistryget( hint: any){
  //     let obj = this.ShiftHistry.value

  //   if (hint == "next"){
  //     this.getShiftMappingHistry(obj, this.presentpageShiftmapping + 1);
  //   }else if(hint == "previous"){
  //     this.getShiftMappingHistry(obj, this.presentpageShiftmapping - 1);
  //   } else {
  //     this.getShiftMappingHistry(obj,1);
  //   }

  // }

  EmpName: any;
  AddShiftMapping(hint: any, data) {
    this.EmpName = data?.employee_id;
    console.log("emp name data", this.EmpName);
    // let obj = this.ShiftHistry.value

    if (hint == "next") {
      this.getShiftMappingHistry(data, this.presentpageShiftmapping + 1);
    } else if (hint == "previous") {
      this.getShiftMappingHistry(data, this.presentpageShiftmapping - 1);
    } else {
      this.getShiftMappingHistry(data, 1);
    }
  }

  onSubmitHolidayClick() {
    let data = this.HolidayForm.value;
    // let  data = this.HolidayForm.get('arr').value

    if (data.year == "" || data.year == undefined || data.year == null) {
      this.notify.warning("Please fill Year");
      return false;
    }
    if (data.state == "" || data.state == undefined || data.state == null) {
      this.notify.warning("Please select state");
      return false;
    }

    if (data.arr?.length == 0) {
      this.notify.warning("Please Click the Add Button");
      return false;
    }

    for (let i = 0; i < data.arr?.length; i++) {
      if (data.arr[i].name == "") {
        this.notify.warning("Please fill Name");
        this.SpinnerService.hide();
        return false;
      }
    }
    //  if(data.arr.){

    //  }

    // if (data.obj.name == "" || data.obj.name == undefined || data.obj.name == null) {
    //   this.notify.warning("Please Fill Name");
    //   return false;
    // }

    console.log(this.HolidayForm.value);

    let arrobj = [];

    let dataToSubmit;
    if (this.holiday_Id != "") {
      let id = this.holiday_Id;
      let dataarrHolidays = data.arr;
      for (let i in dataarrHolidays) {
        let date = this.datePipe.transform(
          dataarrHolidays[i].date,
          "yyyy-MM-dd"
        );
        let name = dataarrHolidays[i].name;

        let obj = {
          date: date,
          name: name,
          id: dataarrHolidays[i].id,
        };

        arrobj.push(obj);

        console.log("arrobj", arrobj);
      }
      let objdata = {
        arr: arrobj,
        state: data?.state?.id,
        year: data?.year,
      };
      dataToSubmit = Object.assign({}, { id: id }, objdata);
    } else {
      let dataarrHolidays = data.arr;
      console.log("data arr holidays", dataarrHolidays);
      for (let i in dataarrHolidays) {
        let date = this.datePipe.transform(
          dataarrHolidays[i].date,
          "yyyy-MM-dd"
        );
        let name = dataarrHolidays[i].name;

        let obj = {
          date: date,
          name: name,
        };

        arrobj.push(obj);
      }
      dataToSubmit = {
        arr: arrobj,
        state: data?.state?.id,
        year: data?.year,
      };
      console.log("create submit ", arrobj, dataToSubmit);
    }
    // this.SpinnerService.show();
    this.attendanceService.holidayform(dataToSubmit).subscribe(
      (results) => {
        // this.SpinnerService.hide();
        console.log("create", results);
        if (results.status == "SUCCESS") {
          // this.SpinnerService.hide();
          if (this.holiday_Id != "") {
            this.notify.success("Successfully Updated");
            this.holiday_Id = "";
            this.isHoliday = true;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.holidaySearch("");
            this.HolidayForm = this.fb.group({
              name: [""],
              state: [""],
              arr: new FormArray([]),
            });
          } else {
            this.notify.success("Successfully Created");
            this.holiday_Id = "";
            this.isHoliday = true;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.holidaySearch("");
            this.HolidayForm = this.fb.group({
              name: [""],
              state: [""],
              arr: new FormArray([]),
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onSubmitLeaveClick() {
    let data = this.LeaveForm.value;
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    console.log("leave", this.LeaveForm.value);
    // if (data.has_attendance == '' || data.has_attendance == undefined || data.has_attendance == null) {
    //   this.notify.warning('Please Select Attendance')
    //   return false
    // }
    // if (data.has_salary == '' || data.has_salary == undefined || data.has_salary == null) {
    //   this.notify.warning('Please Select Salary')
    //   return false
    // }

    let dataToSubmit;
    if (this.leave_Id != "") {
      let id = this.leave_Id;
      dataToSubmit = Object.assign({}, { id: id }, data);
    } else {
      dataToSubmit = data;
    }
    this.SpinnerService.show();
    this.attendanceService.leaveform(dataToSubmit).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results.status == "SUCCESS") {
          this.SpinnerService.hide();
          if (this.leave_Id != "") {
            this.notify.success("Successfully Updated");
            this.leave_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = true;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.LeaveSearch("");
            this.LeaveForm = this.fb.group({
              name: [""],
              has_attendance: [""],
              has_salary: [""],
            });
          } else {
            this.notify.success("Successfully Created");
            this.leave_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = true;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.LeaveSearch("");
            this.LeaveForm = this.fb.group({
              name: [""],
              has_attendance: [""],
              has_salary: [""],
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onSubmitAttendanceClick() {
    let data = this.AttendanceForm.value;
    if (
      data.check_in_mode == "" ||
      data.check_in_mode == undefined ||
      data.check_in_mode == null
    ) {
      this.notify.warning("Please fill Check In Mode");
      return false;
    }
    // if (data.type == '' || data.type == undefined || data.type == null) {
    //   this.notify.warning('Please fill Type')
    //   return false
    // }
    // if (data.holiday_date == '' || data.holiday_date == undefined || data.holiday_date == null) {
    //   this.notify.warning('Please fill Holiday date')
    //   return false
    // }

    let dataToSubmit;
    if (this.attendance_Id != "") {
      let id = this.attendance_Id;
      dataToSubmit = Object.assign({}, { id: id }, data);
    } else {
      dataToSubmit = data;
    }
    this.SpinnerService.show();
    this.attendanceService.attendanceform(dataToSubmit).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results.status == "SUCCESS") {
          this.SpinnerService.hide();
          if (this.attendance_Id != "") {
            this.notify.success("Successfully Updated");
            this.attendance_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = true;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.getAttendancedetails();
            this.AttendanceForm = this.fb.group({
              check_in_mode: [""],
            });
          } else {
            this.notify.success("Successfully Created");
            this.attendance_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = true;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.getAttendancedetails();
            this.AttendanceForm = this.fb.group({
              check_in_mode: [""],
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onSubmitOrgDetailseClick() {
    let data = this.OrgDetailsForm.value;
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    if (data.radius == "" || data.radius == undefined || data.radius == null) {
      this.notify.warning("Please fill Radius");
      return false;
    }
    if (
      data.latitude == "" ||
      data.latitude == undefined ||
      data.latitude == null
    ) {
      this.notify.warning("Please fill Latitude");
      return false;
    }
    if (
      data.longitude == "" ||
      data.longitude == undefined ||
      data.longitude == null
    ) {
      this.notify.warning("Please fill Longitude");
      return false;
    }

    let dataToSubmit;
    if (this.orgdetails_Id != "") {
      let id = this.orgdetails_Id;
      dataToSubmit = Object.assign({}, { id: id }, data);
    } else {
      dataToSubmit = data;
    }
    this.SpinnerService.show();
    this.attendanceService.orgdetailsform(dataToSubmit).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results.status == "SUCCESS") {
          this.SpinnerService.hide();
          if (this.orgdetails_Id != "") {
            this.notify.success("Successfully Updated");
            this.orgdetails_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = true;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.orgSearch("");
            this.OrgDetailsForm = this.fb.group({
              name: [""],
              latitude: [""],
              longitude: [""],
              radius: [""],
            });
          } else {
            this.notify.success("Successfully Created");
            this.orgdetails_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = true;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.orgSearch("");
            this.OrgDetailsForm = this.fb.group({
              name: [""],
              latitude: [""],
              longitude: [""],
              radius: [""],
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onSubmitOrg_IPClick() {
    let data = this.Org_IPForm.value;
    if (
      data.org_detail_id == "" ||
      data.org_detail_id == undefined ||
      data.org_detail_id == null
    ) {
      this.notify.warning("Please fill Organization Detail Name");
      return false;
    }
    if (data.ip_arr == "" || data.ip_arr == undefined || data.ip_arr == null) {
      this.notify.warning("Please fill IP");
      return false;
    }

    let dataToSubmit;
    if (this.orgip_Id != "") {
      let id = this.orgip_Id;
      dataToSubmit = Object.assign({}, { id: id }, data);
    } else {
      data.ip_arr = this.IpList;
      dataToSubmit = data;
    }
    this.SpinnerService.show();
    this.attendanceService.orgIPform(dataToSubmit).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results.status == "SUCCESS") {
          this.SpinnerService.hide();
          if (this.orgip_Id != "") {
            this.notify.success("Successfully Updated");
            this.orgip_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = true;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.orgIPSearch("");
            this.Org_IPForm = this.fb.group({
              org_detail_id: [""],
              ip_arr: [""],
            });
          } else {
            this.notify.success("Successfully Created");
            this.orgip_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = true;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.orgIPSearch("");
            this.Org_IPForm = this.fb.group({
              org_detail_id: [""],
              ip_arr: [""],
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onGradeSubmitClick() {
    let data = this.GradeForm.value;
    if (data.code == "" || data.code == undefined || data.code == null) {
      this.notify.warning("Please fill Code");
      return false;
    }
    if (data.name == "" || data.name == undefined || data.name == null) {
      this.notify.warning("Please fill Name");
      return false;
    }
    if (data.points == "" || data.points == undefined || data.points == null) {
      this.notify.warning("Please fill Points");
      return false;
    }
    let dataToSubmit;
    if (this.grade_Id != "") {
      let id = this.grade_Id;
      dataToSubmit = Object.assign({}, { id: id }, data);
    } else {
      dataToSubmit = data;
    }
    this.SpinnerService.show();
    this.attendanceService.gradeform(dataToSubmit).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results?.status == "SUCCESS") {
          // this.SpinnerService.hide();
          if (this.grade_Id != "") {
            this.notify.success("Successfully Updated");
            this.grade_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = true;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.GradeSearch("");
            this.GradeForm = this.fb.group({
              code: [""],
              name: [""],
              points: [""],
            });
          } else {
            this.notify.success("Successfully Created");
            this.grade_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = true;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.GradeSearch("");
            this.GradeForm = this.fb.group({
              code: [""],
              name: [""],
              points: [""],
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onGradeLeaveSubmitClick() {
    let data = this.GradeLeaveForm.value;
    // if (data.codename == "" || data.codename == undefined || data.codename == null) {
    //   this.notify.warning("Please Select Grade");
    //   return false;
    // }
    if (data.grade == "" || data.grade == undefined || data.grade == null) {
      this.notify.warning("Please Select Grade");
      return false;
    }
    if (data.leave == "" || data.leave == undefined || data.leave == null) {
      this.notify.warning("Please Select Leave");
      return false;
    }
    if (data.count == "" || data.count == undefined || data.count == null) {
      this.notify.warning("Please fill Count");
      return false;
    }

    let obj = {
      leave: this.GradeLeaveForm.value.leave.id,
      grade: this.GradeLeaveForm.value.grade.id,
      count: this.GradeLeaveForm.value.count,
      effective_from: this.datePipe.transform(
        this.GradeLeaveForm.value.effective_from,
        "yyyy-MM-dd"
      ),
    };
    this.SpinnerService.show();
    this.attendanceService.GradeLeaveMappingForm(obj).subscribe(
      (results) => {
        this.SpinnerService.hide();
        console.log("create", results);
        if (results?.status == "SUCCESS") {
          // this.SpinnerService.hide();
          if (this.gradeleave_Id != "") {
            this.notify.success("Successfully Updated");
            this.gradeleave_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = true;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.GradeLeaveForm = this.fb.group({
              grade: [""],
              leave: [""],
              count: [""],
              effective_from: new Date(),
            });
          } else {
            this.notify.success("Successfully Created");
            this.gradeleave_Id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = true;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = false;
            this.isShiftMappingCreate = false;
            this.GradeLeaveForm = this.fb.group({
              grade: [""],
              leave: [""],
              count: [""],
              effective_from: new Date(),
            });
          }
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  onSubmitShift() {
    let data = this.ShiftMappingForm.value;
    console.log(data);
   

    if (data.shift == "" || data.shift == undefined || data.shift == null) {
      this.notify.warning("Please Select Shift");
      return false;
    }
    let dateFrom = this.datePipe.transform(data?.effective_from, "yyyy-MM-dd");

    let dataToSubmit = {
      effective_from: dateFrom,
      shift_id: data?.shift,
    };
    let id = this.EmpName?.id;
    // if (this.employee_id != "") {
    //   let id = this.employee_id;
    //   dataToSubmit = Object.assign({}, { id: id }, data);
    // } else {
    //   dataToSubmit = data;
    // }
    // this.SpinnerService.show();
    this.attendanceService.ShiftMappingHistry(dataToSubmit, id).subscribe(
      (results) => {
        // this.SpinnerService.hide();
        console.log("create", results);
        if (results?.status == "Success") {
          // this.SpinnerService.hide();
          if (this.employee_id != "") {
            this.notify.success("Successfully Updated");
            this.employee_id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = true;
            this.isShiftMappingCreate = false;
            this.ShiftMappingSearch("")
            this.ShiftMappingForm = this.fb.group({
              shift: [""],
              effective_from: new Date(),
            });
          } else {
            this.notify.success("Successfully Created");
            console.log("create the table", this.notify);
            this.employee_id = "";
            this.isHoliday = false;
            this.isHolidayCreate = false;
            this.isHolidayUpdate = false;
            this.isLeaveType = false;
            this.isLeaveTypeCreate = false;
            this.isLeaveTypeUpdate = false;
            this.isattendanceType = false;
            this.isattendanceTypeCreate = false;
            this.isattendanceTypeUpdate = false;
            this.isOrgDetails = false;
            this.isOrgDetailsCreate = false;
            this.isOrgDetailsUpdate = false;
            this.isOrg_IP = false;
            this.isOrg_IPCreate = false;
            this.isOrg_IPUpdate = false;
            this.isOrgIPView = false;
            this.isGrade = false;
            this.isGradeCreate = false;
            this.isGradeLeaveMapping = false;
            this.isGradeLeaveCreate = false;
            this.isShiftMapping = true;
            this.isShiftMappingCreate = false;
            this.ShiftMappingSearch("")
            this.ShiftMappingForm = this.fb.group({
              shift: [""],
              effective_from: new Date(),
            });
          }
        } else {
          this.notify.error(results.message);
          // this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
    );
  }

  // // holiday delete
  // deleteholidaydetail(holidaydelete_Id) {
  //   this.SpinnerService.show();
  //   this.attendanceService.holidayDelete(holidaydelete_Id).subscribe(
  //     (results) => {
  //       this.SpinnerService.hide();
  //       if (results.status == "SUCCESS") {
  //         this.holidaySearch("");
  //         this.SpinnerService.hide();
  //       } else {
  //         this.notify.error(results.message);
  //         this.SpinnerService.hide();
  //         return false;
  //       }
  //     },
  //     (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }

  // leave delete
  leaveDelete(leavedelete_Id) {
    this.SpinnerService.show();
    this.attendanceService.leaveDelete(leavedelete_Id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.status == "SUCCESS") {
          this.getLeaveDetails("", 1);
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  // attendance delete
  attendanceDelete(attdelete_Id) {
    this.SpinnerService.show();
    this.attendanceService.attendanceDelete(attdelete_Id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.status == "SUCCESS") {
          this.getAttendancedetails();
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  // orgdetails delete
  orgDetailsDelete(orgdetdelete_Id) {
    this.SpinnerService.show();
    this.attendanceService.orgDetailsDelete(orgdetdelete_Id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.status == "SUCCESS") {
          this.orgSearch("");
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  // orgip delete
  orgIPDelete(orgipdelete_Id) {
    this.SpinnerService.show();
    this.attendanceService.orgIPDelete(orgipdelete_Id).subscribe(
      (results) => {
        this.SpinnerService.hide();
        if (results.status == "SUCCESS") {
          this.orgIPSearch("");
          this.SpinnerService.hide();
        } else {
          this.notify.error(results.message);
          this.SpinnerService.hide();
          return false;
        }
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
    );
  }

  array: number;
  list: string;
  IpList = [];
  addButton = false;
  addIP() {
    if (this.Org_IPForm.value.ip_arr == "") {
      this.notify.warning("Please Select the IP");
      return false;
    }
    let ipAddress = this.Org_IPForm.value.ip_arr;
    let data = {
      name: ipAddress,
    };
    this.IpList.push(data);
    // this.array = this.zoneNameList.length
    // this.list = this.array.toString();
    // if (this.Org_IPForm.value.ip_arr === this.list) {
    //   this.addButton = true;
    // }
    // if (this.Org_IPForm.value.count === "0") {
    //   this.addButton = true;
    // }
    console.log("iplist", this.IpList);
    this.ip_section.nativeElement.value = " ";
  }

  zoneNameDelete(index: number) {
    this.IpList.splice(index, 1);
    console.log("remove", this.IpList);
    // let count = this.Org_IPForm.value.count
    // this.array = this.zoneNameList.length
    // this.list = this.array.toString();
    // if (count === this.list) {
    //   this.addButton = true;
    //   if (count == "0") {
    //     this.addButton = false;
    //   }
    // }
    // else {
    //   this.addButton = false;
    // }
  }

  orgDetail_Id: number;
  orgDetail_name: string;
  orgDetail_code: string;
  orgIPView(type) {
    this.orgDetail_code = type.code;
    this.orgDetail_name = type.name;
    this.orgDetail_Id = type.id;
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isOrgIPView = true;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
    this.getParticularOrgdetailView();
  }

  backnavigate() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = true;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isOrgIPView = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }

  IPList: any;
  getParticularOrgdetailView() {
    this.attendanceService
      .getParticularOrgdetailView(this.orgDetail_Id)
      .subscribe((result) => {
        console.log("get org detail particular - view", result);
        this.IPList = result["data"];
        //  this.totaldays = result.total_days;

        //  this.leaveReqForm.patchValue({
        //   leave_type: result.leave_type.id,
        //   from_date: result.from_date,
        //   to_date: result.to_date,
        //   total_days: this.totaldays,
        //   reason:result.reason,
        // })
      });
  }

  // createItem(){

  // }

  // AddholidayForm(){

  //   const add = this.HolidayForm.get('arr') as FormArray;
  //   console.log("add controls ", add)

  //   add.push(this.createItem())

  // }

  //   public displayState(typ?:typelistss): string | undefined {
  //     return typ? typ.name : undefined
  //    }

  // deleteholidaydetail( index){
  //   const add = this.HolidayForm.get('arr') as FormArray;
  //   add.removeAt(index)
  // }

  getFormArray(): FormArray {
    return this.HolidayForm.get("arr") as FormArray;
  }

  TypeOfForm: any;
  addHoliday(FormName, data) {
    this.TypeOfForm = FormName;
    console.log(FormName);
    console.log("year data checjk", data);
    this.isHoliday = false;
    this.isHolidayCreate = true;
    if (data != "") {
      this.holiday_Id = data.id;
      this.HolidayForm.patchValue({
        year: data.year,
        state: data.state,
      });

      let year = data.year;
      let statedata = data.state.id;
      console.log(year, statedata);
      this.attendanceService
        .getdataBasedOnStateAndYear(year, statedata)
        .subscribe((results) => {
          let dataset = results["data"];
          // let obj = {
          //   name:
          // }
          for (let dataindividual of dataset) {
            let obj = this.fb.group({
              name: dataindividual?.holidayname,
              date: this.datePipe.transform(dataindividual?.date, "yyyy-MM-dd"),
              id: dataindividual?.id,
            });

            let control = this.HolidayForm.get("arr") as FormArray;
            control.push(obj);
          }
        });

      // let year = this.HolidayForm.value.year
      // let statedata = this.HolidayForm.value.state.id
      // this.attendanceService.getdataBasedOnStateAndYear( statedata, year)
      // .subscribe(results =>{
      //   let data = results['data']
      //   console.log("data based on year and state ", data)

      //    for (let datas of results.arr) {
      //  let name : FormControl = new FormControl('');
      //  let date: FormControl = new FormControl('');

      //  name.setValue( datas.name)

      //  this.getFormArray().push(new FormGroup({
      //   name: name,

      // }))

      // }
      // )
    } else {
      // this.HolidayForm.reset("")
      this.holiday_Id = "";
      this.HolidayForm = this.fb.group({
        year: [""],
        state: [""],
        arr: new FormArray([]),
      });
    }

    // const { name, date} = results ;
    // let startdates = this.datePipe.transform(date, 'yyyy-MM-dd');
    //      this.HolidayForm.patchValue({
    //   name, date:startdates
    //  })
    //  this.getholidaydetails( 1,1)
    //  for (let datas of results.arr) {
    //    let name : FormControl = new FormControl('');
    //    let date: FormControl = new FormControl('');

    //    name.setValue( datas.name)

    //    this.getFormArray().push(new FormGroup({
    //     name: name,

    //   }));

    //  }

    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMappingCreate = false;
    // this.holidaytypeList();
  }
  addLeave(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.leave_Id = data.id;
      this.LeaveForm.patchValue({
        name: data.name,
        has_attendance: data.has_attendance,
        has_salary: data.has_salary,
      });
      console.log(" Add leave", this.LeaveForm);
    } else {
      this.leave_Id = "";
      this.LeaveForm = this.fb.group({
        name: [""],
        has_attendance: [false],
        has_salary: [false],
      });
      console.log(" else Add leave", this.LeaveForm);
    }
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = true;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  addAttendance(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.attendance_Id = data.id;
      this.AttendanceForm.patchValue({
        check_in_mode: data.check_in_mode,
      });
    } else {
      this.attendance_Id = "";
      this.AttendanceForm = this.fb.group({
        check_in_mode: [""],
      });
    }
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = true;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMappingCreate = false;
  }
  addOrgDetails(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.orgdetails_Id = data.id;
      this.OrgDetailsForm.patchValue({
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        radius: data.radius,
      });
    } else {
      this.orgdetails_Id = "";
      this.OrgDetailsForm = this.fb.group({
        name: [""],
        latitude: [""],
        longitude: [""],
        radius: [""],
      });
    }
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = true;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  addOrgIP(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.orgip_Id = data.id;
      this.Org_IPForm.patchValue({
        org_detail_id: data.org_detail_id.id,
        ip: data.ip,
      });
    } else {
      this.orgip_Id = "";
      this.Org_IPForm = this.fb.group({
        org_detail_id: [""],
        ip_arr: [""],
      });
    }
    this.orgSearch("");
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = true;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }

  addGrade(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.grade_Id = data.id;
      this.GradeForm.patchValue({
        name: data.name,
        code: data.code,
        points: data.points,
      });
    } else {
      this.grade_Id = "";
      this.GradeForm = this.fb.group({
        name: [""],
        code: [""],
        points: [""],
      });
    }
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = true;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  leavemappingget(data) {
    this.attendanceService.getLeavedetails(data, 1).subscribe((results) => {
      this.LeaveMappingList = results["data"];
    });
  }

  grademappingget(data) {
    this.attendanceService.getGrade(data, 1).subscribe((results) => {
      this.GradeMappingList = results["data"];
    });
  }

  Addgradeleavemapping(FormName, data) {
    this.TypeOfForm = FormName;
    if (data != "") {
      this.gradeleave_Id = data.id;
      this.GradeLeaveForm.patchValue({
        name: data.codename,
      });
    } else {
      this.gradeleave_Id = "";
      this.GradeLeaveForm = this.fb.group({
        codename: [""],
        grade: [""],
        leave: [""],
        count: [""],
        effective_from: [""],
      });
    }
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = true;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }

  // AddShiftmappingCreate(FormName, data){

  //   this.TypeOfForm = FormName;
  //   if (data != "") {
  //     this.employee_id = data.id;
  //     this.ShiftMappingForm.patchValue({
  //       name: data.effective_from,

  //     });
  //   } else {
  //     this.employee_id = "";
  //     this.ShiftMappingForm = this.fb.group({
  //       shift:[""],
  //       effective_from:[""],
  //     });
  //   }
  //   this.isHoliday = false;
  //   this.isHolidayCreate = false;
  //   this.isHolidayUpdate = false;
  //   this.isLeaveType = false;
  //   this.isLeaveTypeCreate = false;
  //   this.isLeaveTypeUpdate = false;
  //   this.isattendanceType = false;
  //   this.isattendanceTypeCreate = false;
  //   this.isattendanceTypeUpdate = false;
  //   this.isOrgDetails = false;
  //   this.isOrgDetailsCreate = false;
  //   this.isOrgDetailsUpdate = false;
  //   this.isOrg_IP = false;
  //   this.isOrg_IPCreate = false;
  //   this.isOrg_IPUpdate = false;
  //   this.isGrade = false;
  //   this.isGradeCreate = false;
  //   this.isGradeLeaveMapping = false;
  //   this.isGradeLeaveCreate = false;
  //   this.isShiftMapping = false;
  //   this.isShiftMappingCreate = true;
  // }

  onHolidayCancelClick() {
    (this.HolidayForm.controls["arr"] as FormArray).clear();
    this.HolidayForm.reset();
    this.isHoliday = true;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }

  onleaveCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = true;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onattendanceCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = true;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onOrgDetailsCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = true;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onOrg_IPCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = true;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onGradeCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = true;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onGradeLeaveCancelClick() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = true;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = false;
    this.isShiftMappingCreate = false;
  }
  onShiftMappingCancel() {
    this.isHoliday = false;
    this.isHolidayCreate = false;
    this.isHolidayUpdate = false;
    this.isLeaveType = false;
    this.isLeaveTypeCreate = false;
    this.isLeaveTypeUpdate = false;
    this.isattendanceType = false;
    this.isattendanceTypeCreate = false;
    this.isattendanceTypeUpdate = false;
    this.isOrgDetails = false;
    this.isOrgDetailsCreate = false;
    this.isOrgDetailsUpdate = false;
    this.isOrg_IP = false;
    this.isOrg_IPCreate = false;
    this.isOrg_IPUpdate = false;
    this.isGrade = false;
    this.isGradeCreate = false;
    this.isGradeLeaveMapping = false;
    this.isGradeLeaveCreate = false;
    this.isShiftMapping = true;
    this.isShiftMappingCreate = false;
  }
}
