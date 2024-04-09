import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from '../notification.service';
import { TaskService } from '../task.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

export interface iteamList{
  name:string;
  id:number;
}
export interface iEmpList{
  name:string;
  id:number;
}
interface TeamObject {
  ref_type: number;
  ref_id: number;
}
@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  searchForm: FormGroup;
  send_value: string;

  constructor(
    private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog
  ) { }
  @ViewChild('teamInput') teamInput: any;
  @ViewChild('empInput') empInput: any;
  projectSummary:boolean =true
  projectcreation:boolean
  clientviewsummary:boolean
  teammembersadd:boolean
  clientcreation:boolean
  clientSummary:boolean
  modulecreation:boolean
  moduleSummary:boolean
  mappingcreation:boolean
  teamSummary:boolean
  teamcreation:boolean
  teamdetailscreation:boolean
  showmember:boolean
  showcheckbox:boolean
  mappingSummary:boolean
  pipelineSummary: boolean;
  pipelinecreation: boolean;
  TypeOfForm:string;
  project_ids: any;
  clientdetails: any;
  projectteamlist: any;
  projectteamid: any;
  projectempid: any;
  ID_Value_To_projectEdit: any = ''
  projectForm:FormGroup;
  projectteam:FormGroup;
  presentpageproject: number = 1;
  presentpageprojectd:number=1;
  projectList:any;
  has_nextproject = true;
  has_previousproject = true;
  has_next_projectd=true
  has_previous_projectd=true;
  isLoading = false;
  projectteamidlist:any=[]
  projectemplist:any=[]
  newArr:any=[]
  public chipselecteam: iteamList[] = [];
  public chipselectemp:iEmpList[]=[]
  public clientteamlist:iteamList[];
  public clientemplist:iEmpList[]
  public chipSelectedteamid = [];
  public chipSelectedempid=[];
  public clientteamControl = new FormControl();
  public clientempControl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  pagesizeproject=10;
  pagesizeprojectd=10;

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: [''],
      start_date:[''],
      end_date:[''],
    })
    this.searchForm = this.fb.group({
      name: [''],
     
    })
    this.projectteam = this.fb.group({
      clientteamControl: [''],
     // code: [''],
     clientempControl: [''],
    })
    this.get_projectSummary(1)
    if (this.clientteamControl !== null) {
      this.clientteamControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taskservice.get_project_team(value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.clientteamlist = datas;
          // console.log("alllemployeeeisttt", datas)

        })

    }
    if (this.clientempControl !== null) {
      this.clientempControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taskservice.get_project_employee(value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.clientemplist = datas;
          // console.log("alllemployeeeisttt", datas)

        })

    }
  }
  oncancelProject(){
    this.clientcreation = false;
    this.clientSummary = false;
    this.projectcreation = false;
    this.projectSummary = true;
    this.modulecreation = false;
    this.moduleSummary = false;
    this.mappingcreation = false;
    this.mappingSummary = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
  }
 
  addProject(formtype,data){
    this.TypeOfForm = formtype;
    this.projectcreation = true;
    this.projectSummary = false;
    if (data != '') {
      this.ID_Value_To_projectEdit = data.id
      const startdate = this.datePipe.transform(data.start_date, 'yyyy-MM-dd');
      const enddate = this.datePipe.transform(data.end_date, 'yyyy-MM-dd');
      this.projectForm.patchValue({
        name: data.name,
        start_date:startdate,
        end_date:enddate,
      })
    }
    else {
      this.projectForm.reset('')
    }
  }
  projectActiveInactive(status, data) {
    let projectID = data?.id
    this.taskservice.projectActiveInactive(projectID,status)
      .subscribe(results => {
        console.log("results", results)
        this.notification.showSuccess(results.message)
        this.projectSearch('') 
      })
  }
  projectSearch(hint: any) {
   
    if (hint == 'next') {
      this.get_projectSummary(this.presentpageproject + 1)
    }
    else if (hint == 'previous') {
      this.get_projectSummary(this.presentpageproject - 1)
    }
    else {
      this.get_projectSummary(1)
      this.presentpageproject=1
    }

  }
  get_projectSummary(pageno) {
    this.taskservice.projectSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.projectList = result['data']
        let dataPagination = result['pagination'];
        if (this.projectList.length > 0) {
          this.has_nextproject = dataPagination.has_next;
          this.has_previousproject = dataPagination.has_previous;
          this.presentpageproject = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  clientvisiable(cliet_info){
    this.project_ids =cliet_info.id
    this.clientdetails=cliet_info
    this.projectsummaryemp(this.project_ids)
   
    this.projectSummary=false
    this.clientviewsummary=false
    this.teammembersadd=true;
  
  }
  projectsummaryemp(project_id){
    this.taskservice.get_project_summary(project_id).subscribe(result=>{
      this.SpinnerService.hide();
      this.projectteamlist = result['data'];
      let dataPagination = result['pagination'];
      if (this.projectteamlist.length > 0) {
        this.has_next_projectd = dataPagination.has_next;
        this.has_previous_projectd = dataPagination.has_previous;
        this.presentpageprojectd = dataPagination.index;
      }
    })
  }
  set_masterStartDate:any;
  MasterStartDate(event: string) {
    const date = new Date(event)
    this.set_masterStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  projectSubmit(){
    this.SpinnerService.show();
    if (this.projectForm.value.name === ""||this.projectForm.value.name === null||this.projectForm.value.name === undefined) {
      this.toastr.error('Please Enter Project');
      this.SpinnerService.hide();
      return false;
    }
    if (this.projectForm.value.start_date === ""||this.projectForm.value.start_date === null||this.projectForm.value.start_date ===undefined) {
      this.toastr.error('Please Select Start Date');
      this.SpinnerService.hide();
      return false;
    }
    if (this.projectForm.value.end_date === ""||this.projectForm.value.end_date ===null||this.projectForm.value.end_date ===undefined) {
      this.toastr.error('Please Select End Date');
      this.SpinnerService.hide();
      return false;
    }
    let dateValue = this.projectForm.value;
    dateValue.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
    dateValue.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');

    let data = this.projectForm.value
    let dataToSubmit;
    if (this.ID_Value_To_projectEdit != '') {
      let id = this.ID_Value_To_projectEdit
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }
    this.taskservice.projectForm(dataToSubmit)
    .subscribe(res => {
      console.log("project click", res)
      if(res.status == 'success'){
        if (this.ID_Value_To_projectEdit != '') {
          this.notification.showSuccess(res.message)
          this.ID_Value_To_projectEdit = ''
        } else {
          this.notification.showSuccess(res.message)
          this.ID_Value_To_projectEdit = ''
        }
        this.projectForm = this.fb.group({
          name: [''],
          start_date:[''],
          end_date:[''],
        })
        this.projectSummary = true;
        this.projectcreation = false;
        this.projectSearch('');
        this.SpinnerService.hide();
       } else {
        this.notification.showError(res.description)
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }
  clientbacksummary(){
    this.projectSummary = true;
    this.clientviewsummary=true
    
    this.teammembersadd = false;
  }
  closememadd(){
    this.chipselecteam=[]
    this.chipselectemp=[]
    this.projectteamidlist=[]
  this.projectemplist=[]
  }
  public clientteamremove(team: iteamList): void {
    const index = this.chipselecteam.indexOf(team);
  
    if (index >= 0) {
     
      this.chipselecteam.splice(index, 1);
      this.chipSelectedteamid.splice(index, 1);

      const indexToRemove = this.projectteamidlist.findIndex(item => item.ref_id === team.id);

      if (indexToRemove === -1) {
     
        this.projectteamidlist.push(team.id);
      } else {
        
        this.projectteamidlist.splice(indexToRemove, 1);
      }

      this.teamInput.nativeElement.value = '';
  
    } 
  }
  public teamSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectteamByName(event.option.value.name);
    this.teamInput.nativeElement.value ='';
  }
  private selectteamByName(teamName) {
    let foundteam1 = this.chipselecteam.filter(team => team.name == teamName);
    if (foundteam1.length) {
      return;
    }
    let foundteam = this.clientteamlist.filter(team => team.name == teamName);
    if (foundteam.length) {
      this.chipselecteam.push(foundteam[0]);
      this.chipSelectedteamid.push(foundteam[0].id)
      //this.memberIdValue = this.chipSelectedmemberid;
    }
  }
  teamarrayvalue(team_id){
    
    this.projectteamid=team_id.id;
    const team_data: TeamObject = {
      ref_type: 2,
      ref_id: this.projectteamid,
    };
    if (!this.projectteamidlist.some(item => item.ref_id === team_id.id)) {
      
      this.projectteamidlist.push(team_data);
    }
    
      }
      public clientempremove(emp: iEmpList): void {
        const index = this.chipselectemp.indexOf(emp);
      
        if (index >= 0) {
         
          this.chipselectemp.splice(index, 1);
          this.chipSelectedempid.splice(index, 1);
    
          const indexToRemove = this.projectemplist.findIndex(item => item.ref_id === emp.id);
    
          if (indexToRemove === -1) {
            
            this.projectemplist.push(emp.id);
          } else {
           
            this.projectemplist.splice(indexToRemove, 1);
          }
    
    
          this.empInput.nativeElement.value = '';
      
        } 
      }
      public empSelected(event: MatAutocompleteSelectedEvent): void {
        this.selectempByName(event.option.value.name);
        this.empInput.nativeElement.value ='';
      }
      private selectempByName(empName) {
        let foundemp1 = this.chipselectemp.filter(emp => emp.name == empName);
        if (foundemp1.length) {
          return;
        }
        let foundemp = this.clientemplist.filter(emp => emp.name == empName);
        if (foundemp.length) {
          this.chipselectemp.push(foundemp[0]);
          this.chipSelectedempid.push(foundemp[0].id)
          //this.memberIdValue = this.chipSelectedmemberid;
        }
      }
      emparrayvalue(employeee_id){
        this.projectempid=employeee_id.id;
        const emp_data: TeamObject = {
          ref_type: 1,
          ref_id: this.projectempid,
        };
        if (!this.projectemplist.some(item => item.ref_id === employeee_id.id)) {
          
          this.projectemplist.push(emp_data);
        }
        
    
      }
      removeprojectmem(){
        this.chipselecteam=[]
        this.chipselectemp=[]
        this.projectteamidlist=[]
      this.projectemplist=[]
      }
      submittedprojectmem(){
        this.SpinnerService.show();
        this.newArr=this.projectteamidlist.concat(this.projectemplist)
        //console.log(this.newArr);
        if(this.newArr.length==0){
          this.notification.showError("Please choose Team / Employee")
        }
        this.taskservice.projectteamsubmit(this.project_ids,this.newArr).subscribe(result => {
          
    if(this.newArr.length==0){
      this.notification.showError(result.description)
    }
      else{
        this.notification.showSuccess(result.message)
        
        this.teamSummary = false;
        this.teamcreation = false;
        this.showmember = false;
        this.chipselecteam=[]
      this.chipselectemp=[]
      this.projectteamidlist=[]
      this.projectemplist=[]
     this. projectsummaryemp(this.project_ids)
     this.SpinnerService.hide();
      }    
      })
      }
      projectsearchemp(hint: any) {
        if (hint == 'next'){
          this.projectsummaryemp(this.presentpageprojectd + 1)
        }
        else if (hint == 'previous') {
          this.projectsummaryemp(this.presentpageprojectd - 1)
        }
        else {
          this.projectsummaryemp(1)
        }
      }
      clearForm() {
        this.searchForm.reset();
        
        this.get_projectSummary(1)
      }
      
      searchform(){
        let formValue = this.searchForm.value
        this.send_value = ""
        if (formValue.name) {
      this.send_value=  this.send_value + '&query=' + formValue.name
        }
        let page = 1;
        this.taskservice.get_project_search(page,this.send_value).subscribe(result => {
          this.projectList = result['data'];
    
    
        })
        
      }
}
