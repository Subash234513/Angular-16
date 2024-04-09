import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from 'ngx-spinner';
import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { idText } from 'typescript';
import { AtmaService } from '../atma.service';
import { NotificationService } from '../notification.service';

export interface questypelist {
  id: number;
  name: string;
}

export interface quesheaderlist {
  id: number;
  name: string;
}

@Component({
  selector: 'app-questionmapping',
  templateUrl: './questionmapping.component.html',
  styleUrls: ['./questionmapping.component.scss']
})


export class QuestionmappingComponent implements OnInit {

  @ViewChild('typeauto') mattypename: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('typeinput') typeInput;

  @Output() onCancel = new EventEmitter<any>();

  @ViewChild('modalclose') modalclose:any;


  questypelist: any;
  isLoading = false
  type_has_next = true;
  type_has_previous = true;
  type_currentpage = 1;

  questionmappingform: FormGroup
  quesheaderlist: any;

  questiondata =[]
  question_has_next=true
  question_has_previous=true
  question_currentpage=1

  questionidarray:any=[]
  categorylist: any;
  Ventypelist: any;
  criticallist: any;

  constructor(private atmaService: AtmaService,private SpinnerService: NgxSpinnerService, private formbuilder: FormBuilder,private notification:NotificationService) { }

  ngOnInit(): void {

    this.questionmappingform = this.formbuilder.group({
      type_id: [''],
      header: [''],
      question_id: new FormArray([])
    })

    // this.getquestions(this.questionmappingform.value.type_id.id,this.questionmappingform.value.header.id)

    this.getcriticalitylist()
    this.getvendortypelist()
    this.getcategorylists()
  }

  getqueslists() {
    this.atmaService.getquestypemaster('', 1).subscribe(data => {
      this.questypelist = data['data'];
    });
  }

  optionselected(){
    
    console.log('values check',this.questionmappingform.value.type_id.id,  this.questionmappingform.value.header.id)
    console.log('if condition check' ,this.questionmappingform.value.type_id.id&&this.questionmappingform.value.header.id)
    
    if(this.questionmappingform.value.type_id.id && this.questionmappingform.value.header.id){
    this.getquestions(this.questionmappingform.value.type_id.id,this.questionmappingform.value.header.id)
    }

  }

  queslistsvaluechanges(value, page) {
    this.isLoading = true

    this.atmaService.getquestypemaster(value, page).subscribe(data => {
      this.questypelist = data['data'];
      this.isLoading = false


    });
  }

  public getquestypelist(data?: questypelist): string | undefined {
    return data ? data.name : undefined;
  }

  questypescroll() {

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
              if (this.type_has_next === true) {
                this.atmaService.getquestypemaster(this.typeInput.nativeElement.value, this.type_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.questypelist = this.questypelist.concat(datas);
                    if (this.questypelist.length >= 0) {
                      this.type_has_next = datapagination.has_next;
                      this.type_has_previous = datapagination.has_previous;
                      this.type_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }

  getquesheaderlists() {
    this.atmaService.typebasedheaderget('', this.questionmappingform.value.type_id.id, 1).subscribe(data => {
      this.quesheaderlist = data['data'];
    });
  }

  quesheaderlistvaluechanges(value, page) {
    this.isLoading = true
    this.atmaService.typebasedheaderget(value, this.questionmappingform.value.type_id.id, page).subscribe(data => {
      this.quesheaderlist = data['data'];
      this.isLoading = false

    });
  }

  public getquesheaderlist(data?: quesheaderlist): string | undefined {
    return data ? data.name : undefined;
  }

  getquestions(type,id) {
    this.SpinnerService.show()
    this.atmaService.allquestionget(type,id).subscribe(data => {
    this.SpinnerService.hide()

      this.questiondata = data['data'];
      let datapagination = data["pagination"];
      // for(let i=0;i<this.questiondata.length;i++){
      //   this.questiondata[i]['checked']=false
      // }
    // this.getorder()
      
      // if (this.questiondata.length >= 0) {
      //   this.question_has_next = datapagination.has_next;
      //   this.question_has_previous = datapagination.has_previous;
      //   this.question_currentpage = datapagination.index;
      // }

    });
  }

  previousquestiondata(){
if(this.question_has_previous){
  // this.getquestions(this.question_currentpage-1)
}
  }

  nextquestiondata(){
    if(this.question_has_next){
      // this.getquestions(this.question_currentpage+1)
    }
  }

  getcheckbox(e,id,i){
    // (e.target.checked)? this.questionidarray.push(id):(this.questionidarray.includes(id))? this.questionidarray.splice(this.questionidarray.indexOf(id),1):''

    // console.log(this.questionidarray)

    if(e.target.checked){
      this.getquestionmappost(id,e.target.checked)
    }
    else{
      this.getquestionmappost(id,e.target.checked)

    }
  
  }

  questionmappingsubmit(){
    let obj={
      type_id:this.questionmappingform.value.type_id.id,
      header:this.questionmappingform.value.header.id,
      question_id:this.questionidarray
    }


    this.atmaService.getsubmitquestionmapping(obj).subscribe(
      data=>{
        if(data.message == 'Successfully Created'){
          this.notification.showSuccess(data.message)
        }
        else{
          this.notification.showError(data)
        }
      })

  }

  oncancel(){
    this.onCancel.emit()

  }

  questionmarkchange(i,id){
  

    this.questiondata[i].is_check= !this.questiondata[i].is_check
   
 
      // this.questionidarray.push(id)
      this.getquestionmappost(id,this.questiondata[i].is_check)

   
    // console.log(this.questionidarray)
    // // (this.questiondata[i].checked == true )? this.questionidarray.push(id):(this.questionidarray.includes(id))? this.questionidarray.splice(this.questionidarray.indexOf(id),1):''
  }

  closepop(){
    this.modalclose.nativeElement.click()
    this.optionselected()
  }

  getcategorylists(){
    this.atmaService.getGroup().subscribe(result=>{
      this.categorylist = result['data']
    })
  }

  getvendortypelist(){
    this.atmaService.getType().subscribe(result=>{
      this.Ventypelist = result['data']
    })
  }

  getcriticalitylist(){
    this.atmaService.getClassification().subscribe(result=>{
      this.criticallist = result['data']
    })
  }

  getorder(){
    const tomsIndex = this.questiondata.findIndex(x => x.type_id.id == this.questionmappingform.value.type_id.id);
    console.log('orderindex',tomsIndex)
    this.questiondata.push(...this.questiondata.splice(0, tomsIndex));
  }

  getflagpost(id,reftype,refid,remove){
    let obj={
      'questionmapping_id':id,
      'ref_type':reftype,
      'ref_id':refid,
    }
    
    this.atmaService.getquestionmappingflagpost(obj,remove).subscribe(
      data=>{
        if(data.message == 'Successfully Created'){
          this.notification.showSuccess('Successfully updated')
        }
        else if(data.message == 'Successfully Deleted'){
          this.notification.showSuccess('Successfully Deleted')

        }
        else{
          this.notification.showError(data)
        }
      })
  }

  geteval(bool,questionmappingid,reftype,refid){
    if(bool.selected){
      console.log(bool.selected,'quesitionmapping',questionmappingid,'reftype',reftype,'refid',refid)
      this.getflagpost(questionmappingid,reftype,refid,'')
    }
    else{
      this.getflagpost(questionmappingid,reftype,refid,'?remove=1')

    }
  }
  
  
  getquestionmappost(id,bool){
    
    let obj={
      "id":id,
      "is_checked":bool
  }
  
    
    this.atmaService.getquestionmappost(obj).subscribe(
      data=>{
        if(data.message == 'Successfully Updated'){
          this.notification.showSuccess('Successfully Updated')
        }
        else if(data.message == 'Successfully Deleted'){
          this.notification.showSuccess('Successfully Deleted')
        }
        else{
          this.notification.showError(data)
        }
      })
  }

}
