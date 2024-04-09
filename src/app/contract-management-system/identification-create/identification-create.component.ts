import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { CmsService } from '../cms.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CMSSharedService } from '../cms-shared.service';
import { environment } from 'src/environments/environment';
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';

@Component({
  selector: 'app-identification-create',
  templateUrl: './identification-create.component.html',
  styleUrls: ['./identification-create.component.scss']
})
export class IdentificationCreateComponent implements OnInit {

  identificationForm: FormGroup

  empList: emplistss[];
  public chipSelectedemp: emplistss[] = [];
  public chipSelectedempid = [];
  emp_id = new FormControl('');


  hasnext: any
  hasprevious: any
  currentpage: any = 1



  isLoading: boolean = false
  TypeList: any;
  onBehalfList: any;
  public Parallel_Delivery: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  @Output() onSubmitedit = new EventEmitter<any>();
  @Output() onCanceledit = new EventEmitter<any>();

  isEdit: boolean = false
  Change_Difference_Detection: any
  file_remove_ids_For_Edit = []
  imageUrl: any = environment.apiURL
  jpgUrlsAPI: any
  EditFiles: any = []



  constructor(private sanitizer: DomSanitizer, private service: CmsService, private notify: ToastrService,
    private fb: FormBuilder, private datepipe: DatePipe, private cmsshare: CMSSharedService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,) { }

  ngOnInit(): void {

    let key: any = ""
    this.getemp(key);
    this.typeDD('');

    let identificationdata: any = this.cmsshare.identificationCreate.value
    console.log("identification create or edit ", identificationdata)

    if (identificationdata != '') {
      this.isEdit = true
      this.identificationedit(identificationdata)
    }
    else {
      this.isEdit = false
    }

    this.identificationForm = this.fb.group({
      "title": "",
      "type": "",
      "onbehalf_group": '',
      "content": "",
    })
  }

  ////////////////////////////////////////////////////////////////////////////////////////  Identification Edit

  IdentificationID: any
  identificationedit(projectdata) {
    console.log("project data edit funnction call =>", projectdata)
    console.log("is edit=>", this.isEdit)

    if (this.isEdit == true) {
      let data: any = projectdata
      this.IdentificationID = data
      this.SpinnerService.show();
      this.service.getidentification(data)
        .subscribe(results => {
          this.SpinnerService.hide();
          let dataresults = results
          this.Change_Difference_Detection = results
          console.log("results data edit get API=============>", results)
          if (results) {
            this.identificationForm.patchValue({
              "title": results.title,
              "type": results.type,
              "onbehalf_group": results.onbehalf_group,
              "content": results?.covernote?.note
            })
            console.log("projectdata.approver", results)
            for (let i of results.approver) {
              console.log("i", i)
              console.log("i.approver.id", i.approver.id)

              console.log("i.approver.name", i.approver.name)

              this.chipSelectedemp.push(i.approver)
              this.chipSelectedempid.push(i.approver.id)
            }
            this.EditFiles = dataresults.filedata
          }
          console.log("this.chipsname on edit", this.chipSelectedemp)
          console.log(" chipselected id on edit", this.chipSelectedempid)
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }
  }


  //////////////////////////////////////////////////////////////////////////////////////// Identification Submit

  IdentificationSubmit(type) {
    let dataToSubmit = this.identificationForm.value

    if (dataToSubmit.title == '' || dataToSubmit.title == null || dataToSubmit.title == undefined) {
      this.notify.warning('Please fill Title ')
      return false
    }

    if (dataToSubmit.type == '' || dataToSubmit.type == null || dataToSubmit.type == undefined) {
      this.notify.warning('Please fill Type ')
      return false
    }
    if (dataToSubmit.onbehalf_group == '' || dataToSubmit.onbehalf_group == null || dataToSubmit.onbehalf_group == undefined) {
      this.notify.warning('Please fill Beneficiary group ')
      return false
    }
    if (dataToSubmit.content == '' || dataToSubmit.content == null || dataToSubmit.content == undefined) {
      this.notify.warning('Please fill Description in NotePad ')
      return false
    }

    if (this.chipSelectedempid.length <= 0) {
      this.notify.warning('Please Select Approver')
      return false
    }


    let obj: any = {
      "title": dataToSubmit.title,
      "type": dataToSubmit.type.id,
      "onbehalf_group": dataToSubmit.onbehalf_group.id,
      "parallel_approval": this.Parallel_Delivery,
      "approval": {
        "to_arr": this.chipSelectedempid,
        "to_type": 2
      },
      "content": dataToSubmit.content,
      "file_remove": this.fileremove,
    }

    if (this.isEdit == true) {
      obj = Object.assign(obj, { id: this.IdentificationID })
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
    this.service.IdentificationCreate(formData, type)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("results get after submit", results)
        if (results.code == "INVALID_DATA") {
          this.SpinnerService.hide();
          this.notify.warning('Invalid Data')
          return false
        }
        if (results.code == "INVALID_FILETYPE") {
          this.SpinnerService.hide();
          this.notify.warning('Invalid File Type')
          return false
        }
        if (results) {
          this.SpinnerService.hide();
          this.notify.success("Success")
          if (this.isEdit == true) {
            this.onSubmitedit.emit()
          }
          if (this.isEdit == false) {
            this.onSubmit.emit()
          }
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ////////////////////////////////////////////////////////////////////////////////////////// Identification Cancel


  oncancel() {
    if (this.isEdit == true) {
      this.onCanceledit.emit()
    }
    if (this.isEdit == false) {
      this.onCancel.emit()
    }

  }


  /////////////////////////////////////////////////////////////////////////////////////////////File Part 

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
    console.log("filedata selected", data)

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
    console.log("dataforFile", dataforFile)
    let id = dataforFile.file_id
    let file_name = dataforFile.file_name;
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    let stringValue = file_name.split('.')
    if (stringValue[1] === "png" || stringValue[1] === "jpeg" || stringValue[1] === "jpg") {
      this.showimageHeaderPreview = true
      this.showimageHeaderPreviewPDF = false
      this.jpgUrls = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;
      console.log("urlHeader", this.jpgUrls)
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


  // filedownload(data){
  //   console.log("download files ", data)
  //   // http://143.110.244.51:8188/docserv/doc_download/CMS_457


  // }

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

  /////////////////////////////////////////////////////////////////////////////Dropdowns and AutoCompletes  

  ////////////////////////////////////////////EMP Call
  autocompleteempScroll() {
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
                this.service.employeesearch(this.empInput.nativeElement.value, this.currentpage + 1, 2)
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
                    this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }



  getemp(keyvalue) {
    let type = 2 // employee
    console.log("emp fun called")
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





  public removedemp(emp: emplistss) {
    const index = this.chipSelectedemp.indexOf(emp);
    if (this.isEdit == true) {
      return false
    }

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




  ////////////////////////////////////////////////////////////////////////////// type
  typeDD(data) {
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

  @ViewChild('type') mattypeAutocomplete: MatAutocomplete;
  @ViewChild('typeInput') typeInput: any;
  currentpagetype: any = 1
  has_nexttype: boolean
  has_previoustype: boolean

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
                this.service.projecttypesearch(this.identificationForm.value.type, this.currentpagetype + 1)
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
                this.service.employeesearch(this.identificationForm.value.onbehalf_group, this.currentpageOnBeHalf + 1, 2)
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
    return this.sanitizer.bypassSecurityTrustHtml(this.identificationForm.get('content').value);
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



















}

export interface emplistss {
  id: string;
  // name: any;
  name: any
}
export interface OnBeHalflistss {
  id: string;
  name: any;
}

export interface typelistss {
  id: string;
  name: any;
}