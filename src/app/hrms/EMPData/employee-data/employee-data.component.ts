import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles' 
import { AttendanceService } from '../../attendance.service';  
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import { MasterHrmsService } from '../../master-hrms.service';

@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss'],
  providers: [imp.HrmsAPI, imp.Master, imp.Userserv,
  { provide: imp.DateAdapter, useClass: imp.PickDateAdapter },
  { provide: imp.MAT_DATE_FORMATS, useValue: imp.PICK_FORMATS }]
})
export class EmployeeDataComponent implements OnInit {
  EmployeeDocuments: any;
  EmpId: any;
  imageUrls = imp.environment.apiURL;
  filesrc: string;

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService, 
     private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private masterApi: imp.Master, private userv: imp.Userserv,
    private hrmsService:MasterHrmsService
  ) { }

  isShowCalendar: boolean = false;

  EmpObjects = {
    employeeList: null, 
    employeeFirstLetter: null,
    ActivityStatus: null,
    TimeLogList: null,
    empId: null,
    pendingCounts: null   
  }  

  ngOnInit(): void {
    this.getEmployee()  
    this.getTimeLogList()  
    this.get_PendingCounts()
    this.getImages();
  }

  // getEmployee(){
  //   this.SpinnerService.show()
  //   const getDataid = localStorage.getItem("sessionData")
  //   let idValue = JSON.parse(getDataid);
  //   let id = idValue.employee_id;
  //   this.EmpObjects.empId = idValue.employee_id;
  //   this.apicall.ApiCall('get', this.userv.userserv.getemployee + id )
  //   .subscribe(res=>{
  //     this.SpinnerService.hide();
  //     console.log("employee data ", res)
  //     this.EmpObjects.employeeList = res 
  //     if(res?.id){ 
  //       this.gettingProfilename(res?.full_name) 
  //     }
  //   }, error=>{
  //     this.SpinnerService.hide()
  //   })
  // }
  getEmployee(){
    this.SpinnerService.show()
    const getDataid = localStorage.getItem("sessionData")
    let idValue = JSON.parse(getDataid);
    let id = idValue.employee_id;
    this.EmpId = id;
    this.EmpObjects.empId = idValue.employee_id;
    this.hrmsService.getEmpDetails( id )
    .subscribe(res=>{
      this.SpinnerService.hide();
      console.log("employee data ", res)
      this.EmpObjects.employeeList = res 
      if(res?.id){ 
        this.gettingProfilename(res?.full_name) 
      }
    }, error=>{
      this.SpinnerService.hide()
    })
  }

  gettingProfilename(data){
    let name:any = data 
    let letter = name[0]
    console.log(letter) 
    this.EmpObjects.employeeFirstLetter = letter 
  }
  
  callTaskSummary(){ 
    // this.router.navigate(['taskreport/tasksummary']).then(() => {
    //     setTimeout(() => {
          // this.router.navigate(['taskreport/mytask', 'fromEmpview']) ;
          this.router.navigate(['taskmanage/task_manage_summary']) ;
    //    }, 300);
    // });
  }
  callleavesummary(){  
          this.router.navigate(['hrms/hrmsview/leavesummary'], { queryParams: { datafrom: 'fromEmpview' } } ) ;
  }
  

  callemployeeInfo(){  
    // this.router.navigate(['hrms/employeeInfo', { queryParams: { q: searchTerm } }); 

    
    this.router.navigate(['hrms/employeeInfo'],{ queryParams: { id: this.EmpObjects.empId, datafrom: 'empview' } }) ; 
  }

  callemployeeView(){  
    // this.router.navigate(['hrms/employeeInfo', { queryParams: { q: searchTerm } }); 

       
this.router.navigate(['hrms/employeeInfoEditView'],{ queryParams: { id: this.EmpObjects.empId, datafrom: 'empview' } })
  }

  callEmployeeInfoRoutes(){  
    // this.router.navigate(['hrms/employeeInfo', { queryParams: { q: searchTerm } }); 

       
this.router.navigate(['hrms/employeeInfoRoutes'],{ queryParams: { id: this.EmpObjects.empId, datafrom: 'empview' } })
  }
  EmergencyInfo(){
    this.router.navigate(['hrms/hrmsview/Emergency'])
  }

  getdata(data){ 
    console.log("data from log component ???????????????????????????????????????????????????????????????????????????????????????????? ", data)
    this.EmpObjects.ActivityStatus = data 
  }

  getTimeLogList() {
    this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.day_log_summary)
      .subscribe(results => {
        let data = results['data']
        this.EmpObjects.TimeLogList = data
        this.EmpObjects.ActivityStatus = results["active_status"]
        console.log("activity this.activityStatusData.emit(this.AttendanceLogObjects.ActivityStatus) ")
       

      })
  }

    //////////////////////////////////   WIFI LOCATION 
    getWIFILocation(type): void {
      console.log("called")
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude; this.callApi(type, longitude, latitude);
        });
      } else {
        console.log("No support for geolocation")
      }
    }
    ///////////////////////////////  WIFI LOCATION API CALL 
  
    callApi(type, Longitude: number, Latitude: number) {
      let obj = {
        latitude: Longitude,
        longitude: Latitude
      }
      this.apicall.ApiCall('post', this.hrmsapi.HRMS_API.api.check_in + type, obj)
        .subscribe(results => {
          // console.log("res", results)
          if (results?.status == 'FAILED') {
            this.notify.warning(results?.message)
  
          }
          if (results?.status == 'SUCCESS' && type == 1) {
            this.notify.success('Checked In')
          }
          if (results?.status == 'SUCCESS' && type == 2) {
            this.notify.success('Checked Out')
          }
          this.getTimeLogList()
  
        })
  
  
    }


    get_PendingCounts(){
      this.apicall.ApiCall('get', this.hrmsapi.HRMS_API.api.PendingCountsTaskAndLeave)
      .subscribe(res=>{
        this.EmpObjects.pendingCounts = res
      })

    }
    ShowCalendar()
    {
        this.isShowCalendar = !this.isShowCalendar;
    }
    
  getImages()
  {
    this.hrmsService.getEmpDocuments(this.EmpId)
  .subscribe(results => {
    if(results.code)
    {
      this.notify.error(results.code);
    }
    else
    {
    this.EmployeeDocuments = results;
    const fileInfo = this.getImageFileInfo();
  

    if (fileInfo.file_id !=='') {
      
      const file_id = fileInfo.file_id;
      const file_name = fileInfo.file_name;
      let option = 'view'

      this.hrmsService.viewDocumentDetails(this.EmpId, file_id)
        .subscribe(
          results => {
            const getToken = localStorage.getItem("sessionData");
        let tokenValue = JSON.parse(getToken);
  
        let token = tokenValue.token;
      
      
          this.filesrc = this.imageUrls + 'docserv/doc_download/'+file_id+'?entity_id=1&user_id='+this.EmpId+ "&token=" + token;
          console.log("File Image", this.filesrc)
   
        
    })
    this.SpinnerService.hide();
  }
  else
  {
    return false;
  }
}
  });
  }
  
  getImageFileInfo(): { file_id: string, file_name: string } {
    const employeeImageType = this.EmployeeDocuments.data.find(doc => doc.type.name === 'Employee image');
    // this.EmployeeDocuments.data.find(document => document.type.name === 'pan card')



  

    if (employeeImageType && employeeImageType.file.length > 0) {
      const lastFileIndex = employeeImageType.file.length - 1;
      const lastImageFile = employeeImageType.file[lastFileIndex];
      return {
        file_id: lastImageFile.file_id,
        file_name: lastImageFile.file_name
      };
    }
    
    else {
  
      return { file_id: '', file_name: '' };
    }
  }

 




}
