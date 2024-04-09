import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles';
import { AttendanceService } from '../../attendance.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service'

@Component({
  selector: 'app-recruitment-base-page',
  templateUrl: './recruitment-base-page.component.html',
  styleUrls: ['./recruitment-base-page.component.scss'],
  providers:[imp.HrmsAPI]
})
export class RecruitmentBasePageComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private attendanceService: AttendanceService, private shareService: imp.SharedService,
    private hrmsapi: imp.HrmsAPI, private APiserv: ApicallserviceService
  ) { } 

  Objs: any = {
    'Post Job': false 
  }

  public RecruitmentObjects = Object.create({})  

  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      console.log("submodule", subModule)
      if (element.name === "Recruitment") {
        this.RecruitmentObjects.recruitment_Menu_List = subModule;
      }
    })

    console.log("this.RecruitmentObjects.recruitment_Menu_List", this.RecruitmentObjects.recruitment_Menu_List)
  }


  subModuleData(data) { 
    let objs = this.Objs
      console.log("objs",objs)
      for (let i in objs) {  
        if (!(i == data?.name)) {
          objs[i] = false;
        } else {
          objs[i] = true;
        }  
    }
  }

}
