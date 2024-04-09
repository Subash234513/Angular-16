import { Component, OnInit, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ElementRef, HostListener } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { CMSSharedService } from '../cms-shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { AmountPipePipe } from '../amount-pipe.pipe'
import { SlicePipe } from '@angular/common';
import { timeStamp } from 'console';
declare var $;

@Component({
  selector: 'app-agreement-builder',
  templateUrl: './agreement-builder.component.html',
  styleUrls: ['./agreement-builder.component.scss']
})
export class AgreementBuilderComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private notify: ToastrService, private activateroute: ActivatedRoute, private sharedService: SharedService
  ) {

  }

  ProjectAndProposalList: any
  has_nextProjectAndProposal: boolean
  has_previousProjectAndProposal: boolean
  presentpageProjectAndProposal: any
  selected: any
  summarycallView: boolean = true
  ViewLegalAgreement: boolean = false
  Proposal_ID: any
  superScriptCommentsForm: FormGroup
  isEdit: boolean = false
  getLegalResponseShow: boolean
  getLegalResponseCreate: boolean
  agreement_id = ''
  movetoapproverbtn: any
  is_vow_submitedBtn: any
  isacceptedbtn: any
  VersionArr = []
  title: any
  idval: any
  superscriptid: any
  ScriptCommentList: any
  ScriptList: any
  SuperscriptEditContent: any
  VersionDataForm = new FormControl('')
  ProjectName: any
  ProposalName: any
  LegalList: any
  selectedLegalDocumentText = new FormControl('')
  contentShowLegal: any;
  SelectedArrayCount: any = []
  contenthtmlget: any
  LatestVersion: any


  ngOnInit(): void {
    this.ProjectAndProposalSearch('')

    this.superScriptCommentsForm = this.fb.group({
      comments: ''
    })

  }

  ////////// Project And Proposal Summary 

  serviceCallProjectAndProposalSummary(search, pageno, pageSize) {
    this.service.ApprovedProposalsAndProject(search, pageno)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("pro type summary", result)
        this.ProjectAndProposalList = result['data']
        let dataPagination = result['pagination'];
        if (this.ProjectAndProposalList.length > 0) {
          this.has_nextProjectAndProposal = dataPagination.has_next;
          this.has_previousProjectAndProposal = dataPagination.has_previous;
          this.presentpageProjectAndProposal = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  ProjectAndProposalSearch(hint: any) {
    // let search = this.ProjectTypeSearchForm.value;
    let obj = {
      title: ''
    }
    for (let i in obj) {
      if (obj[i] == null || obj[i] == "" || obj[i] == undefined) {
        obj[i] = '';
      }
    }
    this.SpinnerService.show();

    if (hint == 'next') {
      this.serviceCallProjectAndProposalSummary(obj, this.presentpageProjectAndProposal + 1, 10)
    }
    else if (hint == 'previous') {
      this.serviceCallProjectAndProposalSummary(obj, this.presentpageProjectAndProposal - 1, 10)
    }
    else {
      this.serviceCallProjectAndProposalSummary(obj, 1, 10)
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////// View 
  AgreementView(data) {
    console.log("data from project and approved proposal against project", data)

    this.ProjectName = '(' + data?.project?.code + ')' + data?.project?.name
    this.ProposalName = '(' + data?.proposal?.proposer_code + ')' + data?.proposal?.name

    let dataID = data.proposal.id
    this.Proposal_ID = dataID

    this.getLegalResponse()
  }

  getLegalClause(type) {
    let appstatus = 3

    this.SpinnerService.show();
    this.service.getLegal(appstatus, type)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        console.log("results for LegalList", results)
        let datas = results["data"];
        this.LegalList = datas;
        console.log("app LegalList list", datas)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  LegalDocumentsData: any
  legalDocumentView: boolean = false
  legalDocumentComapareView: boolean = false
  getLegalResponse() {
    let id = this.Proposal_ID
    this.SpinnerService.show();
    this.sharedService.isSideNav = true;
    document.getElementById("mySidenav").style.width = "50px";
    document.getElementById("main").style.marginLeft = "40px";
    this.service.getLegalResponseAggrement(id)
      .subscribe((results) => {
        this.SpinnerService.hide();
        this.LegalDocumentsData = results
        this.agreement_id = results?.agreement_id
        this.movetoapproverbtn = results?.is_issued
        this.isacceptedbtn = results?.is_accepted
        this.is_vow_submitedBtn = results?.is_vow_submited
        if (results?.is_created == true) {
          this.summarycallView = false
          this.ViewLegalAgreement = true
          this.getLegalResponseShow = true
          this.legalDocumentView = true
          this.legalDocumentComapareView = false
          this.getLegalResponseCreate = false
          // this.contenthtmlget = results?.agreement
          this.agreement_id = results?.agreement_id
          this.movetoapproverbtn = results?.is_issued
          this.is_vow_submitedBtn = results?.is_vow_submited
          this.isacceptedbtn = results?.is_accepted
          if (results?.is_issued == false) {
            this.contenthtmlget = results?.content
          }
          if (results?.is_issued == true) {
            this.GetAggrementDataWithSuperscriptAndComments(results)
          }
        }
        if (results?.is_created == false) {
          this.getLegalClause(1)
          this.getLegalResponseShow = false
          this.getLegalResponseCreate = true
          this.summarycallView = false
          this.ViewLegalAgreement = true
          this.selectedLegalDocumentText.patchValue('')
          this.selected = "CLAUSE"
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  ///////////////////////////////////////////////////////////////////////////////// Edit Superscript Content


  EditContent() {
    this.isEdit = true
    this.getLegalResponseShow = false
    this.getLegalResponseCreate = true
    this.selectedLegalDocumentText.patchValue(this.SuperscriptEditContent)
    this.getLegalClause(1)
    this.selected = "CLAUSE"
  }

  ///////////////////////////////////////////////////////////////////////////////// Superscript API
  GetAggrementDataWithSuperscriptAndComments(results) {
    // let id = agreementId

    // this.service.getLegalResponseAggrement(id)
    //   .subscribe(results => {
    console.log("results data superscript", results)
    console.log("results data superscript data", results['data'])

    if (results.superscript == null) {
      this.contenthtmlget = results.content
    } else {
      this.contenthtmlget = results.superscript
      this.ScriptList = results['data']

    }
    this.SuperscriptEditContent = results.content
    let versiondata = results?.version
    this.LatestVersion = versiondata
    this.VersionArr = []
    for (var data = 1; data <= versiondata; data++) {
      let dataset = {
        id: data,
        name: 'Version ' + data
      }
      this.VersionArr.push(dataset);

    }
    console.log(this.VersionArr)
    const toSelect = this.VersionArr?.find(c => c.id == versiondata);
    console.log("toselect data", toSelect)
    this.VersionDataForm.patchValue(toSelect.id)
    // VersionDataForm
    // if(this.LatestVersion ){

    // }

    // })

  }

  versionGetData(data) {
    console.log("data of selected version", data, this.LatestVersion, this.VersionDataForm.value)
    let id = this.agreement_id
    this.service.getLegalResponseAggrementVersionBased(this.Proposal_ID, data.id)
      .subscribe(results => {
        this.contenthtmlget = results.superscript
        this.ScriptList = results['data']
      })
  }

  DraftAndVendorVersion(type) {
    let data = this.LegalDocumentsData

    if (type == 'draftversion') {
      this.contenthtmlget = data.content
    }
    if (type == 'vendorversion') {
      this.contenthtmlget = data.superscript
    }

  }



  @HostListener('document:click', ['$event'])
  mouseover(event) {
    if (event.target.matches('.highlight')) {
      this.title = event.target.innerHTML

      this.idval = event.composedPath()[0].attributes.value.value
      console.log("id value data", this.idval)
      console.log("event.composedPath()", event.composedPath())
      console.log("event.composedPath()[0]", event.composedPath()[0])
      console.log("event.composedPath()[0].attributes", event.composedPath()[0].attributes)
      console.log("event.composedPath()[0].attributes.value", event.composedPath()[0].attributes.value)
      console.log("event.composedPath()[0].attributes.value.value", event.composedPath()[0].attributes.value.value)

      if (event.composedPath()[1].attributes.length === 0 || event.composedPath()[1].attributes[0].name != "class") {
        this.ScriptList.forEach((element, index) => {
          if (event.composedPath()[0].attributes.value.value == element.order) {
            this.superscriptid = element.id
            let orderofElement = element.order
            console.log("this.superscriptid", this.superscriptid)
            console.log("this.orderofElement", orderofElement)
            let listvalue = this.ScriptList
            for (var i = 0; i < listvalue.length; i++) {
              console.log("listvalue[i].order", listvalue[i].order)
              if (orderofElement == listvalue[i].order) {
                this.ScriptCommentList = listvalue[i].comments
              }
            }
          }
        })
        document.getElementById("myCheck").click();
      }

    }
  }

  SuperscriptCommentsSubmit(type) {
    let dataSubmit = this.superScriptCommentsForm.value

    console.log("data comment submit for superscript", dataSubmit)
    if (type == 'close') {
      this.superScriptCommentsForm.reset('')
    }
    if (type == 'comment') {
      this.service.CommentOnSuperectipt(this.superscriptid, dataSubmit)
        .subscribe(results => {
          console.log("results comment data", results)
          this.notify.success("Success")
          this.superScriptCommentsForm.reset('')
          this.getLegalResponse()
          return true
        })
    }

  }


  legalpdfDownload() {
    // let id = this.getMemoIdValue(this.idValue)
    let id = this.Proposal_ID
    let clauseID = this.agreement_id
    let name = 'Legal Agreement'

    this.SpinnerService.show();
    this.service.getpdfDocument(id, clauseID)
      .subscribe((data) => {
        this.SpinnerService.hide();
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name + ".pdf";
        link.click();
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })


  }

  ///////////////////////////////////////////////////////////////////////////////////// Move To vendor

  MoveToVendor() {
    let id = this.agreement_id
    this.service.moveLegalDocLToVendor(id)
      .subscribe(results => {
        this.notify.success("Successfully Moved to Vendor")
        this.getLegalResponse()

      })
  }


  ////////////////////////////////////////////////////////////////////////////////////// Legal Doc Create

  LegalDocumentCreate(type) {
    let id = this.Proposal_ID
    let obj;
    console.log("this.agreement_id on submit", this.agreement_id)

    if (type == 'Create') {
      obj = {
        agreement: this.selectedLegalDocumentText.value,
        clauses_id: this.SelectedArrayCount
      }
    }
    if (type == 'Edit') {
      obj = {
        agreement: this.selectedLegalDocumentText.value,
        clauses_id: this.SelectedArrayCount,
        id: this.agreement_id
      }
    }

    console.log("LegalDocumentCreate LegalDocumentCreate", obj)
    this.SpinnerService.show();
    this.service.getLegalResponseCreate(id, obj)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        console.log("results for LegalList", results)
        let datas = results["data"];
        this.LegalList = datas;
        console.log("app LegalList list", datas)
        this.getLegalResponse()
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  //////////////////////////////////////////////////////////////////////////////////// Editor Paste

  getTextFrame(data) {

    console.log("selectedLegalDocumentText data click=> ", data)
    let clauseID = data.id
    let proposalID = this.Proposal_ID
    this.service.clauseGet(proposalID, clauseID)
      .subscribe(results => {
        let resultdata = results.text
        console.log('content to patch on frame resultdata ', resultdata)
        this.SelectedArrayCount.push(data.id)


        var html: any = '<br>' + '<h2>' + data?.name + '</h2>' + '\n' + '<p>' + '&nbsp;&nbsp;&nbsp;&nbsp;' + resultdata + '</p>'

        console.log("html content", html)



        $('#notebook').summernote('editor.saveRange');
        $('#notebook').summernote('editor.restoreRange');
        $('#notebook').summernote('editor.focus');
        $('#notebook').summernote('pasteHTML', html);






        // pasteHTML
        // insertNode
        // insertHtml
        // insertText
        // code
        // $('#notebook').summernote('pasteHTML', html);
        // $('#notebook').summernote('editor.pasteHTML', html);
        // 'editor.insertText'
        // $('#notebook').summernote('pasteHTML', html);

        // console.log("convert to string", datases)


        // var stringcontent = html?.innerHTML
        // var stringcontentvarouterHTML = html?.outerHTML

        // console.log("stringcontent stringcontent", stringcontent )
        //  console.log("stringcontent stringcontentvarouterHTML", stringcontentvarouterHTML )







        // $('#summernote').summernote('insertText', 'Hello, world');

        // this.gethtmlcontnetoneditor(resultdata)
        // var html = 'Hello World!!';
        // $('#notebook').summernote('insertText', html);

      }
      )


  }


  gethtmlcontnetoneditor(data) {
    var html = 'Hello World!!';
    $('#notebook').summernote('insertText', html);
  }

  previewContent() {
    this.contenthtmlget = this.selectedLegalDocumentText.value
  }

  get gettingPreviewValue() {
    console.log("dataframe for patch")
    let data = this.sanitizer.bypassSecurityTrustHtml(this.selectedLegalDocumentText.value);
    return this.contentShowLegal ? this.contentShowLegal = data : undefined
  }



  config: any = {
    tabDisable: true,
    height: "500px",
    toolbar: [
      [
        "font",
        [
          "bold",
          "italic"
        ]
      ],
      ["para", ["ul", "ol"]]
    ],
  };



  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.selectedLegalDocumentText.value);
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
    console.log('event', event)
  }

  get selectedposition() {
    console.log("trigger check")
    return
  }

  showContent() {
    this.summarycallView = false
    this.ViewLegalAgreement = true
  }
  hideContent() {
    this.summarycallView = true
    this.ViewLegalAgreement = false
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "12rem";
    this.sharedService.isSideNav = false;
    this.VersionArr = []
  }

  ///////////////////////////////////////////////////////////////////////Comparision View 

  conpareData_OR_ActualContent: boolean
  CompareHTML_left: any
  CompareHTML_Right: any
  versionLeftForm = new FormControl('')
  versionRightForm = new FormControl('')

  compareleft(typedata) {

    this.service.getLegalResponseAggrementVersionBased(this.Proposal_ID, typedata?.id)
      .subscribe(results => {
        this.CompareHTML_left = results?.content
      })

  }


  compareright(typedata) {

    this.service.getLegalResponseAggrementVersionBased(this.Proposal_ID, typedata?.id)
      .subscribe(results => {
        this.CompareHTML_Right = results?.content
      })

  }

  backToDataLegalAgrementView() {
    this.summarycallView = false
    this.ViewLegalAgreement = true
    this.getLegalResponseShow = true
    this.legalDocumentView = true
    this.legalDocumentComapareView = false
    this.getLegalResponseCreate = false
  }

  CompareView() {
    this.summarycallView = false
    this.ViewLegalAgreement = true
    this.getLegalResponseShow = true
    this.legalDocumentView = false
    this.legalDocumentComapareView = true
    this.getLegalResponseCreate = false

  }





}
