import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { CMSSharedService } from '../cms-shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

export interface typelistss {
  id: string;
  name: any;
}

@Component({
  selector: 'app-contract-management-system',
  templateUrl: './contract-management-system.component.html',
  styleUrls: ['./contract-management-system.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})



export class ContractManagementSystemComponent implements OnInit {

  urls: string;
  urlProject;

  ProjectSearchForm: FormGroup;
  ProjectAppIdentificationSearchForm: FormGroup;

  CMS_Tran_Menu_List: any
  ProjectList: any
  ApprovalStatusList: any
  Is_Closed_Open_List: any = [{ id: 0, text: 'Open' }, { id: 1, text: 'Closed' }]
  TypeList: any

  presentpageProject: number = 1;
  has_nextProject = true;
  has_previousProject = true;

  isLoading = false;
  pageSize = 10;

  projectsummary: boolean
  projectcreate: boolean
  projecview: boolean
  MenuView: boolean = true

  has_nexttype: any
  has_previoustype: any
  currentpagetype: any = 1
  returnnav: number 
  IdentificationSearchForm: FormGroup

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('type') mattypeAutocomplete: MatAutocomplete;
  @ViewChild('typeInput') typeInput: any;

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    // let datas = this.shareService.menuUrlData;
    // datas.forEach((element) => {
    //   let subModule = element.submodule;
    //   if (element.name === "CMS Master") {
    //     this.CMS_Master_Menu_List = subModule;
    //     console.log("CMS_Master_Menu_List", this.CMS_Master_Menu_List)
    //   }
    // })
    this.CMS_Tran_Menu_List = [{ name: 'Project Proposal Request' }, { name: 'Approved Project Proposal Request' }, { name: 'Project' }]

    this.ProjectSearchForm = this.fb.group({
      code: '',
      title: '',
      approvalstatus: '',
      is_closed: 0,
      projecttype: ''

    })

    this.ProjectAppIdentificationSearchForm = this.fb.group({
      code: '',
      title: ''
    })
    this.IdentificationSearchForm = this.fb.group({
      title: [''],
      approvalstatus: [''],

    })

    this.getApprovalStatus()
    this.getIdentificationApprovalStatus() 
  }

  /////////////////////////////////////////////////// Submodules 
  subModuleData(submodule) {
    console.log("submodule names ", submodule)
    if (submodule.name == 'Project') {
      this.projectsummary = true
      this.projectcreate = false
      this.projecview = false
      this.IdentificationApprovedSummaryView = false
      this.identificationcreate = false
      this.identificationview = false
      this.identification = false
      this.ProjectSearch('')
    }
    if (submodule.name == 'Project Proposal Request') {
      this.projectsummary = false
      this.projectcreate = false
      this.projecview = false
      this.IdentificationApprovedSummaryView = false
      this.identificationcreate = false
      this.identificationview = false
      this.identification = true
      this.IdentificationSearch('')
    }
    if (submodule.name == 'Approved Project Proposal Request') {
      this.projectsummary = false
      this.projectcreate = false
      this.projecview = false
      this.IdentificationApprovedSummaryView = true
      this.identificationcreate = false
      this.identificationview = false
      this.identification = false
      this.ProjectApprovedIdentificationSearch('')
    }
  }

/////////////////////////////////////////////////////////////////////////////////////////Project
  ////////////////////////////////////////////////////////////////// Project Summary 
  reftype=1;
  statusclick(data){
    console.log("status for ref type",data)
    this.reftype = data.ref_id
  }


  serviceCallProjectSummary(search, pageno, pageSize) {
    this.service.project_Search_Summary(search, this.reftype,pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("project summary", result)
        this.ProjectList = result['data']
        let dataPagination = result['pagination'];
        if (this.ProjectList.length > 0) {
          this.has_nextProject = dataPagination.has_next;
          this.has_previousProject = dataPagination.has_previous;
          this.presentpageProject = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ProjectSearch(hint: any) {
    let search = this.ProjectSearchForm.value;
    let obj = {
      code: search?.code,
      title: search?.title,
      approvalstatus: search?.approvalstatus,
      is_closed: search?.is_closed,
      projecttype: search?.projecttype?.id
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
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

  resetProject() {
    this.ProjectSearchForm.reset('')
    this.ProjectSearch('')
  }

  ///// add project

  addProject(adddata, type) {
    let data: any = {
      type: type,
      data: adddata
    }
    this.cmsShare.Project_Create_Or_Edit.next(data)
    this.projectsummary = false
    this.projectcreate = true
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = false
    this.MenuView = true
    return
  }

///// project Back
  ProjectCreate() {
    this.ProjectApprovedIdentificationSearch('')
    this.projectsummary = false 
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = true 
    this.identificationcreate = false
    this.identificationview = false
    this.identification = false
    this.MenuView = true
  }
//////// Project Back
  ProjectCancel() {
    console.log("called")
    this.projectsummary = false 
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = true 
    this.identificationcreate = false
    this.identificationview = false
    this.identification = false
    this.MenuView = true
  }
////// Project view
  ProjectView(data) {
    this.MenuView = false
    let dataset: any = {
      data: data,
      view: true,
      individualview: false
    }
    this.cmsShare.ProjectView.next(dataset)
    this.projectsummary = false 
    this.projectcreate = false
    this.projecview = true 
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = false
    this.MenuView = false
    return data
  }

  ProjectViewBack() {
    this.MenuView = true
    this.projectsummary = true
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = false
  }





///////////////////////////////////////////////////////////////////////////////Identification APPROVED Summary


  IdentificcationSummary() {
    this.projectsummary = false
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = true
    this.MenuView = true
    this.ProjectApprovedIdentificationSearch('')
  }

  IdentificationApprovedSummaryView: any
  APP_IdentificationList: any
  has_nextProjectAPPIdentification: any
  has_previousProjectAPPIdentification: any
  presentpageProjectAPPIdentification: any


  serviceCallProjectApprovedIdentificationSummary(search, pageno, pageSize) {
    this.service.project_APP_Identification_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("IdentificationList summary", result)
        this.APP_IdentificationList = result['data']
        let dataPagination = result['pagination'];
        if (this.APP_IdentificationList.length > 0) {
          this.has_nextProjectAPPIdentification = dataPagination.has_next;
          this.has_previousProjectAPPIdentification = dataPagination.has_previous;
          this.presentpageProjectAPPIdentification = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ProjectApprovedIdentificationSearch(hint: any) {
    let search = this.ProjectAppIdentificationSearchForm.value;
    let obj = {
      code: search?.code,
      title: search?.title
    }
    console.log("obj data b4 api", obj)
    for (let i in obj) {
      if (obj[i] == undefined || obj[i] == null) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallProjectApprovedIdentificationSummary(obj, this.presentpageProjectAPPIdentification + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallProjectApprovedIdentificationSummary(obj, this.presentpageProjectAPPIdentification - 1, 10)
    }
    else {
      this.serviceCallProjectApprovedIdentificationSummary(obj, 1, 10)
    }

  }


  ///////////////////////////////////////////////////////////////////////////////////Identification Summary

  // identification 
  identification: boolean;
  identificationcreate: boolean;
  identificationview: boolean;
  identificationSummaryList: any;
  isIdentificationpage: boolean = true;
  presentpageIdentification: number = 1;
  has_nextIdentification = true;
  has_previousIdentification = true;
  pagesize = 10

  serviceCallIdentificationSummary(search, pageno, pageSize) {
    this.service.identificationSummary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("IdentificationList summary", result)
        this.identificationSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.identificationSummaryList.length > 0) {
          this.has_nextIdentification = dataPagination.has_next;
          this.has_previousIdentification = dataPagination.has_previous;
          this.presentpageIdentification = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  IdentificationSearch(hint: any) {
    let search = this.IdentificationSearchForm.value;
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
      this.serviceCallIdentificationSummary(obj, this.presentpageIdentification + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallIdentificationSummary(obj, this.presentpageIdentification - 1, 10)
    }
    else {
      this.serviceCallIdentificationSummary(obj, 1, 10)
    }

  }


  reset_Identification() {
    this.IdentificationSearchForm.controls['title'].reset('')
    this.IdentificationSearchForm.controls['approvalstatus'].reset('')
    this.IdentificationSearch('')
  }


  IdentificationCreate() {
    this.projectsummary = false
    this.projectcreate = false 
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false  
    this.identificationview = false
    this.identification = true 
    this.MenuView = true
    this.IdentificationSearch('');
  }

  IdentificationCancel() {
    this.projectsummary = false
    this.projectcreate = false 
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = true 
    this.MenuView = true
  }

  addIdentification() {
    this.cmsShare.identificationCreate.next('')
    this.projectsummary = false
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = true 
    this.identificationview = false
    this.identification = false
    this.MenuView = true
  }

  editIdentification(data: any) {
    console.log("datat for edit", data )
    this.cmsShare.identificationCreate.next(data)
    this.projectsummary = false
    this.projectcreate = false
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = true 
    this.identificationview = false
    this.identification = false
    this.MenuView = true
    return data 
  }

  identificationView(data) {
    let dataset:any = {
      identificationview : true, 
      data: data
    }
    this.cmsShare.identificationView.next(dataset)
    this.projectsummary = false
    this.projectcreate = false 
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = true 
    this.identification = false
    this.MenuView = false 
  }

  IdentificationViewBack() {
    this.IdentificationSearch("")
    this.projectsummary = false
    this.projectcreate = false 
    this.projecview = false
    this.IdentificationApprovedSummaryView = false
    this.identificationcreate = false
    this.identificationview = false
    this.identification = true 
    this.MenuView = true
  }



  ////////////////////////////////////////////////////////////////////

  getApprovalStatus() {
    let ref = 1
    this.SpinnerService.show();
    this.service.GetApprovalStatusCMS_Summary(ref)
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
                let searchdata
                let data = {
                  searchdata: this.ProjectSearchForm.value?.projecttype?.id
                }
                this.service.projecttypesearch(data.searchdata, this.currentpagetype + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.TypeList = this.TypeList.concat(datas);
                    if (this.TypeList.length >= 0) {
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

IdentificationStatusList: any 
  getIdentificationApprovalStatus() {
    let ref = 1
    this.SpinnerService.show();
    this.service.GetApprovalStatusIdentificationCMS_Summary(ref)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.IdentificationStatusList = datas;
        console.log("app status list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


}
