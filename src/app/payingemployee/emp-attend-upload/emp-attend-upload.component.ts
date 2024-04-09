import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as xlll from 'xlsx'
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-emp-attend-upload',
  templateUrl: './emp-attend-upload.component.html',
  styleUrls: ['./emp-attend-upload.component.scss']
})
export class EmpAttendUploadComponent implements OnInit {
@ViewChild('labelImport')labelImport:ElementRef
uploadForms: FormGroup;
  UploadFile: File;
  
  constructor(private service:PayingempService,private notification:NotificationService) { }

  ngOnInit(): void {
  }
  fileChange(file){
    const fileName:FileList=file.target.files
    this.labelImport.nativeElement.innerText=Array.from(fileName).map(f=>f.name)
    // const read=new FileReader()
    // read.readAsBinaryString(file.target.files[0])
    // read.onload=(e:any)=>{
    //   const BinaryRead=e.target.result
    //   const BinaryReadData=xlll.read(BinaryRead,{type:'binary'})
    //   const SheetNames=BinaryReadData.SheetNames[0]
    //   const Sheet=BinaryReadData.Sheets[SheetNames]
    //   const data=xlll.utils.sheet_to_json(Sheet,{header:1})
    //   console.log('data',data)
    this.UploadFile=<File>file.target.files[0]
    }
    Upload(){
      if(this.UploadFile === undefined || this.UploadFile === null )
      {
        this.notification.showError('Please Select File')
        return false;
      }
      
      this.service.EmployeeAttendanceUpload(this.UploadFile).subscribe(data=>{
        if(data.status==='success'){
          this.notification.showSuccess('Successfully Created')
        }
      })
    }
    Download(){
        this.service.EmployeeAttendanceDownload().subscribe(data=>{
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = "Template" + ".xlsx";
          link.click();
        })
    }
   
  }
 


