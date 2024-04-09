import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';
import { data } from 'jquery';
import { error } from 'console';


@Component({
  selector: 'app-grademaster',
  templateUrl: './grademaster.component.html',
  styleUrls: ['./grademaster.component.scss']
})

export class GrademasterComponent implements OnInit {
uploadForms: FormGroup;
  images: File;
  isFileUpload: boolean=false;
  Action='payrollmaster_grade_upload';
  @ViewChild('labelImport')  labelImport: ElementRef;

  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

    isSummaryContent: boolean = true;
    addForm: FormGroup;
    datassearch: FormGroup;
    editForm: FormGroup;
    limit = 10;
    has_previousgrade = true;
    has_nextgrade = true;
    presentpagegrade: number = 1;
    gradestructurelist: any;
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
    gradeList: any;
    segmentdata=[];

  ngOnInit(): void {
    this.datassearch = this.fb.group({ 
      name: '',      
    })
  this.getSummary();
  this.addForm = this.fb.group({
    name: [''],
    points:[''],
  


  })
  this.editForm = this.fb.group({
     name:[''],
    points:[''],
    
  })
  this.getGrade();
  this.getSegments();
  }
dataId: any;
  searchData()
  {
    this.SpinnerService.show();
    let formValue = this.datassearch.value;
    console.log("Search Values", formValue.name)
    // let grade = formValue.gradelevel;
    let name = formValue.name;
    this.send_value = ""
    let page = 1;
    this.payrollService.searchGrades(name, page).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.gradestructurelist = result['data'];
    })
    
  }
  clearData()
  {
    
    this.datassearch = this.fb.group({ 
      name: '',      
    })
    this.searchData();
    // this.datassearch.reset();
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
    this.payrollService.gradeSummary(this.pagination.index).subscribe(result => {
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.pagination = result.pagination ? result.pagination : this.pagination;
this.gradestructurelist = result['data'];
      let dataPagination = result['pagination'];
      if (this.gradestructurelist.length > 0) {
        this.has_previousgrade = dataPagination.has_previous;
        this.has_nextgrade = dataPagination.has_next;
        this.presentpagegrade = dataPagination.index;
        
      }
    })

  }

  
  newSegments()
    {
      this.isSummaryContent = false;
      this.isTypeCreation = false;
      this.isNewCreation= true;
    }

    editId:any;
    editSegment(datas) { 
      this.isSummaryContent = false;
      this.isTypeCreation = true;
      this.isNewCreation = false;
    
      if (datas && datas.id) {
        this.payrollService.getgradeParticular(datas.id).subscribe(res => {
          console.log("Pay API", res);
          let gradeParticularData = res;
    this.editId=res.id
          if (gradeParticularData) {
            this.editForm.patchValue({
              points: gradeParticularData.points,
              name: gradeParticularData.name
            });
          }
        });
        console.log("Form Values", datas);
        console.log("Form Values points", datas.points);
        console.log("Form Values name", datas.name);
      } else {
        console.error("Invalid datas object:", datas);
      }
    }
    
  

        
    // this.payrollService.getTemplateParticular(datas.id).subscribe(res => {
    //   let results = res['data'];
    //   const extractedId = results.segment.map(segment => segment.id);
    //   // const extractedId = res.paycomponentflagmaster.map(item => item.id);
    //   // const selectedValues = this.paycomponent_array.filter(item => extractedId.includes(item.id));
    //   this.editForm.get('segment_id').setValue(extractedId);
    //   this.editForm.patchValue({
    //     name: results.name,      
    //       id: results.id,
    //       segment_id: extractedId,
    //       gradelevel: results.grade

    //   })
    // })
    
      

    
    deleteSegment(id)
    {
      this.payrollService.deletegrade(id).subscribe(results => {
        if (results.status == 'SUCCESS') {
  
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
        // this.defaultType = this.deduction_type_data[2].
      });
    }
    getComponentType() {
      this.payrollService.getComponentTypeDropdown(this.pagination.index).subscribe(data => {
        this.comp_type_data = data['data'];
        // this.defaultType = this.deduction_type_data[2].
      });
    }
    onSubmitAdd()
    {

    
      if(this.addForm.value.name=='' || this.addForm.value.name==null){
        this.notification.showError('Please Select Grade')
        
      }
      else{
        let data = this.addForm.value   
        let  datapay = {
           "name": data.name,
           "points": data.points,
     
         }
         this.SpinnerService.show()
           this.payrollService.addnewGrade(datapay).subscribe(result => {
             this.SpinnerService.hide();
             if (result.status == 'SUCCESS') {
       
               this.notification.showSuccess("Added Successfully")
               this.getSummary();
               this.isSummaryContent = true;
               this.isTypeCreation = false;
               this.isNewCreation= false;
               this.addForm.reset();
       
             } else {
               this.notification.showError(result.description)
       
               return false;
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
      if(this.editForm.value.name=='' || this.editForm.value.name==null){
        this.notification.showError('Please Select Grade')
      }
      else{
        let data = this.editForm.value
        console.log("PF Form Values", data)
        // const selectedValues = this.editForm.get('segment').value;
        // const refIds = selectedValues.map((id: number) => ({ "ref_id": id }));
       let  datapay = {
        "name": data.name,
        "points": data.points,
        "id": this.editId,
    
        }
        this.SpinnerService.show()
          this.payrollService.updategrade(datapay).subscribe(result => {
            if (result.status == 'SUCCESS') {
              this.SpinnerService.hide()
              this.notification.showSuccess("Updated Successfully")
              this.getSummary();
              this.isSummaryContent = true;
              this.isTypeCreation = false;
              this.isNewCreation= false;
      
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

  getGrade() {
    this.SpinnerService.show();
    this.payrollService.getGrade('')
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results['data'];
        this.gradeList = datas;
      })
  }
  getSegments()
  {
    this.payrollService.getSegmentDropdown(this.pagination.index).subscribe(data => {
      this.segmentdata = data['data'];
      // this.defaultType = this.deduction_type_data[2].
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
    // this.payrollcreation = false;
    // this.payrollSummary = false;
    this.isTypeCreation=false
    this.isNewCreation=false
    this.isSummaryContent=false
  }
  uploadDocuments(){
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
    const download='payrollmaster_grade_upload'
    this.SpinnerService.show()
    this.payrollService.MasterUploadDownload(download,1).subscribe(data=>{
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "payrollmaster_grade_upload" + ".xlsx";
      link.click();
    },
    error=>{
      this.SpinnerService.hide()
    })
  }
  cancel(){
    this.isSummaryContent = true;
    this.isTypeCreation = false;
    this.isNewCreation = false;
    this.isFileUpload=false
  }


}
