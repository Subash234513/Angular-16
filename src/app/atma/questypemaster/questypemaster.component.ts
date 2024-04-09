import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { ShareService } from '../share.service';
import { masterService} from 'src/app/Master/master.service';


@Component({
  selector: 'app-questypemaster',
  templateUrl: './questypemaster.component.html',
  styleUrls: ['./questypemaster.component.scss']
})
export class QuestypemasterComponent implements OnInit {

  constructor(private atmaService: AtmaService, private fb: FormBuilder, private notification: NotificationService,
    private router: Router,private shareservice:ShareService,private masterservice:masterService) { }
  QuesTypeaAddForm: FormGroup
  questypeid:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  moduleslist:Array<any>=[];
  
  
  ngOnInit(): void {

    let data = this.shareservice.questypeedit.value
    this.questypeid = data

    this.QuesTypeaAddForm = this.fb.group({
      // name: ['', Validators.required],
      // remarks: ['', Validators.required],
      // display_name:['', Validators.required],
      // module_id:['', Validators.required]
      questypeheader:new FormArray([
          //  this.quetypedetails()
      ])
    })

    this.getmoduleslist()

    if(this.questypeid){
      this.atmaService.questypesingleget(this.questypeid)
      .subscribe(result => {
        let datas = result
        this.getquestypedatas(datas)
        // this.QuesTypeaAddForm.patchValue({
        //   name: datas?.name,
        //   remarks: datas?.remarks,
        //   display_name:datas?.display_name,
        //   module_id:datas?.module?.id
        // })
      })
    }else{
      (<FormArray>this.QuesTypeaAddForm.get('questypeheader')).push(this.quetypedetails())
    }

  }

  getquestypedatas(data){
    let id = new FormControl('');
    let name = new FormControl('');
    let remarks = new FormControl('');
    let display_name = new FormControl('');
    let module_id = new FormControl('');
    const questypeformArray = this.QuesTypeaAddForm.get("questypeheader") as FormArray;
    id.setValue(data?.id),
    name.setValue(data?.name),
    remarks.setValue(data?.remarks),
    display_name.setValue(data?.display_name),
    module_id.setValue(data?.module_id?.id)
    questypeformArray.push(new FormGroup({
      id:id,
      name:name,
      remarks:remarks,
      display_name:display_name,
      module_id:module_id
    }))

  }

  getmoduleslist(){
    this.masterservice.getModulesList()
    .subscribe(result=>{
      this.moduleslist = result['data']
    })
  }

  getSections(forms) {
    return forms.controls.questypeheader.controls;
  }
  addSection() {
    const control = <FormArray>this.QuesTypeaAddForm.get('questypeheader');
    control.push(this.quetypedetails());
   
  }

  removeSection(i) {
    const control = <FormArray>this.QuesTypeaAddForm.get('questypeheader');
    control.removeAt(i);
  }
    
    quetypedetails(){
       let group = new FormGroup({
        name:new FormControl(''),
        remarks:new FormControl(''),
        display_name : new FormControl(''),
        module_id:new FormControl('')
       })
       return group
    }


  submitquesForm() {
    const values = this.QuesTypeaAddForm.value.questypeheader
    // if (value.name == '' || value.name == null || value.name == undefined) {
    //   this.notification.showError("Please Enter Name");
    //   return false
    // }
    // if (value.remarks == '' || value.remarks == null || value.remarks == undefined) {
    //   this.notification.showError("Please Enter Remarks");
    //   return false
    // }
      this.atmaService.QuestypeCreateForms(values)
      .subscribe(result =>{
        if(result.status == 'success'){
          this.notification.showSuccess('Sucess');
          // this.shareservice.questypeedit.next('')
          this.onSubmit.emit()
        }
      })


    // if(this.questypeid){
    //   this.atmaService.QuestypeEditForms(value, this.questypeid)
    //   .subscribe(result => {
    //     console.log("result", result)
    //     if (result.status == 'success') {
    //       this.notification.showSuccess('Sucess');
    //       this.shareservice.questypeedit.next('')
    //       this.onSubmit.emit()

    //     } else {
    //       this.notification.showError(result.description);
    //       return false
    //     }
    //   })
    // }
    // else{
    //   this.atmaService.QuestypeCreateForms(value)
    //   .subscribe(result => {
    //     if (result.id != undefined) {
    //       this.notification.showSuccess('Sucess');
    //       this.shareservice.questypeedit.next('')

    //       this.onSubmit.emit()

    //     } else {
    //       this.notification.showError(result.description);
    //       return false
    //     }
    //   })
    // }

  }
  ontypecancel() {
    this.shareservice.questypeedit.next('')

    this.onCancel.emit()

  }

  

}
