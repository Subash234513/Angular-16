import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { CMSSharedService } from '../cms-shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AmountPipePipe } from '../amount-pipe.pipe'
import { data } from 'jquery';
import { Console } from 'console';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class ProjectViewComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private notify: ToastrService, private activateroute: ActivatedRoute
  ) {

  }

  detailsPreView: any;
  ProposalList: any;
  CMS_ProjectView_Menu_List: any = [{ name: 'Project Comments' }, { name: 'Transaction History' }, { name: 'Proposals' }, { name: 'Shortlisted Proposals' }, { name: 'Finalized Proposals' }, { name: 'Evaluation' }, { name: 'Supplier Catlog' }];
  ProcessList: any = [{ name: 'Approve' }, { name: 'Reject' }, { name: 'Return' }];
  StatusProposal: any = [{ text: 'Pending', id: 1 }, { text: 'Approved', id: 5 }];
  proposalsTab: boolean;
  ProjectCommentsTab: boolean;
  HistoryTab: boolean;
  projectdetailsView: boolean;
  proposalIndividialView: boolean;
  ShortlistTab: boolean
  EvaluateTab: boolean
  finalizedTab: boolean
  projectcreate: boolean
  SupplierCatlog: boolean

  ProposalSearchForm: FormGroup;
  ShortlistSearchForm: FormGroup;
  finalizeSearchForm: FormGroup;
  RemarksForm: FormGroup
  ApprovalNote: FormGroup
  SupplierCatlogApprovedVendorSearchForm: FormGroup

  HistoryList: any
  imageUrl: any = environment.apiURL
  Project_Id: any
  projectCommentsList: any
  ApprovalStatusList: any
  @Output() onSubmit = new EventEmitter<any>();
  content = new FormControl('')
  commentinput = new FormControl('')
  contentname: any
  strategynote: any
  groupApproverList: any
  hasnext: any
  hasprevious: any
  currentpage: any = 1

  ngOnInit(): void {
    let projectdata: any = this.cmsShare.ProjectView.value
    console.log("project data view get", projectdata)
    this.Project_Id = projectdata.data.id
    // this.detailsPreView = projectdata.data
    this.projectdetailsView = projectdata.view
    this.proposalIndividialView = projectdata.individualview
    this.projectView(projectdata)

    this.ProposalSearchForm = this.fb.group({
      name: '',
      code: '',
      proposer: '',
      approvalstatus: ''
    })
    this.ShortlistSearchForm = this.fb.group({
      name: '',
      code: '',
      proposer: '',
      status: ''
    })

    this.finalizeSearchForm = this.fb.group({
      name: '',
      code: '',
      proposer: '',
      status: ''
    })

    this.RemarksForm = this.fb.group({
      remarks: '',
      group_id: ''
    })

    this.ApprovalNote = this.fb.group({
      content: '',
      remarks: ''
    })

    this.SupplierCatlogApprovedVendorSearchForm = this.fb.group({
      name: '',
      code: '',
      proposer: '',
      status: ''
    })

    this.ProposalSearch('')
    this.getApprovalStatus()
    this.getTransHistory()
    this.getcommnets('')
    this.getProjectBasedversion()
    this.shortlistSearch('')
    this.finalizeSearch('')
    this.getEvaluationComparision()
    this.SupplierCatlogApprovedVendorSearch('')
    // this.getquestiondata(this.vendorid)
    // this.TotalEvaluationView()
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////Project View

  invitationList: any

  projectView(data) {
    console.log("data on view", data.data.id)
    let ID = data.data.id
    this.SpinnerService.show();
    this.service.getproject(ID)
      .subscribe(results => {
        console.log("get view after API", results)
        if (results) {
          this.SpinnerService.hide();
          this.detailsPreView = results
          // this.approverStyle = this.stylingBasedOnApprover(results)
          this.content.patchValue(this.detailsPreView?.covernote?.note)
          this.contentname = this.detailsPreView?.covernote?.note
          this.strategynote = this.detailsPreView?.strategy_note?.note
          // this.CMS_ProjectView_Menu_List
          this.groupApproverList = results?.pending_approver
          this.invitationList = results?.invitation
        }

      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  backnavigate() {
    // this.router.navigate(['cms/cms'])
    this.onSubmit.emit()
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
      "group_id": this.RemarksForm.value.group_id
    }
    this.SpinnerService.show();
    this.service.Approval_Reject_Review(this.Project_Id, obj)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        console.log("results after approval", results)
        let obj = {
          data: {
            id: this.Project_Id
          }
        }
        this.notify.success("Success")
        this.projectView(obj)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////Version Based API

  ProjectVersionlist: any
  getProjectBasedversion() {
    let dataset = this.Project_Id
    this.SpinnerService.show();
    this.service.getVersionProject(dataset, 'proposal')
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("version get", results)
        this.ProjectVersionlist = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  getProjectBasedversionSelect(data) {
    let dataset = this.Project_Id
    this.SpinnerService.show();
    this.service.getVersionProjectBasedOnID(dataset, data?.id)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("version get", results)
        this.detailsPreView = results['data']
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  /////////////////////////////////////////////////////////////////////////////////////////////////// Files

  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  pdfurl: any
  jpgUrlsAPI: any
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


  ////////////////////////////////////////////////////////////////////////////////////////////////Proposal Summary
  has_nextproposal: boolean
  has_previousProposal: boolean
  presentpageProposal: any

  serviceCallProposalSummary(search, pageno, pageSize) {
    this.service.proposal_Search_Summary(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("proposal summary", result)
        this.ProposalList = result['data']
        let dataPagination = result['pagination'];
        if (this.ProposalList.length > 0) {
          this.has_nextproposal = dataPagination.has_next;
          this.has_previousProposal = dataPagination.has_previous;
          this.presentpageProposal = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ProposalSearch(hint: any) {
    let search = this.ProposalSearchForm.value;
    let obj = {
      id: this.Project_Id,
      name: search?.name,
      code: search?.code,
      proposer: search?.proposer,
      approval_status: search?.approvalstatus
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallProposalSummary(obj, this.presentpageProposal + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallProposalSummary(obj, this.presentpageProposal - 1, 10)
    }
    else {
      this.serviceCallProposalSummary(obj, 1, 10)
    }

  }

  resetProposal() {
    this.ProposalSearchForm.reset('')
  }


  ///////////////////////////////////////////////////////////////////////////////////////////Comment Based Get

  has_nextcomments: boolean
  has_previouscomments: boolean
  presentpagecomments: any

  serviceCallCommentsList(page) {
    let reltype = 1
    this.service.CommentsList_Summary(this.Project_Id, reltype, page)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("comments summary", result)
        this.projectCommentsList = result['data']
        let dataPagination = result['pagination'];
        this.projectCommentsList.map(v => Object.assign(v, { replyshow: false, replyfilearray: [], replyinput: '' }))
        if (this.projectCommentsList.length > 0) {
          this.has_nextcomments = dataPagination.has_next;
          this.has_previouscomments = dataPagination.has_previous;
          this.presentpagecomments = dataPagination.index;
        }
        console.log("project comment list after comment reply input  key ", this.projectCommentsList)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  getcommnets(hint: any) {
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallCommentsList(this.presentpagecomments + 1)
    }
    else if (hint == 'previous') {
      this.serviceCallCommentsList(this.presentpagecomments - 1)
    }
    else {
      this.serviceCallCommentsList(1)
    }

  }

  deleteInlineFile(fileindex, data) {
    console.log("fileindex", fileindex)
    let filedata = this.Documentfilearray
    console.log("filedata for delete before", filedata)

    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)
  }


  Documentfilearray = []

  onFileSelected(e) {
    console.log("e in file", e)
    for (var i = 0; i < e.target.files.length; i++) {
      this.Documentfilearray.push(e.target.files[i])
    }
    console.log("document array===>", this.Documentfilearray)
  }


  replycommentinputshowhide(data) {
    console.log("data output", data)
    if (data.replyshow == true) {
      data.replyshow = false
    } else {
      data.replyshow = true
    }
  }

  replycomment(comment, data) {
    let reltype = 1

    let obj = { "comment": comment }

    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(obj))
    // for (var i = 0; i < this.Documentfilearray.length; i++) {
    //   let keyvalue = 'file'
    //   let pairValue = this.Documentfilearray[i];
    //   formData.append(keyvalue, pairValue)
    // }
    this.SpinnerService.show();
    this.service.replycomment(this.Project_Id, reltype, data.id, formData)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("comment result", results)
        // this.Documentfilearray = []
        comment = ''
        this.getcommnets("")
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  imageViewFor_Comment_ReplyList: any
  popupimageView(data) {
    console.log("image view", data.file_data)
    this.imageViewFor_Comment_ReplyList = data.file_data
  }

  postcomment(comment) {
    let reltype = 1

    let obj = { "comment": comment }

    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(obj))
    for (var i = 0; i < this.Documentfilearray.length; i++) {
      let keyvalue = 'file'
      let pairValue = this.Documentfilearray[i];
      formData.append(keyvalue, pairValue)
    }
    this.SpinnerService.show();
    this.service.postcomment(this.Project_Id, reltype, formData)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("comment result", results)
        this.Documentfilearray = []
        this.commentinput.reset('')
        this.getcommnets("")
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  ////////////////////////////////////////////////////////////////////////////////////////////// Tran history
  TranHistoryList: any
  getTransHistory() {
    let id = this.Project_Id
    let type = 'project'
    this.SpinnerService.show();
    this.service.getTranHistory(id, type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        console.log("results for tran histry", results)
        let datas = results["data"];
        this.TranHistoryList = datas;
        console.log("app TranHistoryList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  //////////////////////////////////////////////////////////////////////////////Shortlist and Finalize


  has_nextShortlist: boolean
  has_previousShortlist: boolean
  presentpageShortlist: any
  ShortlistList: any

  serviceCallShortlistSummary(search, pageno, pageSize) {
    this.service.shortlist_Search_Summary(search, this.Project_Id, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("Shortlist summary", result)
        this.ShortlistList = result['data']
        let dataPagination = result['pagination'];
        if (this.ShortlistList.length > 0) {
          this.has_nextShortlist = dataPagination.has_next;
          this.has_previousShortlist = dataPagination.has_previous;
          this.presentpageShortlist = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  shortlistSearch(hint: any) {
    let search = this.ShortlistSearchForm.value;
    let obj = {
      status: 1,
      appstatus: ''
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallShortlistSummary(obj, this.presentpageProposal + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallShortlistSummary(obj, this.presentpageProposal - 1, 10)
    }
    else {
      this.serviceCallShortlistSummary(obj, 1, 10)
    }

  }





  has_nextfinalize: boolean
  has_previousfinalize: boolean
  presentpagefinalize: any
  finalizeList: any

  serviceCallfinalizeSummary(search, pageno, pageSize) {
    console.log("search finalised?????????????????????????????????????????????????????????????", search)
    this.service.shortlist_Search_Summary(search, this.Project_Id, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("finalize summary", result)
        let data = result['data']
        this.finalizeList = result['data']
        let dataPagination = result['pagination'];
        if (this.finalizeList.length > 0) {
          this.has_nextfinalize = dataPagination.has_next;
          this.has_previousfinalize = dataPagination.has_previous;
          this.presentpagefinalize = dataPagination.index;
          this.finalizedListDataBoolean(data)
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  finalizeSearch(hint: any) {
    let search = this.finalizeSearchForm.value;
    let obj = {
      status: 2,
      appstatus: ''
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallfinalizeSummary(obj, this.presentpagefinalize + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallfinalizeSummary(obj, this.presentpagefinalize - 1, 10)
    }
    else {
      this.serviceCallfinalizeSummary(obj, 1, 10)
    }

  }


  ShowHideButtonForApprover: boolean = true
  ApproveddFinalizedData: any

  finalizedListDataBoolean(data) {

    let filterPendingData: any = data.filter(_ => _.approval_status?.text == 'PENDING')
    console.log("Pending Cases", filterPendingData)

    if (filterPendingData?.length > 0) {
      this.ShowHideButtonForApprover = false
    }

  }


  selectedFinalApprovalGroup: any = []

  SelectForFinalApprovalGroup(data, event) {

    console.log("data for final select approval", data)
    console.log("data for final select event", event.target.checked)

    if (event.target.checked == true) {
      this.selectedFinalApprovalGroup.push(data?.id)
    }
    else {
      let selectedindex = this.selectedFinalApprovalGroup.indexOf(data?.id)
      this.selectedFinalApprovalGroup.splice(selectedindex, 1)
    }
    this.selectedFinalApprovalGroup = this.selectedFinalApprovalGroup


    console.log("selectedFinalApprovalGroup selectedFinalApprovalGroup>>>>>>", this.selectedFinalApprovalGroup)
  }



  FinalApprovalSelectedData() {
    if (this.selectedFinalApprovalGroup?.length == 0) {
      this.notify.warning("Please Select Atleast One")
      return false
    }
    let objectData = { "comments": this.ApprovalNote.value.remarks, "arr": this.selectedFinalApprovalGroup }
    let id = this.Project_Id
    this.service.MoveToFinalApprover(id, objectData)
      .subscribe(result => {
        console.log("results for  Final Approval ", result)
        if (result.code == 'INVALID_DATA') {
          this.notify.warning("Invalid data")
          return false
        }
        if (result?.status == 'success') {
          this.notify.success("Successfully moved to Final Approver Group")
          this.getTransHistory()
          let dataNote = { "content": this.ApprovalNote.value.content }
          this.service.NoteForFinalApprovalGroup(id, dataNote)
            .subscribe(resultsAfterFinalApproval => {
              console.log("results After Final Approval ", resultsAfterFinalApproval)
            })

        }

      })
  }


  ReleaseNote: any

  CoverNoteGet() {
    let id = this.Project_Id
    this.service.CoverNoteGet(id)
      .subscribe(results => {
        console.log("results for covernote", results)
        this.ReleaseNote = results?.note
      })
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////Supplier Catlog

  has_nextSupplierCatlogApprovedVendor: boolean
  has_previousSupplierCatlogApprovedVendor: boolean
  presentpageSupplierCatlogApprovedVendor: any
  SupplierCatlogApprovedVendorList: any

  serviceCallSupplierCatlogApprovedVendorSummary(search, pageno, pageSize) {
    console.log("supplier catlog summary ----------------------------------------------------->", search)
    this.service.shortlist_Search_Summary(search, this.Project_Id, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("SupplierCatlogApprovedVendor summary", result)
        let data = result['data']
        this.SupplierCatlogApprovedVendorList = result['data']
        let dataPagination = result['pagination'];
        if (this.SupplierCatlogApprovedVendorList.length > 0) {
          this.has_nextSupplierCatlogApprovedVendor = dataPagination.has_next;
          this.has_previousSupplierCatlogApprovedVendor = dataPagination.has_previous;
          this.presentpageSupplierCatlogApprovedVendor = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  SupplierCatlogApprovedVendorSearch(hint: any) {
    let search = this.SupplierCatlogApprovedVendorSearchForm.value;
    let obj = {
      status: '',
      appstatus: 5
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallSupplierCatlogApprovedVendorSummary(obj, this.presentpageSupplierCatlogApprovedVendor + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallSupplierCatlogApprovedVendorSummary(obj, this.presentpageSupplierCatlogApprovedVendor - 1, 10)
    }
    else {
      this.serviceCallSupplierCatlogApprovedVendorSummary(obj, 1, 10)
    }

  }

  SuppliersCatlog(data) {
    console.log("get Data For Suppliers Catlog", data)

    let dataCodeset = data?.id
    this.service.getVendorProjectViewDetails(dataCodeset)
      .subscribe(results => {
        let datares = results
        console.log("datares=>", datares)
        if (results) {
          let obj: any = {
            proposalsdetails: data,
            catlogres: datares,
            proposercode: data.proposer_code
          }
          this.cmsShare.SupplierCatlog.next(obj)
          this.projectcreate = false
          this.projectdetailsView = false
          this.proposalIndividialView = false
          this.SupplierTab = false
          this.SupplierCatlog = true
          return
        }
      })

  }

  SupplierCatCreate() {
    this.projectcreate = false
    this.projectdetailsView = true
    this.proposalIndividialView = false
    this.SupplierCatlog = false
    this.SupplierTab = true
    this.SupplierCatlogApprovedVendorSearch('')
  }

  SupplierCatCancel() {
    this.projectcreate = false
    this.projectdetailsView = true
    this.proposalIndividialView = false
    this.SupplierCatlog = false
    this.SupplierTab = true
  }


  ////////////////////////////////////////////////////////////////////////////////Project Edit

  /////////////////////////////////////////////////////////////////////////////////////////////////////////Project View 


  EditProject() {
    let dataset: any = {
      type: 'edit',
      id: this.Project_Id
    }
    this.cmsShare.Project_Create_Or_Edit.next(dataset)
    this.projectcreate = true
    this.projectdetailsView = false
    this.proposalIndividialView = false

  }

  ///// project Back
  ProjectCreate() {
    let data = {
      data: {
        id: this.Project_Id
      }
    }
    this.projectView(data)

    this.projectcreate = false
    this.projectdetailsView = true
    this.proposalIndividialView = false
  }
  ProjectCancel() {
    this.projectcreate = false
    this.projectdetailsView = true
    this.proposalIndividialView = false
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  ResubmitProject() {
    this.SpinnerService.show();
    this.service.IdentificationResubmit(this.Project_Id)
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if (results.code == "INVALID_DATA" && results.description == "CAN'T RESUBMIT") {
          this.SpinnerService.hide();
          this.notify.warning("Can't Resubmit, Please check status is RETURNED and only maker can resubmit")
          return false
        }
        else {
          this.SpinnerService.hide();
          this.notify.success("Successfully Resubmitted")
          let obj = {
            data: {
              id: this.Project_Id
            }
          }
          this.projectView(obj)
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }



  /////////////////////////////////////////////////////////////////////////////////Evaluation
  EvaluationList: any
  IndividualEvaluationList: any
  EvaluateListData: any = []
  // EvaluateheaderCallList: any 

  async getEvaluationComparision() {
    let id = this.Project_Id
    // console.log("One")
    // let dataPrevious = await this.service.getEvaluationComparision(id)
    // .subscribe(results=>{
    // console.log("One API call")
    //   console.log("results for getEvaluationComparision", results)
    //   let dataComparision = results['data']
    //   this.EvaluationList = dataComparision 
    // })

    // console.log("One End")

    // let dataForstcall = await this.service.EvaluateCallList(id).subscribe(results => { this.EvaluationList = results; console.log("Two Strt")  },(error)=>{console.log("error", error)} )
    // console.log("Two End")
    // console.log("dataForstcall", dataForstcall)
    // console.log("EvaluationList", this.EvaluationList)  

    let DataCallForTypeList: any = await this.service.EvaluateCallList(id).toPromise();  
    console.log("DataCallForTypeList", DataCallForTypeList)

    for (let data of DataCallForTypeList) { 
       
      let dataCall: any = await this.service.getEvaluationComparision(id, data.id).toPromise();

      console.log("data call for evaluator", dataCall)
      // let headerslist: any = dataCall.header 
      // let dataQuestionAns = dataCall.data 
      // headerslist.push("comments") 
      // console.log("headerlist", headerslist )

      let ObjForQuestionnaire = Object.assign({}, dataCall, {type: data}   )
      this.EvaluateListData.push(ObjForQuestionnaire) 


      // for( let i of headerslist ){ 
      //   for( let j of dataQuestionAns){
      //      let objs = {} 
      //      console.log("inside loop i", i)
      //      console.log("inside loop j", j)
      //      console.log("inside loop j keys", Object.keys(j))
      //      Object.keys(j).forEach(x => {
      //       console.log("objects keys seperating", x, i)
      //       if( i == x  ){
      //         console.log("satisfied", i, Object.keys(j) )
      //      }
      //      })

           
              
      //   }
         
      // }
























      // console.log("data arr headerslist =====================================================>", headerslist)
      // console.log("data arr questions =====================================================>", dataQuestionAns) 


      // let arrlist = []
      // for(let arr of dataQuestionAns){

      //   let obj = {} 
      //   Object.keys(arr).forEach(key => {
      //     // console.log('key', key);     
      //     // console.log('value', arr[key]);    

      //     if( arr == key ){
      //       if( arr[key] == "object"){
      //         obj[key]= obj[key].comments 
      //       }

      //     }
      // });

      // console.log("????????????????????????????????????????????????????????????????", obj) 

      // }

    //  this.EvaluateListData.push(FullQuestionListPush)    

      // let Headers
      // Headers = dataCall.header 
      // Headers.push("Evaluator")
      // Headers.push("Flag")
      // let actualHeader = Headers 
      // , {headers: HeadersData}, {originalHeader: actualHeader}      
      
    //  let FullQuestionListPush =  Object.assign(ObjectForTypeAndData, {questionlist: dataCall.data})
    // let data = 
    }
    console.log("==========================================================================> 6", this.EvaluateListData); 

    // let dataCall: any = await this.service.getEvaluationComparision(id, 1).toPromise(); 

    // console.log("==========================================================================> 6");


  }

  headerslistdataArr = ['question','answer', 'comments']

  setData(data, particulardata, index){
    // console.log("data from summary loop data",data) 
    console.log("data from summary loop particulardata",particulardata) 
    // console.log("data from summary loop index", index) 
    // console.log("data from summary loop", data)
        // if(data.constructor == Object ){
        //     console.log("data from summary", data, particulardata)
        //     for(let dataset in data){
        //       if("comments" == dataset){
              
        //       }
        //     }
        //     // if('comments' in data){
        //     //   return data.comments 
        //     // }
        //       return data.answer
        // } 
        // return data?.comments 
        if(particulardata == 'question'){
          return data
        }
        if(particulardata == 'answer'){
          return data.answer
        }
        if(particulardata == 'comments'){
          return data.comments 
        }
        
  }

  getIndividualListBasedOnType(individual) {
    console.log("data based on single get", individual)

    this.IndividualEvaluationList = individual 
    console.log("this.IndividualEvaluationList ============================> ", this.IndividualEvaluationList)
  }

  ////////////////////////////////////////////////////////////////////////////////Proposal view
  proposalview(data) {
    console.log("passing ddata to proposal view", data)
    let obj: any = {
      projectid: this.Project_Id,
      dataview: this.detailsPreView,
      data: data
    }
    this.cmsShare.ProposalView.next(obj)
    // this.router.navigate(['cms/proposalview'], { skipLocationChange: true })
    this.proposalIndividialView = true
    this.projectdetailsView = false
    return obj
  }

  ProposalCancel() {
    this.proposalIndividialView = false
    this.projectdetailsView = true
    this.ProposalSearch('')
    this.shortlistSearch('')
    this.finalizeSearch('')
    this.getEvaluationComparision()
    this.EvaluateListData = [] 
    this.IndividualEvaluationList = []
    // this.TotalEvaluationView()
    // this.getquestiondata(this.vendorid)
  }



  ///////////////////////////////////////////////////////////////////////////////////////////////Cover Note 

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
    return this.sanitizer.bypassSecurityTrustHtml(this.ApprovalNote.get('content').value);
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

  // click Based on the sub tab view
  SupplierTab: boolean
  viewShow(data) {
    console.log("clicked sub module ", data)
    if (data.name == 'Proposals') {
      this.proposalsTab = true
      this.HistoryTab = false
      this.ProjectCommentsTab = false
      this.ShortlistTab = false
      this.EvaluateTab = false
      this.finalizedTab = false
      this.SupplierTab = false

    }
    if (data.name == 'Project Comments') {
      this.proposalsTab = false
      this.HistoryTab = false
      this.ProjectCommentsTab = true
      this.ShortlistTab = false
      this.EvaluateTab = false
      this.finalizedTab = false
      this.SupplierTab = false


    }
    if (data.name == 'Transaction History') {
      this.proposalsTab = false
      this.HistoryTab = true
      this.ProjectCommentsTab = false
      this.ShortlistTab = false
      this.EvaluateTab = false
      this.finalizedTab = false
      this.SupplierTab = false


    }
    if (data.name == 'Shortlisted Proposals') {
      this.proposalsTab = false
      this.HistoryTab = false
      this.ProjectCommentsTab = false
      this.ShortlistTab = true
      this.EvaluateTab = false
      this.finalizedTab = false
      this.SupplierTab = false


    }
    if (data.name == 'Finalized Proposals') {
      this.proposalsTab = false
      this.HistoryTab = false
      this.ProjectCommentsTab = false
      this.ShortlistTab = false
      this.finalizedTab = true
      this.EvaluateTab = false
      this.SupplierTab = false
    }
    if (data.name == 'Evaluation') {
      this.proposalsTab = false
      this.HistoryTab = false
      this.ProjectCommentsTab = false
      this.ShortlistTab = false
      this.EvaluateTab = true
      this.finalizedTab = false
      this.SupplierTab = false
    }
    if (data.name == 'Supplier Catlog') {
      this.proposalsTab = false
      this.HistoryTab = false
      this.ProjectCommentsTab = false
      this.ShortlistTab = false
      this.EvaluateTab = false
      this.finalizedTab = false
      this.SupplierTab = true
    }


  }

  getApprovalStatus() {
    let ref = 2
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

  filedownload(data, type) {
    console.log("fileName", data)
    this.SpinnerService.show();
    let fileName = data.file_name
    let id = data.file_id

    this.service.fileDownloads(id)
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
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  jpgUrls: any
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
        this.jpgUrlsAPI = reader.result
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


}