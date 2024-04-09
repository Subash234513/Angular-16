import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import { CmsService } from '../cms.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CMSSharedService } from '../cms-shared.service';
import { environment } from 'src/environments/environment';
import { AmountPipePipe } from '../amount-pipe.pipe';
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class ProjectCreateComponent implements OnInit {
  today = new Date()
  ProjectForm: FormGroup

  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  emp_id = new FormControl();
  hasnext: any
  hasprevious: any
  currentpage: any = 1

  currentpagetype: any = 1
  has_nexttype: boolean
  has_previoustype: boolean
  isLoading: boolean = false
  TypeList: any
  for_vendorList: any = [{ send: true, text: 'Yes' }, { send: false, text: 'No' }]

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  @ViewChild('type') mattypeAutocomplete: MatAutocomplete;
  @ViewChild('typeInput') typeInput: any;

  @ViewChild('user') matuserAutocomplete: MatAutocomplete;
  @ViewChild('userInput') userInput: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancelEdit = new EventEmitter<any>();
  @Output() onSubmitEdit = new EventEmitter<any>();

  isEdit: boolean = false
  Change_Difference_Detection: any
  file_remove_ids_For_Edit = []
  imageUrl: any = environment.apiURL
  jpgUrlsAPI: any
  EditFiles: any = []
  invitationList = []
  projectID: any 



  constructor(private sanitizer: DomSanitizer, private service: CmsService, private notify: ToastrService,
    private fb: FormBuilder, private datepipe: DatePipe, private cmsshare: CMSSharedService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    let key: any = ""
    // let type: any = ''
    // this.getemp(key, type);
    this.typeDD(key)
    this.categoryDD(key)
    this.getViewType()
    // this.SubcategoryDD(0, '')
    this.getVendorType()
    this.getcriticality()
    this.getRelationShipCategory() 
    this.ProjectForm = this.fb.group({
      "title": "",
      "type": "",
      "submission_start_date": new Date(),
      "submission_end_date": new Date(),
      "project_start_date": new Date(),
      "project_end_date": new Date(),
      "budget": "",
      "parent_id": null,
      "content": "",
      "strategy_note": "",
      "commodity_id": '',
      "subcommodity": '',
      "estimate_currentspent": '',
      "estimate_save": '',
      "for_vendor": true,
      "onbehalf_group": '',
      "view_type": '',
      "description": '',
      "parallel_approval": false,
      "collaborator": '',
      "project_identification": '',
      "invitation": '',
      "rel_cat": '',
      "criticality": '',
      "vendor_type": ''
    })


    let projectdata: any = this.cmsshare.Project_Create_Or_Edit.value
    console.log("projectdata create or edit ", projectdata)

    if (projectdata.type == 'edit') {
      this.isEdit = true
      this.projectedit(projectdata)
    }
    if (projectdata.type == 'add') {
      console.log("projectdata create title name ", projectdata.data.title)
      console.log("projectdata create project identification ", projectdata.data.project_identification)
      this.isEdit = false
      this.ProjectForm.patchValue(
        {
          title: projectdata.data.title,
          project_identification: projectdata.data.id,
          type: projectdata.data.type,
          // onbehalf_group: projectdata.data.onbehalf_group
        }
      )
    }


  }

  // "approval":{"to_arr":[1,5],"to_type":1}

  projectedit(projectdata) {

    console.log("project data edit funnction call =>", projectdata)
    console.log("project data edit funnction call id =>", projectdata.id)
    console.log("is edit=>", this.isEdit)



    if (this.isEdit == true) {
      let data: any = projectdata.id
      this.projectID = data 
      this.SpinnerService.show();
      this.service.getproject(data)
        .subscribe(results => {
          this.SpinnerService.hide();
          let dataresults = results
          this.Change_Difference_Detection = results
          console.log("results data edit get API=============>", results)
          if (results) {
            this.ProjectForm.patchValue({
              "title": dataresults?.title,
              "description": dataresults?.description,
              "type": dataresults?.type,
              "commodity_id": dataresults?.commodity_id,
              "subcommodity": dataresults?.subcommodity,
              "submission_start_date": dataresults?.submission_start_date,
              "submission_end_date": dataresults?.submission_end_date,
              "project_start_date": dataresults?.project_start_date,
              "project_end_date": dataresults?.project_end_date,
              "view_type":dataresults?.view_type.id,
              "budget": dataresults?.budget,
              "estimate_currentspent": dataresults?.estimate_currentspent,
              "estimate_save": dataresults?.estimate_save,
              
              "parent_id": null,
              "content": dataresults?.covernote?.note,
              "strategy_note": dataresults?.strategy_note?.note,
              "cat_id": dataresults?.cat_id,
              "subcat_id": dataresults?.subcat_id,
              "for_vendor": dataresults?.for_vendor,
              "onbehalf_group": dataresults?.onbehalf_group,
              "rel_cat": dataresults?.rel_cat?.id,
              "criticality": dataresults?.criticality?.id,
              "vendor_type": dataresults?.vendor_type?.id
            })

            console.log("result approver=====>", results?.approver)
            console.log("result q_approver===>", results?.q_approver)
            console.log("result collabator===>", results?.collabator)


            for(let i of results.approver){
              this.chipSelectedemp.push(i.approver)
              this.chipSelectedempid.push(i.approver.id)
            }

            for(let i of results.q_approver){
              this.chipSelectedempapproval.push(i.approver)
              this.chipSelectedempapprovalid.push(i.approver.id)
            }

            for(let i of results.collabator){
              this.chipSelectedempcol.push(i.approver)
              this.chipSelectedempcolid.push(i.approver.id)
            }


            this.invitationList = dataresults?.invitation


            this.EditFiles = dataresults.filedata

          }

        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })




    }


  }












  projectSubmit() {
    let dataToSubmit = this.ProjectForm.value
    let Sub_Start_date_transform = dataToSubmit.submission_start_date
    let Sub_End_date_transform = dataToSubmit.submission_end_date
    let Project_Start_date_transform = dataToSubmit.project_start_date
    let Project_End_date_transform = dataToSubmit.project_end_date

    if (dataToSubmit.title == '' || dataToSubmit.title == null || dataToSubmit.title == undefined) {
      this.notify.warning('Please fill Title ')
      return false
    }
    if (dataToSubmit.description == '' || dataToSubmit.description == null || dataToSubmit.description == undefined) {
      this.notify.warning('Please fill Description ')
      return false
    }
    if (dataToSubmit.type == '' || dataToSubmit.type == null || dataToSubmit.type == undefined) {
      this.notify.warning('Please Select Project Type ')
      return false
    }
    
    if (dataToSubmit.commodity_id == '' || dataToSubmit.commodity_id == null || dataToSubmit.commodity_id == undefined) {
      this.notify.warning('Please Select Commodity ')
      return false
    }
    if (dataToSubmit.subcommodity == '' || dataToSubmit.subcommodity == null || dataToSubmit.subcommodity == undefined) {
      this.notify.warning('Please fill Sub Commodity ')
      return false
    }
    if (dataToSubmit.onbehalf_group == '' || dataToSubmit.onbehalf_group == null || dataToSubmit.onbehalf_group == undefined) {
      this.notify.warning('Please Select Beneficiary Group ')
      return false
    }
    if (dataToSubmit.submission_start_date > dataToSubmit.submission_end_date) {
      this.notify.warning('Submission End Date must  be greater than Submission Start Date ')
      return false
    }
    if (dataToSubmit.project_start_date > dataToSubmit.project_end_date) {
      this.notify.warning('Project End Date must be greater than Project Start Date ')
      return false
    }
    if (dataToSubmit.view_type == '' || dataToSubmit.view_type == null || dataToSubmit.view_type == undefined) {
      this.notify.warning('Please fill Audience ')
      return false
    }
    if (dataToSubmit.rel_cat == '' || dataToSubmit.rel_cat == null || dataToSubmit.rel_cat == undefined) {
      this.notify.warning('Please fill Relationship Category ')
      return false
    }
    if (dataToSubmit.vendor_type == '' || dataToSubmit.vendor_type == null || dataToSubmit.vendor_type == undefined) {
      this.notify.warning('Please fill Vendor Type ')
      return false
    }

    if (dataToSubmit.criticality == '' || dataToSubmit.criticality == null || dataToSubmit.criticality == undefined) {
      this.notify.warning('Please fill Criticality ')
      return false
    }
    if (dataToSubmit.budget == '' || dataToSubmit.budget == null || dataToSubmit.budget == undefined) {
      this.notify.warning('Please fill Budget ')
      return false
    }
    if (dataToSubmit.estimate_currentspent == '' || dataToSubmit.estimate_currentspent == null || dataToSubmit.estimate_currentspent == undefined) {
      this.notify.warning('Please fill Estimated Current Spend ')
      return false
    }
    if (dataToSubmit.estimate_save == '' || dataToSubmit.estimate_save == null || dataToSubmit.estimate_save == undefined) {
      this.notify.warning('Please fill Estimated Save ')
      return false
    }
    
    if (dataToSubmit.content == '' || dataToSubmit.content == null || dataToSubmit.content == undefined) {
      this.notify.warning('Please fill Project Note in NotePad ')
      return false
    }
    if (dataToSubmit.strategy_note == '' || dataToSubmit.strategy_note == null || dataToSubmit.strategy_note == undefined) {
      this.notify.warning('Please fill Strategy Note in NotePad ')
      return false
    }
    // if (dataToSubmit.project_start_date == '' || dataToSubmit.project_start_date == null || dataToSubmit.project_start_date == undefined) {
    //   this.notify.warning('Please fill Project Start Date')
    //   return false
    // }
    // if (dataToSubmit.project_end_date == '' || dataToSubmit.project_end_date == null || dataToSubmit.project_end_date == undefined) {
    //   this.notify.warning('Please fill Project Endd Date ')
    //   return false
    // }
    // if (dataToSubmit.onbehalf_group == '' || dataToSubmit.onbehalf_group == null || dataToSubmit.onbehalf_group == undefined) {
    //   this.notify.warning('Please fill On Be Half ')
    //   return false
    // }
    if (this.chipSelectedempid.length <= 0) {
      this.notify.warning("Please Select Atleast one 'Final Vendor Selection Approval Group' ")
      return false
    }
    if (this.chipSelectedempcolid.length <= 0) {
      this.notify.warning("Please Select Atleast one 'Collaborators' ")
      return false
    }
    if (this.chipSelectedempapprovalid.length <= 0) {
      this.notify.warning("Please Select Atleast one 'Project Creation & Spec Approval group'")
      return false
    }
    // chipSelectedempid chipSelectedempcolid chipSelectedempapprovalid
    if(this.invitationList?.length <= 0){
      this.notify.success("Please Select Atleast one Vendor ")
      return false 
    }


    let substart = this.datepipe.transform(Sub_Start_date_transform, 'yyyy-MM-dd')
    let subend = this.datepipe.transform(Sub_End_date_transform, 'yyyy-MM-dd')
    let prostart = this.datepipe.transform(Project_Start_date_transform, 'yyyy-MM-dd')
    let proend = this.datepipe.transform(Project_End_date_transform, 'yyyy-MM-dd')

    let notechange

    if (this.isEdit == true) {
      if (this.Change_Difference_Detection.covernote != this.ProjectForm.value.content) {
        notechange = true
      }
      else {
        notechange = false
      }
    } else {
      notechange = true
    }

    let parallel_approvalobj: any

    if (dataToSubmit.parallel_approval == false) {
      parallel_approvalobj = 0
    }
    else {
      parallel_approvalobj = 1
    }
    let type = 2

    let obj: any = {
      "title": dataToSubmit.title,
      "type": dataToSubmit.type.id,
      "submission_start_date": substart,
      "submission_end_date": subend,
      "project_start_date": prostart,
      "project_end_date": proend,
      "budget": dataToSubmit.budget,
      "parent_id": null,
      "content": dataToSubmit.content,
      "strategy_note": dataToSubmit.strategy_note,
      "proposal_approver": {
        "to_arr": this.chipSelectedempid,
        "to_type": type
      },
      "collaborator": {
        "to_arr": this.chipSelectedempcolid
      },
      "approval": {
        "to_arr": this.chipSelectedempapprovalid
      },
      "onbehalf_group": dataToSubmit.onbehalf_group.id,
      "for_vendor": dataToSubmit.for_vendor,
      "file_remove": this.fileremove,
      "view_type": dataToSubmit.view_type,
      "description": dataToSubmit.description,
      "parallel_approval": parallel_approvalobj,
      "project_identification": dataToSubmit.project_identification,
      "commodity_id":  dataToSubmit.commodity_id.id,
      "subcommodity": dataToSubmit.subcommodity,
      "estimate_currentspent":dataToSubmit.estimate_currentspent,
      "estimate_save": dataToSubmit.estimate_save,
      "invitation": this.invitationList,
      "rel_cat": dataToSubmit?.rel_cat,
      "criticality": dataToSubmit?.criticality,
      "vendor_type": dataToSubmit?.vendor_type
    }

    if(this.isEdit == true){
      Object.assign(obj, {id: this.projectID})
    }

    console.log("obj create", obj)
    console.log("this.Documentfilearray", this.Documentfilearray)
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(obj))
    for (var i = 0; i < this.Documentfilearray.length; i++) {
      let keyvalue = 'file'
      let pairValue = this.Documentfilearray[i];
      formData.append(keyvalue, pairValue)
    }
    this.SpinnerService.show();
    this.service.ProjectTranCreate(formData)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("results get after submit", results)
        if(results.code == "INVALID_PROJECT_ID"){
          this.notify.warning("Project is created for this Selected Identification")
          return false 
        }
        if (results) {
          if(this.isEdit == false){
          this.notify.success("Successully created")
          this.questionaairetopic(results)
            this.onSubmit.emit()
          }
          if(this.isEdit == true){
            this.notify.success("Successfully Updated")
            this.onSubmitEdit.emit()
          }
          
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  questionaairetopic(data){
    console.log("data after submmit", data)

    let questionaaire = data?.project_id
    let dataset = {"arr":[7, 6, 4, 2, 3, 1, 5]}
    this.service.questionaaire(questionaaire, dataset)
    .subscribe(results=>{

    })


  }










  oncancel() {
    
    if(this.isEdit == false){
      // this.notify.success("Successully created")
      this.onCancel.emit()
      }
      if(this.isEdit == true){
        // this.notify.success("Successfully Updated")
        this.onCancelEdit.emit()
      }
  }


  Documentfilearray: any = []
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  pdfurl: any
  jpgUrls: any

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

    // if (this.isEdit == true && 'id' in data) {
    //   this.file_remove_ids_For_Edit.push(data.id)
    // }

    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)
  }

  filepreview(files) {
    console.log("file data to view ", files)

    let stringValue = files.name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false

      // if(this.isEdit == false){

      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.jpgUrls = reader.result
      }
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = true
      const reader: any = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = (_event) => {
        this.pdfurl = reader.result
      }
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
      this.notify.info('Preview not available for this format')
    }
  }

  Files_Api_View(dataforFile) {
    let id = dataforFile.id
    let file_name = dataforFile.file_name;
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      this.jpgUrlsAPI = this.imageUrl + "" + id + "?token=" + token;
      console.log("urlHeader", this.jpgUrlsAPI)
    }
    if (stringValue[1] === "pdf") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      this.service.files(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfurl = downloadUrl
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
    if (stringValue[1] === "csv" || stringValue[1] === "ods" || stringValue[1] === "xlsx" || stringValue[1] === "txt") {
      this.showimageHeaderPreview = false
      this.showimageHeaderPreviewPDF = false
      this.notify.info('Preview not available for this format')
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
              if (this.hasnext === true) {
                this.service.employeesearch(this.empInput.nativeElement.value, this.currentpage + 1, type)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.hasnext = datapagination.has_next;
                      this.hasprevious = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  }, (error) => {

                  })
              }
            }
          });
      }
    });
  }

  public displayFnemp(emp?: emplistss): string | undefined {
    return emp ? emp.name : undefined;
  }


  getemp(keyvalue, type) {
    // this.SpinnerService.show();
    this.service.employeesearch(keyvalue, 1, type)
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



  typeDD(data) {
    let obj = JSON.stringify(data)
    // this.SpinnerService.show();
    this.service.projecttypesearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.TypeList = datas;
        let datapagination = results["pagination"];
        this.has_nexttype = datapagination.has_next;
        this.has_previoustype = datapagination.has_previous;
        this.currentpagetype = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  public displayFnType(typ?: typelistss): string | undefined {
    return typ ? typ.name : undefined;
  }


  autocompletetypeScroll() {
    setTimeout(() => {
      if (
        this.mattypeAutocomplete &&
        this.autocompleteTrigger &&
        this.mattypeAutocomplete.panel
      ) {
        fromEvent(this.mattypeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattypeAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattypeAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattypeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattypeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nexttype === true) {
                this.service.projecttypesearch(this.ProjectForm.value.type, this.currentpagetype + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.TypeList = this.TypeList.concat(datas);
                    if (this.TypeList.length > 0) {
                      this.has_nexttype = datapagination.has_next;
                      this.has_previoustype = datapagination.has_previous;
                      this.currentpagetype = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }


  CategoryList: any
  has_nextcat: boolean
  has_previouscat: boolean
  currentpagecat: any = 1
  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  categoryDD(data) {
    this.SpinnerService.show();
    let obj = JSON.stringify(data)
    this.service.projectcatsearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.CategoryList = datas;
        let datapagination = results["pagination"];
        this.has_nextcat = datapagination?.has_next;
        this.has_previouscat = datapagination?.has_previous;
        this.currentpagecat = datapagination?.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  public displayFncat(cat?: catlistss): string | undefined {
    return cat ? cat.name : undefined;
  }


  autocompleteCatScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcat === true) {
                this.service.projectcatsearch(this.ProjectForm.value.cat_id, this.currentpagecat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.CategoryList = this.CategoryList.concat(datas);
                    if (this.CategoryList.length > 0) {
                      this.has_nextcat = datapagination.has_next;
                      this.has_previouscat = datapagination.has_previous;
                      this.currentpagecat = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  ViewTypeList: any
  getViewType() {
    this.SpinnerService.show();
    this.service.getViewType()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.ViewTypeList = datas;
        console.log("ViewTypeList data get ", this.ViewTypeList)
      }, (error) => {

      }

      )
  }







  SubCategoryList: any
  has_nextsubcat: boolean
  has_previoussubcat: boolean
  currentpagesubcat: any = 1
  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatInput') subcatInput: any;

  SubcategoryDD(cat, data) {
    // if(cat == '' || cat == null || cat == undefined){
    //   this.notify.warning('Please choose Category')
    //   return false 
    // }
    let obj = JSON.stringify(data)
    // this.SpinnerService.show();
    this.service.projectsubcatsearch(data, cat.id, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.SubCategoryList = datas;
        let datapagination = results["pagination"];
        this.has_nextsubcat = datapagination?.has_next;
        this.has_previoussubcat = datapagination?.has_previous;
        this.currentpagesubcat = datapagination?.index;
      }, (error) => {

      })
  }


  public displayFnsubcat(subcat?: subcatlistss): string | undefined {
    return subcat ? subcat.name : undefined;
  }


  autocompletesubCatScroll() {
    setTimeout(() => {
      if (
        this.matsubcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matsubcatAutocomplete.panel
      ) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextsubcat === true) {
                this.service.projectsubcatsearch(this.ProjectForm.value.cat_id, this.ProjectForm.value.subcat_id, this.currentpagesubcat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.SubCategoryList = this.SubCategoryList.concat(datas);
                    if (this.SubCategoryList.length > 0) {
                      this.has_nextsubcat = datapagination.has_next;
                      this.has_previoussubcat = datapagination.has_previous;
                      this.currentpagesubcat = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }







  OnBeHalfList: any
  has_nextOnBeHalf: boolean
  has_previousOnBeHalf: boolean
  currentpageOnBeHalf: any = 1
  @ViewChild('OnBeHalf') matOnBeHalfAutocomplete: MatAutocomplete;
  @ViewChild('OnBeHalfInput') OnBeHalfInput: any;

  OnBeHalfDD(data) {
    let type = 1
    // this.SpinnerService.show();
    this.service.employeesearch(data, 1, type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.OnBeHalfList = datas;
        let datapagination = results["pagination"];
        this.has_nextOnBeHalf = datapagination.has_next;
        this.has_previousOnBeHalf = datapagination.has_previous;
        this.currentpageOnBeHalf = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  public displayFnOnBeHalf(OnBeHalf?: OnBeHalflistss): string | undefined {
    return OnBeHalf ? OnBeHalf.name : undefined;
  }


  autocompleteOnBeHalfScroll() {
    setTimeout(() => {
      if (
        this.matOnBeHalfAutocomplete &&
        this.autocompleteTrigger &&
        this.matOnBeHalfAutocomplete.panel
      ) {
        fromEvent(this.matOnBeHalfAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matOnBeHalfAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matOnBeHalfAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matOnBeHalfAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matOnBeHalfAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextOnBeHalf === true) {
                this.service.employeesearch(this.ProjectForm.value.onbehalf_group, this.currentpageOnBeHalf + 1, 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.OnBeHalfList = this.OnBeHalfList.concat(datas);
                    if (this.OnBeHalfList.length > 0) {
                      this.has_nextOnBeHalf = datapagination.has_next;
                      this.has_previousOnBeHalf = datapagination.has_previous;
                      this.currentpageOnBeHalf = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }













  commodityList: any
  has_nextcommodity: boolean
  has_previouscommodity: boolean
  currentpagecommodity: any = 1
  @ViewChild('commodity') matcommodityAutocomplete: MatAutocomplete;
  @ViewChild('commodityInput') commodityInput: any;

  commodityDD(data) {
    let obj = JSON.stringify(data)
    // this.SpinnerService.show();
    this.service.commoditysearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.commodityList = datas;
        let datapagination = results["pagination"];
        this.has_nextcommodity = datapagination?.has_next;
        this.has_previouscommodity = datapagination?.has_previous;
        this.currentpagecommodity = datapagination?.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  public displayFncom(commodity?: commoditylistss): string | undefined {
    return commodity ? commodity.name : undefined;
  }


  autocompleteCommodityScroll() {
    setTimeout(() => {
      if (
        this.matcommodityAutocomplete &&
        this.autocompleteTrigger &&
        this.matcommodityAutocomplete.panel
      ) {
        fromEvent(this.matcommodityAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcommodityAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcommodityAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcommodityAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcommodityAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcommodity === true) {
                this.service.commoditysearch(this.ProjectForm.value.commodity, this.currentpagesubcat + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityList = this.commodityList.concat(datas);
                    if (this.commodityList.length > 0) {
                      this.has_nextcommodity = datapagination.has_next;
                      this.has_previouscommodity = datapagination.has_previous;
                      this.currentpagecommodity = datapagination.index;
                    }
                  }, (error) => {
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
















  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ProjectForm.get('content').value);
  }
  get sanitizedHtmltwo() {
    return this.sanitizer.bypassSecurityTrustHtml(this.ProjectForm.get('strategy_note').value);
  }


  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = false;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
  }






  @ViewChild('empcol') matempcolAutocomplete: MatAutocomplete;
  @ViewChild('empcolInput') empcolInput: any;
  public chipSelectedempcol: emplistss[] = [];
  public chipSelectedempcolid = [];
  empcol_id = new FormControl();



  public removedempcollaborators(emp: emplistss): void {
    const index = this.chipSelectedempcol.indexOf(emp);

    if (index >= 0) {

      this.chipSelectedempcol.splice(index, 1);
      console.log(this.chipSelectedempcol);
      this.chipSelectedempcolid.splice(index, 1);
      console.log(this.chipSelectedempcolid);
      this.empcolInput.nativeElement.value = '';
    }

  }



  public empcolSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempcolByName(event.option.value.name);
    this.empcolInput.nativeElement.value = '';
    console.log('chipSelectedempcolid', this.chipSelectedempcolid)
  }
  private selectempcolByName(emp) {
    let foundemp1 = this.chipSelectedempcol.filter(e => e.name == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter(e => e.name == emp);
    if (foundemp.length) {
      this.chipSelectedempcol.push(foundemp[0]);
      this.chipSelectedempcolid.push(foundemp[0].id)
    }
  }






  @ViewChild('empapproval') matempapprovalAutocomplete: MatAutocomplete;
  @ViewChild('empapprovalInput') empapprovalInput: any;
  public chipSelectedempapproval: emplistss[] = [];
  public chipSelectedempapprovalid = [];
  empapproval_id = new FormControl();



  public removedempapproval(emp: emplistss) {
    if(this.isEdit){
      return false 
    }
    const index = this.chipSelectedempapproval.indexOf(emp);
    if (index >= 0) {
      this.chipSelectedempapproval.splice(index, 1);
      console.log(this.chipSelectedempapproval);
      this.chipSelectedempapprovalid.splice(index, 1);
      console.log(this.chipSelectedempapprovalid);
      this.empapprovalInput.nativeElement.value = '';
    }
  }



  public empapprovalSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectempapprovalByName(event.option.value.name);
    this.empapprovalInput.nativeElement.value = '';
    console.log('chipSelectedempapprovalid', this.chipSelectedempapprovalid)
  }
  private selectempapprovalByName(emp) {
    let foundemp1 = this.chipSelectedempapproval.filter(e => e.name == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.empList.filter(e => e.name == emp);
    if (foundemp.length) {
      this.chipSelectedempapproval.push(foundemp[0]);
      this.chipSelectedempapprovalid.push(foundemp[0].id)
    }
  }



  vendorcode = new FormControl('')
  email_id = new FormControl('')
  v_name = new FormControl('')

  InvitorsAdd() {
    console.log("getting value for vendor code ", this.vendorcode.value['code'])
    let vcodes

    if(this.vendorcode.value['code'] == undefined){
      vcodes = null
    }else{
      vcodes = this.vendorcode.value['code'] 
    }

    let object = {
      email_id: this.email_id.value,
      v_name: this.v_name.value,
      v_code: vcodes
    }
    console.log("add invitations", object)
    this.invitationList.push(object)
    this.vendorcode.reset("")
    this.v_name.reset("")
    this.email_id.reset("")
  }





  UserList: any
  has_nextuser: any
  has_previoususer: any
  currentpageuser: any

  userdd(data) {
    // this.SpinnerService.show();
    this.service.usersearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.UserList = datas;
        let datapagination = results["pagination"];
        this.has_nextuser = datapagination.has_next;
        this.has_previoususer = datapagination.has_previous;
        this.currentpageuser = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  SelectedVendor(data){
    this.email_id.patchValue(data.email_id)
    this.v_name.patchValue(data.name)
  }

  displayFnuser(user?: userlistss): string | undefined {
    return user ? user.code : undefined;
  }

  autocompleteuserScroll() {

  }


  deleteuser(index){
    console.log("index of selected user", index)
    this.invitationList.splice(index, 1)
  }



  RelationShipCategoryList: any
  getRelationShipCategory() {
    this.SpinnerService.show();
    this.service.getRelationShipCategory()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.RelationShipCategoryList = datas;
        console.log("RelationShipCategoryList data get ", this.RelationShipCategoryList)
      }, (error) => {

      }

      )
  }



  VendorTypeList: any
  getVendorType() {
    this.SpinnerService.show();
    this.service.getvendorType()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.VendorTypeList = datas;
        console.log("VendorTypeList data get ", this.VendorTypeList)
      }, (error) => {

      }

      )
  }



  criticalityList: any
  getcriticality() {
    this.SpinnerService.show();
    this.service.getCriticality()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.criticalityList = datas;
        console.log("criticality data get ", this.criticalityList)
      }, (error) => {

      }

      )
  }


  filedownload(data) {
    console.log("fileName",data)
    this.SpinnerService.show();
    let fileName = data.file_name 
    this.service.fileDownloads(data.file_id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        let filevalue = fileName.split('.')
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  fileremove:any =[]
  deleteInlineApiImageFile(index, data){
    console.log("index for already selected files index", index)
    console.log("index for already selected files data", data)
    let dataConfirm = confirm("Are you sure do you want to remove file?")
    if(dataConfirm){
      this.fileremove.push(data.id)
      this.EditFiles.splice(index, 1)
    }
    else{
      return false
    }
    console.log("index for already selected files data remove array", this.fileremove)
  }


  amtclick(e) {
    let amt = e.target.value
    console.log("amtclick",amt)
    let taxamt:any = this.ProjectForm.value.budget - amt
    console.log("amtclick",taxamt);
    this.ProjectForm.controls['estimate_save'].setValue(taxamt)

  }


}
export interface emplistss {
  id: string;
  name: any;
  full_name: any
}


export interface typelistss {
  id: string;
  name: any;
}

export interface catlistss {
  id: string;
  name: any;
}

export interface subcatlistss {
  id: string;
  name: any;
}

export interface OnBeHalflistss {
  id: string;
  name: any;
}


export interface commoditylistss {
  id: string;
  name: any;
}


export interface userlistss {
  id: string;
  name: any;
  code: any; 
}
