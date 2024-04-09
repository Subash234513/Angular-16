import { Component, OnInit, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ElementRef } from '@angular/core';
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
import { DataService } from 'src/app/service/data.service';
declare var $;

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class ProposalViewComponent implements OnInit {

  @Output() onCancelproposal = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private notify: ToastrService, private activateroute: ActivatedRoute
  ) {

  }
  proposer_code
  Project_ID: any
  Proposal_ID: any
  proposalview: boolean
  proposalDataView: any;
  versionview = new FormControl('')
  contentname: any
  Financialcontent: any
   ExecutionContent: any 
  CMS_ProposalView_Menu_List: any = [{ name: 'Proposal Comments' }, { name: 'Questionnaire' }, { name: 'Transaction History' }]
  // commentsmenu:any  = [{approver:{ name: 'Proposal Comments' }}]
  projectview: any

  VersionList: any;
  RemarksForm: FormGroup

  ProposalCommentsTab: boolean
  Q_A_CommentsTab: boolean
  Q_A_CommentsList: any

  commentinput = new FormControl('')

  has_nextcomments: boolean
  has_previouscomments: boolean
  presentpagecomments: any
  proposalCommentsList: any
  QuestionAnsBasedOnVendorList: any
  typeBasedList: any


  ngOnInit(): void {
    let dataProcess: any = this.cmsShare.ProposalView.value
    console.log("data process for proposal view ", dataProcess)
    this.Proposal_ID = dataProcess.data.id
    this.proposer_code = dataProcess.data.proposer_code

    this.projectview = dataProcess.dataview
    this.Project_ID = dataProcess.projectid
    this.getVersion(dataProcess)
    this.getProposalView(dataProcess)
    this.getcommnets('')
    // this.getquestiondata(this.vendorid)
    // this.QA_VOW_()
    this.getTransHistory()
    this.getQuestionAnsBasedOnVendor()

    this.RemarksForm = this.fb.group({
      remarks: '',
      group_id: ''
    })
    // this.getLegalResponse()
  }

  /////////////////////////////////////////////////////////////////////////////////////// Show or Hide based on condition
  viewShow(data) {
    console.log("clicked sub module ", data)
    if (data?.name == 'Proposal Comments') {
      this.Q_A_CommentsTab = false
      this.ProposalCommentsTab = true
      this.HistoryTab = false
    }
    if (data?.name == 'Questionnaire') {
      this.Q_A_CommentsTab = true
      this.ProposalCommentsTab = false
      this.HistoryTab = false
    }
    if (data?.name == 'Transaction History') {
      this.Q_A_CommentsTab = false
      this.ProposalCommentsTab = false
      this.HistoryTab = true
    }

  }


  //////////////////////////////////////////////////////////////////////////////////////          Proposal View 

  getProposalView(data) {
    let dataset = data.data.id
    this.SpinnerService.show();
    this.service.getProposalView(dataset)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("proposal single get", results)
        this.proposalDataView = results
        let datasetproposal = results
        if (results) {
          this.proposalview = true
          console.log("version data to patch 1", results)
          // console.log("version data to patch 2" , results.history[0].id)
          let versiondata = results.version
          this.versionview.patchValue(versiondata)
          this.contentname = this.proposalDataView?.covernote?.note
          this.Financialcontent = this.proposalDataView?.financial_note?.note
          this.ExecutionContent = this.proposalDataView?.execution_note?.note
          this.getVendor();
          // if(this.proposalDataView?.shortlisted == true ){
          // let data_Prop_App_arr = this.projectview.q_approver
          // console.log("proposer approver tabs check", this.projectview, data_Prop_App_arr)
          // this.CMS_ProposalView_Menu_List = Object.assign( data_Prop_App_arr, this.commentsmenu)
          // console.log("this.CMS_ProposalView_Menu_List", this.CMS_ProposalView_Menu_List)

        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  //////////////////////////////////////////////////////////////////////////////////////////////           get Version
  getVersion(data) {
    let dataset = data.data.id
    this.SpinnerService.show();
    this.service.getVersionProposal(dataset, 'proposal')
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("version get", results)
        this.VersionList = results['data']
        if (results) {
          this.proposalview = true
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  /////////////////////////////////////////////////////////////////////////////////////////////// Comments

  serviceCallCommentsList(page) {
    let reltype = 2
    this.SpinnerService.show();
    this.service.CommentsList_Summary(this.Project_ID, reltype, page)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("comments summary", result)
        this.proposalCommentsList = result['data']
        let dataPagination = result['pagination'];
        this.proposalCommentsList.map(v => Object.assign(v, { replyshow: false, replyfilearray: [], replyinput: '' }))
        if (this.proposalCommentsList.length > 0) {
          this.has_nextcomments = dataPagination.has_next;
          this.has_previouscomments = dataPagination.has_previous;
          this.presentpagecomments = dataPagination.index;
        }
        console.log("project comment list after comment reply input  key ", this.proposalCommentsList)
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
  replycommentinputshowhide(data) {
    console.log("data output", data)
    if (data.replyshow == true) {
      data.replyshow = false
    } else {
      data.replyshow = true
    }
  }

  replycomment(comment, data) {
    let reltype = 2

    let obj = { "comment": comment }

    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(obj))
    this.SpinnerService.show();
    this.service.replycomment(this.Project_ID, reltype, data.id, formData)
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
    let reltype = 2

    let obj = { "comment": comment }

    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(obj))
    for (var i = 0; i < this.Documentfilearray.length; i++) {
      let keyvalue = 'file'
      let pairValue = this.Documentfilearray[i];
      formData.append(keyvalue, pairValue)
    }
    this.SpinnerService.show();
    this.service.postcomment(this.Project_ID, reltype, formData)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("comment result", results)
        this.Documentfilearray = []
        this.getcommnets("")
        this.commentinput.reset('')
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


  Documentfilearray = []

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

    filedata.splice(fileindex, 1)
    console.log("filedata for delete after", filedata)
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////    Bookmarking Profile

  bookmarkingProfile() {
    let dataConfirm = confirm("Are you sure, do you want to shortlist?")
    let obj = { "proposal_id": this.Proposal_ID, "remarks": this.RemarksForm.value.remarks, "shortlist": 1 }

    if (dataConfirm == true) {
      this.SpinnerService.show();
      this.service.shortlistproposal(obj)
        .subscribe(results => {
          this.SpinnerService.hide();
          if (results.code == "You don't have permission to perform this action") {
            this.SpinnerService.hide();
            this.notify.warning("You are not allowed to perform this action")
            return false
          }
          if (results) {
            this.SpinnerService.hide();
            this.notify.success("Successfully updated")
            let data = {
              data: {
                id: this.Proposal_ID
              }
            }
            this.getProposalView(data)
          }
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

    }

  }
  /////////////////////////////////////////////////////////////////////////////////////////////////    Finalize Profile


  finalizingProfile() {
    let dataConfirm = confirm("Are you sure, do you want to Finalize?")
    let obj = { "proposal_id": this.Proposal_ID, "remarks": this.RemarksForm.value.remarks }

    if (dataConfirm == true) {
      this.SpinnerService.show();
      this.service.finalizeproposal(obj)
        .subscribe(results => {
          this.SpinnerService.hide();
          if (results.code == "INVALID_PERMISSION_ID") {
            this.SpinnerService.hide();
            this.notify.warning("You are not allowed to perform this action")
            return false
          }
          if (results) {
            this.SpinnerService.hide();
            this.notify.success("Successfully updated")
            let data = {
              data: {
                id: this.Proposal_ID
              }
            }
            this.getProposalView(data)
          }
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

    }

  }

  //////////////////////////////////////////////////////////////////////////////// Move To approver

  MoveToApprover() {
    let dataConfirm = confirm("Are you sure, do you want to Approve?")
    let obj = { "remarks": this.RemarksForm.value.remarks, status: 3 }
    let id = this.Proposal_ID
    if (dataConfirm == true) {
      this.SpinnerService.show();
      this.service.MoveToApprover(obj, id)
        .subscribe(results => {
          this.SpinnerService.hide();
          if (results.code == "INVALID_PERMISSION_ID") {
            this.SpinnerService.hide();
            this.notify.warning("You are not allowed to perform this action")
            return false
          }
          if (results.code == "INVALID_DATA" && results.description == "INVAILD APPROVER") {
            this.SpinnerService.hide();
            this.notify.warning("You are not allowed to perform this action")
            return false
          }
          if (results) {
            this.SpinnerService.hide();
            this.notify.success("Successfully updated")
            let data = {
              data: {
                id: this.Proposal_ID
              }
            }
            this.getProposalView(data)
            this.getTransHistory()
          }
        }, (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        })

    }

  }


  redflagValueChange(value) {
    console.log("Value for flag setup", value)
    let truecounts = value.questions.map(x => x.red_flag)
    console.log("truecounts redflag", truecounts)
    let count = 0
    for (let i of truecounts) {
      if (i == true) {
        count = count + 1
      }
    }
    value.type.flagcount = count

  }




  backToProjectView() {
    this.onCancelproposal.emit()
  }



  TranHistoryList: any
  HistoryTab: boolean
  getTransHistory() {
    let id = this.Proposal_ID
    let type = 'proposal'
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

  //////////////////////////////////////////////////////////////////////////////////////////   Question Ans Based On Vendor


  QuestionnaireContents: boolean
  legalContents: boolean


  async gettabBasedOnQuestionType(data) {
    this.QuestionnaireContents = true
    this.legalContents = false
    console.log("typeBasedList typeBasedList typeBasedList===>", data)
    this.typeBasedList = data

   

  }


  
  filedownload(data) {
    console.log("fileName",data)
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
      },(error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  jpgUrls: any 
  showimageHeaderPreview: boolean = false
  showimageHeaderPreviewPDF: boolean = false
  pdfurl: any
  jpgUrlsAPI: any

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


 











  getQuestionAnsBasedOnVendor() {
    let Proposal_IDData = this.Proposal_ID
    let Project_IDData = this.Project_ID
    let qtype = 0
    this.SpinnerService.show();
    this.service.QuestionAnsBasedOnVendor(Project_IDData, Proposal_IDData, qtype)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("questionaaire get", results)
        let dataset = results['data']
        // this.QuestionAnsBasedOnVendorList = results['data']
        // this.addingkeys(dataset)
        this.DataFrameForQuestionaaire(dataset)
        // this.InsertNecessaryKeys(dataset)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }

  // assigninedKeys: any 

  // async InsertNecessaryKeys(results){
  //   let one = await this.asigningkeys(results)
  //   let two = await this.FrameKeysBasedOnQuestionnaire(this.assigninedKeys)
  // }


  // asigningkeys(data){
  //   data.map(row => {
  //     return Object.assign({}, row, { red_flag: false, proposal_id: this.Proposal_ID , score: '',  commentsinput: false });
  //   });
  //   console.log("assigning keys ", data)
  //   this.assigninedKeys = data 
  // }


  // FrameKeysBasedOnQuestionnaire(data){

  //   console.log("frame key based on the  condition", data)


  // }


  
















  // async addingkeys(keys) {
  //   let one = await this.KeyPatchForQuestionaaire(keys)
  //   // let two = await this.AnswersList(this.QuestionAnsBasedOnVendorList)
  //   // let three = await console.log("this is final output", this.QuestionAnsBasedOnVendorList )
  // }







  



  QuestionnairesDataList: any
  DataFrameForQuestionaaire(dataFromQuestionaaire) {
    // console.log("dataFromQuestionaaire", dataFromQuestionaaire)
    let fulldataForQuestionaaire: any = dataFromQuestionaaire
    // let fulldataForQuestionaaire: any = this.QuestionnarieData['data']

    

    for (let data in fulldataForQuestionaaire) {
      Object.assign(fulldataForQuestionaaire[data].type, { flagcount: 0 }, {indexing: data})
      fulldataForQuestionaaire[data].header.push({ name: 'Comments' }, { name: 'Flag' })
      let listarr = fulldataForQuestionaaire[data]?.questions
      for (let questionData of listarr) {
        // console.log("questionData and Answer Data ", questionData)
        // console.log("Answer Data ", questionData?.ans)
       Object.assign(questionData, { red_flag: false, proposal_id: this.Proposal_ID, updated: false,commentsinput: false}) 
      }


        // if(questionData?.ans != null && "answer" in questionData?.ans){
        //   console.log("id condition 2")
        //   Object.assign(
        //     questionData,
        //     { red_flag: questionData?.ans?.red_flag },
        //     { comments: questionData?.ans?.comments },
        //     { comments_id: questionData?.ans?.comments_id },
        //     { id: questionData?.ans?.id },
        //     { proposal_id: this.Proposal_ID },
        //     { updated: true },
        //     { score: "" },
        //     { commentsinput: true }
        //   )
        // }

        // else if (questionData?.ans == null && questionData?.ans?.comments_id !== null) {
        //   else{
        //   Object.assign(
        //     questionData,
        //     { red_flag: questionData?.ans?.red_flag },
        //     { comments: questionData?.ans?.comments },
        //     { comments_id: questionData?.ans?.comments_id },
        //     { id: questionData?.ans?.id },
        //     { proposal_id: this.Proposal_ID },
        //     { updated: true },
        //     { score: "" },
        //     { commentsinput: true }
        //   )
        // }
      

        // if (questionData?.ans == null && questionData?.ans?.comments_id !== null) {
        //   Object.assign(
        //     questionData,
        //     { red_flag: questionData?.ans?.red_flag },
        //     { comments: questionData?.ans?.comments },
        //     { comments_id: questionData?.ans?.comments_id },
        //     { id: questionData?.ans?.id },
        //     { proposal_id: this.Proposal_ID },
        //     { updated: true },
        //     { score: "" },
        //     { commentsinput: true }
        //   )
        // }
      // }
    }
    this.QuestionnairesDataList = fulldataForQuestionaaire
    console.log(" this.QuestionnairesDataList", this.QuestionnairesDataList)

  }


  dataForEvalComments(value) {
    console.log('submitted data ', value)
    let commentsvalue = value.questions
    console.log("commentsvalue for selected tab questions array", commentsvalue)
    let finalans: any = []
    for (let data of commentsvalue) {
      let obj;
      if ('id' in data) {
        obj = {
          "answer_id": data?.ans?.id,
          "comments": data?.ans?.comments,
          "comment_id": data?.ans?.comment_id,
          "id": data?.id,
          "red_flag": data?.red_flag, 
          "ref_id": this.Proposal_ID
        }
      }
      finalans.push(obj)
      if(data?.sub_question?.length > 0){
        for (let subdata of data?.sub_question ){
          let obj;
        if ('id' in data) {
          obj = {
            "answer_id": subdata?.ans?.id,
            "comments": subdata?.ans?.comments,
            "comment_id": subdata?.ans?.comment_id,
            "id": subdata?.id,
            "red_flag": subdata?.red_flag,
            "ref_id": this.Proposal_ID,
            "score": subdata?.score
          }
        }
        console.log("data for obj sub ques", obj)
        finalans.push(obj)
        }
      }
    }
    this.SpinnerService.show()
    console.log("final answer for pushing data", finalans)
    this.service.ProposalEvaluationComments(finalans)
      .subscribe(results => {
        // this.SpinnerService.show()
        console.log("results for final dataset after api call ", results)
        this.notify.success('Updated Successfully')
        this.getparticularTypeQuestionnarieData(value)

      })

  }

  getparticularTypeQuestionnarieData(data){
    this.service.QuestionAnsBasedOnVendor(this.Project_ID, this.Proposal_ID, data?.type?.id)
    .subscribe(results=>{
      let data = results['data'] 
      this.typeBasedList = data 
      this.SpinnerService.hide() 
      this.triggerFalseClick()
    })

  }

  @ViewChild('myDivQues') myDivQues: ElementRef<HTMLElement>;

  triggerFalseClick() {
      let el: HTMLElement = this.myDivQues.nativeElement;
      console.log("el classio myDivQues", this.myDivQues)
      console.log("el classio", el)
      el.click();
  }

  SelectedProcess: any 
  SelectedProcessForApproveOrReturn(type){
    this.SelectedProcess = type
  }

  ApproveOrReturnQuestionnaire(data, type){
    let confirmData = confirm("Do you want to "+ type+'?')
    if(confirmData){
        let statusdata = 0
        if(type == 'Approve'){
            console.log("type", type)
            statusdata = 3
        }
        if(type == 'Return'){
            console.log("type", type)
            statusdata = 5
        }

        let dataObj : ApproveReturn = {
            status: statusdata,
            type_id: data.type?.id,
            remarks: this.RemarksForm.value.remarks
        };
         
        this.service.move_to_approver_Or_Return_Questionnaire(this.Proposal_ID, dataObj)
        .subscribe(results =>{
            console.log("After approve and return results", results) 
            this.notify.success("Successfully "+ type)
            return true 
        })
    }
    else{
        return false 
    }

  }




  vendorviewData: any
  getVendor() {
    let data = this.proposer_code
    this.SpinnerService.show();
    this.service.getVendor(data)
      .subscribe(results => {
        this.SpinnerService.hide();
        console.log("vendorviewData get", results)
        this.vendorviewData = results
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })

  }


































  async addingkeys(keys) {
    let one = await this.KeyPatchForQuestionaaire(keys)
    // let two = await this.AnswersList(this.QuestionAnsBasedOnVendorList)
    // let three = await console.log("this is final output", this.QuestionAnsBasedOnVendorList )
  }


  KeyPatchForQuestionaaire(keys) {
    let addkeysArray: any = keys
    // console.log("keys data value ", keys)
    // console.log("await one >>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    for (let i of addkeysArray) {
      // console.log("i value ", i)

      Object.assign(i.type, { flagcount: 0 })

      i.header.push({ name: 'COMMENTS' }, { name: 'FLAG' })
      for (let j of i?.questions) {
        // console.log("j value for get the question series ", j)

        let redflag;
        let comments;

        if ('red_flag' in j) {
          redflag = j.red_flag
        }
        else {
          redflag = false
        }

        if ('comments' in j) {
          comments = j.comments
        }
        else {
          comments = ''
        }

        Object.assign(j, { comments: comments }, { answer_id: j?.ans?.id }, { red_flag: redflag }, { ref_id: this.Proposal_ID }, { score: 0 }, { id: j?.id })
      }
    }
    // console.log("Final dataset for adding keys", addkeysArray)
    this.QuestionAnsBasedOnVendorList = addkeysArray
  }


  AnswersList(summaryList) {

    // console.log("await two >>>>>>>>>>>>>>>>>>>>>>>>>>>>>", summaryList)
    let id = this.Proposal_ID

    for (let i of summaryList) {
      let type = i?.type?.id
      this.service.getEvaluationComments(id, type)
        .subscribe(results => {
          let dataaset = results['data']
          console.log("inner loop results for dataset", dataaset)
          if (dataaset?.length > 0) {
            for (let j of i.questions) {

              for (let k of dataaset) {
                if (j?.ans?.id == k?.answer_id) {
                  console.log("inner loop after API", j)
                  Object.assign(j, { evalid: k?.id })
                  j.comments = k.comments
                  j.red_flag = k.red_flag
                }
              }
            }
            console.log("patch assign ", this.QuestionAnsBasedOnVendorList)
          }
        })

    }

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
    // return this.sanitizer.bypassSecurityTrustHtml(this.selectedLegalDocumentText.value);
    return
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























}


interface ApproveReturn {
    status: any;
    type_id: any;
    remarks: any 
  }