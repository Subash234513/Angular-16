import { Component, OnInit,ViewChild,Output,EventEmitter} from '@angular/core';
import { FormGroup,FormBuilder,Validators, FormArray, FormControl} from '@angular/forms';
import { AtmaService} from '../atma.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import {MatAutocomplete,MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {finalize,switchMap,tap,map,takeUntil} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ShareService } from '../share.service';
export interface questypelist{
  id:number;
  name:string;
}

@Component({
  selector: 'app-quesheader-master',
  templateUrl: './quesheader-master.component.html',
  styleUrls: ['./quesheader-master.component.scss']
})
export class QuesheaderMasterComponent implements OnInit {
  inputdropdown: any;

  constructor(private fb:FormBuilder,private atmaservice:AtmaService,private shareservice:ShareService,
    private notification:NotificationService,private router:Router) { }
  QuesheaderAddForm:FormGroup
  questypelist:Array<any>=[];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('typeauto') mattypename:MatAutocomplete;
  @ViewChild('typeinput') typeInput;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  quesheaderid:any
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
 
  ngOnInit(): void {

    let datas = this.shareservice.quesheaderedit.value
    this.quesheaderid = datas

   this.QuesheaderAddForm = this.fb.group({
    //  type_id:['', Validators.required],
    //  name:['', Validators.required],
    //  order:['', Validators.required],
    //  is_input:[false, Validators.required],
    //  input_type:['', Validators.required]
    quesheader:new FormArray([
      //  this.getqueshdrdetails()
    ])
   }) 
  //  this.QuesheaderAddForm.get('type_id').valueChanges.pipe(
  //   tap(()=>{
  //     this.isLoading=true;
  //   }),
  //   switchMap(value=>this.atmaservice.getquestypemaster(value,1).pipe(
  //     finalize(()=>{
  //       this.isLoading=false;
  //     })
  //   ))
  // ).subscribe(data=>{
  //   this.questypelist=data['data'];
  // });

  if(this.quesheaderid){
    this.atmaservice.quesheadersingleget(this.quesheaderid)
    .subscribe(result => {
      let datas = result
      this.getquestionhdrdetails(datas)
      // this.QuesheaderAddForm.patchValue({
      //   type_id: datas?.type_id,
      //   name:datas?.name,
      //   order:datas?.order,
      //   is_input:datas?.is_input,
      //   input_type: datas?.input_type?.id
      // })
    })
  }else{
    (<FormArray>this.QuesheaderAddForm.get('quesheader')).push(this.getqueshdrdetails())
  }

  this.getinputdropdown()

  }

  getquestionhdrdetails(data){
    let id = new FormControl('');
    let type_id = new FormControl('');
    let name = new FormControl('');
    let order = new FormControl('');
    let is_input = new FormControl('');
    let input_type = new FormControl('')
    const quesheaderArray = this.QuesheaderAddForm.get('quesheader') as FormArray
    id.setValue(data?.id),
    type_id.setValue(data?.type),
    name.setValue(data?.name),
    order.setValue(data?.order),
    is_input.setValue(data?.is_input),
    input_type.setValue(data?.input_type?.id)
    quesheaderArray.push(new FormGroup({
      id:id,
      type_id:type_id,
      name:name,
      order:order,
      is_input:is_input,
      input_type:input_type
    }))
    type_id.valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getquestypemaster(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.questypelist=data['data'];
    });
  }

  getSections(forms) {
    return forms.controls.quesheader.controls;
  }
  addSection() {
    const control = <FormArray>this.QuesheaderAddForm.get('quesheader');
    control.push(this.getqueshdrdetails());
    let data = this.QuesheaderAddForm.value.quesheader
    for(let i = 0;i<data.length;i++){
      if(i>0){
        this.QuesheaderAddForm.get('quesheader')['controls'][i].get('type_id').setValue(data[0].type_id)
      }
    }
   
  }

  removeSection(i) {
    const control = <FormArray>this.QuesheaderAddForm.get('quesheader');
    control.removeAt(i);
  }
    

  getqueshdrdetails(){
    let group = new FormGroup({
      type_id : new FormControl(''),
      name:new FormControl(''),
      is_input : new FormControl(false),
      input_type:new FormControl(''),
      order : new FormControl(''),
     
    }

    )

    group.get('type_id').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaservice.getquestypemaster(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.questypelist=data['data'];
    });
    return group
  }

  public getquestypelist(data ?:questypelist):string | undefined{
    return data?data.name:undefined;
  }
  getqueslists(){
    this.atmaservice.getquestypemaster('',1).subscribe(data=>{
      this.questypelist=data['data'];
    });
  }
  questypescroll(){
      
    setTimeout(() => {
      if (
        this.mattypename &&
        this.autocompleteTrigger &&
        this.mattypename.panel
      ) {
        fromEvent(this.mattypename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattypename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattypename.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattypename.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattypename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.getquestypemaster(this.typeInput.nativeElement.value,this.currentpage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.questypelist = this.questypelist.concat(datas);
                    if (this.questypelist.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  
 
  }

  createFormate() {
    let data = this.QuesheaderAddForm.controls;
    let quesheaderclass = new quesheader();
    quesheaderclass.type_id = data['type_id'].value.id;
    quesheaderclass.name = data['name'].value;
    quesheaderclass.order= data['order'].value;
    quesheaderclass.is_input= data['is_input'].value;
    quesheaderclass.input_type= data['input_type'].value;
    return quesheaderclass;
  }

  inputcheck(e,ind){
    if(e.checked == false){
      this.QuesheaderAddForm.get('quesheader')['controls'][ind].get('input_type').setValue("")
    }
  }
  submitqueshdrForm(){

    // if(this.quesheaderid){
    //   this.atmaservice.QuesHeaderEditForms(this.createFormate(),this.quesheaderid)
    //   .subscribe(result=>{
    //     if(result.status == "success"){
    //       this.notification.showSuccess("Success")
    //       this.shareservice.quesheaderedit.next('')

    //       this.onSubmit.emit()
    //      //  this.router.navigate(['atma/quesheadersummary'])
    //     }else{
    //       this.notification.showError(result.description)
    //       return false;
    //     }
    //   })
    // }
    // else{
    //   this.atmaservice.QuesHeaderCreateForms(this.createFormate())
    //   .subscribe(result=>{
        
    //     if(result.id != undefined){
    //       this.notification.showSuccess("Success");
    //       this.shareservice.quesheaderedit.next('')

    //       this.onSubmit.emit()
    //      //  this.router.navigate(['atma/quesheadersummary'])
    //     }else{
    //       this.notification.showError(result.description)
    //       return false;
    //     }
    //   })
    // }
    const values = this.QuesheaderAddForm.value.quesheader
    for(let i in values){
      values[i].type_id = values[i].type_id.id
    }
    this.atmaservice.QuesHeaderCreateForms(values)
    .subscribe(result=>{
      if(result.status == "success"){
      this.notification.showSuccess("Success");
      // this.shareservice.quesheaderedit.next('')
      this.onSubmit.emit()
      }
      else{
        this.notification.showError(result.description)
        return false;
        }
    })
  }
  onQuesHdrCancel(){
    this.shareservice.quesheaderedit.next('')

    this.onCancel.emit()
    // this.router.navigate(['atma/quesheadersummary'])
  }
  kyenbdata(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }

  getinputdropdown(){
    this.atmaservice.inputypesdropdown().subscribe(data=>{
      this.inputdropdown=data['data'];
    });
  }

}
class quesheader{
  type_id:number;
  name:string;  
  order: any;
  is_input:any
  input_type:any
}