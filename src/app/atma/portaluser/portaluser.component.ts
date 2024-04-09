import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShareService } from '../share.service';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portaluser',
  templateUrl: './portaluser.component.html',
  styleUrls: ['./portaluser.component.scss']
})
export class PortaluserComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  portalForm: FormGroup;
  vendorId: any;
  VendorData: any
  rel_type: any

  constructor(private fb: FormBuilder, private shareService: ShareService, private atmaservice: AtmaService,
    private notification: NotificationService, private spinner: NgxSpinnerService, private errorHandler: ErrorHandlingService,
    private router: Router) { }

  ngOnInit(): void {
    let data: any = this.shareService.vendorsingleget.value;
    console.log("vendorid",data);
    this.VendorData = data
    this.rel_type = this.VendorData?.custcategory_id?.name

    this.portalForm = this.fb.group({
      //  id: ['',Validators.required],
      name: ['', Validators.required],
      supplier_code: ['', Validators.required],
      relationship_type: ['', Validators.required],
      created_by: ['', Validators.required]


    })

    this.portalForm.patchValue({
      //  id:this.VendorData?.id,
      name: this.VendorData?.name,
      supplier_code: this.VendorData?.code,
      created_by: this.VendorData?.created_by,
      relationship_type: this.VendorData?.custcategory_id?.id


    })



  }

  onCancelClick() {
    this.onCancel.emit()
  }
  portalsubmitForm() {
    const portaldata = this.portalForm.value
    portaldata.relationship_type = this.VendorData?.custcategory_id?.id,
      this.atmaservice.PortalActiveForm(portaldata)
        .subscribe(res => {
          // console.log("res",res)
          this.shareService.portaluserdata.next(res)
          // console.log("res1",this.shareService.portaluserdata)
          // console.log("res2",this.shareService.portaluserdata.value)
          this.notification.showSuccess("Success");
          
          let obj = {
            portal_flag: true,
            portal_code: res.code,
            vendor_id: this.VendorData.id
          }
          this.atmaservice.getportaluserupdate(obj).subscribe(
            res => {
              console.log('portalupdate', res)
            })
          // this.router.navigate(['atma/portalusersummary'])
          this.onSubmit.emit()
        }
        )
  }

}
