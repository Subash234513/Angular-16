import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-segment-master',
  templateUrl: './segment-master.component.html',
  styleUrls: ['./segment-master.component.scss']
})
export class SegmentMasterComponent implements OnInit {
  @ViewChild('segment') matcomponentAutocomplete: MatAutocomplete;
  @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('getsegmentInput') getsegmentInput: any;
  @ViewChild('Bonus') matbonusAutocomplete: MatAutocomplete;
  @ViewChild('getbonusInput') getbonusInput: any;
  @ViewChild('labelImport')  labelImport: ElementRef;
  @ViewChild('geteditcomponentInput') geteditcomponentInput: any;
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }
    has_next = true;
    has_previous = true;
    isLoading : boolean 
    currentpage: number = 1;
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
    deduction_type_data: any;
    comp_type_data: any;
    isTypeCreation: boolean = false;
    paycomponent_array=[]
    uploadForms: FormGroup;
    inputs = document.querySelectorAll('.file-input')
   
    images: any;
    isFileUpload: boolean = false;
    Action='payrollmaster_segment_upload'

  ngOnInit(): void {
    this.datassearch = this.fb.group({ 
        name: '',      
      })
    this.getSummary();
    this.addForm = this.fb.group({
      name: [''],
      component_type: [''],
      type:[''],
      GlNo:[''],
      percentage:['']


    })
    this.editForm = this.fb.group({
      name: [''],
      component_type: [''],
      type:[''],
      GlNo:[''],
      percentage:[''],
      id:['']
    })
    // this.deduction_type();
    // this.getComponentType();
    this.getFunctional('');
    this.getFunctionalbonus('')
    this.getpaymentcomponentinfo();
    
  }

  searchData()
  {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    // let grade = formValue.gradelevel;
    let name = formValue.name;
    this.send_value = ""
    let page = 1;
    this.payrollService.searchSegments(name, page).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      // this.isShowTable = true;
    })
  }
  clearData()
  {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
    // this.datassearch.reset();
    this.searchData();
    // this.isShowTable = false;
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
    this.payrollService.segmentSummary(this.pagination.index).subscribe(result => {
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.pagination = result.pagination ? result.pagination : this.pagination;

    })

  }


  getComponentsegment(component_type) {
    this.payrollService.getsegmentpageApi(component_type,1).subscribe(data => {
      this.comp_type_data = data['data'];
    });
  }

  getComponentbonus(type){
    this.payrollService.bonusdeductiontype(type).subscribe(data => {
      this.deduction_type_data = data['data'];
    });
  }
  
  newSegments()
    {
      this.isSummaryContent = false;
      this.isTypeCreation = false;
      this.isNewCreation= true;
    }
    editSegment(datas)
    { 
        this.isSummaryContent = false;
        this.isTypeCreation = true;
        this.isNewCreation = false;
        this.editForm.patchValue({
          name: datas.name,
          percentage: datas.percentage,
          id: datas.id,
          GlNo:datas.glno,
          // type: datas.type?.id,
          type: { name: datas.type?.name, id: datas.type?.id },
          component_type: { name: datas.component_type?.name, id: datas.component_type?.id },
          // component_type: datas.component_type?.id

    
        })  

    }
    deleteSegment(id)
    {
      this.payrollService.deleteSegments(id).subscribe(results => {
        if (results.status == 'success') {
  
          this.notification.showSuccess("Deleted Successfully")
          this.getSummary();
        } else {
          this.notification.showError(results.description)
  
          return false;
        }
      })
    }
    // deduction_type() {
    //   let gstkeyvalue: String = "";
    //   this.getFunctionalbonus(gstkeyvalue);
    //   this.addForm
    //     .get('component_type')
    //     .valueChanges.pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap((value) =>
    //         this.payrollService.bonusdeductiontype(value).pipe(
    //           finalize(() => {
    //             this.isLoading = false;
    //           })
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results['data'];
    //       this.deduction_type_data = datas;
    //     });
    // }

    getFunctionalbonus(gstkeyvalue) {
      this.payrollService
        .deductiontypeApi(gstkeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.deduction_type_data = datas;
        });
      // this.payrollService.deductiontype().subscribe(data => {
      //   this.deduction_type_data = data['data'];
        // this.defaultType = this.deduction_type_data[2].
      // });
    }
    
    // getComponentType() {
    //   let gstkeyvalue: String = "";
    //   this.getFunctional(gstkeyvalue);
    //   this.addForm
    //     .get('component_type')
    //     .valueChanges.pipe(
    //       debounceTime(100),
    //       distinctUntilChanged(),
    //       tap(() => {
    //         this.isLoading = true;
    //       }),
    //       switchMap((value) =>
    //         this.payrollService.getComponentTypeDropdown(value).pipe(
    //           finalize(() => {
    //             this.isLoading = false;
    //           })
    //         )
    //       )
    //     )
    //     .subscribe((results: any[]) => {
    //       let datas = results['data'];
    //       this.comp_type_data = datas;
    //     });
    // }

getFunctional(gstkeyvalue) {
      this.payrollService
        .getsegmentpageApi(gstkeyvalue, 1)
        .subscribe((results: any[]) => {
          let datas = results['data'];
          this.comp_type_data = datas;
        });
    }

    // getComponentType() {
    //   this.payrollService.getComponentTypeDropdown(this.pagination.index).subscribe(data => {
    //     this.comp_type_data = data['data'];
        // this.defaultType = this.deduction_type_data[2].
    //   });
    // }
    onSubmitAdd()
    {
      this.SpinnerService.show();
      let name = this.addForm.get('name').value;
      let category = this.addForm.get('component_type').value.id;
      let type = this.addForm.get('type').value.id;
      let percent = this.addForm.get('percentage').value;
      let GlNo=this.addForm.get('GlNo').value;
      let payload = {
        "name": name,
        "component_type": category,
        "type": type,
        "percentage": percent,
        'glno':GlNo
      }
      if(name=='' || name==null){
        this.notification.showError("Please Enter Name")
        this.SpinnerService.hide();
      }
      else if(this.addForm.value.component_type=='' || this.addForm.value.component_type==null){
        this.notification.showError('Please Select Pay Category Type')
        this.SpinnerService.hide();
      }
      else if(this.addForm.value.type=='' || this.addForm.value.type==null){
        this.notification.showError('Please Select Bonus Type')
        this.SpinnerService.hide();
      }
      else if(percent=='' || percent==null){
        this.notification.showError('Please Enter Percentage')
        this.SpinnerService.hide();
      }
      // else if(GlNo=='' || GlNo==null){
      //   this.notification.showError('Please Enter GlNo')
      //   this.SpinnerService.hide();
      // }
      else{
        this.payrollService.addnewSegment(payload).subscribe(result => {
          this.SpinnerService.hide();
          if (result.status == 'success') {
    
            this.notification.showSuccess("Added Successfully")
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation= false;
            this.addForm.reset();
    
          } else if(result.name_message){
            this.notification.showError(result.name_message)
            // this.SpinnerService.hide();
            // return false;
          }
          else if(result.description){
            this.notification.showError(result.description)
          }
        },
        error=>{
          this.SpinnerService.hide()
        })
      }
   

    }
    onCancelAdd()
    {
      this.isSummaryContent = true;
      this.isTypeCreation = false;
      this.isNewCreation = false;
      this.addForm.reset();
    }
    update()
    {
      this.SpinnerService.show()
      let data = this.editForm.value;
      let datapay = {
        "name": data.name,
        "component_type": data.component_type ? data.component_type.id : null,
        "type":  data.type ? data.type.id : null,
        "percentage": data.percentage,
        "id": data.id,
        'glno':data.GlNo

        
      };
      if(data.name=='' || data.name==null){
        this.notification.showError("Please Enter Name")
        this.SpinnerService.hide();
      }
      else if(this.editForm.value.component_type=='' || this.editForm.value.component_type==null){
        this.notification.showError('Please Select Pay Category Type')
        this.SpinnerService.hide();
      }
      else if(this.editForm.value.type=='' || this.editForm.value.component_type==null){
        this.notification.showError('Please Select Bonus Type')
        this.SpinnerService.hide();
      }
      else if(data.percentage=='' || data.percentage==null){
        this.notification.showError('Please Enter Percentage')
        this.SpinnerService.hide();
      }
      // else if(data.GlNo=='' || data.GlNo==null){
      //   this.notification.showError('Please Enter GlNo')
      //   this.SpinnerService.hide();
      // }
      else{
        this.payrollService.updateSegment(datapay).subscribe(result => {
          this.SpinnerService.hide()
          if (result.status == 'success') {
    
            this.notification.showSuccess("Updated Successfully")
            this.getSummary();
            this.isSummaryContent = true;
            this.isTypeCreation = false;
            this.isNewCreation= false;
    
          }
          else if(result.name_message){
            this.notification.showError(result.name_message)
          }
          // else if(result.percentage_message){
          //   this.notification.showError(result.percentage_message)
          // }
          
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
  
  public displayfnsegment(segment?: any): string | undefined {
    return segment ? segment.name : undefined;
  }


  autocompletesegmentScroll() {
    setTimeout(() => {
      if (
        this.matcomponentAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomponentAutocomplete.panel
      ) {
        fromEvent(this.matcomponentAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map((x: Event) => (x.target as HTMLElement).scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((scrollTop) => {
            const scrollHeight = this.matcomponentAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomponentAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollService
                  .getsegmentpageApi(this.getsegmentInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.comp_type_data = this.comp_type_data.concat(data);
                    if (this.comp_type_data.length > 0) {
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
  
 
  public displayfnBonus(Bonus?: any): string | undefined {
    return Bonus ? Bonus.name : undefined;
  }
  autocompleteBonusScroll() {
    setTimeout(() => {
      if (
        this.matbonusAutocomplete &&
        this.autocompleteTrigger &&
        this.matbonusAutocomplete.panel
      ) {
        fromEvent(this.matbonusAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map((x: Event) => (x.target as HTMLElement).scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((scrollTop) => {
            const scrollHeight = this.matbonusAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbonusAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  
            if (atBottom) {
              if (this.has_next === true) {
                this.payrollService
                  .deductiontypeApi(this.getsegmentInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.deduction_type_data = this.deduction_type_data.concat(data);
                    if (this.deduction_type_data.length > 0) {
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
    const download='payrollmaster_segment_upload'
    this.payrollService.MasterUploadDownload(download,1).subscribe(data=>{
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrollmaster_segment_upload" + ".xlsx";
      link.click();
    })
  }
  cancel()
  {
    this.isFileUpload = false;
    this.isSummaryContent = true;
    this.isNewCreation = false;
    this.isTypeCreation = false;

  }

}
