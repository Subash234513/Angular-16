import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service'; 
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { MasterHrmsService } from '../master-hrms.service';
import { SharedHrmsService } from '../shared-hrms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
 
constructor(private fb: FormBuilder, private notify: NotificationService, private SpinnerService: NgxSpinnerService, 
    private masterHrms: MasterHrmsService, private error: ErrorHandlingServiceService, private datepipe: DatePipe,
    private share: SharedHrmsService, private route: Router, private activateroute: ActivatedRoute) { }


  ngOnInit(): void {
    this.getDocumentList()
  }

  DocumentTypeList: any
  getDocumentList() {
    this.masterHrms.getrelationship('template')
      .subscribe(results => {
        console.log(results)
        this.DocumentTypeList = results['data'] 
      })

  }

  TypeOfDocument(data){
    this.SpinnerService.show()
    console.log(data)
    this.masterHrms.TypeOfDocumentDownload(data?.id)
    .subscribe((data) => {
      this.SpinnerService.hide()
      let binaryData = [];
      binaryData.push(data)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Attendance Report'+".pdf";
      link.click();
      }, error=>{
        this.SpinnerService.hide()
      })

  }

}
