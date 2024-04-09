import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator } from '@angular/forms';
import { TaskService } from '../task.service';
import { Client, appName } from '../tasksummary/tasksummary.component';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Clientmaster, appNamemaster } from '../task-create/task-create.component';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { interfacedatas } from '../EmpTask/emp-task-summary/emp-task-summary.component';
import { ApicallserviceService } from 'src/app/AppAutoEngine/API Services/Api_and_Query/apicallservice.service';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { NotificationService } from '../notification.service';
import { ToastrService } from '../../AppAutoEngine/import-services/CommonimportFiles';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [imp.TaskApi]
})
export class ActivityComponent implements OnInit {

  activitySummary: any = true;
  activityform: FormGroup;
  // searchform: FormGroup;
  addteam: any; // You might want to specify the correct type for addteam
  activitylist: any[];
  // presentpageactivity: number;
  // pagesiz: number;
  name: FormGroup;
  visiable: any;
  teamlist: any;
  yourModel: any;
  taskAddForm: FormGroup;
  has_previous: boolean;
  has_next: boolean;
  activitySearch: any;
  clientList: any[]; // Replace 'any' with the actual type of your client data
  isLoading: boolean;
  moduleNameList: any[];
  teammember: any;
  chipselectemember: any[];
  removedmember: any;
  separatorKeysCodes: any[];
  memberControl: FormControl;
  memberSelected: any;
  allmemberslist: any[];
  submitted: any;
  showmember: boolean;
  memberlist: any[];
  presentpagemember: number;
  pagesizemember: number;
  has_nextactivity: any;
  has_previousactivity: any;
  
  // taskservice: any;
  showcheckbox: boolean;
  teamdetailscreation: boolean;
  teamSummary: boolean;
  mappingSummary: boolean;
  moduleSummary: boolean;
  projectSummary: boolean;
  clientSummary: boolean;
  presentpageactivity = 1;
  pagesiz = 10;
  activitycreation: boolean = false;
  viewlist: any[] = []; // Declare the 'viewlist' property
  clientlist: any;
  has_nextclient: any;
  presentpageclient: any;
  modulelist: any;
  presentpagemodule: any;
  has_nextmodule: any;
  has_previousview: any;
  presentpageview: any;
  has_nextview: any;
  // taskapi: any;
  // apicall: any;
  EmpTaskCreateObj: any;
  errorHandler: any;
  activity: any;
  //  displayFnclt: any;
  EmpTaskCreate: any;
  displayFnmodnm: any

  fb: any;
  currentpage: any;
  cltInput: any;
  matclientAutocomplete: any;
  autocompleteTrigger: any;
  appNameList: any=[];
  modnmInput: any;
  appNamemasterList: any;
  appnmInput: any;
  maprotmasterAutocomplete: any;
  // @ViewChild('appnmInput') appnmInput: any;
  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  projectList: any;
  teamcreation: boolean;
  mappingcreation: boolean;
  modulecreation: boolean;
  clientcreation: boolean;
  projectcreation: boolean;
  notify: any;
  send_value = '';
  presentpageteam: number;

  // client_Id: any;
  clientmasterList: any;
  matclientmasterAutocomplete: any;
  cltmasterInput: any;
  matteamleadAutocomplete: any;
  teamldInput: any;
  teamldList: any;
  client_id: any;
  showTasksPage: boolean;
  showpagedata: boolean;
  showtabledatas: boolean;
  storyTaskList: any;
  dataPaginationt: any;
  has_nextStoryTask: any;
  has_previousStoryTask: any;
  presentpageStoryTask: any;
  filteredProjects: any;


  constructor(private formBuilder: FormBuilder, private taskservice: TaskService, private apicall: ApicallserviceService, private taskapi: imp.TaskApi,private notification: NotificationService,
    private toastr: ToastrService, private SpinnerService: NgxSpinnerService) {
    // Initialize form groups and controls

    this.activityform = this.formBuilder.group({
      // Define form controls
      name: ''
    });



    // Initialize other properties
    // ...
  }
  oncancelteam() {
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
    this.activitySummary = true;
    this.teamcreation = false;
    this.showmember = false;
    this.showcheckbox = false;
    this.activitycreation = false;

    this.taskAddForm.reset();

  }

  ngOnInit(): void {

    this.taskAddForm = this.formBuilder.group({
      client: '',
      project: '',
      activity: '',
      app_id: ''


      // Define your form controls here
    });

    // const selectedClientId = this.taskAddForm.get('client').value;

    // Filter projects based on the selected client
    // this.filteredProjects = this.projectList.filter(project => project.clientId === selectedClientId);

    // Reset the selected project to null to avoid issues when changing clients
    // this.taskAddForm.get('project').setValue(null);
    this.get_activitySummary(1);
    //  this.dropdownsummaryclient_activity('')



  }



  get_activitySummary(pageno) {
    let page = 0;
    this.taskservice.searchactivitycategory(this.send_value, pageno).subscribe(
      result => {
        this.activitylist = result['data'];
        let dataPagination = result['pagination'];
        console.log("Activity Data", this.activitylist)
        if (this.activitylist.length > 0) {
          this.has_nextactivity = dataPagination.has_next;
          this.has_previousactivity = dataPagination.has_previous;
          this.presentpageteam = dataPagination.index;
        }
      })
  }
  //search
  searchform(page = 1
  ) {
    let formValue = this.activityform.value
    console.log("Search Values", formValue)
    this.send_value = ""
    if (formValue.name) {
      this.send_value = this.send_value + '&query=' + formValue.name
    }
    this.taskservice.searchactivitycategory(this.send_value, page).subscribe(result => {
      this.activitylist = result['data'];
      let dataPagination = result['pagination'];
      if (this.activitylist.length > 0) {
        this.has_nextactivity = dataPagination.has_next;
        this.has_previousactivity = dataPagination.has_previous;
        this.presentpageteam = dataPagination.index;
      }

    })

  }

  clearForm(page = 1) {
    // this.SpinnerService.show();
    this.activityform.reset();
    let formValue = this.activityform.value
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


  get_dropdownclient_activity(activity_id) {
    this.taskservice.dropdownsummaryclient_activity(activity_id).subscribe(result => {
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
  // displayFnappnm(appnm?: interfacedatas): string | undefined {
  //   return appnm ? appnm.name : undefined;
  // }

  Projectsearch(clientdata, Typedata) {
    // clientdata.id = 5;
    console.log(Typedata)
    if (clientdata?.id == undefined) {
      return false
    }
    this.apicall.ApiCall('get', this.taskapi.tasksApi.api.projectSearch + '/' + clientdata?.id + '?' + this.taskapi.tasksApi.queries.query + Typedata +
      '&' + this.taskapi.tasksApi.queries.status + 2)
      .subscribe(results => {
        this.projectList = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  resetModule() {
    // this.EmpTaskCreate.controls['project_map_id'].reset()
    // this.taskAddForm.reset();
  }

  teamSearch(hint: any) {
    if (hint == 'next') {
      this.get_activitySummary(this.presentpageteam + 1)
    }
    else if (hint == 'previous') {
      this.get_activitySummary(this.presentpageteam - 1)
    }
    else {
      this.get_activitySummary(1)
    }
  }

  // }
  oncancelactivity() {
    // Implementation
  }

  activitysubmit() {
    // Implementation
  }
  moduleSearch(hint: any) {
    if (hint == 'next') {
      this.get_activitySummary(this.presentpagemodule + 1)
    }
    else if (hint == 'previous') {
      this.get_activitySummary(this.presentpagemodule - 1)
    }
    else {
      this.get_activitySummary(1)
    }
  }
  // clearForm() {
  //   this.activityform.reset();

  // }

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
  // getModule(clientdata, projectdata, Typedata) {
  //   if (clientdata?.id == undefined || projectdata?.id == undefined) {
  //     return false
  //   }
  //   this.apicall.ApiCall('get', this.taskapi.tasksApi.api.moduleSearch + projectdata?.id + '?' + 'client_id=' + clientdata?.id + '&' + this.taskapi.tasksApi.queries.query +
  //     Typedata + '&' + this.taskapi.tasksApi.queries.status + 2)
  //     .subscribe(results => {
  //       this.EmpTaskCreateObj.moduleList = results['data']
  //     }, (error) => {
  //       this.errorHandler.handleError(error);
  //       this.SpinnerService.hide();
  //     })
  // }
  resetProjectAndModule() {
    // implementation goes here
  }
  // public displayFnappnm(appnm?: appName): string | undefined {
  //   return appnm ? appnm.name : undefined;
  // }
  //  addactivity(arg1: any, arg2: any, arg3: any ) {
  //     // Implementation goes here
  //   }

  addactivity(arg: any): void {
    // Your method implementation here
    console.log(arg);
    this.activitycreation = true;
    this.activitySummary = false;

    this.clientList = [];
    this.isLoading = false;
    this.moduleNameList = [];
  }

  // clearproject() {
  //   this.taskAddForm.controls['app_id'].reset("");
  //   this.taskAddForm.controls['module_id'].reset("");
  // }

  // client
  client() {
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
        switchMap(value => this.taskservice.getcltFilter(value, 1)
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

  getclt(cltkeyvalue) {
    this.taskservice.getcltFilter(cltkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientList = datas;
      })
  }

  // public displayFnclt(clt?: Client): string | undefined {
  //   return clt ? clt.name : undefined;
  // }

  // get clt() {
  //   return this.taskAddForm.value.get('client');
  // }

  // client master
  clientmaster() {
    let teamldkeyvalue: String = "";
    this.getclientmaster(teamldkeyvalue);

    this.taskAddForm.get('client').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getclientmasterFilter(value, 1)
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
    this.taskservice.getclientmasterFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.clientmasterList = datas;
      })
  }

  // public displayFncltmaster(cltmaster?: Clientmaster): string | undefined {
  //   return cltmaster ? cltmaster.name : undefined;
  // }

  // get cltmaster() {
  //   return this.taskAddForm.value.get('client');
  // }

  client_Id = 0;
  FocusOut_select_client(data) {
    console.log("client", data);
    this.client_Id = data.id;
    console.log("client- id", this.client_Id)
  }

  client_master_Id = 0;
  FocusOut_select_clientmaster(data) {
    console.log("client master", data);
    this.client_master_Id = data.id;
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
                this.taskservice.getprojectFilter(this.appnmInput.nativeElement.value, this.currentpage + 1)
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


  // project master
  projectnamemaster() {
    // let teamldkeyvalue: String = "";
    // this.getprojectnamemaster(teamldkeyvalue);

    this.taskAddForm.get('project').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        // getappNameFilter--->Old Api
        switchMap(value => this.taskservice.getprojectFilter( value, 1)
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

  private getprojectnamemaster(teamldkeyvalue) {
    this.taskservice.getprojectFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appNamemasterList = datas;
      })
  }

  // public displayFnappnmmaster(promaster?: appNamemaster): string | undefined {
  //   return promaster ? promaster.name : undefined;
  // }

  // get promaster() {
  //   return this.taskAddForm.value.get('project');
  // }

  project_master_Id = 0;
  FocusOut_select_projectmaster(data) {
    console.log("project master", data);
    this.project_master_Id = data.id;
  }
  project_Id = 0;
  FocusOut_select_project(data) {
    console.log("client", data);
    this.project_Id = data.id;
    console.log("project- id", this.project_Id)
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
                this.taskservice.getprojectnamemasterFilter(this.client_master_Id, this.appnmInput.nativeElement.value, this.currentpage + 1)
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




  // client_master_Id(client_master_Id: any, value: any, arg2: any) {
  //   throw new Error('Method not implemented.');
  // }
  // client_Id = 0
  // app name
  // app name
  activityValue:any;
  onActivityInputChange(event: any) {
    this.activityValue = event.target.value;
    console.log('Project Value:', this.activityValue);
    this.getappName(this.activityValue);

  }
  appName() {
    let appkeyvalue: String = "";
    this.getappName(this.activityValue);

    this.taskAddForm.get('project').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.taskservice.getprojectFilter(value, 1)
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

getappName(appkeyvalue) {
    this.taskservice.getprojectFilter( appkeyvalue, 1)
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

  // master() {
  //   // client form
  //   this.taskAddForm = this.formBuilder.group({
  //     name: [''],
  //   })
  //   // project form
  //   this.taskAddForm = this.formBuilder.group({
  //     name: [''],
  //     start_date: [''],
  //     end_date: [''],
  //   })
  //   // module form
  //   this.taskAddForm = this.formBuilder.group({
  //     name: [''],

  //   })

  //   // mapping form
  //   this.taskAddForm = this.formBuilder.group({
  //     client_id: [''],
  //     project_id: [''],
  //     module_id: [''],
  //   })
  // }
  appNamemaster(appkeyvalue) {
    this.taskservice.getprojectFilter( appkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.appNameList = datas;
      })
  }


  // get appnm() {
  //   return this.taskAddForm.value.get('app_id');
  // }
  modulename() {

  }
  // master() {

  // }
  Activitypost() {
    this.taskservice.Activitypost
  }

  // clearmodule() {
  //   // Implementation
  // }

  autocompletemodnmScroll() {
    // Implementation
  }

  moduleName() {
    // Implementation
  }
  taskaddform = {

    client: '',
    project: '',
    activity: ''

  }
  showAlert() {
    alert('fill to the required field');
  }

  project() {

  }

  submit() {
    this.SpinnerService.show();
    if (this.taskAddForm.value.client === ""||this.taskAddForm.value.client=== null||this.taskAddForm.value.client===undefined) {
      this.toastr.error('Choose the client');
      this.SpinnerService.hide();
      return false;
    }
    if (this.taskAddForm.value.app_id === ""||this.taskAddForm.value.app_id === null||this.taskAddForm.value.app_id === undefined) {
      this.toastr.error('choose the project');
      this.SpinnerService.hide();
      return false;
    }
    if (this.taskAddForm.value.activity === ""||this.taskAddForm.value.activity === null||this.taskAddForm.value.activity === undefined) {
      this.toastr.error('Enter activity');
      this.SpinnerService.hide();
      return false;
    }
   
    let client = this.taskAddForm.get('client').value;
    let project = this.taskAddForm.get('app_id').value;
    let activity = this.taskAddForm.get('activity').value;
    let payload = {

      "client_id": client.id,
      "app_id": project.id,
      "activity": activity



    }

   
    this.taskservice.Activitypost(payload).subscribe(
      result => {
        if(result.code){
          this.notification.showError(result.description)
        }
        else{
          this.notification.showSuccess(result.message)
          this.taskAddForm.reset()
          this.activitycreation =false;
          this.activitySummary = true;
          this.get_activitySummary(1)
          this.SpinnerService.hide();
        }
       
      })
  }

  oncancelClient() {

  }

  clientchange(data) {

  }

  focusClient(event: any) {
    // Implement logic when client input is focused
  }

  focusProject(event: any) {
    // Implement logic when project input is focused
  }

  displayFnclt(client: any): string {
    return client && client.name ? client.name : '';
  }

  displayFnProject(project: any): string {
    return project && project.name ? project.name : '';
  }

  // You need to implement methods to fetch client and project data
  // For example, fetchClients() and fetchProjects()

  fetchClients(): any[] {
    // Implement your logic to fetch clients
    return [{ id: 1, name: 'Client 1' }, { id: 2, name: 'Client 2' }];
  }

  fetchProjects(): any[] {
    // Implement your logic to fetch projects
    return [
      { id: 1, name: 'Project A', clientId: 1 },
      { id: 2, name: 'Project B', clientId: 1 },
      { id: 3, name: 'Project C', clientId: 2 },
      { id: 4, name: 'Project D', clientId: 2 },
    ];
  }

}
