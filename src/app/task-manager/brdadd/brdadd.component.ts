import { Component, OnInit, ViewChild ,Output,EventEmitter} from '@angular/core';
import { FormGroup ,FormBuilder, FormControl, Validators} from '@angular/forms';
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from 'src/app/service/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ShareddataService } from '../shareddata.service';
@Component({
  selector: 'app-brdadd',
  templateUrl: './brdadd.component.html',
  styleUrls: ['./brdadd.component.scss']
})
export class BrdaddComponent implements OnInit {
  brdaddform:FormGroup
  isLoading: boolean;
  moduledrop: any;
  client_id:number=0;
  appNameList: any;
  contentShowLegal: any;

  selectedLegalDocumentText = new FormControl('')
  clientname: any;
  appname: any;
  dataname: any;
  details: any;
  constructor(private notification: NotificationService,private SpinnerService: NgxSpinnerService,private fb:FormBuilder,private TaskManagerService: TaskManagerService, private sanitizer: DomSanitizer,private LocalShareService:ShareddataService) { }
  clientdrop:any=[]
  @ViewChild('clientteamrole') matclienttAutocomplete: MatAutocomplete;
  @ViewChild('modulerole') matmoduleAutocomplete: MatAutocomplete;
  @ViewChild('appnm') matAutocomplete: MatAutocomplete;
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
  ngOnInit(): void {
let data: any= this.LocalShareService.brddata.value;
   this.brdaddform = data
    console.log('dtaes', this.brdaddform)
    this.brdaddform=this.fb.group({
      client_id:new FormControl("",[Validators.required]),
      from_date:'',
      to_date:'',
      query:new FormControl("",[Validators.required]),
      module_id:'',
      details:new FormControl("",[Validators.required]),
      project:new FormControl("",[Validators.required])

    })
    // this.brdaddform.patchValue({
    //   client_id:data.app,
    //   project:data.client,
    //   details:data.details,
    //   query:data.name
    // })
  }
  clientdopdown(){
    this.TaskManagerService.getClient('').subscribe((results: any[]) => {
      let datas = results["data"];
      this.clientdrop = datas;
    })
  }
  clientclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.brdaddform.get('client_id').valueChanges
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

  
get gettingPreviewValue() {
  console.log("dataframe for patch")
  let data = this.sanitizer.bypassSecurityTrustHtml(this.brdaddform.get('details').value);
  return this.contentShowLegal ? this.contentShowLegal = data : undefined
}


config: any = {
  tabDisable: true,
  height: "500px",
  toolbar: [
    [
      "font",
      [
        "bold",
        "italic"
      ]
    ],
    ["para", ["ul", "ol"]]
  ],
};

editorDisabled = false;
get sanitizedHtml() {
  return this.sanitizer.bypassSecurityTrustHtml(this.brdaddform.get('details').value);
}

onBlur() {
  // console.log('Blur');
}
onDelete(file) {
  // console.log('Delete file', file.url);
}
summernoteInit(event) {
  // console.log(event);
  console.log('event', event)
}

get selectedposition() {
  console.log("trigger check")
  return
}

  getModuledrop() {
    let data = this.brdaddform.value.client_id?.id
    if(this.client_id!=0 && data!="" && data!= undefined && data!=null ){
      this.TaskManagerService.getmodule('').subscribe(res=>{
        this.moduledrop = res['data']
      })
    }
    else{
      this.moduledrop=[]
    }
    
  }
 
  public displayccclient(clt?: Client): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displaymoduleclient(clt?: moduleclient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  public displayFnappnm(appnm?: appName): string | undefined {
    return appnm ? appnm.name : undefined;
  }
  
  moduleClick() {
    let data = this.brdaddform.value.client_id?.id
    if(this.client_id!=0 && data!="" && data!= undefined && data!=null ){
      let devkeyvalue: String = "";
      // this.getsprint(devkeyvalue);
      // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
      this.brdaddform.get('module_id').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
    
          }),
          switchMap(value => this.TaskManagerService.getmodule(value)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.moduledrop = datas;
        })
    }
    else{
      this.moduledrop=[]
    }
    
  }

  submitbrd(){
    // client_id:'',
    //   from_date:'',
    //   to_date:'',
    //   query:'',
    //   module_id:'',
    //   details:''
    // {"name":"vendor spec","details":"migration","module_id":2,"client_id":2,"story_id":1}

    let value=this.brdaddform.value
    if(value.query==''||value.query==undefined||value.query==null){
this.notification.showError("Please Choose Name")
return false
    }
    if(value.details==''||value.details==undefined||value.details==null){
      this.notification.showError("Please Choose Details")
      return false
          }
if(value.project==''||value.project==undefined||value.project==null){
  this.notification.showError("Please Choose Project")
return false}
if(value.client_id==''||value.client_id==undefined||value.client_id==null){
  this.notification.showError("Please Choose Client")
return false}
    let data={
      "name":value.query,
      "details":value.details,
      "app_id":value.project.id,
      "client_id":value.client_id.id

    }
    this.TaskManagerService.postbrd(data).subscribe(result => {
      this.SpinnerService.show();
      console.log("sprint summary", result)
      if(result.status){
          this.notification.showSuccess(result.message)
          this.brdaddform.reset()
          this.SpinnerService.hide();
          this.client_id=0
          this.OnSubmit.emit()

      }
      else{
        this.notification.showError(result.description)

      }
  })
  
}
private getappName(appkeyvalue) {
  this.TaskManagerService.getappNameFilter(this.client_id, appkeyvalue, 1)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.appNameList = datas;
    })
}
appName() {
  let appkeyvalue: String = "";
  this.getappName(appkeyvalue);

  this.brdaddform.get('project').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.TaskManagerService.getappNameFilter(this.client_id, value, 1)
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
FocusOut_select_client(data) {
  console.log("client", data);
  this.client_id = data.id;
  console.log("client- id", this.client_id)
  this.brdaddform.get("project").patchValue('')
}
cancelbrd(){
  this.OnSubmit.emit()

}
chooseclient(data){
this.client_id=data.id
}

}
export interface Client {
  id: string;
  name: string;
}

export interface moduleclient {
  id: string;
  name: string;
}

export interface appName {
  id: string;
  name: string;
}

