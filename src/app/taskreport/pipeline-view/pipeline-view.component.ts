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
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';

export interface chipList {
  name: string;
  id: number;
}
@Component({
  selector: 'app-pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: ['./pipeline-view.component.scss']
})
export class PipelineViewComponent implements OnInit {

  @ViewChild('chipInput') chipInput: any;
  pipelineform: FormGroup;
  templateform:FormGroup;
  segmetform:FormGroup
  pipelinecreation:boolean
  clientcreation:boolean
  pipelineSummary:boolean=true
  isShowspipeline:boolean
  clientSummary:boolean
  projectcreation:boolean
  projectSummary:boolean
  modulecreation:boolean
  moduleSummary:boolean
  mappingSummary:boolean
  mappingcreation:boolean
  teamSummary:boolean
  teamcreation:boolean
  showmember:boolean
  showcheckbox:boolean
  pipelinelist:any;
  templatelist: any;
  has_nextclient:boolean = true;
  has_previousclient:boolean= true;
  presentpageclient: number = 1;
  presentpageteam: number = 1;
  presentpagepipeline: number = 1;
  has_nextactivity:boolean=true
  has_previousactivity:boolean=true
  pagesizepipeline = 10;
  pagesiz=10;
  send_value: String = "";
  activitylist: any;
  has_next = true;
  has_previous = true;
  isLoading = false;
  pipeview: any = [];
  pipetemplist: any;
  public chipselectemember: chipList[] = [];
  public chipSelectedmemberid = [];
  public pipelinelists: chipList[];
  emparray:any=[];
  public segment = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  temp_id: any;
  Search=new FormControl('')
  pagination={
    has_previous:false,
    has_next:false,
    index:1
  }

  constructor(
    private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.pipelineform = this.fb.group({
      name: ['']
    })
    this.templateform = this.fb.group({
      name: ['']
    })
    this.segmetform=this.fb.group({
      name:[''],
      segment:['']
    })
    
    this.get_pipelineSummary(1)

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
  Ontemplatetimesheet() {
    this.isShowspipeline = true;
    this.pipelinecreation = false;
    this.pipelineSummary = false;
    this.get_pipelinetempsum()

    // this.taskservice.gettimetempSummary("").subscribe(
    //   (result) => {
    //     this.SpinnerService.hide();
    //     this.temptimesummlist = result["data"];
    //   },
    //   (error) => {
    //     this.errorHandler.handleError(error);
    //     this.SpinnerService.hide();
    //   }
    // );
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
          this.presentpagepipeline = dataPagination?.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  get_pipelinetempsum() {
    this.taskservice.pipelinetempsum()
      .subscribe(result => {
        this.SpinnerService.hide();
        this.pipetemplist = result['data']
        let dataPagination = result['pagination'];
        if (this.pipetemplist.length > 0) {
          this.has_nextclient = dataPagination?.has_next;
          this.has_previousclient = dataPagination?.has_previous;
          this.presentpagepipeline = dataPagination?.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
   pipelineSearch(hint: any) {
    if (hint == 'next'){
      this.get_pipelineSummary(this.presentpagepipeline + 1)
    }
    else if (hint == 'previous') {
      this.get_pipelineSummary(this.presentpagepipeline - 1)
    }
    else {
      this.get_pipelineSummary(1)
      this.presentpagepipeline=1
    }
  }
  teamSearch(hint: any) {
    if (hint == 'next') {
      this.get_pipelineSummary(this.presentpageclient + 1)
    }
    else if (hint == 'previous') {
      this.get_pipelineSummary(this.presentpageclient - 1)
    }
    else {
      this.get_pipelineSummary(1)
      this.presentpageclient = 1;
    }
  }
  searchtempform(page = 1
    ) {
      let formValue = this.templateform.value
      console.log("Search Values", formValue)
      this.send_value = ""
      if (formValue.name) {
        this.send_value = this.send_value + '&query=' + formValue.name
      }
      this.taskservice.pipelinetemplate_summary(this.send_value, page).subscribe(result => {
        this.templatelist = result['data'];
        let dataPagination = result['pagination'];
        if (this.templatelist.length > 0) {
          this.has_nextactivity = dataPagination.has_next;
          this.has_previousactivity = dataPagination.has_previous;
          this.presentpageteam = dataPagination.index;
        }
  
      })
  
    }
    cleartempForm(page = 1) {
      // this.SpinnerService.show();
      this.templateform.reset();
      let formValue = this.templateform.value
      console.log("Search Values", formValue)
      this.send_value = ""
      if (formValue.name) {
        this.send_value = this.send_value + '&query=' + formValue.name
      }
      this.taskservice.searchactivitycategory(this.send_value, page).subscribe(result => {
        // this.SpinnerService.hide();
        this.activitylist = result['data'];
        let dataPagination = result['pagination'];
        if (this.activitylist.length > 0) {
          this.has_nextactivity = dataPagination.has_next;
          this.has_previousactivity = dataPagination.has_previous;
          this.presentpageteam = dataPagination.index;
        }
  
      })
  
    }
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
    goBack() {
      // Use the location service to navigate back
      // this.location.back();
      this.isShowspipeline = false
      this.pipelineSummary = true
    }
    viewpopup(pipes) {
     this.temp_id=pipes['pipeline'];

      
  
    }
    public removedmember(member: chipList): void {
      const index = this.chipselectemember.indexOf(member);
    
      if (index >= 0) {
       
        this.chipselectemember.splice(index, 1);
        this.chipSelectedmemberid.splice(index, 1);
  
        this.emparray = this.emparray.filter(item => item !== member.id);
         this.segmetform.get("segment").setValue(this.emparray)
  
        this.chipInput.nativeElement.value = '';
    
      } 
    }
    public memberSelected(event: MatAutocompleteSelectedEvent): void {
      this.selectmemberByName(event.option.value.name);
      this.chipInput.nativeElement.value ='';
    }
    private selectmemberByName(memberName) {
      let foundmember1 = this.chipselectemember.filter(member => member.name == memberName);
      if (foundmember1.length) {
        return;
      }
      let foundmember = this.pipelinelists.filter(member => member.name == memberName);
      if (foundmember.length) {
        this.chipselectemember.push(foundmember[0]);
        this.chipSelectedmemberid.push(foundmember[0].id)
        //this.memberIdValue = this.chipSelectedmemberid;
      }
    }
    clickpipeline(){
      
        this.segmetform.get('segment').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.taskservice.get_pipeline(value)
              .pipe(
                finalize(() => {
                  this.isLoading = false;
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.pipelinelists = datas;
            // console.log("alllemployeeeisttt", datas)
  
          })
  
    
  
    }
    PipeLineDropdown(value){
      this.taskservice.get_pipeline(value).subscribe(data=>{
        this.pipelinelists = data['data'];
      })
    }
    submitpipetemp(){
      
      let name=this.segmetform.get('name').value

      let obj={
        "name":name,
        "pipeline":this.emparray
      }
    
        this.taskservice.subpipetemp(obj).subscribe(result => {
         // this.datas=result.id
    if(result.code){
      this.notification.showError(result.description)
    }
    else{
    
      this.notification.showSuccess(result.message)
      this.segmetform.reset()
      
      this.emparray=[]
      this.chipselectemember=[]
      this.get_pipelinetempsum()
    }
          
      })
      }
      memberselect(data){
        if(this.emparray.includes(data.id)){
          
        }
        else{
          this.emparray.push(data.id)
        
          this.segmetform.get("segment").setValue(this.emparray)
        
        }
          }
          clicktoclose(){
            this.segmetform.reset()
            
            this.emparray=[]
            this.chipselectemember=[]
          }
  
          deletepipetemp(data) {
            let tempid = data.id
            if (confirm("Confirm?")) {
            this.SpinnerService.show();
            this.taskservice.deletepipetemp(tempid)
                .subscribe(res => {
                  console.log("task delete", res)
                  if(res.code){
                    this.notification.showError(res.description)
                  }
                  else{
                  
                    this.notification.showSuccess(res.message)
                   
                  }
                  this.SpinnerService.hide()
                  this.get_pipelinetempsum()
                }
                
                
                )}
             
          }
          search(){
            if(this.Search.value){
              this.taskservice.pipelineSummary_master_search(this.Search.value).subscribe(data=>{
                this.pipelinelist=data['data']
                this.has_nextclient = data.pagination?.has_next;
                this.has_previousclient = data.pagination?.has_previous;
                this.presentpagepipeline = data.pagination?.index;
              })
            }
            else{
              this.taskservice.pipelineSummary_master_search('').subscribe(data=>{
                this.pipelinelist=data['data']
                this.has_nextclient = data.pagination?.has_next;
                this.has_previousclient = data.pagination?.has_previous;
                this.presentpagepipeline = data.pagination?.index;
              })
            }
          }
          Clear(){
            this.Search.reset()
            this.search()
          }
         
}
