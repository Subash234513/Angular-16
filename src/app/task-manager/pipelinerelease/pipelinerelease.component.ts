import { Component, OnInit,ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { ShareddataService } from '../shareddata.service';
import { NotificationService } from 'src/app/service/notification.service';
import { FormBuilder,FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface Status {
  name: string;
  id: number;
}
@Component({
  selector: 'app-pipelinerelease',
  templateUrl: './pipelinerelease.component.html',
  styleUrls: ['./pipelinerelease.component.scss']
})

export class PipelinereleaseComponent implements OnInit {
  @ViewChild('clientteamrole') matclienttAutocomplete: MatAutocomplete;

  
 Status_list = [
    {id: 1, name: 'Deployed'},
    {id: 2, name: 'Tested'},
    {id: 0, name: 'Hold'}
  ];
pipeList: any=[];
sprintpresentpage: number=1;
ReleaseSummary:boolean=true
ReleaseView:boolean=false
pagesizeStoryTask: number=10;
pipenewlist:any=[]
has_previousStoryTask: any;
has_nextStoryTask: any;
  presentpageStoryTask: any;
  releaseid: any;
  isShowPipelines: boolean;
  taskview: boolean;
  idArray: any=[];
  has_nextpipline: boolean=false;
  has_previouspipline: boolean=false;
  presentpipeline: number;
  piplinecurrentpage: number=1;
  piplinesearchform:FormGroup
  formgroup:FormGroup
  droplist: any;
  clientdrop: any;
  isLoading: boolean;
  status_id: any;
  type_id: any;
  historylist: any;
  type_ids: any;
  constructor( private fb: FormBuilder,private notification: NotificationService,private SpinnerService: NgxSpinnerService,private TaskManagerService: TaskManagerService, private errorHandler: ErrorHandlingServiceService, private localservice : ShareddataService) {}

  ngOnInit(): void {
    this.pipelineSummary("",1)
    this.piplinesearchform=this.fb.group({
      name:'',
      status:'',
      client:'',
    })
    this.formgroup=this.fb.group({
    
      status:'',
      
    })
  }
  previousPage(){
    this.sprintpresentpage=this.sprintpresentpage-1
    this.pipelineSummary("",this.sprintpresentpage)
  }
  nextPage(){
    this.sprintpresentpage=this.sprintpresentpage+1
    this.pipelineSummary("",this.sprintpresentpage)

  }
  
  public displayclientteam(clientteamrole?: clientlists): string | undefined {
    return clientteamrole ? clientteamrole.client_name : undefined;
  }
  public displayccclient(clt?: Client): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  pipelineSummary(obj,page) {
    this.SpinnerService.show();
    
    // let action  = this.pipelineSummaryForm.get('status').value;
    // let action = {}
    this.TaskManagerService.getreleaseSummary(page,obj)
      .subscribe(result => {
        
        console.log("story task summary", result)
        this.pipeList = result['data']
        
        let dataPagination = result['pagination'];
        if (this.pipeList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
          this.SpinnerService.hide();

        }
        this.SpinnerService.hide();
        
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
       
      }

      )
  }
  releaseview(data){
this.ReleaseSummary=false
this.ReleaseView=true
this.taskview=false
this.releaseid=data.id
this.newpipelineSummary({},1,this.releaseid)
  }
  story_TaskView(story_taskID) {
    this.localservice.taskid.next(story_taskID);
    this.taskview = true;
    this.ReleaseSummary=false
    this.ReleaseView=false
  }
  check(e,data){
    if(data.ischecked){
      this.idArray.push(data.id)
  
    }
    else{
      this.idArray = this.idArray.filter(item => item !== data.id);
  
    }
  }
  newpipelineSummary(obj,page,id) {
    this.SpinnerService.show();
    
    // let action  = this.pipelineSummaryForm.get('status').value;
    // let action = {}
    this.TaskManagerService.particularreleaseSummary(page,obj,id)
      .subscribe(result => {
        
        console.log("story task summary", result)
        this.pipenewlist = result['data']
        let dataPagination = result['pagination'];
        // this.pipelinePopups()
        if (this.pipenewlist.length > 0) {
          for(let list of this.pipeList){
            list["ischecked"]=false
            for(let array of this.idArray){
              if(list.id==array){
                list["ischecked"]=true
              }

            }
            
          }
          this.has_nextpipline = dataPagination.has_next;
          this.has_previouspipline= dataPagination.has_previous;
          this.presentpipeline = dataPagination.index;
          this.SpinnerService.hide();

        }
        this.SpinnerService.hide();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
       
      }

      )
  }
  getDropDown() {
    this.TaskManagerService.getStatus().subscribe(res=>{
      this.droplist = res
    })
  }
  getClientdrop() {
    this.TaskManagerService.getClient('').subscribe(res=>{
      this.clientdrop = res['data']
    })
  }
  clientclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.piplinesearchform.get('client').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')
  
        }),
        switchMap(value => this.TaskManagerService.getClient(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientdrop = datas;
  
  
  
  
      })
  
  
  
  
  }
  
  
  newpreviousPage(){
    this.piplinecurrentpage= this.piplinecurrentpage-1
    this.newpipelineSummary({}, this.piplinecurrentpage,this.releaseid)
  }
  newnextPage(){
    this.piplinecurrentpage= this.piplinecurrentpage+1
    this.newpipelineSummary({}, this.piplinecurrentpage,this.releaseid)
  }
  removepipeline(){
    let data={
      "task_arr":this.idArray,
      "action":"remove"
    }
    this.SpinnerService.show()
    this.TaskManagerService.removerelease(data,this.releaseid)
    .subscribe(result => {
      if(result.status){
        this.notification.showSuccess(result.message)
        this.idArray=[]
        this.newpipelineSummary({},1,this.releaseid)
        this.SpinnerService.hide()
  
      }
      else{
        this.notification.showError(result.description)
        this.SpinnerService.hide()
  
      }
    })
  }
  backtoTaskSummary(){
    this.ReleaseView=false
    this.ReleaseSummary=true
    this.taskview=false
    this.pipelineSummary("",1)
  }

  backtoview(){
    this.taskview=false
    this.ReleaseView=true
    this.ReleaseSummary=false
  }
  pipsearch(){
    let params=''
    let value=this.piplinesearchform.get('name').value
    value?params+='&query='+value:''
    // status:'',
    //   client:'',
    let status=this.piplinesearchform.get('status').value
    status?params+='&status='+status:''
    let client=this.piplinesearchform.get('client').value
    client?params+='&client='+client.id:''
    
    this.sprintpresentpage=1
    this.pipelineSummary(params,this.sprintpresentpage)
  }
  resetpipes(){
    this.piplinesearchform.reset()
    this.sprintpresentpage=1
    this.pipelineSummary('',this.sprintpresentpage)

  }
  closepopup(){
    this.formgroup.reset()
  }
  iconClicked(type,status_id){
    this.type_ids=type.id
    console.log("sbsabfbasv=",this.type_ids,status_id)

    if(status_id === 1 || status_id === 2  ){
      var answer = window.confirm("confirm?");
    }
    if(answer){
      this.SpinnerService.show()
      this.TaskManagerService.releaspush(this.type_ids,status_id)
      .subscribe(result => {
        if(result.code){
          this.notification.showError(result.description)
          this.formgroup.reset()
        }
        else{
          this.notification.showSuccess(result.message)
          this.sprintpresentpage=1
          this.pipelineSummary("",this.sprintpresentpage)
          this.formgroup.reset()
  
  
        }
        this.SpinnerService.hide()
  
      })
    }
    if(status_id === 0){
      this.SpinnerService.show()
      this.TaskManagerService.releaspush(this.type_ids,status_id)
      .subscribe(result => {
        if(result.code){
          this.notification.showError(result.description)
          this.formgroup.reset()
        }
        else{
          this.notification.showSuccess(result.message)
          this.sprintpresentpage=1
          this.pipelineSummary("",this.sprintpresentpage)
          this.formgroup.reset()
  
  
        }
        this.SpinnerService.hide()
  
      })
    }
    
  
  }
  gettype_id(data){
    this.type_id=data.id

  }
  Statusdata(data){
this.status_id=data.id
  }
  historypopup(){
    console.log("history_id=",this.releaseid)
     this.TaskManagerService.pipelinehistory(this.releaseid)
      .subscribe(result => {
        
       
        this.historylist = result['data']
      })
  }
  getTooltipText(id: number): string {
    switch (id) {
      case 1:
        return "Deployed";
      case 2:
        return "Tested";
      case 0:
        return "Hold";
      default:
        return ""; // Handle other cases as needed
    }
  }
  getIconClass(id: number): string {
    switch (id) {
      case 1:
        return "fa-solid fa-arrow-up-from-bracket";
      case 2:
        return "fa-regular fa-thumbs-up";
      case 0:
        return "fa-regular fa-hand";
      default:
        return ""; // Handle other cases as needed
    }
  }
}

export interface clientlists{
  id:string;
  client_code:string;
  client_name:string;
}
export interface Client {
  id: string;
  name: string;
}

