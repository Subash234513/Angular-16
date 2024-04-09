import { Component, OnInit,ViewChild , Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TaskService } from '../task.service';
import { NotificationService } from '../notification.service';
import { formatDate, DatePipe } from '@angular/common';
import { Observable, from, fromEvent, } from 'rxjs';
import { data } from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectSearchComponent } from 'ngx-mat-select-search';
import { query } from '@angular/animations';

interface empObject {
  ref_type: number;
  ref_id: number;
}
export interface imemberList {
  name: string;
  id: number;
}

export interface appNamemaster {
  id: string;
  name: string;aAAaa
}
export interface Clientmaster {
  id: string;
  name: string;a
}
export interface inchargemaster {
  id:number;
  name:string;aa
}
export interface ModeuleNamemaster {
  module_id: string;
  name: string;
}

interface Incharge {
  name: string;
}

@Component({
  selector: 'app-taskmaster',
  templateUrl: './taskmaster.component.html',
  styleUrls: ['./taskmaster.component.scss']
})
export class TaskmasterComponent implements OnInit {
  // selectedInchargeControl = new FormControl<Incharge | Null >(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  inchargeList: Incharge[] = []
   // master
   @ViewChild('cltmaster') matclientmasterAutocomplete: MatAutocomplete;
   @ViewChild('incharge') matinchargeAutocomplete: MatAutocomplete;
   @ViewChild('cltmasterInput') cltmasterInput: any;
 
   @ViewChild('appnmmaster') maprotmasterAutocomplete: MatAutocomplete;
   @ViewChild('appnmmasterInput') appnmmasterInput: any;
 
   @ViewChild('modnmmaster') matmodulenamemasterAutocomplete: MatAutocomplete;
   @ViewChild('modnmmasterInput') modnmmasterInput: any;
   @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger; 

  task_Master_Menu_List: any
  clientSummary:boolean
  projectSummary:boolean
  moduleSummary:boolean
  mappingSummary:boolean
  clientcreation:boolean
  projectcreation:boolean
  modulecreation:boolean
  mappingcreation:boolean
  teamSummary:boolean
  teamcreation:boolean
  teamdetailscreation:boolean
  showmember:boolean
  showcheckbox:boolean
  teammembersadd:boolean
  clientviewsummary:boolean
  clientList:any;
  projectList:any;
  moduleList:any;
  mappingList:any;
  teamlist:any;
  pipelinelist:any;
  viewlist:any;
  memberlist:any;
  particularview: any[]=[]; 
 public allmemberslist: imemberList[];
 public chipselectemember: imemberList[] = [];
 public chipSelectedmemberid = [];
 public chipSelectedteamid = [];
 public chipSelectedEmployeeid = [];

  public chipSelectedempid=[];
 public memberControl = new FormControl();



 readonly separatorKeysCodes: number[] = [ENTER, COMMA];


 @ViewChild('memberInput') memberInput: any;
@ViewChild('auto') matAutocomplete: MatAutocomplete;
  clientForm:FormGroup;
 
  moduleForm:FormGroup;
  mappingForm:FormGroup;
  teamform:FormGroup;
 
  employeeform:FormGroup;
  teamsform:FormGroup;
  pipelineform: FormGroup;


  presentpageclient: number = 1;
  pagesizeclient=10;
  pagesizeteam =10;
  pagesizemember =10;
  pagesizeprojectd=10;
  has_nextclient:boolean = true;
  has_previousclient:boolean= true;
  has_nextteam = true;
  has_previousteam = true;
  presentpageproject: number = 1;
  pagesizeproject=10;
  has_nextproject = true;
  has_previousproject = true;
  presentpagemodule: number = 1;
  pagesizemodule=10;
  has_nextmember = true;
  has_previousmember = true;
  datasearch = FormGroup;
  memberIdValue: any;
  send_value: String = "";
  has_nextmodule = true;
  has_previousmodule = true;
  presentpagemapping: number = 1;
  presentpageteam: number = 1;
  presentpageprojectd:number=1;
  presentpagemember: number = 1;
  pagesizemapping=10;
  has_next_projectd=true
  has_previous_projectd=true;
  has_nextmapping = true;
  has_previousmapping = true;
 has_nextparticular = true;
 has_previousparticular = true;
 presentpageparticular: number = 1;
 has_nextview = true;
 has_previousview = true;
 presentpageview: number = 1
 pagesizepipeline = 10;
  isLoading = false;
  has_next = true;
  has_next_drop=true;
  has_previous = true;
  has_previous_drop=true;
  currentpage: number = 1;
  appNamemasterList: Array<appNamemaster>;
  clientmasterList: Array<Clientmaster>;
  moduleNamemasterList: Array<ModeuleNamemaster>;

  id: any;
  teammember: any;
  pipelineSummary: boolean;
  pipelinecreation: boolean;
  category:boolean;
  subcategory:boolean;
  auditmapping:boolean;
  presentpagepipeline: number = 1;
  ToList: any;
  inchrageId: any;
  datas: any;
  teammember_id: any;
  teamidssss: any;
  emparray:any=[];
  projectteamidlist:any=[]
  projectemplist:any=[]
  newArr:any=[]
  teamarray:any=[]
  projectemparray:any=[]
  clientdetails: any;
  projectteamlist: any;
  proID: any;
  refID: any;
  refType: any;
  project_ids: any;
  projectteamid: any;
  projectteamids: number;
  projectempid: any;
  newArray: any;
  activitysummary: boolean = false;
  taskapprover: boolean;
  


  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog
  ) {

  }



  ngOnInit(): void {
     
    let datas = this.shareService.menuUrlData;
    console.log("datas", datas)
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Task Master") {
        this.task_Master_Menu_List = subModule;
        console.log("taskMaster",this.task_Master_Menu_List)
      }
    });

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
    
   
     // client form
     this.clientForm = this.fb.group({
      name: [''],
    })
    
    
     // module form
     this.moduleForm = this.fb.group({
      name: [''],
     
    })

    // mapping form
    this.mappingForm = this.fb.group({
      client_id: [''],
      project_id: [''],
      module_id: [''],
    })

    //team form
    this.teamform = this.fb.group({
      name: [''],
     // code: [''],
      incharge: [''],
    })
   
    this.teamsform = this.fb.group({
      team_id: [''],
      employee_arr: ['']
    })
      //employee form
      this.employeeform = this.fb.group({
        name: ['']
      })
      //pipeline from
      this.pipelineform = this.fb.group({
        name: ['']
      })



    this.get_dropdownsummary_team(1);
    this.get_pipelineSummary(1);

      
  }

  subModuleData(data) { 
    
    if (data.url == '/client') {
     this.clientSummary = true;
     this.teammembersadd=false;
     this.clientcreation = false;
     this.projectSummary = false;
     this.projectcreation = false;
     this.moduleSummary = false;
     this.modulecreation = false;
     this.mappingSummary = false;
     this.mappingcreation = false;
     this.teamSummary = false;
     this.teamcreation = false;
     this.teamdetailscreation = false;
     this.showmember = false;
     this.showcheckbox = false;
      this.clientSearch('');
     this.pipelineSummary = false;
     this.activitysummary= false;
     this.taskapprover= false;
     this.category=false;
     this.subcategory=false;
     this.auditmapping=false;

    } 
    else if (data.url == '/project') {
      this.clientSummary = false;
      this.teammembersadd=false;
      this.clientcreation = false;
      this.projectSummary = true;
      this.projectcreation = false;
      this.moduleSummary = false;
      this.modulecreation = false;
      this.mappingSummary = false;
      this.mappingcreation = false;
      this.teamSummary = false;
      this.teamcreation = false;
      this.teamdetailscreation = false;
      this.showmember = false;
      this.showcheckbox = false;
      // this.projectSearch('');
      // this.projectsearchemp('');
      this.activitysummary= false;
      this.pipelineSummary = false;
      this.taskapprover= false;
      this.category=false;
      this.subcategory=false;
      this.auditmapping=false;

    } 
    else if (data.url == '/projectmodule' ) {
      this.clientSummary = false;
      this.teammembersadd=false;
      this.clientcreation = false;
      this.projectSummary = false;
      this.projectcreation = false;
      this.moduleSummary = true;
      this.modulecreation = false;
      this.mappingSummary = false;
      this.mappingcreation = false;
      this.teamSummary = false;
      this.teamcreation = false;
      this.teamdetailscreation = false;
      this.showmember = false;
      this.showcheckbox = false;
     // this.moduleSearch('');
      this.pipelineSummary = false;
      this.activitysummary= false;
      this.taskapprover= false;
      this.category=false;
      this.subcategory=false;
      this.auditmapping=false;

    } 
    else if (data.url == '/mapping' ) {
      this.clientSummary = false;
      this.teammembersadd=false;
      this.clientcreation = false;
      this.projectSummary = false;
      this.projectcreation = false;
      this.moduleSummary = false;
      this.modulecreation = false;
      this.mappingSummary = true; 
      this.mappingcreation = false;
      this.teamSummary = false;
      this.teamcreation = false;
      this.teamdetailscreation = false;
      this.showmember = false;
      this.showcheckbox = false;
     // this.mappingSearch('');
      this.pipelineSummary = false;
      this.activitysummary= false;
      this.taskapprover= false;
      this.category=false;
      this.subcategory=false;
      this.auditmapping=false;

    } 
   else if (data.url == '/team') {
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = true;
    this.teamcreation = false;
  //  this.teamSearch('');
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.activitysummary= false;
    this.taskapprover= false;
    this.category=false;
    this.subcategory=false;
    this.auditmapping=false;


   }
   else if (data.url == '/pipeline') {
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = true;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.activitysummary= false;
    this.taskapprover= false;
    // this.pipelineSearch('');
    this.category=false;
    this.subcategory=false;
    this.auditmapping=false;
   }
   else if (data.url == '/activity') {
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.activitysummary= true;
    this.taskapprover= false;
    // this.pipelineSearch('');
    this.category=false;
    this.subcategory=false;
    this.auditmapping=false;
   }
   else if (data.url == '/taskapprover') {
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.taskapprover= true;
    this.activitysummary=false
    this.category=false;
    this.subcategory=false;
    this.auditmapping=false;
    
    // this.pipelineSearch('');
   }
   else if(data.url=='/category'){
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.taskapprover= false;
    this.activitysummary=false
    this.category=true;
    this.subcategory=false;
    this.auditmapping=false;
   }
   else if(data.url=='/subcategory'){
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.taskapprover= false;
    this.activitysummary=false
    this.category=false;
    this.subcategory=true;
    this.auditmapping=false;
   }
   else if(data.url=='/auditmapping'){
    this.clientSummary = false;
    this.teammembersadd=false;
    this.clientcreation = false;
    this.projectSummary = false;
    this.projectcreation = false;
    this.moduleSummary = false;
    this.modulecreation = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.teamdetailscreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.teamcreation = false;
    this.taskapprover= false;
    this.activitysummary=false
    this.category=false;
    this.subcategory=false;
    this.auditmapping=true;
   }
  }


  //client master
  get_clientSummary(pageno) {
    this.taskservice.clientSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.clientList = result['data']
        let dataPagination = result['pagination'];
        if (this.clientList.length > 0) {
          this.has_nextclient = dataPagination?.has_next;
          this.has_previousclient = dataPagination?.has_previous;
          this.presentpageclient = dataPagination?.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  clientSearch(hint: any) {
   
    if (hint == 'next') {
      this.get_clientSummary(this.presentpageclient + 1)
    }
    else if (hint == 'previous') {
      this.get_clientSummary(this.presentpageclient - 1)
    }
    else {
      this.get_clientSummary(1)
      // this.presentpageclient=1
    }

  }


   // mapping master
   
 
 
//Error
  // memebersearch( hint: any){
    
  //   if (hint == 'next') {
  //     this.get_teammembersummary(this.presentpagemember + 1)
  //   }
  //   else if (hint == 'previous') {
  //     this.get_teammembersummary(this.presentpagemember - 1)
  //   }
  //   else {
  //     this.get_teammembersummary(1)
  //   }
  // }

 
  get_dropdownsummary_team(value){
    this.taskservice.dropdownsummary_team(value).subscribe(result => {
      this.SpinnerService.hide();
      this.viewlist = result['data']
      let datapagination = result['pagination'];
      if (this.viewlist.length > 0) {
        this.has_nextview = datapagination.has_next;
        this.has_previousview = datapagination.has_previous;
        this.presentpageview = datapagination.index;
      }
    })
  }



  

  get_pipelineSummary(pageno) {
    this.taskservice.pipelineSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.pipelinelist = result['data']
        let dataPagination = result['pagination'];
        if (this.pipelinelist.length > 0) {
          this.has_nextclient = dataPagination?.has_next;
          this.has_previousclient = dataPagination?.has_previous;
          this.presentpageclient = dataPagination?.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  // pipelineSearch(hint: any) {
  //   if (hint == 'next'){
  //     this.get_pipelineSummary(this.presentpagepipeline + 1)
  //   }
  //   else if (hint == 'previous') {
  //     this.get_pipelineSummary(this.presentpagepipeline - 1)
  //   }
  //   else {
  //     this.get_pipelineSummary(1)
  //   }
  // }

  //search


  // clientSubmit(){
  //   this.SpinnerService.show();
  //   // if (this.clientForm.value.name === "") {
  //   //   this.toastr.error('Please Enter Client');
  //   //   this.SpinnerService.hide();
  //   //   return false;
  //   // }
  //   let data = this.clientForm.value
  //   if (data.name == '' || data.name == undefined || data.name == null) {
  //     this.toastr.error('Please Enter Client');
  //     this.SpinnerService.hide();
  //     return false
  //   }
  //   let dataToSubmit;
  //   if (this.ID_Value_To_clientEdit != '') {
  //     let id = this.ID_Value_To_clientEdit
  //     dataToSubmit = Object.assign({}, { 'id': id }, data)
  //   }
  //   else {
  //     dataToSubmit = data
  //   }

  //   this.taskservice.clientForm(dataToSubmit)
  //   .subscribe(res => {
  //     console.log("client click", res)
  //     if(res.status == 'success'){

  //       if (this.ID_Value_To_clientEdit != '') {
  //         this.notification.showSuccess('Successfully Updated')
  //         this.ID_Value_To_clientEdit = ''
  //       } else {
  //         this.notification.showSuccess('Successfully Created')
  //         this.ID_Value_To_clientEdit = ''
  //       }
  //       this.clientForm = this.fb.group({
  //         name: [''],
  //       })
  //       this.clientSummary = true;
  //       this.clientcreation = false;
  //       // this.clientSearch('');
  //       this.SpinnerService.hide();
        
  //      } else {
  //       this.notification.showError(res.description)
  //       this.SpinnerService.hide();
  //       return false;
  //     }
  //   },
  //   error => {
  //     this.errorHandler.handleError(error);
  //     this.SpinnerService.hide();
  //   }
  //   )
  // }

  

  
  pipelinesubmit() {
    
    this.taskservice.addpipelineform(this.pipelineform.value).subscribe(result => {
      

        this.notification.showSuccess("Added Successfully")
      
        this.pipelineSummary = true;
        this.pipelinecreation = false;
        
        this.pipelineform.reset()
        this.get_pipelineSummary(1)
        
    }
    )
  
  }
  
  employeesubmit(){
    this.taskservice
  }



  createteammapping() {
    let data = this.teamform.controls;
    let teammasterclass = new teammaster();
    teammasterclass.name = data['name'].value.name;
    teammasterclass.code = data['code'].value.code;
    teammasterclass.incharge = data['incharge'].value.incharge;
    return teammasterclass; 
  }

    
      get cltmaster() {
        return this.mappingForm.value.get('client_id');
      }
    
      get promaster() {
        return this.mappingForm.value.get('project_id');
      }

      FocusOut_select_incharge(e){
        let inchrageId=e.source.value.id;
        this.teamform.get("incharge").setValue(inchrageId)
      }

                
                  get modmaster() {
                    return this.mappingForm.value.get('module_id');
                  }


  oncancelpipeline(){
    this.clientcreation = false;
    this.clientSummary = false;
    this.projectcreation = false;
    this.projectSummary = false;
    this.modulecreation = false;
    this.moduleSummary = false;
    this.mappingSummary = false;
    this.mappingcreation = false;
    this.mappingSummary = false;
    this.teamSummary = false;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = true;
    this.pipelinecreation = false;
  }
  TypeOfForm:string;
  ID_Value_To_clientEdit: any = ''
  ID_Value_To_projectEdit: any = ''
  ID_Value_To_moduleEdit: any = ''
  ID_Value_To_mappingEdit: any = ''
  ID_Value_To_teamEdit: any = ''




addpipeline(formtype,data){
  this.TypeOfForm = formtype;
  this.pipelinecreation = true;
  this.pipelineSummary = false;
  if (data != '') {
    this.ID_Value_To_teamEdit = data.id
    this.pipelineform.patchValue({
      name: data.name
    })
  }
  else {
    this.pipelineform.reset('')
  }
}

adds(){
  // this.showcheckbox= true;
  // this.showmember= false;
  // this.teamdetailscreation= false;
  this.dialog.open(TaskmasterComponent,{
    width: '60%',
    height: '400px'
  })
}


  
 
  
  // public removedmember(member: imemberList): void {
  //   const index = this.chipselectemember.indexOf(member);
  //   if (index >= 0) {
  
  //   this.chipselectemember.splice(index, 1);

  //   this.chipSelectedmemberid.splice(index, 1);
  //   this.memberInput.nativeElement.value ='';
  //   this.emparray = this.emparray.filter(item => item!==member.id);
  // }
  //   // for (let i of this.emparray) {
  //   //   if (i===member.id) {
        
  //   //   }
  //   // }
    
    
    
  // }

  
 
  
  
  
  

}




class teammaster{
  name: string;
  code: string;
  incharge: string;
}


// @Component({
//  templateUrl: 'popup.component.html',
//  styleUrls: ['./taskmaster.component.scss']

// })

// export class Dialogclass {

// }