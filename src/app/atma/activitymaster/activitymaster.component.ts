import { Component, OnInit,Output,ViewChild,EventEmitter } from '@angular/core';
import { FormGroup,FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-activitymaster',
  templateUrl: './activitymaster.component.html',
  styleUrls: ['./activitymaster.component.scss']
})
export class ActivitymasterComponent implements OnInit {
  ActivityForm:FormGroup
  Activityid:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private fb:FormBuilder,private atmaservice:AtmaService,private notification:NotificationService,
   private router:Router,private shareservice:ShareService ) { }
  
  ngOnInit(): void {
    let data = this.shareservice.activitymasteredit.value
    this.Activityid = data 

    // this.ActivityForm = this.fb.group({
    //   activities:new FormArray([
    //   //  this.getactivitydetails() 
    //   ])
    // })

    this.ActivityForm = this.fb.group({
      name : [''],
      description : ['']
    })

    if(this.Activityid){
      this.atmaservice.actmastersingleget(this.Activityid)
      .subscribe(result=>{
        // this.getactdetails(result)
        this.ActivityForm.patchValue({
          name:result?.name,
          description:result?.description
        })
      })
    }
    // else{
    //   (<FormArray>this.ActivityForm.get('activities')).push( this.getactivitydetails())
    // }
  }

  getactdetails(datas){
    let id:FormControl = new FormControl('');
    let name:FormControl = new FormControl('');
    let description:FormControl = new FormControl('');
    const actFormArray = this.ActivityForm.get('activities') as FormArray
    id.setValue(datas?.id),
    name.setValue(datas?.name),
    description.setValue(datas?.description),

    actFormArray.push(new FormGroup({
      id:id,
      name:name,
      description:description
    }))
  }

  addSection(){
    const control = <FormArray>this.ActivityForm.get('activities');
    control.push(this.getactivitydetails())
  }

  removeSection(i){
    const control = <FormArray>this.ActivityForm.get('activities');
    control.removeAt(i);
  }

  getactivitydetails(){
   let group = new FormGroup({
    name:new FormControl(''),
    description:new FormControl('')
   })
   return group
  }

  activitysubmit(){
    let value = this.ActivityForm.value
    if(this.Activityid){
      this.atmaservice.ActivityEditForms(value, this.Activityid)
      .subscribe(result => {
        console.log("result", result)
        if (result.id != undefined) {
          this.notification.showSuccess('Sucess');
          this.shareservice.activitymasteredit.next('')
          this.onSubmit.emit()

        } else {
          this.notification.showError(result.description);
          return false
        }
      })
    }
    else{
      this.atmaservice.ActivitymstrForm(value)
      .subscribe(result => {
        if (result.id != undefined) {
          this.notification.showSuccess('Sucess');
          this.shareservice.activitymasteredit.next('')

          this.onSubmit.emit()

        } else {
          this.notification.showError(result.description);
          return false
        }
      })
    }
  }
  onactivityCancel(){
     this.onCancel.emit()
  }

}
