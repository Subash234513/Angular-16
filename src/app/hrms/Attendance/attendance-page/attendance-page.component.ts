import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';
 


export interface Emplistss {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrls: ['./attendance-page.component.scss'],
  providers: []
})
export class AttendancePageComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
   private attendanceService: AttendanceService, private shareService: imp.SharedService,
    ) { }


  AttendanceObjects = {
    attendance_Menu_List: [],
    menuName: null  
  }

  Objs={
    'Attendance Log':false,
    'Attendance Report':false,
    'Track Employee':false,
    'Attendance Full Report': false,
    'FET View':false

  }


  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Attendance") {
        this.AttendanceObjects.attendance_Menu_List = subModule;
      }

    },
    this.subModuleData({
      name : "Attendance Log"
    }))
    
    // this.AttendanceObjects.attendance_Menu_List.push(
    //   {
    //     "id": 195,
    //     "logo": null,
    //     "name": "FET View",
    //     "role": [
    //         {
    //             "code": "r1",
    //             "id": 1,
    //             "name": "Maker"
    //         }
    //     ],
    //     "type": "transaction",
    //     "url": "/fetview"
    // }
    // )
  }


  subModuleData(data) { 
    let objs = this.Objs
    this.AttendanceObjects.menuName = data?.name
    console.log("objs",objs, data)
      for (let i in objs) {  
        if (!(i == data?.name)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        }  
    }
  }

  























}
