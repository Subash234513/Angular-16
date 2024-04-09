import { Component, OnInit,ViewChild , Output, EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from, fromEvent, } from 'rxjs';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { TaskService } from '../task.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ShareService } from '../share.service';

export interface appName {
  id: string;
  name: string;
}
export interface Client {
  id: string;
  name: string;
}
// export interface ModeuleName {
//   id: string;
//   name: string;
// }
export interface unitHead {
  id: string;
  name: string;
}
export interface teamLead {
  id: string;
  name: string;
}

export interface emplistss {
  id: string;
  name: any;
  full_name: any
}

export interface appName {
  id: string;
  name: string;
}
export interface Client {
  id: string;
  name: string;
}
export interface ModeuleName {
  id: string;
  name: string;
  mapping_id: number;
}

export interface appNamemaster {
  id: string;
  name: string;
}
export interface Clientmaster {
  id: string;
  name: string;
}
export interface ModeuleNamemaster {
  module_id: string;
  name: string;
}
export interface developer {
  id: string;
  name: string;
}

export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
}
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class TaskCreateComponent implements OnInit {
  taskAddForm:FormGroup;
  clientForm:FormGroup;
  projectForm:FormGroup;
  moduleForm:FormGroup;
  mappingForm:FormGroup;
  isLoading = false;
  devtypelist:any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  // setdate = new Date()

  hasnextdevname = true;
  haspreviousdevname = true;
  currentpagedevname: number = 1;

  appNameList: Array<appName>;
  clientList: Array<Client>;
  moduleNameList: Array<ModeuleName>;
  unitheadList: Array<unitHead>;
  developerList: Array<developer>;
  teamldList: Array<teamLead>;

  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  employee_arr = new FormControl();
  task_Id:any;

  set_Threedays_ago:any
 

  appNamemasterList: Array<appNamemaster>;
  clientmasterList: Array<Clientmaster>;
  moduleNamemasterList: Array<ModeuleNamemaster>;


  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('appnmInput') appnmInput: any;

  @ViewChild('clt') matclientAutocomplete: MatAutocomplete;
  @ViewChild('cltInput') cltInput: any;
  
  @ViewChild('modnm') matmodulenameAutocomplete: MatAutocomplete;
  @ViewChild('modnmInput') modnmInput: any;
  
  @ViewChild('unitHD') matunitheadAutocomplete: MatAutocomplete;
  @ViewChild('unitHDInput') unitHDInput: any;
  
  @ViewChild('teamld') matteamleadAutocomplete: MatAutocomplete;
  @ViewChild('teamldInput') teamldInput: any;

  // developer name 
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  // master
  @ViewChild('cltmaster') matclientmasterAutocomplete: MatAutocomplete;
  @ViewChild('cltmasterInput') cltmasterInput: any;

  @ViewChild('appnmmaster') maprotmasterAutocomplete: MatAutocomplete;
  @ViewChild('appnmmasterInput') appnmmasterInput: any;

  @ViewChild('modnmmaster') matmodulenamemasterAutocomplete: MatAutocomplete;
  @ViewChild('modnmmasterInput') modnmmasterInput: any;
  

  constructor(private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlingService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService, private toastr: ToastrService, private datePipe: DatePipe,
    private router: Router,private taskservice:TaskService, private taskShare: ShareService)
    { }

  ngOnInit(): void {
    let d = new Date();
    console.log('Today is: ' + d);
    d.setDate(d.getDate() - 3);
    console.log('3 days ago was: ' + d);
    this.set_Threedays_ago = d;
    
    this.taskAddForm = this.formBuilder.group({
      app_id: ['', Validators.required],
      client: ['', Validators.required],
      // type: ['', Validators.required],
      project_map_id : ['', Validators.required],
      // unit_head: ['', Validators.required],
      // team_lead: ['', Validators.required],
      // employee_arr: ['', Validators.required],
      // task: ['', Validators.required],
      // start_date: [''],
      // end_date: [''],
      // data: new FormArray([
      //   this.dataForTask 
      // ])
      data: new FormArray([
        
      ]),
    
    })
    // client form
    this.clientForm = this.formBuilder.group({
      name: [''],
    })
    // project form
    this.projectForm = this.formBuilder.group({
      name: [''],
      start_date:[''],
      end_date:[''],
    })
     // module form
     this.moduleForm = this.formBuilder.group({
      name: [''],
     
    })

    // mapping form
    this.mappingForm = this.formBuilder.group({
      client_id: [''],
      project_id: [''],
      module_id: [''],
    })
    
    
    this.getdevtype();
    this.getTask();
    // /this.ggg();
   
  }





  
  // get dataForTask(): FormGroup {
  //   let FormGroupArray = this.formBuilder.group({
  //     type: '',
  //     start_date: '',
  //     end_date: '',
  //     developer: '',
  //     task: ''
  //   })
  //   return FormGroupArray
  // }

  // AddTask(){
  //   let control = this.taskAddForm.get("data") as FormArray;
  //   control.push(this.dataForTask)
  // }

  getTask() {
    // if (this.editappraisal) {
    //   // this.vowecfservice.getedit(this.editappraisal)
    //   //   .subscribe(results => {
     
    //   //       this.getappraisallist(results)
          
  
    //   //   })
    // }
    // else {
      (<FormArray>this.taskAddForm.get('data')).push(this.getdetails())
    // }
  
  }

  getdetails() {
    let group = new FormGroup({
      dev_type: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      developer: new FormControl(''),
      task: new FormControl('')
    })
  
  
    return group
  }


  
addSection() {
  const control = <FormArray>this.taskAddForm.get('data');
  control.push(this.getdetails());

}

removeSection(i) {
  const control = <FormArray>this.taskAddForm.get('data');
  control.removeAt(i);

}

getSections(forms) {
  return forms.controls.data.controls;
}


  step = 0;

  setStep(index: number) {
    this.step = index;
  }


  master(){
    // client form
    this.clientForm = this.formBuilder.group({
      name: [''],
    })
    // project form
    this.projectForm = this.formBuilder.group({
      name: [''],
      start_date:[''],
      end_date:[''],
    })
     // module form
     this.moduleForm = this.formBuilder.group({
      name: [''],
     
    })

    // mapping form
    this.mappingForm = this.formBuilder.group({
      client_id: [''],
      project_id: [''],
      module_id: [''],
    })
  }

  getdevtype() {
    this.taskservice.getdevtype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.devtypelist = datas;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

// app name
  appName(){
    let appkeyvalue: String = "";
      this.getappName(appkeyvalue);
  
      this.taskAddForm.get('app_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskservice.getappNameFilter(this.client_Id,value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.appNameList = datas;
  
        })
  
  }

      private getappName(appkeyvalue) {
        this.taskservice.getappNameFilter(this.client_Id,appkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.appNameList = datas;
          })
      }

      public displayFnappnm(appnm?: appName): string | undefined {
        return appnm ? appnm.name : undefined;
      }
    
      get appnm() {
        return this.taskAddForm.value.get('app_id');
      }


// client
      client(){
        let cltkeyvalue: String = "";
          this.getclt(cltkeyvalue);
      
          this.taskAddForm.get('client').valueChanges
            .pipe(
              debounceTime(100),
              distinctUntilChanged(),
              tap(() => {
                this.isLoading = true;
                console.log('inside tap')
      
              }),
              switchMap(value => this.taskservice.getcltFilter(value,1)
                .pipe(
                  finalize(() => {
                    this.isLoading = false
                  }),
                )
              )
            )
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.clientList = datas;
      
            })
      
      }
    
          private getclt(cltkeyvalue) {
            this.taskservice.getcltFilter(cltkeyvalue,1)
              .subscribe((results: any[]) => {
                let datas = results["data"];
                this.clientList = datas;
              })
          }
    
          public displayFnclt(clt?: Client): string | undefined {
            return clt ? clt.name : undefined;
          }
        
          get clt() {
            return this.taskAddForm.value.get('client');
          }

// module name
moduleName(){
            let modkeyvalue: String = "";
              this.getModuleName(modkeyvalue);
          
              this.taskAddForm.get('project_map_id').valueChanges
                .pipe(
                  debounceTime(100),
                  distinctUntilChanged(),
                  tap(() => {
                    this.isLoading = true;
                    console.log('inside tap')
          
                  }),
                  switchMap(value => this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,value,1)
                    .pipe(
                      finalize(() => {
                        this.isLoading = false
                      }),
                    )
                  )
                )
                .subscribe((results: any[]) => {
                  let datas = results["data"];
                  this.moduleNameList = datas;
          
                })
          
          }
        
            private getModuleName(modkeyvalue) {
                this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,modkeyvalue,1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    this.moduleNameList = datas;
                  })
              }
        
              public displayFnmodnm(mod?: ModeuleName): string | undefined {
                return mod ? mod.name : undefined;
              }
            
              get mod() {
                return this.taskAddForm.value.get('module_id');
              }


// unit head
unitHead(){
  let unithdkeyvalue: String = "";
    this.getUnitHead(unithdkeyvalue);

    this.taskAddForm.get('unit_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getUnitHeadFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.unitheadList = datas;

      })

}

  private getUnitHead(unithdkeyvalue) {
      this.taskservice.getUnitHeadFilter(unithdkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.unitheadList = datas;
        })
    }

    public displayFnunitHD(unithd?: unitHead): string | undefined {
      return unithd ? unithd.name : undefined;
    }
  
    get unithd() {
      return this.taskAddForm.value.get('unit_head');
    }


// Team lead
TeamLead(){
  let teamldkeyvalue: String = "";
    this.getTeamLead(teamldkeyvalue);

    this.taskAddForm.get('team_lead').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getTeamLeadFilter(value,1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;

      })

}

  private getTeamLead(teamldkeyvalue) {
      this.taskservice.getTeamLeadFilter(teamldkeyvalue,1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.teamldList = datas;
        })
    }

    public displayFnteamld(teamld?: teamLead): string | undefined {
      return teamld ? teamld.name : undefined;
    }
  
    get teamld() {
      return this.taskAddForm.value.get('team_lead');
    }



    // developer name
    developer(i){
      let devkeyvalue: String = "";
        this.getDeveloper(devkeyvalue);
        (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
        // this.taskAddForm.get('developer').valueChanges
          .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
              console.log('inside tap')
    
            }),
            switchMap(value => this.taskservice.getdeveloperFilter(value,1)
              .pipe(
                finalize(() => {
                  this.isLoading = false
                }),
              )
            )
          )
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.developerList = datas;
    
          })
    
    }
    
      private getDeveloper(unithdkeyvalue) {
          this.taskservice.getdeveloperFilter(unithdkeyvalue,1)
            .subscribe((results: any[]) => {
              let datas = results["data"];
              this.developerList = datas;
            })
        }
    
        public displayFndev(emp?: developer): string | undefined {
          return emp ? emp.name : undefined;
        }
      
        get emp() {
          return this.taskAddForm.value.get('developer');
        }


        autocompletedevScroll() {
          setTimeout(() => {
            if (
              this.matempAutocomplete &&
              this.autocompleteTrigger &&
              this.matempAutocomplete.panel
            ) {
              fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
                .pipe(
                  map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
                  takeUntil(this.autocompleteTrigger.panelClosingActions)
                )
                .subscribe(x => {
                  const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
                  const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
                  const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
                  const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
                  if (atBottom) {
                    if (this.hasnextdevname === true) {
                      this.taskservice.getdeveloperFilter(this.empInput.nativeElement.value, this.currentpagedevname + 1)
                        .subscribe((results: any[]) => {
                          let datas = results["data"];
                          let datapagination = results["pagination"];
                          this.empList = this.empList.concat(datas);
                          if (this.empList.length >= 0) {
                            this.hasnextdevname = datapagination.has_next;
                            this.haspreviousdevname = datapagination.has_previous;
                            this.currentpagedevname = datapagination.index;
                          }
                        }, (error) => {
      
                        })
                    }
                  }
                });
            }
          });
        }


    // client master
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
    
        public displayFncltmaster(cltmaster?: Clientmaster): string | undefined {
          return cltmaster ? cltmaster.name : undefined;
        }
      
        get cltmaster() {
          return this.mappingForm.value.get('client_id');
        }

        client_master_Id=0;
        FocusOut_select_clientmaster(data){
          console.log("client master",data);
          this.client_master_Id = data.id;
        }

      
        clearproject() {
          this.taskAddForm.controls['app_id'].reset("");
          this.taskAddForm.controls['module_id'].reset("");
        }
        clearmodule(){
          this.taskAddForm.controls['module_id'].reset("");
        }


        // project master
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
    
        public displayFnappnmmaster(promaster?: appNamemaster): string | undefined {
          return promaster ? promaster.name : undefined;
        }
      
        get promaster() {
          return this.mappingForm.value.get('project_id');
        }

        project_master_Id=0;
        FocusOut_select_projectmaster(data){
          console.log("project master",data);
          this.project_master_Id = data.id;
        }



                // module master
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
                
                    public displayFnmodnmmaster(modmaster?: ModeuleNamemaster): string | undefined {
                      return modmaster ? modmaster.name : undefined;
                    }
                  
                    get modmaster() {
                      return this.mappingForm.value.get('module_id');
                    }
            
                   






  // createFormate() {
  //   let data = this.taskAddForm.controls;
  //   console.log("create formate",data)
    
  //   let taskclass = new task();
  //   taskclass.app_id = data['app_id'].value.id;
  //   taskclass.client = data['client'].value.id;
  //   taskclass.type = data['type'].value;
  //   taskclass.module_id = data['module_id'].value.id;
  //   // taskclass.unit_head = data['unit_head'].value.id;
  //   // taskclass.team_lead = data['team_lead'].value.id;
  //   // taskclass.developername = data['developername'].value;
  //   taskclass.task = data['task'].value;
  //   taskclass.start_date = data['start_date'].value;
  //   taskclass.end_date = data['end_date'].value;
   
  //   let dateValue = this.taskAddForm.value;
  //   taskclass.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
  //   taskclass.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');

  //   console.log("taskclass", taskclass)
  //   return taskclass;
  // }


  submitForm() {
    // this.taskAddForm.value.developername = this.chipSelectedempid;
    this.SpinnerService.show();
   
    if (this.taskAddForm.value.client.id === undefined || this.taskAddForm.value.client === "") {
      this.toastr.error('Please Select Valid Client');
      this.SpinnerService.hide();
      return false;
    }
    if (this.taskAddForm.value.app_id.id === undefined || this.taskAddForm.value.app_id === "" ) {
      this.toastr.error('Please Select Valid Project ');
      this.SpinnerService.hide();
      return false;
    }
    if (this.taskAddForm.value.project_map_id.id === undefined || this.taskAddForm.value.project_map_id === "") {
      this.toastr.error('Please Select Valid Module');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.taskAddForm.value.type === undefined || this.taskAddForm.value.type === "") {
    //   this.toastr.error('Please Select Valid Dev Type');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.taskAddForm.value.unit_head.id === undefined || this.taskAddForm.value.unit_head === "") {
    //   this.toastr.error('Please Select Valid Unit Head');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.taskAddForm.value.team_lead.id === undefined || this.taskAddForm.value.team_lead === "") {
    //   this.toastr.error('Please Select Valid Team Lead');
    //   this.SpinnerService.hide();
    //   return false;
    // }
 
    // if (this.taskAddForm.value.start_date === "") {
    //   this.toastr.error('Please Select Start Date');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    // if (this.taskAddForm.value.end_date === "") {
    //   this.toastr.error('Please Select End Date');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.taskAddForm.value.task === "") {
    //   this.toastr.error('Please Enter Task');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    // if (this.chipSelectedempid.length === 0) {
    //   this.toastr.error('Please Select Developer Name');
    //   this.SpinnerService.hide();
    //   return false;
    // }

    let details =this.taskAddForm.value.data
    for(let i=0;i<details.length;i++){
     if (details[i].dev_type == '' || details[i].dev_type == null || details[i].dev_type == undefined) {
       this.notification.showError('Please Select Developer Type')
       this.SpinnerService.hide();
       return false
     }
     if (details[i].start_date == '') {
       this.notification.showError('Please Select Planned Start Date')
       this.SpinnerService.hide();
       return false
     }
     if (details[i].end_date == '') {
      this.notification.showError('Please Select Planned End Date')
      this.SpinnerService.hide();
      return false
    }
    if (details[i].developer.id === undefined || details[i].developer === "") {
      this.toastr.error('Please Select Valid Developer');
      this.SpinnerService.hide();
      return false;
    }
    if (details[i].task == '') {
      this.notification.showError('Please Enter Task Name')
      this.SpinnerService.hide();
      return false
    }
    }
    
    this.taskAddForm.value.project_map_id = this.taskAddForm.value.project_map_id.mapping_id
    for (let i in details) {
     details[i].developer = details[i].developer.id;
     details[i].start_date = this.datePipe.transform(details[i].start_date, 'yyyy-MM-dd');
     details[i].end_date = this.datePipe.transform(details[i].end_date, 'yyyy-MM-dd');
    }
    
 
    
      console.log("create",this.taskAddForm.value)
      this.taskservice.taskCreateForm(this.taskAddForm.value)
      .subscribe(res => {
        console.log("vendor", res)
        if(res.message === "Successfully Created"){
          this.notification.showSuccess("Created Successfully!...")
          this.SpinnerService.hide();
          this.onSubmit.emit();
        } 
        else {
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



// app name
  autocompleteAppnmScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getappNameFilter(this.client_Id,this.appnmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.appNameList = this.appNameList.concat(datas);
                    if (this.appNameList.length >= 0) {
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

  // client
  autocompleteCltScroll() {
    setTimeout(() => {
      if (
        this.matclientAutocomplete &&
        this.autocompleteTrigger &&
        this.matclientAutocomplete.panel
      ) {
        fromEvent(this.matclientAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matclientAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matclientAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matclientAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matclientAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getcltFilter(this.cltInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.clientList = this.clientList.concat(datas);
                    if (this.clientList.length >= 0) {
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

  // module name
  autocompletemodnmScroll() {
    setTimeout(() => {
      if (
        this.matmodulenameAutocomplete &&
        this.autocompleteTrigger &&
        this.matmodulenameAutocomplete.panel
      ) {
        fromEvent(this.matmodulenameAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matmodulenameAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matmodulenameAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matmodulenameAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matmodulenameAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getmodulenameFilter(this.client_Id,this.project_Id,this.modnmInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.moduleNameList = this.moduleNameList.concat(datas);
                    if (this.moduleNameList.length >= 0) {
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

// unit head
autocompleteuntheadScroll() {
    setTimeout(() => {
      if (
        this.matunitheadAutocomplete &&
        this.autocompleteTrigger &&
        this.matunitheadAutocomplete.panel
      ) {
        fromEvent(this.matunitheadAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matunitheadAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matunitheadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matunitheadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matunitheadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getUnitHeadFilter(this.unitHDInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.unitheadList = this.unitheadList.concat(datas);
                    if (this.unitheadList.length >= 0) {
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

// team  lead
autocompleteteteamldScroll() {
    setTimeout(() => {
      if (
        this.matteamleadAutocomplete &&
        this.autocompleteTrigger &&
        this.matteamleadAutocomplete.panel
      ) {
        fromEvent(this.matteamleadAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matteamleadAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matteamleadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matteamleadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matteamleadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskservice.getTeamLeadFilter(this.teamldInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.teamldList = this.teamldList.concat(datas);
                    if (this.teamldList.length >= 0) {
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

  // client master
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


   // project master
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

  
// module master
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
  


  getemp(keyvalue, type) {
    this.taskservice.employeesearch(keyvalue, 1, type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.empList = datas;
        console.log("emp data get ", this.empList)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }





  public removedemp(emp: emplistss): void {
    const index = this.chipSelectedemp.indexOf(emp);

    if (index >= 0) {

      this.chipSelectedemp.splice(index, 1);
      console.log(this.chipSelectedemp);
      this.chipSelectedempid.splice(index, 1);
      console.log(this.chipSelectedempid);
      this.empInput.nativeElement.value = '';
    }

  }



  public empSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempByName(event.option.value.name);
    this.empInput.nativeElement.value = '';
    console.log('chipSelectedempid', this.chipSelectedempid)
  }
  private selectempByName(emp) {
    let foundemp1 = this.chipSelectedemp.filter(e => e.name == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter(e => e.name == emp);
    if (foundemp.length) {
      this.chipSelectedemp.push(foundemp[0]);
      this.chipSelectedempid.push(foundemp[0].id)
    }
  }


  autocompleteempScroll(type) {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.hasnextdevname === true) {
                this.taskservice.employeesearch(this.empInput.nativeElement.value, this.currentpagedevname + 1, type)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.hasnextdevname = datapagination.has_next;
                      this.haspreviousdevname = datapagination.has_previous;
                      this.currentpagedevname = datapagination.index;
                    }
                  }, (error) => {

                  })
              }
            }
          });
      }
    });
  }


  set_StartDate:any;
  StartDate(event: string) {
    const date = new Date(event)
    // this.ss1 = date
    this.set_StartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  
  //     const currentYear = new Date().getFullYear();
  //     this.setdefault_date = new Date(currentYear - 0, 0, 22);
  // }




  client_Id=0;
  FocusOut_select_client(data) {
    console.log("client",data);
    this.client_Id = data.id;
    console.log("client- id", this.client_Id)
  }
  project_Id=0;
  FocusOut_select_project(data) {
    console.log("client",data);
    this.project_Id = data.id;
    console.log("project- id", this.project_Id)
  }



  developer_List = [];
  getTaskEdit() {
    this.taskservice.gettaskview(this.task_Id)
      .subscribe(result => {
          let data = result
          console.log("totalldata", data)
          this.developer_List = data.dev_arr;
          
          const startdate = this.datePipe.transform(data.start_date, 'yyyy-MM-dd');
          const enddate = this.datePipe.transform(data.end_date, 'yyyy-MM-dd');
      
          this.taskAddForm.patchValue({
            // "app_id": data.app_id,
            // "client": data.client_name,
            // "type": data.dev_type,
            // "module_id" : data.module_id,
            "unit_head": data.unit_head,
            "team_lead":data.team_lead,
            "employee_arr": data.developer_List,
            "task": data.task_status,
            "start_date": startdate,
            "end_date": enddate,
          })

      })
  }


  clientSubmit(){
    this.SpinnerService.show();
    if (this.clientForm.value.name === "") {
      this.toastr.error('Please Enter Client');
      this.SpinnerService.hide();
      return false;
    }

    this.taskservice.clientForm(this.clientForm.value)
    .subscribe(res => {
      console.log("client click", res)
      if(res.message == 'Successfully Created'){
        this.notification.showSuccess("Created Successfully!...");
        this.clientForm = this.formBuilder.group({
          name: [''],
        })
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

  projectSubmit(){
    this.SpinnerService.show();
    if (this.projectForm.value.name === "") {
      this.toastr.error('Please Enter Project');
      this.SpinnerService.hide();
      return false;
    }
    if (this.projectForm.value.start_date === "") {
      this.toastr.error('Please Select Start Date');
      this.SpinnerService.hide();
      return false;
    }
    if (this.projectForm.value.end_date === "") {
      this.toastr.error('Please Select End Date');
      this.SpinnerService.hide();
      return false;
    }
    let dateValue = this.projectForm.value;
    dateValue.start_date = this.datePipe.transform(dateValue.start_date, 'yyyy-MM-dd');
    dateValue.end_date = this.datePipe.transform(dateValue.end_date, 'yyyy-MM-dd');
    this.taskservice.projectForm(this.projectForm.value)
    .subscribe(res => {
      console.log("project click", res)
      if(res.message == 'Successfully Created'){
        this.notification.showSuccess("Created Successfully!...");
        this.projectForm = this.formBuilder.group({
          name: [''],
          start_date:[''],
          end_date:[''],
        })
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
  moduleSubmit(){
    this.SpinnerService.show();
    if (this.moduleForm.value.name === "") {
      this.toastr.error('Please Enter Module');
      this.SpinnerService.hide();
      return false;
    }
    this.taskservice.moduleForm(this.moduleForm.value)
    .subscribe(res => {
      console.log("module click", res)
      if(res.message == 'Successfully Created'){
        this.notification.showSuccess("Created Successfully!...");
        this.moduleForm = this.formBuilder.group({
          name: [''],
         
        })
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

  mappingSubmit(){
    this.SpinnerService.show();
    if (this.mappingForm.value.client_id === "") {
      this.toastr.error('Please Select Vaild Client');
      this.SpinnerService.hide();
      return false;
    }
    if (this.mappingForm.value.project_id === "") {
      this.toastr.error('Please Select Vaild Project');
      this.SpinnerService.hide();
      return false;
    }
    if (this.mappingForm.value.module_id === "") {
      this.toastr.error('Please Select Vaild Module');
      this.SpinnerService.hide();
      return false;
    }

    this.taskservice.mappingForm(this.createFormatemapping())
    .subscribe(res => {
      console.log("module click", res)
      if(res.message == 'Successfully Created'){
        this.notification.showSuccess("Created Successfully!...");
        this.mappingForm = this.formBuilder.group({
          client_id: [''],
          project_id: [''],
          module_id: [''],
        })
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

  
  set_masterStartDate:any;
  MasterStartDate(event: string) {
    const date = new Date(event)
    this.set_masterStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  oncancel() {
   
    this.onCancel.emit()

}

Documentfilearray: any = []
onFileSelected(e) {
  console.log("e in file", e)
  for (var i = 0; i < e.target.files.length; i++) {
    this.Documentfilearray.push(e.target.files[i])
  }
  console.log("document array===>", this.Documentfilearray)
}

deleteInlineFile(fileindex, data) {
  console.log("fileindex", fileindex)
  let filedata = this.Documentfilearray
  console.log("filedata for delete before", filedata)
  console.log("filedata selected", data)

    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)
}

}

class task {
  
  app_id: string;
  client: string;
  type: string;
  module_id : string;
  unit_head: string;
  team_lead: string;
  employee_arr: string;
  task:string;
  start_date: string;
  end_date: string;


}

class taskmaster {
  client_id: string;
  project_id: string;
  module_id: string;
}

