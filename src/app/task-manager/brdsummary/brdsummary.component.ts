import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup,FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorhandlingService } from 'src/app/ppr/errorhandling.service';
import { ShareddataService } from '../shareddata.service';

@Component({
  selector: 'app-brdsummary',
  templateUrl: './brdsummary.component.html',
  styleUrls: ['./brdsummary.component.scss']
})
export class BrdsummaryComponent implements OnInit {
  brdsummary:any=[]
  has_next:boolean
  brdsummarform:FormGroup
  has_previous:boolean
  presentpage:number=1
  pagesize:number=10
  isLoading: boolean;
  clientdrop:any=[]
  addbrdform:boolean=false
  SummaryForm:boolean=true
  brdadd:boolean=false
  brdview:boolean=false
  @ViewChild('clientteamrole') matclienttAutocomplete: MatAutocomplete;
  @ViewChild('modulerole') matmoduleAutocomplete: MatAutocomplete;
  @ViewChild('closebutton') closebutton;

  moduledrop: any;

  constructor(private SpinnerService: NgxSpinnerService,private TaskManagerService: TaskManagerService,private fb: FormBuilder, private errorHandler: ErrorhandlingService,private LocalShareService:ShareddataService) { }

  ngOnInit(): void {
    this.brdsummarform=this.fb.group({
      client_id:'',
      from_date:'',
      to_date:'',
      query:'',
      module_id:'',
      details:''
    })
    this.brdsummaryfunc()
    
  }
  brdsummaryfunc(){
    let params='?page='+this.presentpage
    let client_id=this.brdsummarform.get('client_id').value
    client_id?params+='&client_id='+client_id.id:''

    let module_id=this.brdsummarform.get('module_id').value
    module_id?params+='&client_id='+module_id.id:''

    let query=this.brdsummarform.get('query').value
    query?params+='&query='+query:''

    let from_date=this.brdsummarform.get('from_date').value
    from_date?params+='&from_date='+from_date:''

    let to_date=this.brdsummarform.get('to_date').value
    to_date?params+='&to_date='+to_date:''

    this.TaskManagerService.getbrd(params).subscribe(result => {
      this.SpinnerService.show();
    
      console.log("sprint summary", result)
      this.brdsummary = result['data']
      let dataPagination = result['pagination'];
      if(this.brdsummary.length>0){
        this.has_next = dataPagination.has_next;
          this.has_previous= dataPagination.has_previous;
          // this.presentpage= dataPagination.index;
          this.SpinnerService.hide();

      }

      this.SpinnerService.hide();

    })
  }
  previousPage(){
    this.presentpage=this.presentpage-1
    this.brdsummary('')
  }
  nextPage(){
    this.presentpage=this.presentpage+1
    this.brdsummary('')
  }
  clientclick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.brdsummarform.get('client_id').valueChanges
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
  clientdopdown(){
    this.TaskManagerService.getClient('').subscribe((results: any[]) => {
      let datas = results["data"];
      this.clientdrop = datas;
    })
  }
  getModuledrop() {
    this.TaskManagerService.getmodule('').subscribe(res=>{
      this.moduledrop = res['data']
    })
  }
  public displayccclient(clt?: Client): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }

  patch(type){
   
    // let datas = this.brdsummarform.value
    //   this.TaskManagerService.getbrd(datas)
    //   .subscribe((res) => {
      this.LocalShareService.brdview.next(type);
        // this.brdsummarform.patchValue({
        //   client_id: type.client,
        //   query: type.app.name, 
        //   module_id: type.name,
        //   details: type.details
        // })
       
        this.brdview = true;
        this.SummaryForm = false;
      
  
}
  moduleClick() {
    let devkeyvalue: String = "";
    // this.getsprint(devkeyvalue);
    // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
    this.brdsummarform.get('module_id').valueChanges
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
  public displaymoduleclient(clt?: moduleclient): string | undefined {
    // console.log(`Client testing data - ${clt.name}`);
    return clt ? clt.name : undefined;
  }
  reset(){
    this.brdsummarform.reset()
    this.presentpage=1
    this.brdsummaryfunc()
  }
  add(){
this.SummaryForm=false
this.brdadd=true
this.brdsummarform.reset()
  }
  returntosummary(){
    this.presentpage=1
    this.brdsummaryfunc()
    this.SummaryForm=true
this.brdadd=false
this.closebutton.nativeElement.click();
  }

  returntobrdview(){
    this.presentpage=1
    this.brdsummaryfunc()
    this.SummaryForm=true
this.brdadd=false
this.brdview=false
this.closebutton.nativeElement.click();
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