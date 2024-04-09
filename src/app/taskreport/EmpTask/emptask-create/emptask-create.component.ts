import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApicallserviceService } from '../../../AppAutoEngine/API Services/Api_and_Query/apicallservice.service';


@Component({
  selector: 'app-emptask-create',
  templateUrl: './emptask-create.component.html',
  styleUrls: ['./emptask-create.component.scss'],
  providers: [imp.TaskApi]
})
export class EMPTaskCreateComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private shareService: imp.SharedService, private hrmsapi: imp.HrmsAPI,
    private apicall: ApicallserviceService, private taskapi: imp.TaskApi
  ) { }
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();

  EmpTaskCreate: FormGroup


  EmpTaskCreateObj = {
    QuickAccessList: [],
    selectedNav: '',
    clientList: [],
    projectList: [],
    moduleList: [],
    createArray: [],
    from_date: '',
    to_date: '',
    task: '',
    type: '',
    devtypelist: [],
    statusListData: '',
    toSelectDropDown: null, 
    submitValidation: false 
  }


  ngOnInit(): void {
    this.EmpTaskCreate = this.fb.group({
      client: '',
      project: '', 
      project_map_id: '',
      // task: '',
      // dev_type: '',

      data: new FormArray([
         
      ])
    })


    this.getlatestTasks() 
    this.getdevtype() 
  }



  getlatestTasks() {
    this.apicall.ApiCall("get", this.taskapi.tasksApi.api.QuickAccessProjects)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.EmpTaskCreateObj.QuickAccessList = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  SelectedLink(data) {
    this.EmpTaskCreateObj.selectedNav = data?.id
    console.log(data, this.EmpTaskCreateObj.selectedNav)
    let moduledata = {
      name: data?.module?.name,
      id: data?.id 
    }
    this.EmpTaskCreate.patchValue({
      client: data.client,
      project: data?.project,
      project_map_id: moduledata  }) 
  }

  // data?.client?.name}} >> {{data?.module?.name}} >> {{data?.project?.name}} 


  clearTags() {
    this.EmpTaskCreateObj.selectedNav = '';

  }



  clientsearch(Typedata) {

    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.clientsearch +
      this.taskapi.tasksApi.queries.query + Typedata + '&' +
      this.taskapi.tasksApi.queries.status + 2)

      .subscribe(results => {
        this.EmpTaskCreateObj.clientList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  displayFnclt(clt?: interfacedatas): string | undefined {
    return clt ? clt.name : undefined;
  }


  Projectsearch(clientdata, Typedata) {
    if(clientdata?.id == undefined){
      return false 
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch+'/'+clientdata?.id+'?'+ this.taskapi.tasksApi.queries.query + Typedata +
     '&' + this.taskapi.tasksApi.queries.status + 2) 
      .subscribe(results => {
        this.EmpTaskCreateObj.projectList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnappnm(appnm?: interfacedatas): string | undefined {
    return appnm ? appnm.name : undefined;
  }




  getModule(clientdata, projectdata, Typedata) {
    if(clientdata?.id == undefined || projectdata?.id == undefined){
      return false 
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.moduleSearch+projectdata?.id +'?'+ 'client_id='+clientdata?.id +'&' +  this.taskapi.tasksApi.queries.query +
     Typedata + '&' + this.taskapi.tasksApi.queries.status + 2 )
      .subscribe(results => {
        this.EmpTaskCreateObj.moduleList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  displayFnmodnm(mod?: interfacedatas): string | undefined {
    return mod ? mod.name : undefined;
  }


  getdevtype() {
    this.SpinnerService.show()
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.devTypeDD)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide() 
        let datas = results["data"];
        this.EmpTaskCreateObj.devtypelist = datas;
        if(this.EmpTaskCreateObj.devtypelist?.length > 0){
          // this.EmpTaskCreateObj.statusListData = this.EmpTaskCreateObj.devtypelist[0]?.id  
          this.EmpTaskCreateObj.toSelectDropDown = this.EmpTaskCreateObj.devtypelist?.find(c => c.id == 1);
          console.log("---------> data for dropdown", this.EmpTaskCreateObj.toSelectDropDown, this.EmpTaskCreateObj.devtypelist)
        }
        
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  get dataForTask(): FormGroup {
    let FormGroupArray = this.fb.group({
      start_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 
      end_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'), 
      dev_type_name: this.EmpTaskCreateObj?.toSelectDropDown,
      dev_type: this.EmpTaskCreateObj?.toSelectDropDown?.id,
      task: ''
    })
    return FormGroupArray
  }

  AddTask(){
    let control = this.EmpTaskCreate.get("data") as FormArray;
    control.push(this.dataForTask)
  }
  deleteTask(index){ 
    let control = this.EmpTaskCreate.get("data") as FormArray;
    control.removeAt(index) 
  }

  ChangeDateFormat(index, key, date){
    this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(this.datePipe.transform(date, 'yyyy-MM-dd'))
  }

  getdevTypeId(index, data, key){
    console.log(index, data, key) 
    this.EmpTaskCreate.get('data')['controls'][index].get(key).setValue(data?.id)
  }

  SubmitTask(){
    let data = this.EmpTaskCreate.value
    if(data?.project_map_id?.id == null || data?.project_map_id?.id == '' ||data?.project_map_id?.id == undefined){
      this.notify.warning("Project Not Selected")
      return false; 
    }
    if(data?.data?.length == 0){
      this.notify.warning("Please Fill Atleast One Task")
      return false; 
    }
    let obj = {
      project_map_id: data?.project_map_id?.mapping_id ? data?.project_map_id?.mapping_id : data?.project_map_id?.id , 
      data: data?.data 
    }
    this.EmpTaskCreateObj.submitValidation = true 
    this.SpinnerService.show()
    this.apicall.ApiCall("post", this.taskapi.tasksApi.api.CreateIndividualTask, obj)
    .subscribe(results=>{
    this.SpinnerService.hide()
      this.notify.success("Task Created")
      this.OnSubmit.emit() 
      return true 
    }, error =>{
    this.SpinnerService.hide()
      this.EmpTaskCreateObj.submitValidation = false 
    }) 

  }

  BackToSummary(){
    this.OnCancel.emit()

  }


  resetProjectAndModule(){
    this.EmpTaskCreate.controls['project'].reset()
    this.EmpTaskCreate.controls['project_map_id'].reset()
  }
  resetModule(){
    this.EmpTaskCreate.controls['project_map_id'].reset()
  }




}



export interface interfacedatas {
  id: string;
  name: string;
}