import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Component, OnInit, ViewChild,ElementRef, EventEmitter, Output} from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';
import { data } from 'jquery';

export interface paycomonent {
  id: number;
  name: string;
}

@Component({
  selector: 'app-segmentmapping',
  templateUrl: './segmentmapping.component.html',
  styleUrls: ['./segmentmapping.component.scss']
})
export class SegmentmappingComponent implements OnInit {
  // segment_id: FormControl = new FormControl();
  @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('component') matcomponentAutocomplete: MatAutocomplete;
  @ViewChild('getcomponentInput') getcomponentInput: any;
@ViewChild('getpaycomponentInput') getpaycomponentInput: any;
@ViewChild('getpayInput') getpayInput: any;
@ViewChild('pay') matbonusAutocomplete: MatAutocomplete;
@ViewChild('labelImport')  labelImport: ElementRef;
  isFileUpload: boolean=false;
  uploadForms: FormGroup;
  images: File;
  Action='payrollmaster_segmentmapping_upload';
  paycomponentId: any;
  paydata: any;
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

    has_next = true;
    has_previous = true;
    currentpage: number = 1;
    isLoading : boolean
    isSummaryContent: boolean = true;
    addForm: FormGroup;
    datassearch: FormGroup;
    editForm: FormGroup;
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
    has_nextmap = true;
    has_previousmap = true;
    presentpagemap: number = 1;
    presentpagemapseg: number = 1;
    deduction_type_data: any;
    segmentdata: any=[];
    segmentmappinglist: any;
    isTypeCreation: boolean = false;
    paycomponent_array = []

  ngOnInit(): void {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
  this.getSummary();
  this.addForm = this.fb.group({
    segment_id:new FormControl('',Validators.required),
    paycomponent_id: new FormControl('',Validators.required)
  


  })
  this.editForm = this.fb.group({
    segment_id:new FormControl('',Validators.required),
    paycomponent_id: new FormControl('',Validators.required),
    id:['']
  })
  // this.deduction_type();
  // this.getComponentType();
  this.getpaymentcomponentinfo();
  this.getSegments();
  }


  clearData()
  {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
    // this.getSummary();
    this.searchsegment();
    // this.isShowTable = false;
  }

 getSummary(pageIndex?: number) {
  const indexToUse = pageIndex !== undefined ? pageIndex : this.pagination.index;

  this.payrollService.mappingSummary(indexToUse).subscribe(result => {
    this.summarylist = result['data'];
    let dataPagination = result['pagination'];

    if (this.summarylist.length > 0) {
      this.has_nextmap = dataPagination.has_next;
      this.has_previousmap = dataPagination.has_previous;
      this.presentpagemapseg = dataPagination.index;
    }
    // this.isShowTable = true;
  });
}
searchsegment(){
  {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    // let grade = formValue.gradelevel;
    let name = formValue.name;
    this.send_value = ""
    let page = 1;
    this.payrollService.searchsegmentmapping(name).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.presentpagemapseg = page;
    })
  }
}

mapSearch(hint: any) {
  if (hint == 'next') {
    this.getSummary(this.presentpagemapseg + 1);
    
  } else if (hint == 'previous') {
    this.getSummary(this.presentpagemapseg - 1);
    
  } else {
    this.getSummary(1);
  }
}


  getSegments()
  {
    let gstkeyvalue: String = "";
    this.getFunctional(gstkeyvalue);
    this.addForm.get('segment_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.payrollService.getSegmentDropdown(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.segmentdata = datas;
    })
    // this.payrollService.getSegmentDropdown(this.pagination.index).subscribe(data => {
    //   this.segmentdata = data['data'];
    //   // this.defaultType = this.deduction_type_data[2].
    // });
  }
    

  geteditSegments(segment_id) {

    this.payrollService.getSegmentDropdown(segment_id).subscribe(data => {
      this.segmentdata = data['data'];
    });
  }

 

  private getFunctional(gstkeyvalue) {
    this.payrollService.getSegmentDropdownAPI(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.segmentdata = datas;
      })
  }

  getpaymentcomponentinfo() {

    let gstkeyvalue: String = "";
    this.getpayFunctional(gstkeyvalue);
    this.addForm.get('paycomponent_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.payrollService.getpaycomponenttype(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.paycomponent_array = datas;
    })

  }
      
  geteditpaymentcomponentinfo(paycomponent_id){
this.payrollService.getpaycomponenttype(paycomponent_id).subscribe(data => {
  this.paycomponent_array = data['data'];
})
  }

  private getpayFunctional(gstkeyvalue) {
    this.payrollService.getpaycomponenttypeApi(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.paycomponent_array = datas;
      })
  }
  
  validation(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }

  public displaycom(data?: paycomonent): any | undefined {
    return data ? data.name : undefined;
  }

  newSegments()
    {
      this.isSummaryContent = false;
      this.isTypeCreation = false;
      this.isNewCreation= true;
    }

    onSubmitAdd()
    {
      if(this.addForm.value.segment_id=='' || this.addForm.value.segment_id===null){
        this.notification.showError('Please Select Segment')
      }
      else if(this.addForm.value.paycomponent_id==='' || this.addForm.value.paycomponent_id===null){
        this.notification.showError('Please Select Paycomponent')
      }
      else{
        let component = this.addForm.get('segment_id').value.id
        let pay = this.addForm.get('paycomponent_id').value.id
        let value = this.addForm.value;
        let payload = {
          "segment_id": component,
          "paycomponent_id": pay
        }
        this.SpinnerService.show()
        this.payrollService.addnewMapping(payload).subscribe(result => {
          this.SpinnerService.hide()
          if (result.status == 'success') {
    
            this.notification.showSuccess("Added Successfully")
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation= false;
            this.addForm.reset();
    
          }
          else if(result.message){
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

    deleteSegment(id)
    {
      this.payrollService.deleteSegmentMapping(id).subscribe(results => {
        if (results.status == 'success') {
  
          this.notification.showSuccess("Deleted Successfully")
          this.getSummary();
        } else {
          this.notification.showError(results.description)
  
          return false;
        }
      })
    }

    editSegment(datas) { 
      this.isSummaryContent = false;
      this.isTypeCreation = true;
      this.isNewCreation = false; 
      this.editForm.patchValue({
          segment_id: { name: datas.segment?.name, id: datas.segment?.id },
          paycomponent_id: { name: datas.paycomponent_name, id: datas.paycomponent },
          // paycomponent_id: datas.paycomponent_name,
          id: datas.id
      });
      this.paycomponentId = datas.paycomponent;
  }
  

    update()
    {
      if(this.editForm.value.segment_id=='' || this.editForm.value.segment_id===null){
        this.notification.showError('Please Select Segment')
      }
      else if(this.editForm.value.paycomponent_id==='' || this.editForm.value.paycomponent_id===null){
        this.notification.showError('Please Select Paycomponent')
      }
      else{
        let data = this.editForm.value;
        if(data.paycomponent_id.id == null)
        {
          this.paydata= this.paycomponentId
        }
        else
        {
          this.paydata = data.paycomponent_id.id
        }
        let datapay = {
          "segment_id":  data.segment_id ? data.segment_id.id : null,
          "paycomponent_id":  data.paycomponent_id ? data.paycomponent_id.id : null,
          "id": data.id,
  
          
        };
  
        this.SpinnerService.show()
        this.payrollService.updateMappingSegment(datapay).subscribe(result => {
          this.SpinnerService.hide()
          if (result.status == 'success') {
    
            this.notification.showSuccess("Updated Successfully")
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation= false;
    
          }
          else if(result.message){
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
    onCancel()
    {
      this.isSummaryContent = true;
      this.isTypeCreation = false;
      this.isNewCreation = false;
      this.editForm.reset();
    }
    onCancelAdd()
    {
      this.isSummaryContent = true;
      this.isTypeCreation = false;
      this.isNewCreation = false;
      this.addForm.reset();
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

    back(){
      this.router.navigate(['payingemployee/paymasters']);
      this.isSummaryContent = false;
      
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
                  this.payrollService.getSegmentDropdownAPI(
                    this.getcomponentInput.nativeElement.value,
                    this.currentpage + 1
                  ).subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.segmentdata = this.segmentdata.concat(data);
                    if (this.segmentdata.length > 0) {
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


    public displaypaycomponent(paycomponent?: any): string | undefined {
      return paycomponent ? paycomponent.name : undefined;
    }

  
    autocompletepaycomponentScroll() {
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
                  this.payrollService.getpaycomponenttypeApi(
                    this.getcomponentInput.nativeElement.value,
                    this.currentpage + 1
                  ).subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.paycomponent_array = this.paycomponent_array.concat(data);
                    if (this.paycomponent_array.length > 0) {
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
    uploadfile()
{
  this.isFileUpload = true;
  this.isSummaryContent = false;
  this.isNewCreation = false;
  this.isTypeCreation = false;

}
uploadDocuments()
{
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
  const download='payrollmaster_segmentmapping_upload'
  this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,1).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrollmaster_segmentmapping_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
}
fileChange(file, files:FileList) {
  this.labelImport.nativeElement.innerText = Array.from(files)
  .map(f => f.name)
  .join(', ');
  this.images = <File>file.target.files[0];
}
cancel()
{
  this.isFileUpload = false;
  this.isSummaryContent = true;
  this.isNewCreation = false;
  this.isTypeCreation = false;

}
    

}
