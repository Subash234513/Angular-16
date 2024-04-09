import { Component, OnInit,ViewChild,Output,EventEmitter } from '@angular/core';
import { FormArray, FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { AtmaService} from '../atma.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import {MatAutocompleteSelectedEvent,MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {finalize,switchMap,tap,map,takeUntil} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ShareService } from '../share.service';
import { formatDate, DatePipe} from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
export interface questypelist{
  id:number;
  name:string;
}
export interface docgrouplist{
  id:number;
  name:string;
}
export interface deptlist{
  id:number;
  name:string;
}
export interface employeelistss {
  id: string;
  full_name: string;
}
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-document-questioner-mapping',
  templateUrl: './document-questioner-mapping.component.html',
  styleUrls: ['./document-questioner-mapping.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class DocumentQuestionerMappingComponent implements OnInit {
  
  constructor(private fb:FormBuilder,private atmaservice:AtmaService,private notification:NotificationService,
    private router:Router,private shareservice:ShareService,private datepipe:DatePipe) { }
  MappingForm:FormGroup;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  questypelist:Array<any>=[];
  categorylist:Array<any>=[];
  Ventypelist:Array<any>=[];
  criticallist:Array<any>=[];
  docgrouplist:Array<any>=[];
  periodlist:Array<any>=[];
  processlist:Array<any>=[];
  deptlist:Array<any>=[];
  public employeelist:employeelistss[];
  public chipSelectedDept: employeelistss[] = [];
  public chipSelectedDeptid = [];
  mappingid:any
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('typeauto') mattypename:MatAutocomplete;
  @ViewChild('typeinput') typeInput;
  @ViewChild('docauto') matdocname:MatAutocomplete;
  @ViewChild('docinput') docInput;
  @ViewChild('deptauto') matdeptname:MatAutocomplete;
  @ViewChild('deptinput') deptInput;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  quesdoc = [{ 'value': false, 'display': 'Questioner' }, { 'value': true, 'display': 'Document' }];
  venact = [{ 'value': false, 'display': 'Vendor' }, { 'value': true, 'display': 'Activity' }];
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();


  ngOnInit(): void {

    let data = this.shareservice.venmapedit.value
   this.mappingid = data


    this.MappingForm = this.fb.group({
      mappingheader:new FormArray([
        // this.mappingdetails()
      ])
    })

    this.getmappingdetails()

    this.getcategorylists();
    this.getvendortypelist();
    this.getcriticalitylist();
    this.getperiodlists();
    this.getprocesslist();

  }

  getmappingdetails() {
    if(this.mappingid){
      this.atmaservice.docmappingsingleget( this.mappingid)
      .subscribe(results=>{
        this.getmappinglist(results);
      })
    }
    else{
      (<FormArray>this.MappingForm.get('mappingheader')).push(this.mappingdetails())
    }
   
  }

  getmappinglist(datas){
    
      let id:FormControl = new FormControl('');
      let rel_cat:FormControl = new FormControl('');
      let vendor_type:FormControl = new FormControl('');
      let criticality:FormControl = new FormControl('');
      let type_id:FormControl = new FormControl('');
      let is_doc:FormControl = new FormControl('');
      let document_group_id:FormControl = new FormControl('');
      let dept_id:FormControl = new FormControl('');
      let period:FormControl = new FormControl('');
      let process:FormControl = new FormControl('');
      let is_activity:FormControl = new FormControl('');
      // let expiration_date:FormControl = new FormControl('');
      let order:FormControl = new FormControl('');

      const mapformArray = this.MappingForm.get("mappingheader") as FormArray;

      id.setValue(datas?.id),
      rel_cat.setValue(datas?.rel_cat?.id),
      vendor_type.setValue(datas?.vendor_type?.id),
      criticality.setValue(datas?.criticality?.id),
      type_id.setValue(datas?.type_id),
      is_doc.setValue(datas?.is_doc),
      document_group_id.setValue(datas?.document_group),
      dept_id.setValue(datas?.dept_id),
      period.setValue(datas?.period?.id),
      process.setValue(datas?.process?.id),
      is_activity.setValue(datas?.is_activity),
      // expiration_date.setValue(datas?.expiration_date),
    order.setValue(datas?.order)

      mapformArray.push(new FormGroup({
        id:id,
        rel_cat:rel_cat,
        vendor_type:vendor_type,
        criticality:criticality,
        type_id:type_id,
        is_doc:is_doc,
        document_group_id:document_group_id,
        dept_id:dept_id,
        period:period,
        process:process,
        is_activity:is_activity,
        // expiration_date:expiration_date,
        order:order,
      }))

      type_id.valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.atmaservice.getquestypemaster(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(data=>{
        this.questypelist=data['data'];
      });
      document_group_id.valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.atmaservice.get_parentScroll(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(data=>{
        this.docgrouplist=data['data'];
      });
      dept_id.valueChanges.pipe(
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.atmaservice.getdeptlists(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(data=>{
        this.deptlist=data['data'];
      });
  

      

    
  }

  getSections(form){
    return form.controls.mappingheader.controls
  }

  addSection(){
    const control = <FormArray>this.MappingForm.get('mappingheader');
    control.push(this.mappingdetails());
  }

  removeSection(i){
    const control =<FormArray>this.MappingForm.get('mappingheader');
    control.removeAt(i);
  }


  mappingdetails(){
    let group = new FormGroup({
      rel_cat :new FormControl(''),
      vendor_type:new FormControl(''),
      criticality:new FormControl(''),
      type_id:new FormControl(''),
      is_doc:new FormControl(false),
      is_activity:new FormControl(false),
      // expiration_date:new FormControl(''),
      document_group_id : new FormControl(''),
      dept_id:new FormControl(''),
      process:new FormControl(''),
      period:new FormControl(''),
      order:new FormControl(''),

    })
    group.get('type_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getquestypemaster(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.questypelist=data['data'];
    });
    group.get('document_group_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.get_parentScroll(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.docgrouplist=data['data'];
    });
    group.get('dept_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getdeptlists(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.deptlist=data['data'];
    });
    
    return group
  
   
  }
  

  public getquestypelist(data ?:questypelist):string | undefined{
    return data?data.name:undefined;
  }
  public getdocgrplist(data ?:docgrouplist):string | undefined{
    return data?data.name:undefined;
  }
  public getdeptlist(data ?:deptlist):string | undefined{
    return data?data.name:undefined;
  }
  getqueslists(){
    this.atmaservice.getquestypemaster('',1).subscribe(data=>{
      this.questypelist=data['data'];
    });
  }
  getdocumentlists(){
    this.atmaservice.get_parentScroll('',1).subscribe(data=>{
      this.docgrouplist=data['data'];
    });
  }
  getdepartmentlists(){
    this.atmaservice.getdeptlists('',1).subscribe(data=>{
      this.deptlist=data['data'];
      });
  }
  getcategorylists(){
    this.atmaservice.getGroup().subscribe(result=>{
      this.categorylist = result['data']
    })
  }
  getvendortypelist(){
    this.atmaservice.getType().subscribe(result=>{
      this.Ventypelist = result['data']
    })
  }
  getcriticalitylist(){
    this.atmaservice.getClassification().subscribe(result=>{
      this.criticallist = result['data']
    })
  }
  getperiodlists(){
    this.atmaservice.getperiodlist().subscribe(result=>{
      this.periodlist = result['data']
    })
  }
  getprocesslist(){
    this.atmaservice.getprocesslist().subscribe(result=>{
      this.processlist = result['data']
    })
  }

  radiocheck(data,ind){
    if(data.value == false){
      this.MappingForm.get('mappingheader')['controls'][ind].get('document_group_id').setValue("")
    }
  }

  public removeEmployeedept(employee: employeelistss): void {
    const index = this.chipSelectedDept.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedDept.splice(index, 1);
      this.chipSelectedDeptid.splice(index, 1);
      this.deptInput.nativeElement.value = '';
    }
  }

  public employeedeptSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeDeptByName(event.option.value.full_name);
    this.deptInput.nativeElement.value = '';
  }

  private selectEmployeeDeptByName(employee) {
    let foundEmployeeDept = this.chipSelectedDept.filter(employees => employees.full_name == employee);
    if (foundEmployeeDept.length) {
      return;
    }
    let foundEmployeeDepts = this.employeelist.filter(employees => employees.full_name == employee);
    if (foundEmployeeDepts.length) {
      this.chipSelectedDept.push(foundEmployeeDepts[0]);
      this.chipSelectedDeptid.push(foundEmployeeDepts[0].id)
    }
  }

  questypescroll(){
      
    setTimeout(() => {
      if (
        this.mattypename &&
        this.autocompleteTrigger &&
        this.mattypename.panel
      ) {
        fromEvent(this.mattypename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattypename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattypename.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattypename.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattypename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.getquestypemaster(this.typeInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.questypelist = this.questypelist.concat(datas);
                    if (this.questypelist.length >= 0) {
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

  docgroupscroll(){
      
    setTimeout(() => {
      if (
        this.matdocname &&
        this.autocompleteTrigger &&
        this.matdocname.panel
      ) {
        fromEvent(this.matdocname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdocname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdocname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdocname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdocname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.get_parentScroll(this.docInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.docgrouplist = this.docgrouplist.concat(datas);
                    if (this.docgrouplist.length >= 0) {
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

  departmentscroll(){
      
    setTimeout(() => {
      if (
        this.matdeptname &&
        this.autocompleteTrigger &&
        this.matdeptname.panel
      ) {
        fromEvent(this.matdeptname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdeptname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdeptname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdeptname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdeptname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.getdeptlists(this.deptInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.deptlist = this.deptlist.concat(datas);
                    if (this.deptlist.length >= 0) {
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

  submitform(){
    const DocumentJson = this.MappingForm.value.mappingheader
    for(let i in DocumentJson){
      if(typeof( DocumentJson[i].type_id) == 'object'){
      DocumentJson[i].type_id =  DocumentJson[i].type_id.id
      }else if(DocumentJson[i].type_id == null){
        DocumentJson[i].type_id = ""
      }else{
        DocumentJson[i].type_id = DocumentJson[i].type_id  
      }
      if(typeof(DocumentJson[i].document_group_id) == "object"){
      DocumentJson[i].document_group_id =  DocumentJson[i].document_group_id.id
      }else if( DocumentJson[i].document_group_id == null){
        DocumentJson[i].document_group_id = ""
      }else{
        DocumentJson[i].document_group_id =  DocumentJson[i].document_group_id
      }
      if(typeof(DocumentJson[i].dept_id) == "object"){
      DocumentJson[i].dept_id = DocumentJson[i].dept_id.id
      }else if(DocumentJson[i].dept_id == null){
        DocumentJson[i].dept_id = "" 
      }else{
        DocumentJson[i].dept_id = DocumentJson[i].dept_id 
      }
      // DocumentJson[i].expiration_date=this.datepipe.transform(DocumentJson[i]?.expiration_date, 'yyyy-MM-dd');
    }

    this.atmaservice.DocMappingForms(DocumentJson)
    .subscribe(results =>{
      if(results.status == "success"){
      this.notification.showSuccess("Success")
      this.onSubmit.emit()
      }else{
        this.notification.showError(results.description)
        return false
      }


    })
  }

  ondocCancel(){
   this.onCancel.emit()
  }


  kyenbdata(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  

}
