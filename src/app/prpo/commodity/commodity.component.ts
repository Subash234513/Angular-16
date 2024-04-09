import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { PRPOSERVICEService } from '../prposervice.service';
import { PRPOshareService } from '../prposhare.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../error-handling-service.service'
@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss']
})
export class CommodityComponent implements OnInit {
  commodityForm: FormGroup;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private prposhareService: PRPOshareService, private shareService: SharedService,
    private dataService: PRPOSERVICEService, private toastr:ToastrService,private notification: NotificationService, private router: Router, private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService ) { }

  ngOnInit(): void {
    this.commodityForm = this.fb.group({
      name:['', Validators.required] ,
     
    })
  }

  commoditySubmit(){
    if (this.commodityForm.value.name===""){
      this.toastr.error('Add Commodity name Field','Empty value not Allowed');
      return false;
    }
    // if (this.commodityForm.value.name.trim()===""){
    //   this.toastr.error('Add Commodity name Field',' WhiteSpace Not Allowed');
    //   return false;
    // }
    // if (this.commodityForm.value.name.trim().length > 20){
    //   this.toastr.error('Not more than 20 characters','Enter valid Commodity name' );
    //   return false;
    // }
    let data = this.commodityForm.value
    this.SpinnerService.show();
   this.dataService.commodityCreateForm(data)
   .subscribe(res => {
    if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
      this.notification.showError("[INVALID_DATA! ...]")
    }
    else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
      this.notification.showWarning("Duplicate Data! ...")
    } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
      this.notification.showError("INVALID_DATA!...")
    }
     else {
       this.notification.showSuccess("Successfully created!...")
      
      this.onSubmit.emit();
     }
       console.log("commodity Form SUBMIT", res)
       return true
     },(error) => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }) 
  }

  omit_special_char(event)
{   
  var k;  
  k = event.charCode;  
  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}
 onCancelClick() {
  
  this.onCancel.emit()
 }
} 