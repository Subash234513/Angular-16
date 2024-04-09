import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { map, startWith, finalize, switchMap, debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CMSSharedService } from '../cms-shared.service';

export interface iEmployeeList {
  full_name: string;
  id: number;
}


@Component({
  selector: 'app-cms-master',
  templateUrl: './cms-master.component.html',
  styleUrls: ['./cms-master.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class CmsMasterComponent implements OnInit {


  urls: string;
  urlProjectType;
  urlDocumentType;

  ProjectTypeSearchForm: FormGroup
  DocumentTypeSearchForm: FormGroup
  AddFormProjectOrDocument: FormGroup
  GroupSearchForm: FormGroup
  EmpAddForm: FormGroup
  IdentificationForm: FormGroup

  CMS_Master_Menu_List: any
  ProjectTypeList: any
  DocumentTypeList: any
  groupList: any;

  presentpageProject: number = 1;
  has_nextProject = true;
  has_previousProject = true;

  presentpageDoc: number = 1;
  has_nextDoc = true;
  has_previousDoc = true;

  isLoading = false;
  pageSize = 10;

  FormName: any
  TypeOfForm: any
  ID_Value_To_Edit: any = ''

  projecttypesummary: boolean
  documenttypesummary: boolean
  addformpart: boolean

  // group menu
  groupsummary: boolean;
  groupView_EmployeeMapping: boolean;
  presentpageGroup: number = 1;
  has_nextGroup = true;
  has_previousGroup = true;
  group_Id: number;


  // group view
  has_next = true;
  has_previous = true;
  currentpage: number = 1;

  employeeMappingList: any;
  roleList: any;

  // legal clause
  legalsummary: boolean;
  LegalSearchForm: FormGroup;
  RemarksForm: FormGroup;
  MoveToApproveForm: FormGroup
  legalList: any;
  presentpageLegal: number = 1;
  has_nextLegal = true;
  has_previousLegal = true;
  legal_Id: any = ''
  legalForm: FormGroup;
  islegalForm: boolean;
  islegalView: boolean;
  ProcessList: any = [{ name: 'Approve' }, { name: 'Reject' }, { name: 'Return' }];
  ApprovalStatusList_legal: any =
    [{ 'id': 1, 'name': 'Draft' }, { 'id': 2, 'name': 'Pending' }, { 'id': 3, 'name': 'Approved' }, { 'id': 4, 'name': 'Rejected' }, { 'id': 5, 'name': 'Review' }]
  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployee: iEmployeeList[] = [];
  public chipSelectedEmployeeid = [];
  public chipRemovedEmployeeid = [];
  public employeeControl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('employeeInput') employeeInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;




  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private notify: ToastrService, private cmsShareService: CMSSharedService
  ) {

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
      ['insert', ['table', 'picture', 'link', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  ngOnInit(): void {
    // let datas = this.shareService.menuUrlData;
    // datas.forEach((element) => {
    //   let subModule = element.submodule;
    //   if (element.name === "CMS Master") {
    //     this.CMS_Master_Menu_List = subModule;
    //     console.log("CMS_Master_Menu_List", this.CMS_Master_Menu_List)
    //   }
    // })
    this.CMS_Master_Menu_List = [{ name: 'Project Type' }, { name: 'Document Type' }, { name: 'Group' },
    { name: 'Legal Clause' }]

    this.ProjectTypeSearchForm = this.fb.group({
      code: '',
      name: ''
    })
    this.DocumentTypeSearchForm = this.fb.group({
      code: '',
      name: ''
    })
    this.GroupSearchForm = this.fb.group({
      code: '',
      name: ''
    })
    this.AddFormProjectOrDocument = this.fb.group({
      name: ''
    })
    this.EmpAddForm = this.fb.group({
      role_id: [''],
      group_id: [''],
    })
    this.legalForm = this.fb.group({
      name: [''],
      description: [''],
      clauses: [''],
      type: ['']
    })
    this.LegalSearchForm = this.fb.group({
      title: [''],
      approvalstatus: [''],
    })

    this.RemarksForm = this.fb.group({
      remarks: '',
    })
    this.MoveToApproveForm = this.fb.group({
      approval_by: '',
    })




    if (this.employeeControl !== null) {
      this.employeeControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.service.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.allEmployeeList = datas;
          console.log("alllemployeeeisttt", datas)
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }

        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })
    }

    this.getRole();
    this.getApprovalStatus();
    this.legaltypelist();



  }

  subModuleData(submodule) {
    console.log("submodule names ", submodule)
    if (submodule.name == 'Project Type') {
      this.projecttypesummary = true
      this.documenttypesummary = false
      this.addformpart = false
      this.groupsummary = false;
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false
      // this.identificationview = false
      // this.identificationcreate = false
      this.ProjectTypeSearch('')
    }
    if (submodule.name == 'Document Type') {
      this.projecttypesummary = false
      this.documenttypesummary = true
      this.addformpart = false
      this.groupsummary = false;
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false
      // this.identificationview = false
      // this.identificationcreate = false
      this.DocumentTypeSearch('')
    }
    if (submodule.name == 'Group') {
      this.projecttypesummary = false
      this.documenttypesummary = false
      this.addformpart = false
      this.groupView_EmployeeMapping = false;
      this.groupsummary = true;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false
      // this.identificationview = false
      // this.identificationcreate = false
      this.GroupSearch('');
    }
    if (submodule.name == 'Legal Clause') {
      this.projecttypesummary = false
      this.documenttypesummary = false
      this.addformpart = false
      this.groupView_EmployeeMapping = false;
      this.groupsummary = false;
      this.legalsummary = true;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false
      // this.identificationview = false
      // this.identificationcreate = false
      this.LegalSearch('');
    }

  }


  serviceCallProjectSummary(search, pageno, pageSize) {
    this.service.project_type_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("pro type summary", result)
        this.ProjectTypeList = result['data']
        let dataPagination = result['pagination'];
        if (this.ProjectTypeList.length > 0) {
          this.has_nextProject = dataPagination.has_next;
          this.has_previousProject = dataPagination.has_previous;
          this.presentpageProject = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ProjectTypeSearch(hint: any) {
    let search = this.ProjectTypeSearchForm.value;
    let obj = {
      title: search.code
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallProjectSummary(obj, this.presentpageProject + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallProjectSummary(obj, this.presentpageProject - 1, 10)
    }
    else {
      this.serviceCallProjectSummary(obj, 1, 10)
    }

  }


  resetProjectType() {
    this.ProjectTypeSearchForm.controls['code'].reset('')
    this.ProjectTypeSearchForm.controls['name'].reset('')
    this.ProjectTypeSearch('')
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  serviceCallDocumentSummary(search, pageno, pageSize) {
    this.service.document_type_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("doc type summary", result)
        this.DocumentTypeList = result['data']
        let dataPagination = result['pagination'];
        if (this.DocumentTypeList.length > 0) {
          this.has_nextDoc = dataPagination.has_next;
          this.has_previousDoc = dataPagination.has_previous;
          this.presentpageDoc = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  DocumentTypeSearch(hint: any) {
    let search = this.DocumentTypeSearchForm.value;
    let obj = {
      title: search.code
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallDocumentSummary(obj, this.presentpageDoc + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallDocumentSummary(obj, this.presentpageDoc - 1, 10)
    }
    else {
      this.serviceCallDocumentSummary(obj, 1, 10)
    }

  }


  resetDocumentType() {
    this.DocumentTypeSearchForm.controls['code'].reset('')
    this.DocumentTypeSearchForm.controls['name'].reset('')
    this.DocumentTypeSearch('')
  }

  // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ group master

  GroupSearch(hint: any) {
    let search = this.GroupSearchForm.value;
    let obj = {
      title: search.code
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.group_Summary(obj, this.presentpageGroup + 1, 10)
    }
    else if (hint == 'previous') {
      this.group_Summary(obj, this.presentpageGroup - 1, 10)
    }
    else {
      this.group_Summary(obj, 1, 10)
    }

  }
  group_Summary(search, pageno, pageSize) {
    this.service.group_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("group summary", result)
        this.groupList = result['data']
        let dataPagination = result['pagination'];
        if (this.groupList.length > 0) {
          this.has_nextGroup = dataPagination.has_next;
          this.has_previousGroup = dataPagination.has_previous;
          this.presentpageGroup = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  resetGroupType() {
    this.GroupSearchForm.controls['code'].reset('')
    this.GroupSearchForm.controls['name'].reset('')
    this.GroupSearch('')
  }

  // -------------------------------------------------group view-employee mapping
  groupView(id) {
    console.log("view-group id", id)
    this.group_Id = id;
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.addformpart = false;
    this.groupView_EmployeeMapping = true;
    this.legalsummary = false;
    this.islegalForm = false;
    this.islegalView = false;
    // this.identification = false;
    this.getemployee_from_group();
  }

  getemployee_from_group() {
    this.SpinnerService.show();
    this.service.getemployee_from_group(this.group_Id)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("group summary", result)
        this.employeeMappingList = result['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  public removeEmployee(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployee.indexOf(employee);

    // this.chipRemovedEmployeeid.push(employee.id)
    // // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
    // // console.log(employee.id)
    if (index >= 0) {

      this.chipSelectedEmployee.splice(index, 1);
      // console.log(this.chipSelectedEmployee);
      this.chipSelectedEmployeeid.splice(index, 1);
      // console.log(this.chipSelectedEmployeeid);
      this.employeeInput.nativeElement.value = '';
    }

  }

  public employeeSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('employeeSelected', event.option.value.full_name);
    this.selectEmployeeByName(event.option.value.full_name);
    this.employeeInput.nativeElement.value = '';
  }
  private selectEmployeeByName(employeeName) {
    let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.full_name == employeeName);
    if (foundEmployee1.length) {
      // console.log('found in chips');
      return;
    }
    let foundEmployee = this.allEmployeeList.filter(employee => employee.full_name == employeeName);
    if (foundEmployee.length) {
      // We found the employeecc name in the allEmployeeList list
      // console.log('founde', foundEmployee[0].id);
      this.chipSelectedEmployee.push(foundEmployee[0]);
      this.chipSelectedEmployeeid.push(foundEmployee[0].id)
      console.log("added-list", this.chipSelectedEmployeeid);
    }
  }



  submitForm() {
    let jsondata: any = [];
    let roledata = this.EmpAddForm.value.role_id
    if (this.chipSelectedEmployeeid.length !== 0) {
      let x = JSON.stringify(this.chipSelectedEmployeeid)
      jsondata["emp_arr"] = JSON.parse(x)
      if(roledata == "" || roledata == null || roledata == undefined){
        this.notify.warning("Please fill Role")
        return false 
      }

      this.EmpAddForm.value.group_id = this.group_Id;
      console.log("form", this.EmpAddForm.value)
      let json = JSON.stringify(Object.assign({}, jsondata, this.EmpAddForm.value))
      console.log("aa", json)
      this.SpinnerService.show();
      this.service.employee_mapping(json)
        .subscribe(res => {
          this.SpinnerService.hide();
          if (res.status === "success") {
            this.SpinnerService.hide();
            this.notify.success("Assigned Successfully....")
            this.EmpAddForm.reset("")
            this.chipSelectedEmployee = []
            this.chipSelectedEmployeeid = []
            this.getemployee_from_group();
            return true
          } else {
            this.SpinnerService.hide();
            this.notify.error(res.description)
            return false;
          }
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })


    }
    this.chipSelectedEmployeeid = [];

  }

  onCancelClickGroupViwe() {
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = true
    this.groupView_EmployeeMapping = false
    this.legalsummary = false;
    this.islegalForm = false;
    this.islegalView = false;
    // this.identification = false;
  }

  deleteMappedEMployee(data) {
    let employeeId = data.id
    console.log("data to delete employee", data, this.group_Id)
    let obj = {
      "emp_arr": [employeeId],
      "group_id": this.group_Id,
      "role_id": data.role.id
    }
    this.SpinnerService.show();
    this.service.getdelete_MappedEmployee(1, obj)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.notify.success("Successfully Updated")
        this.groupView(this.group_Id)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  //////////////////////////////////////////// identification master
  ApprovalStatusList: any
  getApprovalStatus() {
    let ref = 1
    this.SpinnerService.show();
    this.service.GetApprovalStatus(ref)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.ApprovalStatusList = datas;
        console.log("app status list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  legaltype: any;
  legaltypelist() {
    this.SpinnerService.show();
    this.service.legaltypelist()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        // let datas = results["data"];
        this.legaltype = results;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }




  addType(type, typeOfForm, data) {
    console.log("dataa", data)
    this.FormName = type
    this.TypeOfForm = typeOfForm

    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.groupView_EmployeeMapping = false;
    this.addformpart = true
    this.legalsummary = false;
    this.islegalForm = false;
    this.islegalView = false;
    if (data != '') {
      this.ID_Value_To_Edit = data.id
      this.AddFormProjectOrDocument.patchValue({
        name: data.name
      })
    }
    else {
      this.AddFormProjectOrDocument.reset('')
    }
  }

  onSubmitClick() {
    let type = this.FormName
    let data = this.AddFormProjectOrDocument.value
    if (data.name == '' || data.name == undefined || data.name == null) {
      this.notify.warning('Please fill Name')
      return false
    }
    let dataToSubmit;
    if (this.ID_Value_To_Edit != '') {
      let id = this.ID_Value_To_Edit
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }
    this.SpinnerService.show();
    this.service.ProjectAndDocumentCreate(dataToSubmit, type)
      .subscribe(results => {
        this.SpinnerService.hide();
        if (results?.code == "UNEXPECTED_ERROR" && results?.description == "Duplicate Name") {
          this.notify.warning("Duplicate Data")
          return false
        }
        console.log('create', results)
        if (results) {
          this.SpinnerService.hide();
          if (this.ID_Value_To_Edit != '') {
            this.notify.success('Successfully Updated')
            this.ID_Value_To_Edit = ''
          } else {
            this.notify.success('Successfully Created')
            this.ID_Value_To_Edit = ''
          }
          if (type == 'Project') {
            this.ProjectTypeSearch('')
          }
          if (type == 'Document') {
            this.DocumentTypeSearch('')
          }
          if (type == 'Group') {
            this.GroupSearch('')
          }
          this.AddFormProjectOrDocument.reset('')
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })







    this.addformpart = false

    if (this.FormName == 'Project') {
      this.projecttypesummary = true
      this.documenttypesummary = false
      this.groupsummary = false
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;
    }

    if (this.FormName == 'Document') {
      this.projecttypesummary = false
      this.documenttypesummary = true
      this.groupsummary = false
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;
    }

    if (this.FormName == 'Group') {
      this.projecttypesummary = false
      this.documenttypesummary = false
      this.groupsummary = true
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;
    }




  }



  getRole() {
    this.SpinnerService.show();
    this.service.getRole()
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("doc type summary", result)
        this.roleList = result['data']

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  onCancelClick() {

    this.addformpart = false

    if (this.FormName == 'Project') {
      this.projecttypesummary = true
      this.documenttypesummary = false
      this.groupsummary = false
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;
    }

    if (this.FormName == 'Document') {
      this.projecttypesummary = false
      this.documenttypesummary = true
      this.groupsummary = false
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;
    }

    if (this.FormName == 'Group') {
      this.projecttypesummary = false
      this.documenttypesummary = false
      this.groupsummary = true
      this.groupView_EmployeeMapping = false;
      this.legalsummary = false;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;

    }

    if (this.FormName == 'Legal') {
      this.projecttypesummary = false
      this.documenttypesummary = false
      this.groupsummary = false
      this.groupView_EmployeeMapping = false;
      this.legalsummary = true;
      this.islegalForm = false;
      this.islegalView = false;
      // this.identification = false;

    }


  }






  autocompleteEmployeeScroll() {
    // setTimeout(() => {
    //   if (
    //     this.matAutocomplete &&
    //     this.autocompleteTrigger &&
    //     this.matAutocomplete.panel
    //   ) {
    //     fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
    //       .pipe(
    //         map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
    //         takeUntil(this.autocompleteTrigger.panelClosingActions)
    //       )
    //       .subscribe(x => {
    //         const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
    //         const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
    //         const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
    //         const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    //         // console.log('fetchmoredata', scrollTop, elementHeight, scrollHeight, atBottom);
    //         if (atBottom) {
    //           // fetch more data
    //           // console.log('fetchmoredata1', this.has_next);
    //           // console.log(this.employeeInput.nativeElement.value);
    //           if (this.has_next === true) {
    //             this.dataService.get_EmployeeList(this.employeeInput.nativeElement.value, this.currentpage + 1)
    //               .subscribe((results: any[]) => {
    //                 let datas = results["data"];
    //                 let datapagination = results["pagination"];
    //                 this.allEmployeeList = this.allEmployeeList.concat(datas);
    //                 // console.log("emp", datas)
    //                 if (this.allEmployeeList.length >= 0) {
    //                   this.has_next = datapagination.has_next;
    //                   this.has_previous = datapagination.has_previous;
    //                   this.currentpage = datapagination.index;
    //                 }
    //               })
    //           }
    //         }
    //       });
    //   }
    // });
  }



  // legal summary


  LegalSearch(hint: any) {
    let search = this.LegalSearchForm.value;
    let obj = {
      title: search?.title,
      approval_status: search?.approvalstatus
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.legal_Summary(obj, this.presentpageLegal + 1, 10)
    }
    else if (hint == 'previous') {
      this.legal_Summary(obj, this.presentpageLegal - 1, 10)
    }
    else {
      this.legal_Summary(obj, 1, 10)
    }

  }

  legal_Summary(search, pageno, pageSize) {
    this.service.legal_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("legal summary", result)
        this.legalList = result['data']
        let dataPagination = result['pagination'];
        if (this.legalList.length > 0) {
          this.has_nextLegal = dataPagination.has_next;
          this.has_previousLegal = dataPagination.has_previous;
          this.presentpageLegal = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  reset_legal() {
    this.LegalSearchForm.controls['title'].reset('')
    this.LegalSearchForm.controls['approvalstatus'].reset('')
    this.LegalSearch('')
  }


  // add legal
  addLegal(typeOfForm) {
    this.legal_Id = ''
    this.TypeOfForm = typeOfForm
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.groupView_EmployeeMapping = false;
    this.addformpart = false
    this.legalsummary = false;
    this.islegalForm = true;
    this.islegalView = false;
    this.legalForm = this.fb.group({
      name: [''],
      description: [''],
      clauses: [''],
      type: ['']
    })
  }

  onSubmitlegalClick() {
    let data = this.legalForm.value
    if (data.name == '' || data.name == undefined || data.name == null) {
      this.notify.warning('Please fill Name')
      return false
    }
    if (data.type == '' || data.type == undefined || data.type == null) {
      this.notify.warning('Please fill Type')
      return false
    }
    if (data.description == '' || data.description == undefined || data.description == null) {
      this.notify.warning('Please fill Description')
      return false
    }
    if (data.clauses == '' || data.clauses == undefined || data.clauses == null) {
      this.notify.warning('Please fill Clause')
      return false
    }
    let dataToSubmit;
    if (this.legal_Id != '') {
      let id = this.legal_Id
      dataToSubmit = Object.assign({}, { 'id': id }, data)
    }
    else {
      dataToSubmit = data
    }
    this.SpinnerService.show();
    this.service.legalform(dataToSubmit)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log('create', results)
        if (results.status == 'success') {
          this.SpinnerService.hide();
          if (this.legal_Id != '') {
            this.notify.success('Successfully Updated')
            this.projecttypesummary = false
            this.documenttypesummary = false
            this.groupsummary = false
            this.groupView_EmployeeMapping = false;
            this.legalsummary = false;
            this.islegalForm = false;
            this.addformpart = false;
            this.islegalView = true;
            this.getParticularLegal();
          } else {
            this.notify.success('Successfully Created')
            this.legal_Id = ''
            this.projecttypesummary = false
            this.documenttypesummary = false
            this.groupsummary = false
            this.groupView_EmployeeMapping = false;
            this.legalsummary = true;
            this.islegalForm = false;
            this.addformpart = false;
            this.islegalView = false;
            this.LegalSearch('')
            this.legalForm = this.fb.group({
              name: [''],
              description: [''],
              clauses: [''],
              type: ['']
            })
          }

        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  onLegalCancelClick() {
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.addformpart = false;
    this.groupView_EmployeeMapping = false;
    this.legalsummary = true;
    this.islegalForm = false;
    this.islegalView = false;
  }


  legalDetails: any
  // view legal
  legalView(id) {
    console.log("view-legal id", id)
    this.legal_Id = id;
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.addformpart = false;
    this.groupView_EmployeeMapping = false;
    this.legalsummary = false;
    this.islegalForm = false;
    this.islegalView = true;
    this.getParticularLegal();
  }

  // legal edit
  EditLegal(typeOfForm) {
    this.TypeOfForm = typeOfForm
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.addformpart = false;
    this.groupView_EmployeeMapping = false;
    this.legalsummary = false;
    this.islegalForm = true;
    this.islegalView = false;

    this.service.getParticularLegal(this.legal_Id)
      .subscribe(result => {
        this.legalForm.patchValue({
          name: result.name,
          clauses: result.clauses,
          description: result.description,
          type: result.type
        })
      })
  }

  getParticularLegal() {
    this.service.getParticularLegal(this.legal_Id)
      .subscribe(result => {
        console.log("getParticularLegal", result)
        this.legalDetails = result;
      })
  }



  deleteLegal(id) {
    let legal_Id = id
    if (confirm("Delete Legal details?")) {
      this.service.deleteLegal(legal_Id)
        .subscribe(result => {
          if (result['status'] == 'success') {
            this.notify.success("Successfully deleted")
            this.LegalSearch('')
            return true
          } else {
            this.notify.error(result['code'])
          }

        })
    }
    else {
      return false;
    }

  }





  editorDisabled = false;
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



  /////////////////////////////////////////////////////////////////////////////////////Approve Reject Return Process

  SelectedProcess: any


  gettingRemarks(type) {
    console.log("selected tuype for popup", type)
    let type_Of_Process = type?.name
    this.SelectedProcess = type_Of_Process
  }



  Approval_Reject_Review(type) {
    let typeID;
    if (type == 'Approve') {
      typeID = 3
    }
    if (type == 'Reject') {
      typeID = 4
    }
    if (type == 'Return') {
      typeID = 5
    }

    let obj = {
      "remarks": this.RemarksForm.value.remarks,
      "status": typeID,
    }
    this.SpinnerService.show();
    this.service.Approval_Reject_Review_legal(this.legal_Id, obj)
      .subscribe((results) => {
        if (results.status == 'success') {
          this.notify.success("Success")
          this.getParticularLegal();
          this.SpinnerService.hide();
          this.RemarksForm.reset("")
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  move_to_approver() {

    this.MoveToApproveForm.value.approval_by = this.MoveToApproveForm.value.approval_by.id
    let obj = {
      status: 2,
      approval_by: this.MoveToApproveForm.value.approval_by
    }
    this.service.move_to_approver(this.legal_Id, obj)
      .subscribe((results) => {
        if (results.status == 'success') {
          this.notify.success("Submitted To Approver")
          this.getParticularLegal();
          this.MoveToApproveForm.reset("")
          this.SpinnerService.hide();
        }

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  backnavigate() {
    this.projecttypesummary = false
    this.documenttypesummary = false
    this.groupsummary = false;
    this.addformpart = false;
    this.groupView_EmployeeMapping = false;
    this.legalsummary = true;
    this.islegalForm = false;
    this.islegalView = false;
  }




  EMPList: any
  has_nextemp: any
  has_previousemp: any
  currentpageemp: any
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;

  EmpDD(data) {
    this.service.Allemployeesearch(data, 1)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.EMPList = datas;
        let datapagination = results["pagination"];
        this.has_nextemp = datapagination.has_next;
        this.has_previousemp = datapagination.has_previous;
        this.currentpageemp = datapagination.index;
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  displayFnemp(emp?: emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }







}


export interface emplistss {
  id: string;
  name: any;
  full_name: any
}
