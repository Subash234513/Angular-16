import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-portaluser-summary',
  templateUrl: './portaluser-summary.component.html',
  styleUrls: ['./portaluser-summary.component.scss']
})
export class PortaluserSummaryComponent implements OnInit {

  portalform:FormGroup;
  rolesList: any;
  vendordetails: any;

  @ViewChild('closebuttonportalform') closebuttonportalform;


  constructor(private atmaservice:AtmaService,private ShareService:ShareService,
    private fb:FormBuilder,private notification:NotificationService) { }
  portalSummaryList:Array<any>=[];
  portalusercode:any
  ngOnInit(): void {

    this.portalform=this.fb.group({
      name:[''],
      email:[''],
      role:[''],
      entity:['']
    })

    // let data = this.ShareService.portaluserdata.value
    let data: any = this.ShareService.vendorsingleget.value;
    this.vendordetails=data
    // console.log("data",data)
    console.log('portal check ' ,data)
    this.portalusercode= data.code
    // console.log("portalusercode",this.portalusercode)
    this.getusersummary();

    this.getRolesList()

  }

  getusersummary(){
    this.atmaservice.getportalusersummary('PORT66')
    .subscribe(res =>{
     console.log("ressssss------>",res)
     this.portalSummaryList =res['data']
    })
  }

  portalsubmit(){


    if(this.portalform.value.name==''){
      this.notification.showError('Please enter Name')
      return false
    }
    // if(this.portalform.value.password==''){
    //   this.notification.showError('Please enter Password')
    //   return false
    // }
    if(this.portalform.value.email==''){
      this.notification.showError('Please enter Email')
      return false
    }
    if(this.portalform.value.role==''){
      this.notification.showError('Please enter Role')
      return false
    }

    const session = JSON.parse(localStorage.getItem("sessionData"))
    this.portalform.value.entity=session.entity_id

    this.atmaservice.createportal('PORT66',this.portalform.value).subscribe(
      res=>{
        console.log('portal',res)
        this.getusersummary()
        this.closebuttonportalform.nativeElement.click()
      }
    )

  }

  getRolesList() {
    this.atmaservice.getRolesList()
      .subscribe((results: any[]) => {
        let datas = results["data"]; ``
        this.rolesList = datas;
      })
  }

}
