import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ShareddataService } from '../shareddata.service';
import { TaskManagerService } from '../task-manager.service';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';


@Component({
  selector: 'app-brdview',
  templateUrl: './brdview.component.html',
  styleUrls: ['./brdview.component.scss']
})
export class BrdviewComponent implements OnInit {
  contentShowLegal: any;
  details: any;
  appname: any;
  clientdrop:any=[]
  client_id:number=0;
  isLoading: boolean;
  brdviewform:FormGroup
  appNameList: any;
  constructor(private sanitizer: DomSanitizer,private fb:FormBuilder, private LocalShareService:ShareddataService,private TaskManagerService: TaskManagerService) { }
  @Output() OnSubmit = new EventEmitter<any>();
  ngOnInit(): void {
    let data: any= this.LocalShareService.brdview.value;
    this.brdviewform = data
    this.brdviewform=this.fb.group({
      client_id:"",
      project:"",
      query:"",
      details:""
    })
    this.brdgetform();
    this.brdviewform.patchValue({
      client_id:data.app,
      project:data.client,
      details:data.details,
      query:data.name
    })

    
   
  }
  
  get gettingPreviewValue() {
    console.log("dataframe for patch")
    let data = this.sanitizer.bypassSecurityTrustHtml(this.brdviewform.get('details').value);
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
  return this.sanitizer.bypassSecurityTrustHtml(this.brdviewform.get('details').value);
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
brdgetform() {

}
chooseclient(data){
  this.client_id=data.id
  }
cancelbrd(){
  this.OnSubmit.emit()

}
clientdopdown(){
  this.TaskManagerService.getClient('').subscribe((results: any[]) => {
    let datas = results["data"];
    this.clientdrop = datas;
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

  this.brdviewform.get('project').valueChanges
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
clientclick() {
  let devkeyvalue: String = "";
  // this.getsprint(devkeyvalue);
  // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
  this.brdviewform.get('client_id').valueChanges
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

FocusOut_select_client(data) {
  console.log("client", data);
  this.client_id = data.id;
  console.log("client- id", this.client_id)
  this.brdviewform.get("project").patchValue('')
}
public displayccclient(clt?: Client): string | undefined {
  // console.log(`Client testing data - ${clt.name}`);
  return clt ? clt.name : undefined;
}

public displayFnappnm(appnm?: appName): string | undefined {
  return appnm ? appnm.name : undefined;
}
}
export interface Client {
  id: string;
  name: string;
}

export interface appName {
  id: string;
  name: string;
}
