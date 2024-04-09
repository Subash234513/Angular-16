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
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, map, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface Clientmaster {
  id: string;
  name: string;a
}
export interface appNamemaster {
  id: string;
  name: string;aAAaa
}
export interface ModeuleNamemaster {
  module_id: string;
  name: string;
}

@Component({
  selector: 'app-mapping-view',
  templateUrl: './mapping-view.component.html',
  styleUrls: ['./mapping-view.component.scss']
})
export class MappingViewComponent implements OnInit {

  mappingcreation:boolean
  mappingSummary:boolean=true
  clientcreation:boolean
  clientSummary:boolean
  projectcreation:boolean
  projectSummary:boolean
  modulecreation:boolean
  moduleSummary:boolean
  teamSummary:boolean
  teamcreation:boolean
  showmember:boolean
  showcheckbox:boolean
  pipelineSummary:boolean
  pipelinecreation:boolean
  mappingList:any;
  has_nextmapping:boolean = true;
  has_previousmapping:boolean = true;
  presentpagemapping: number = 1;
  pagesizemapping=10;
  mappingForm:FormGroup;
  isLoading = false;
  clientmasterList: Array<Clientmaster>=[];
  appNamemasterList: Array<appNamemaster>=[];
  moduleNamemasterList: Array<ModeuleNamemaster>=[];
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  ClientMasterDrop=[]
  ProjectMasterDrop=[]
  ModuleMasterDrop=[]
  isClientMasterId: any;
  isProjectMasterId: any;
  isModuleMasterId: any;
  search=new FormGroup({
    client:new FormControl(''),
    project:new FormControl(''),
    module:new FormControl('')
  })

  @ViewChild('cltmaster') matclientmasterAutocomplete: MatAutocomplete;
  @ViewChild('cltmasterInput') cltmasterInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger; 
  @ViewChild('appnmmasterInput') appnmmasterInput: any;
  @ViewChild('appnmmaster') maprotmasterAutocomplete: MatAutocomplete;
  @ViewChild('modnmmasterInput') modnmmasterInput: any;
  @ViewChild('modnmmaster') matmodulenamemasterAutocomplete: MatAutocomplete;
  

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private taskservice: TaskService,
    private notification: NotificationService,private datePipe: DatePipe,private dialog: MatDialog) { }

  ngOnInit(): void {

    this.mappingForm = this.fb.group({
      client_id: [''],
      project_id: [''],
      module_id: [''],
    })
    this.get_mappingSummary(1)
    
  }

  oncancelMapping(){
    this.clientcreation = false;
    this.clientSummary = false;
    this.projectcreation = false;
    this.projectSummary = false;
    this.modulecreation = false;
    this.moduleSummary = false;
    this.mappingcreation = false;
    this.mappingSummary = true;
    this.teamSummary = false;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.pipelineSummary = false;
    this.pipelinecreation = false;
    this.mappingForm.reset()
  }

  addMapping(){
    this.mappingcreation = true;
    this.mappingSummary = false;
  }
  get_mappingSummary(pageno) {
    this.taskservice.mappingSummary_master(pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.mappingList = result['data']
        let dataPagination = result['pagination'];
        if (this.mappingList.length > 0) {
          this.has_nextmapping = dataPagination.has_next;
          this.has_previousmapping = dataPagination.has_previous;
          this.presentpagemapping = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  mappingActiveInactive(status, data) {
    let mappingID = data?.id
    this.taskservice.mappingActiveInactive(mappingID,status)
      .subscribe(results => {
        console.log("results", results)
        this.notification.showSuccess(results.message)
        this.mappingSearch('') 
      })
  }
  mappingSearch(hint: any) {
   
    if (hint == 'next') {
      this.get_mappingSummary(this.presentpagemapping + 1)
    }
    else if (hint == 'previous') {
      this.get_mappingSummary(this.presentpagemapping - 1)
    }
    else {
      this.get_mappingSummary(1)
      this.presentpagemapping=1
    }

  }
  clientmaster(){
    let teamldkeyvalue: String = "";
      this.getclientmaster(teamldkeyvalue);
  
      this.mappingForm.get('client_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskservice.getclientmasterFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.clientmasterList = datas;
  
        })
  
  }
  private getclientmaster(teamldkeyvalue) {
    this.taskservice.getclientmasterFilter(teamldkeyvalue,1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientmasterList = datas;
      })
  }
  autocompleteCltmasterScroll() {
    setTimeout(() => {
      if (
        this.matclientmasterAutocomplete &&
        this.autocompleteTrigger &&
        this.matclientmasterAutocomplete.panel
      ) {
        fromEvent(this.matclientmasterAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientmasterAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientmasterAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientmasterAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientmasterAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getclientmasterFilter(this.cltmasterInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.clientmasterList = this.clientmasterList.concat(datas);
                    if (this.clientmasterList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  client_master_Id=0;
      FocusOut_select_clientmaster(data){
        console.log("client master",data);
        this.client_master_Id = data.id;
      }
      projectnamemaster(){
        let teamldkeyvalue: String = "";
          this.getprojectnamemaster(teamldkeyvalue);
      
          this.mappingForm.get('project_id').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
              switchMap(value => this.taskservice.getprojectnamemasterFilter(this.client_master_Id,value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.appNamemasterList = datas;
      
            })
      
      }
      private getprojectnamemaster(teamldkeyvalue) {
        this.taskservice.getprojectnamemasterFilter(this.client_master_Id,teamldkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.appNamemasterList = datas;
          })
      }
      autocompleteAppnmmasterScroll() {
        setTimeout(() => {
          if (
            this.maprotmasterAutocomplete &&
            this.autocompleteTrigger &&
            this.maprotmasterAutocomplete.panel
          ) {
            fromEvent(this.maprotmasterAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.maprotmasterAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.maprotmasterAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.maprotmasterAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.maprotmasterAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.taskservice.getprojectnamemasterFilter(this.client_master_Id,this.appnmmasterInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.appNamemasterList = this.appNamemasterList.concat(datas);
                        if (this.appNamemasterList.length >= 0) {
                          this.has_next = datapagination.has_next;
                          this.has_previous = datapagination.has_previous;
                          this.currentpage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      project_master_Id=0;
      FocusOut_select_projectmaster(data){
        console.log("project master",data);
        this.project_master_Id = data.id;
      }
      modulenamemaster(){
        let teamldkeyvalue: String = "";
          this.getmodulenamemaster(teamldkeyvalue);
      
          this.mappingForm.get('module_id').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
              switchMap(value => this.taskservice.getmodulenamemasterFilter(this.client_master_Id,this.project_master_Id,value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.moduleNamemasterList = datas;
      
            })
      
      }
      private getmodulenamemaster(teamldkeyvalue) {
        this.taskservice.getmodulenamemasterFilter(this.client_master_Id,this.project_master_Id,teamldkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.moduleNamemasterList = datas;
          })
      }
      autocompletemodnmmasterScroll() {
        setTimeout(() => {
          if (
            this.matmodulenamemasterAutocomplete &&
            this.autocompleteTrigger &&
            this.matmodulenamemasterAutocomplete.panel
          ) {
            fromEvent(this.matmodulenamemasterAutocomplete.panel.nativeElement, 'scroll')
              .pipe(
                map(x => this.matmodulenamemasterAutocomplete.panel.nativeElement.scrollTop),
                takeUntil(this.autocompleteTrigger.panelClosingActions)
              )
              .subscribe(x => {
                const scrollTop = this.matmodulenamemasterAutocomplete.panel.nativeElement.scrollTop;
                const scrollHeight = this.matmodulenamemasterAutocomplete.panel.nativeElement.scrollHeight;
                const elementHeight = this.matmodulenamemasterAutocomplete.panel.nativeElement.clientHeight;
                const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                if (atBottom) {
                  if (this.has_next === true) {
                    this.taskservice.getmodulenamemasterFilter(this.client_master_Id,this.project_master_Id,this.modnmmasterInput.nativeElement.value, this.currentpage + 1)
                      .subscribe((results: any[]) => {
                        let datas = results["data"];
                        let datapagination = results["pagination"];
                        this.moduleNamemasterList = this.moduleNamemasterList.concat(datas);
                        if (this.moduleNamemasterList.length >= 0) {
                          this.has_next = datapagination.has_next;
                          this.has_previous = datapagination.has_previous;
                          this.currentpage = datapagination.index;
                        }
                      })
                  }
                }
              });
          }
        });
      }
      mappingSubmit(){
        this.SpinnerService.show();
        if (this.mappingForm.value.client_id === ""||this.mappingForm.value.client_id===null||this.mappingForm.value.client_id===undefined) {
          this.toastr.error('Please Select Vaild Client');
          this.SpinnerService.hide();
          return false;
        }
        if (this.mappingForm.value.project_id === ""||this.mappingForm.value.project_id === null||this.mappingForm.value.project_id ===undefined) {
          this.toastr.error('Please Select Vaild Project');
          this.SpinnerService.hide();
          return false;
        }
        if (this.mappingForm.value.module_id === ""||this.mappingForm.value.module_id === null||this.mappingForm.value.module_id ===undefined) {
          this.toastr.error('Please Select Vaild Module');
          this.SpinnerService.hide();
          return false;
        }
    
        this.taskservice.mappingForm(this.createFormatemapping())
        .subscribe(res => {
          console.log("module click", res)
          if(res.status == 'success'){
            this.notification.showSuccess(res.message);
            this.mappingForm = this.fb.group({
              client_id: [''],
              project_id: [''],
              module_id: [''],
            })
            this.mappingSummary = true;
            this.mappingcreation = false;
            this.mappingSearch('');
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
      
      createFormatemapping() {
        let data = this.mappingForm.controls;
        let taskmasterclass = new taskmaster();
        taskmasterclass.client_id = data['client_id'].value.id;
        taskmasterclass.project_id = data['project_id'].value.id;
        taskmasterclass.module_id = data['module_id'].value.module_id;
        return taskmasterclass;
      }
      // Search(){
      //   this.taskservice.mappingSummary_master_search(this.SearchMapping.value).subscribe(data=>{
      //     this.mappingList=data['data']
      //     this.has_nextmapping = data.pagination.has_next;
      //     this.has_previousmapping = data.pagination.has_previous;
      //     this.presentpagemapping = data.pagination.index;
      //   })
      // }
      // Clear(){
      //   this.SearchMapping.reset()
      // }
      ClientMaster(name){
        this.taskservice.getclientmasterFilter(name,1).subscribe(data=>{
          this.ClientMasterDrop=data['data']
        })
      }
    
      ProjectMaster(name){
        this.taskservice.getprojectnamemasterFilter(0,name,1).subscribe(data=>{
          this.ProjectMasterDrop=data['data']
        })
      }
      ModuleMaster(name){
        this.taskservice.getmodulenamemasterFilter(0,0,name,1).subscribe(data=>{
          this.ModuleMasterDrop=data['data']
        })
      }
      ClientMasterId(value){
        this.isClientMasterId=value.id
      }
      ProjectMasterId(value){
        this.isProjectMasterId=value.id
      }
      ModuleMasterId(value){
        this.isModuleMasterId=value.id
      }
      Search(){
        if(!this.isClientMasterId){
          this.isClientMasterId=''
        }
        if(!this.isProjectMasterId){
          this.isProjectMasterId=''
        }
        if(!this.isModuleMasterId){ 
          this.isModuleMasterId=''
        }
        this.taskservice.mappingSummary_master_search(this.isModuleMasterId,this.isClientMasterId,this.isProjectMasterId).subscribe(data=>{
          this.mappingList=data['data']
          this.has_nextmapping = data.pagination.has_next;
              this.has_previousmapping = data.pagination.has_previous;
              this.presentpagemapping = data.pagination.index;
        })
      }
      clear(){
        this.search.reset()
        this.isModuleMasterId=''
        this.isClientMasterId=''
        this.isProjectMasterId=''
        this.Search()
      }

      
  public displayFncltmaster(cltmaster?: Clientmaster): string | undefined {
    return cltmaster ? cltmaster.name : undefined;
  }
  public displayFnappnmmaster(promaster?: appNamemaster): string | undefined {
    return promaster ? promaster.name : undefined;
  }
  public displayFnmodnmmaster(modmaster?: ModeuleNamemaster): string | undefined {
    return modmaster ? modmaster.name : undefined;
  }

  get cltmaster() {
    return this.mappingForm.value.get('client_id');
  }

  get promaster() {
    return this.mappingForm.value.get('project_id');
  }
}
class taskmaster {
  client_id: string;
  project_id: string;
  module_id: string;
}