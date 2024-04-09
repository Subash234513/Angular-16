import { Component, OnInit, ViewChild,ElementRef, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ComponentType } from 'ngx-toastr';
import { data, get } from 'jquery';
// import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { error } from 'console';

export interface component {
  name: string;
  id: number;
}

export interface isegmentList{
  name: string;
  id: number;
  
}

export interface iseditsegmentlist{
  name: string;
  id: number;
  map_id: number;
}
@Component({
  selector: 'app-templatemaster',
  templateUrl: './templatemaster.component.html',
  styleUrls: ['./templatemaster.component.scss']
})
export class TemplatemasterComponent implements OnInit {
  @Output() onCanceladd = new EventEmitter<any>();
  @ViewChild('gradedatavalue') gradelevelinput:any;
  @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('leveldata')matinputAutocomplete: MatAutocomplete;
  @ViewChild('component') matcomponentAutocomplete: MatAutocomplete;
  @ViewChild('getcomponentInput') getcomponentInput: any;
  @ViewChild('editcomponent') mateditcomponentAutocomplete: MatAutocomplete;
  @ViewChild('editgetcomponentInput') editgetcomponentInput: any;
  public segmentIdValue: number[] = [];
 
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }
has_next = true;
has_previous = true;
    isSummaryContent: boolean = true;
    addForm: FormGroup;
    datassearch: FormGroup;
    editForm: FormGroup;
    segment= new FormControl();
    limit = 10;
    pagination = {
      has_next: false,
      has_previous: false,
      index: 1
    }
    
    summarylist = [];
    send_value: String = "";
    isShowTable: boolean = true;
    isNewCreation: boolean = false;
    deduction_type_data: any;
    comp_type_data: any;
    isTypeCreation: boolean = false;
    paycomponent_array=[];
    Action='payrolltemplate_upload'
    isLoading : boolean 
    componentlist: any=[];
    currentpage: number = 1;
    public allsegmentlist: isegmentList[]; 
    public chipSelectedsegment: isegmentList[] = [];
    public chipSelectedsegmentid = [];
    public chipRemovedsegmentid = [];

    public segmentdata: iseditsegmentlist[];
    public chipeditselectedsegment: iseditsegmentlist[] = [];
    public chipeditselectedsegmentid = [];
    public chipeditRemovedsegmentid = [];
    // public segment = new FormControl();
    public separatorKeysCodes: number[] = [ENTER, COMMA];
   
    @ViewChild('segmentInput') segmentInput: any;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
@ViewChild('editsegmentInput') editsegmentInput: any;
@ViewChild('auto') editmatAutocomplete: MatAutocomplete;
    gradeList: any;
    
    hasMoreOptions: boolean = true; 
    index: number = 1;   
    @ViewChild('matSelect') matSelect: ElementRef; 
    inputs = document.querySelectorAll('.file-input')
    @ViewChild('labelImport')  labelImport: ElementRef;
    images: any;
    isFileUpload: boolean = false;
    uploadForms : FormGroup;

  ngOnInit(): void {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
  this.getSummary();
  this.addForm = this.fb.group({
    name: [''],
    segment:[''],
    gradelevel:[''],
    glno:'',
    // component_id: [''],


  })
  this.editForm = this.fb.group({
    name: [''],
    segment:[''],
    gradelevel:[''],
    id:[''],
    glno:'',
  })
  if (this.addForm.get('segment') !== null) {
    this.addForm.get('segment').valueChanges
           .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.payrollService.searchSegments(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            ))
           )  
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.allsegmentlist = datas;

      })
  }
  this.getGrade();
  this.getSegments();

  if (this.editForm.get('segment') !== null) {
    this.editForm.get('segment').valueChanges
           .pipe(
            debounceTime(100),
            distinctUntilChanged(),
            tap(() => {
              this.isLoading = true;
            }),
            switchMap(value => this.payrollService.searchSegments(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            ))
           )  
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.segmentdata = datas;
      })
  }
  
  }

  
  searchData()
  {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    let name = formValue.name;
    this.send_value = ""
    let page = 1;
    this.payrollService.searchtemplate(name,page).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];  
      this.pagination.index = page;
    })
  }

  
  clearData()
  {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
    this.searchData();
    // this.datassearch.reset();
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getSummary();
  }

  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getSummary();
  }
 
  getSummary()
  {
    this.payrollService.templateSummary(this.pagination.index).subscribe(result => {
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.pagination = result.pagination ? result.pagination : this.pagination;
    })
  }

  newSegments()
    {
      this.isSummaryContent = false;
      this.isTypeCreation = false;
      this.isNewCreation= true;
    }

    dataId:any;
    editSegment(datas) {
      this.isSummaryContent = false;
      this.isTypeCreation = true;
      this.isNewCreation = false;
    
      this.payrollService.getTemplateParticular(datas.id).subscribe(res => {
        let datam = res['data'];
        const extractedId = datas.segment.map(segment => segment.name);
        this.editForm.get('segment').setValue(extractedId);
        this.chipeditselectedsegment = datas.segment;
        const selectedValues = this.editForm.value.segment;
        const refIds = this.chipeditselectedsegment.map((ids) => ({ "ref_id": ids.id }));
        this.editForm.patchValue({
          name: datas.name,
          gradelevel: { name: datas.grade?.name, id: datas.grade?.id },
          segment: refIds,
          glno: datas.glno
        });
        this.dataId = datas.id;
      });
    
      let segmentNames = datas.segment.map(segment => segment.name);
    }
    

     getComponentTypes() {
      let gstkeyvalue: String = "";
      this.getFunctional(gstkeyvalue);
      this.addForm.get('grade').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.payrollService.getGrade(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.componentlist = datas;
      })
    
    }

    private getFunctional(gstkeyvalue) {
      this.payrollService.getGradeApi(gstkeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.componentlist = datas;
        })
    }

    public displayfncomponent(component?: any): string | undefined {
      return component ? component.name : undefined;
    }
    

    autocompletecomponentScroll() {
      setTimeout(() => {
        if (
          this.matcomponentAutocomplete &&
          this.autocompleteTrigger &&
          this.matcomponentAutocomplete.panel
        ) {
          fromEvent(this.matcomponentAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matcomponentAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(scrollTop => {
              const scrollHeight = this.matcomponentAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matcomponentAutocomplete.panel.nativeElement.elementHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    
              if (atBottom) {
                if (this.has_next === true) {
                  this.payrollService.getGradeApi(
                    this.getcomponentInput.nativeElement.value,
                    this.currentpage + 1
                  ).subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.componentlist = this.componentlist.concat(data);
                    if (this.componentlist.length > 0) {
                      this.has_next = dataPagination.has_next;
                      this.has_previous = dataPagination.has_pagination;
                      this.currentpage = dataPagination.index;
                    }
                  });
                }
              }
            });
        }
      });
    }

    getComponentgrade(gradelevel) {
      this.payrollService.getGrade(gradelevel).subscribe(data => {
        this.componentlist = data['data'];
      });
    }

    deleteSegment(id)
    {
      this.payrollService.deleteTemplates(id).subscribe(results => {
        if (results.status == 'success') {
  
          this.notification.showSuccess("Deleted Successfully")
          this.getSummary();
        } else {
          this.notification.showError(results.description)
          return false;
        }
      })
    }

    deduction_type() {
      this.payrollService.deductiontype().subscribe(data => {
        this.deduction_type_data = data['data'];  
      });
    }
  
  
    onSubmitAdd(){
      if(this.addForm.value.name=="" || this.addForm.value.name==null){
        this.notification.showError('Please Enter Name')
      }
      else if(this.addForm.value.gradelevel=='' || this.addForm.value.gradelevel==null){
        this.notification.showError('Please Select Grade')
      }
      else if(this.chipSelectedsegment.length==0){
        this.notification.showError('Please Select Segment')
      }
      // else if(this.addForm.value.glno=='' || this.addForm.value.glno==null){
      //   this.notification.showError('Please Enter GL No')
      // }
      else{
      let data = this.addForm.value
      this.addForm.value.segment=this.chipSelectedsegment
      const selectedValues = this.addForm.value.segment;
      const refIds = selectedValues.map((id) => ({ "ref_id": id.id}));
      let  datapay = {
          "name": data.name,
          "grade": data.gradelevel.id,
          "segment": refIds,
          "glno" : data.glno
        }
        this.SpinnerService.show()
        this.payrollService.addnewTemplate(datapay).subscribe(result => {
  
        
          this.SpinnerService.hide();
          if (result.status == 'success') {
            this.notification.showSuccess("Added Successfully")
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation= false;
            this.addForm.reset();
            this.chipSelectedsegment=[]
          }
          else if(result.name_message){
            this.notification.showError(result.name_message)
          } 
          else if(result.status=='INVALID GRADE'){
            this.notification.showError(result.message)
          }
          else {
            this.notification.showError(result.description)
            return false;
          }
        },
        error=>{
          this.SpinnerService.hide()
        })
      }
   
    }

    onCancelAdd() {
      this.isSummaryContent = true;
      this.isTypeCreation = false;
      this.isNewCreation = false;
      this.addForm.reset();
      this.clearMatChipInput();
      this.chipSelectedsegment=[]
    }
    
    clearMatChipInput() {
      this.chipSelectedsegment = [];
      this.addForm.get('segment').setValue(null);
    }
    
    update() {
      if(this.editForm.value.name=="" || this.editForm.value.name==null){
        this.notification.showError('Please Enter Name')
      }
      else if(this.editForm.value.gradelevel==''|| this.editForm.value.gradelevel==null){
        this.notification.showError('Please Select Grade')
      }
      else if(this.chipeditselectedsegment.length==0){
        this.notification.showError('Please Select Segment')
      }
      // else if(this.editForm.value.glno=='' || this.editForm.value.glno==null){
      //   this.notification.showError('Please Enter GL No')
      // }
      else{
        let data = this.editForm.value;
        const refIds = this.chipeditselectedsegment.map((segment) => ({ "ref_id": segment.id }));
      
        let datapay = {
          "name": data.name,
          "grade": data.gradelevel ? data.gradelevel.id : null,
          "segment": refIds,
          "id": this.dataId,
          "glno": data.glno
        };
      
        let jsonDataPay = JSON.stringify(datapay);
        this.SpinnerService.show()
        this.payrollService.updateTemplate(datapay).subscribe(result => {
          this.SpinnerService.hide()
          if (result.status === 'success') {
            this.notification.showSuccess("Updated Successfully");
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation = false;
            this.editForm.reset()
            this.chipeditselectedsegment=[]
          }
          else if(result.name_message){
            this.notification.showError(result.name_message)
          } 
          else if(result.status=='INVALID GRADE'){
            this.notification.showError(result.message)
          }
          else {
            this.notification.showError(result.description);
          }
        },
        error=>{
          this.SpinnerService.hide()
        });
      }
    }

    onCancel()
    {
      this.isSummaryContent = true;
      this.isTypeCreation = false;
      this.isNewCreation = false;
      this.editForm.reset();
      this.chipeditselectedsegment=[]
    }

    mapping()
    {
      this.router.navigate(['payingemployee/mapping'])
      
    }
 
  getpaymentcomponentinfo() {
    // let values = 'is_deduction=true';
    this.payrollService.getpaycomponent('', 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }

  getGrade() {
  
  }
  getSegments()
  {

    this.payrollService.getSegmentDropdowns(this.pagination.index).subscribe(data => {
      this.allsegmentlist = data['data'];
      this.segmentdata = data['data'];
    }); 
  }

  public removedsegment(segment: isegmentList): void {
    const index = this.chipSelectedsegment.indexOf(segment);
    if(index >= 0){
    this.chipSelectedsegmentid.push(segment);
    this.chipSelectedsegment.splice(index, 1);
    this.chipSelectedsegmentid.splice(index, 1);
    this.segmentInput.nativeElement.value = '';
    // this.chipSelectedsegmentid.push(foundsegment[0].id)
  
    }
  }

  public segmentSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectsegmentByName(event.option.value.name);
    this.segmentInput.nativeElement.value = '';

  }

  public selectsegmentByName(segmentName) {
    let foundsegment1 = this.chipSelectedsegment.filter(segment => segment.name == segmentName);
    if (foundsegment1.length) {
      return;
    }
    let foundsegment = this.allsegmentlist.filter(segment => segment.name == segmentName);
    if (foundsegment.length) {
      this.chipSelectedsegment.push(foundsegment[0]);
      this.chipSelectedsegmentid.push(foundsegment[0].id)
     this.segmentIdValue = this.chipSelectedsegmentid;
    }
  } 
newsegment: any[]
public editremovedsegment(segment: iseditsegmentlist): void {
  const index = this.chipeditselectedsegment.indexOf(segment);

  if (index !== -1) {
    this.chipeditselectedsegmentid.push(segment.id);
    this.chipeditselectedsegmentid.splice(index, 1);
    this.chipeditselectedsegment.splice(index, 1);
    const apiresp = this.chipeditselectedsegment.map(res => res.map_id);
    const mapId = apiresp[0];
    if (mapId) {
      this.payrollService.deletetemplate(segment.id, mapId).subscribe(res => {
       
      });
    }
  }
}





  
  public editsegmentSelected(event: MatAutocompleteSelectedEvent): void {
    this.editselectsegmentByName(event.option.value.name);
    this.editsegmentInput.nativeElement.value = '';    
  }
  public editselectsegmentByName(segmentName) {
    let foundsegment1 = this.chipeditselectedsegment.filter(segment => segment.name == segmentName);
    if (foundsegment1.length) {
      return;
    }
    let foundsegment = this.segmentdata.filter(segment => segment.name == segmentName);
    if (foundsegment.length) {
      this.chipeditselectedsegment.push(foundsegment[0]);
      this.chipeditselectedsegmentid.push(foundsegment[0].id)
      this.segmentIdValue = this.chipeditselectedsegmentid;
    }
  } 
  fileChange(file, files:FileList) {
    this.labelImport.nativeElement.innerText = Array.from(files)
    .map(f => f.name)
    .join(', ');
    this.images = <File>file.target.files[0];
  }
  uploadfile()
  {
    this.isFileUpload = true;
    this.isSummaryContent = false;
    this.isNewCreation = false;
    this.isTypeCreation = false;

  }
  uploadDocuments()
  {
    if(this.images === null || this.images ===  undefined)
    {
      this.notification.showError('Please Select File');
      return false;
    }
    this.SpinnerService.show()
    this.payrollService.MasterUpload(this.Action,this.images).subscribe(data=>{
      this.SpinnerService.hide()
      this.notification.showSuccess(data.message)
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  downloadTemplate()
  {
    const download='payrolltemplate_upload'
    this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,2).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrolltemplate_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.isNewCreation = false;
    this.isSummaryContent = true;
    this.isTypeCreation = false;


  }
}
