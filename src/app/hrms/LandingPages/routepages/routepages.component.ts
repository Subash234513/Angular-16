import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routepages',
  templateUrl: './routepages.component.html',
  styleUrls: ['./routepages.component.scss']
})
export class RoutepagesComponent implements OnInit {

  constructor( private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
   private attendanceService: AttendanceService, private shareService: imp.SharedService,
   private activatedroute: ActivatedRoute ) { }

   LandingPageObjects = {
    Menu_List: null, 
  }

  ngOnInit(): void {
    console.log("called landing page ")
    this.LandingPageObjects.Menu_List = null;
    // this.activatedroute.queryParams.subscribe(params =>{
    //   // console.log("routing parameters => ", params, params['arrayParam'])
    //   let encodedata = atob(params['arrayParam'])
    //   // console.log("routing parameters => ", params )  

    //   this.LendingPageObjects.Menu_List = JSON.parse(encodedata)


    //   console.log("this.LendingPageObjects.Menu_List", this.LendingPageObjects.Menu_List)
    // })
    let menuData = localStorage.getItem('menu') 
    let submodulesData = JSON.parse(menuData) 
    console.log("submodulesData list", submodulesData) 
    this.LandingPageObjects.Menu_List = submodulesData?.submodule

  }

 

  subModuleData(data){
    console.log("data", data)
    // localStorage.setItem("submenus", JSON.stringify(data))
    this.router.navigate([data?.url])
  }
 

  // navLinks = [
  //   {
  //     label: 'First',
  //     link: 'hrms/landingPage/leavebalancecounts',
  //     index: 0,
  //   },
  //   {
  //     label: 'Second',
  //     link: 'hrms/landingPage/empsummary',
  //     index: 1,
  //   }
  // ];


















}
