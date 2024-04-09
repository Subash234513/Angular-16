import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, from, fromEvent } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { CmsService } from '../cms.service';
import { CMSSharedService } from '../cms-shared.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-identification-view',
  templateUrl: './identification-view.component.html',
  styleUrls: ['./identification-view.component.scss']
})
export class IdentificationViewComponent implements OnInit {
  RemarksForm:FormGroup
  Identification_Id:number;
  detailsIdeView:any;
  identificationViewList:any;
  groupApproverList:any;
  ProcessList: any = [{ name: 'Approve' }, { name: 'Reject' }, { name: 'Return' }];
  imageUrl: any = environment.apiURL
  identificationviewdiv: boolean = true 
  identificationedit: boolean = false 

  @Output() onCancel = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService, private service: CmsService,
    private cmsShare: CMSSharedService, private notify: ToastrService, private activateroute: ActivatedRoute) { }

  ngOnInit(): void {

    let data: any = this.cmsShare.identificationView.value
    console.log("identification data view get", data)
    console.log("identification view ID get ", data.data.id)
    this.Identification_Id  = data.data.id
    this.detailsIdeView = data.data

    this.identificationView()

    this.RemarksForm= this.fb.group({
      remarks: '',
      group_id: ''
    })
    this.getTransHistory()
  }


  PA:any;
  identificationView(){
    this.SpinnerService.show();
    this.service.identificationView(this.Identification_Id)
      .subscribe(results => {
        this.SpinnerService.hide();
        this.identificationViewList = results
        console.log("identification-view",this.identificationViewList)
        this.groupApproverList = this.identificationViewList.approver
        this.RemarksForm.patchValue({
          "group_id":this.groupApproverList[0].approver.id
        })
        console.log("pending approval array",this.groupApproverList)
        if(results.parallel_approval == true){
         this.PA = 'Yes'
        } else {
         this.PA = "No"
        }
        console.log("get view after API", this.identificationViewList)
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  SelectedProcess: any 
  

  gettingRemarks(type){
    console.log("selected type for popup", type)
    let type_Of_Process = type?.name 
    this.SelectedProcess = type_Of_Process
  }


  Approval_Reject_Review(type) {
    let typeID;
    if(type == 'Approve'){
      typeID = 3
    }
    if(type == 'Reject'){
      typeID = 4
    }
    if(type == 'Return'){
      typeID = 5
    }

    let obj={
    "remarks":this.RemarksForm.value.remarks,
    "status":typeID,
    "group_id": this.RemarksForm.value.group_id}
    this.SpinnerService.show();
    this.service.identification_Approval_Reject_Review(this.Identification_Id, obj)
      .subscribe((results) => {
        this.SpinnerService.hide();
        console.log("results after approval", results)
        if (results.status == "success") {
          if(type == 'Approve'){
            this.notify.success("Approved Successfully")
          }
          if(type == 'Reject'){
            this.notify.error("Rejected...")
          }
          if(type == 'Return'){
            this.notify.success("Returned..")
          }
          this.identificationView();
          this.getTransHistory()
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  backnavigate(){
    // this.router.navigate(['cms/cms'])
    this.onSubmit.emit()
  }



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
      this.jpgUrlsAPI = this.imageUrl + "inwdserv/fileview/" + id + "?token=" + token;
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




  editIdentification() {
    let data: any  = this.Identification_Id
    console.log("datat for edit", data )
    this.cmsShare.identificationCreate.next(data)
    this.identificationviewdiv = false 
    this.identificationedit = true 
    
    return data 
  }

  Identificationedit(){
    this.identificationView()
    this.getTransHistory()
    this.identificationviewdiv = true  
    this.identificationedit = false 
  }

  Identificationeditcancel(){
    this.identificationviewdiv = true  
    this.identificationedit = false 
  }






  ResubmitIdentification() {
    this.SpinnerService.show();
    this.service.IdentificationResubmit(this.Identification_Id)
      .subscribe((results: any) => {
        this.SpinnerService.hide();
        if(results.code == "INVALID_DATA" && results.description == "CAN'T RESUBMIT"){
          this.SpinnerService.hide();
          this.notify.warning("Can't Resubmit, Please check status is RETURNED and only maker can resubmit")
          return false  
        }
        else{
          this.SpinnerService.hide();
          this.notify.success("Successfully Resubmitted")
          this.identificationView()
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  CMS_IdentificationView_Menu_List: any = [{ name: 'Transaction History' }];
  HistoryTab :boolean 

  viewShow(data){
    if(data?.name == 'Transaction History'  ){
      this.HistoryTab = true 
    } 
    console.log("tran data for identification", data)


  }


  TranHistoryList: any
  getTransHistory() {
    this.SpinnerService.show();
    let id = this.Identification_Id
    let reltype = 'identification'
    this.service.getTranHistory(id, reltype)
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
























}
