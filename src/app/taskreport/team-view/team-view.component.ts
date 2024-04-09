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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface inchargemaster {
  id:number;
  name:string;aa
}
export interface imemberList {
  name: string;
  id: number;
}
@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {

  @ViewChild('memberInput') memberInput: any;
  
  pagesizemember =10;
  teamdetailscreation:boolean
  teamcreation:boolean
  showmember:boolean
  teamSummary:boolean=true
  clientcreation:boolean
  clientSummary:boolean
  projectcreation:boolean
  projectSummary:boolean
  modulecreation:boolean
  moduleSummary:boolean
  mappingSummary:boolean
  mappingcreation:boolean
  showcheckbox:boolean
  pipelineSummary:boolean
  pipelinecreation:boolean
  teamform:FormGroup;
  teamsform:FormGroup;
  send_value: String = "";
  teamlist:any;
  ToList: any;
  has_nextteam:boolean = true;
  has_previousteam:boolean = true;
  presentpageteam: number = 1;
  pagesizeteam =10;
  presentpagemember: number = 1;
  teammember: any;
  teamidssss: any;
  teammember_id: any;
  particularview: any[]=[];
  emparray:any=[];
  public chipselectemember: imemberList[] = [];
  public allmemberslist: imemberList[];
  public chipSelectedmemberid = [];
  memberlist:any;
  isLoading = false;
  has_next_drop:boolean=true;
  has_previous_drop:boolean=true;
  currentpage: number = 1;
  public memberControl = new FormControl();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  team_ids: any;

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.teamform = this.fb.group({
      name: [''],
     // code: [''],
      incharge: [''],
    })
    this.teamsform = this.fb.group({
      team_id: [''],
      employee_arr: ['']
    })
    if (this.memberControl !== null) {
      this.memberControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.taskservice.get_memberList(value)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.allmemberslist = datas;
          // console.log("alllemployeeeisttt", datas)

        })

    }
    this.get_teamSummary(1)
  }
  oncancelteam(){
    this.clientcreation = false;
    this.clientSummary = false;
    this.projectcreation = false;
    this.projectSummary = false;
    this.modulecreation = false;
    this.moduleSummary = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.mappingSummary = false;
    this.teamSummary = true;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamform.reset();
  }

  searchform(){
    let formValue = this.teamform.value
    console.log("Search Values", formValue)
    this.send_value = ""
    if (formValue.name) {
  this.send_value=  this.send_value + '&query=' + formValue.name
    }
    let page = 1;
    this.taskservice.searchteamcategory(this.send_value, page).subscribe(result => {
      this.teamlist = result['data'];


    })
    
  }
  clearForm() {
    this.teamform.reset();
    this.teamlist=[]
    this.get_teamSummary(1)
  }
  get_teamSummary(pageno){
    this.taskservice.teamSummary_master(pageno).subscribe(
      result => {
        this.SpinnerService.hide();
        this.teamlist = result['data'];
        let dataPagination = result['pagination'];
        if (this.teamlist.length > 0) {
          this.has_nextteam = dataPagination.has_next;
          this.has_previousteam = dataPagination.has_previous;
          this.presentpageteam = dataPagination.index;
        }
    })
  }
  TypeOfForm:string;
  ID_Value_To_teamEdit: any = ''
  addteam(formtype,data){
    this.TypeOfForm = formtype;
    this.teamcreation = true;
    this.teamSummary = false;
    if (data != '') {
      this.ID_Value_To_teamEdit = data.id
      this.teamform.patchValue({
        name: data.name
      })
    }
    else {
      this.teamform.reset('')
    }
}
visiable(team_info){
  this.team_ids=team_info.id
  let team_id = team_info.id
  this.teammember = team_info
  this.teamidssss=team_id
  this.get_particularsummary_team(team_id)
  this.get_teammembersummary(team_id)
  this.teamSummary = false;
  this.teamdetailscreation = true;
  this.showmember = true;
  this.teamsform.get("team_id").setValue(team_id)
 // this.memebersearch('')
}
data:any;
get_particularsummary_team(team_id) {
  this.taskservice.particularsummary_team(team_id)
  .subscribe(result =>{
    console.log('resultsss',result);
    this.data = result
    this.teammember_id=result.id
    console.log(team_id)
    this.particularview = result['data']
 

    // this.particularview.push(result.data)

    console.log('',this.particularview)

  })
}
get_teammembersummary(team_id){
  this.taskservice.teammembersummary_member(team_id).subscribe(result =>{
    this.SpinnerService.hide();
    this.memberlist = result['data']
    let dataPagination = result['pagination'];
    // if (this.teamlist.length > 0) {
    //   this.has_nextmember = dataPagination.has_next;
    //   this.has_previousmember = dataPagination.has_previous;
    //   this.presentpagemember = dataPagination.index;
         
    //  }
    })
  
}
teamSearch(hint: any) {
  if (hint == 'next'){
    this.get_teamSummary(this.presentpageteam + 1)
  }
  else if (hint == 'previous') {
    this.get_teamSummary(this.presentpageteam - 1)
  }
  else {
    this.get_teamSummary(1)
    this.presentpageteam = 1;
  }
}
inchargedropdown(){
  this.teamform.get('incharge').valueChanges
  .pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap(value => this.taskservice.dropdownincharge_team(value,1)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
    )
  )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.ToList = datas;
    let inchargeTolist=datas.id
//this.teamform.get("incharge").setValue(inchargeTolist)

    let datapagination = results["pagination"];
    if (this.ToList.length >= 0) {
      this.has_next_drop = datapagination.has_next;
      this.has_previous_drop = datapagination.has_previous;
      this.currentpage = datapagination.index;
    }
  })
}
InchargeDropdown(name){
  this.taskservice.dropdownincharge_team(name,1).subscribe(data=>{
    this.ToList=data['data']
  })
}
teamsubmit() {
  this.SpinnerService.show();
    if (this.teamform.value.name === ""||this.teamform.value.name === null||this.teamform.value.name === undefined) {
      this.toastr.error('Please Enter Team Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.teamform.value.incharge === ""||this.teamform.value.incharge === null||this.teamform.value.incharge === undefined) {
      this.toastr.error('Please choose Incharge');
      this.SpinnerService.hide();
      return false;
    }

  let data={
    "name":this.teamform.get("name").value,
    "incharge":this.teamform.get("incharge").value.id
  }
  
  this.taskservice.addteamform(data).subscribe(result => {
    

      this.notification.showSuccess(result.message)
    
      this.teamSummary = true;
      this.teamcreation = false;
      
      this.teamform.reset()
      this.get_teamSummary(1)
      this.SpinnerService.hide();
  }
  )

}
backsummary(){
  this.teamSummary = true;
  this.teamdetailscreation = false;
  this.showmember = false;
}
closeteammember(){
  this.chipselectemember=[]
  this.emparray=[]
  let teams_id=this.teamsform.get('team_id').value
this.teamsform.reset()
this.teamsform.get("team_id").patchValue(teams_id)

}
memberselect(data){
  if(this.emparray.includes(data.id)){
    
  }
  else{
    this.emparray.push(data.id)
  
    this.teamsform.get("employee_arr").setValue(this.emparray)
  
  }
    }
    removemem(){
      this.chipselectemember=[]
      this.emparray=[]
      let teams_id=this.teamsform.get('team_id').value
    this.teamsform.reset()
    this.memberInput.nativeElement.value = '';
    this.teamsform.get("team_id").patchValue(teams_id)
    }
    submitted(){
      this.SpinnerService.show();
      let teamdatas=this.teamsform.get('employee_arr').value
      if(teamdatas.length==0){
        this.notification.showError("Please choose Members")
        this.SpinnerService.hide();
        return false;
      }
     
  
      this.taskservice.addsummaryteam(this.teamsform.value).subscribe(result => {
       // this.datas=result.id
  if(result.code){
    this.notification.showError(result.description)
    this.memberInput.nativeElement.value = '';
    this.SpinnerService.hide();
    return false;
  }
  else{
  
    this.notification.showSuccess(result.message)
    this.SpinnerService.hide();
      
    this.teamSummary = false;
    this.teamcreation = false;
    this.showmember = true;
    this.chipselectemember=[]
  // this.teamform.get('team_id').patchValue(this.teamidssss)
  let teams_id=this.teamsform.get('team_id').value
    this.teamsform.reset()
    
    this.teamsform.get("team_id").patchValue(teams_id)
    this.teamsform.get("employee_arr").patchValue([])
    this.emparray=[]
    
    this.get_teammembersummary(this.teamidssss);
    
    
    
    

  }
  this.memberInput.nativeElement.value = '';
  this.SpinnerService.hide();
        
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    );
    }

    public removedmember(member: imemberList): void {
      const index = this.chipselectemember.indexOf(member);
    
      if (index >= 0) {
       
        this.chipselectemember.splice(index, 1);
        this.chipSelectedmemberid.splice(index, 1);
  
        this.emparray = this.emparray.filter(item => item !== member.id);
        this.teamsform.get("employee_arr").setValue(this.emparray)
  
        this.memberInput.nativeElement.value = '';
    
      } 
    }
    public memberSelected(event: MatAutocompleteSelectedEvent): void {
      this.selectmemberByName(event.option.value.name);
      this.memberInput.nativeElement.value ='';
    }
    private selectmemberByName(memberName) {
      let foundmember1 = this.chipselectemember.filter(member => member.name == memberName);
      if (foundmember1.length) {
        return;
      }
      let foundmember = this.allmemberslist.filter(member => member.name == memberName);
      if (foundmember.length) {
        this.chipselectemember.push(foundmember[0]);
        this.chipSelectedmemberid.push(foundmember[0].id)
        //this.memberIdValue = this.chipSelectedmemberid;
      }
    }
    deletepipetemp(member) {
     let memberid=member.id
      if (confirm("Confirm?")) {
      this.SpinnerService.show();
      this.taskservice.deleteteammembers(this.team_ids,memberid)
          .subscribe(res => {
            console.log("task delete", res)
            if(res.code){
              this.notification.showError(res.description)
            }
            else{
            
              this.notification.showSuccess(res.message)
              this.get_teammembersummary(this.teamidssss);
            }
            this.SpinnerService.hide()
           
          }
          
          
          )}
         
         
       
    }
   

public displayFncltincharge(incharge?: inchargemaster): string | undefined {
  return incharge ? incharge.name : undefined;
}
}
