import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AtmaService } from '../atma.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { finalize, switchMap, tap, map, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ShareService } from '../share.service';


export interface questypelist {
  id: number;
  name: string;
}
export interface quesheaderlist {
  id: number;
  name: string;
}

@Component({
  selector: 'app-questionmaster',
  templateUrl: './questionmaster.component.html',
  styleUrls: ['./questionmaster.component.scss']
})
export class QuestionmasterComponent implements OnInit {
  inputdropdown: any;

  constructor(private fb: FormBuilder, private atmaservice: AtmaService, private shareservice: ShareService,
    private notification: NotificationService, private router: Router) { }
  QuesForm: FormGroup
  subtextForm: FormGroup
  questypelist: Array<any> = [];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('typeauto') mattypename: MatAutocomplete;
  @ViewChild('typeinput') typeInput;
  quesheaderlist: Array<any> = [];
  @ViewChild('headerauto') matheadername: MatAutocomplete;
  @ViewChild('headerinput') headerInput;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  questypeid: any;
  questionid: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();



  ngOnInit(): void {

    let data = this.shareservice.quesedit.value
    this.questionid = data

    this.QuesForm = this.fb.group({
      formheader: new FormArray([
        // this.quedetails()

      ]),


    })

    this.getquestions()
    this.getinputdropdown()
  }

  getquestions() {
    if (this.questionid) {
      this.atmaservice.geteditquestions(this.questionid)
        .subscribe(results => {
     
            this.getqueslist(results['data'])
          

        })
    }
    else {
      (<FormArray>this.QuesForm.get('formheader')).push(this.quedetails())
    }

  }

  getqueslist(data) {

    for(let i in data){

    
    let id: FormControl = new FormControl('');
    let type_id: FormControl = new FormControl('');
    let header_id: FormControl = new FormControl('');
    let text: FormControl = new FormControl('');
    let input_type: FormControl = new FormControl('');
    let order: FormControl = new FormControl('');
    let min: FormControl = new FormControl('');
    let max: FormControl = new FormControl('');
    let is_score: FormControl = new FormControl('');

    // let is_subtext:FormControl = new FormControl('');
    const quesformArray = this.QuesForm.get("formheader") as FormArray;

    id.setValue(data[i]?.id),
      type_id.setValue(data[i]?.type_id),
      header_id.setValue(data[i]?.header_id),
      input_type.setValue(data[i]?.input_type?.id),
      text.setValue(data[i]?.text),
      order.setValue(data[i]?.order)
      min.setValue(data[i]?.min)
      max.setValue(data[i]?.max)
      is_score.setValue(data[i]?.is_score)


    // is_subtext.setValue(data?.is_subtext)


    quesformArray.push(new FormGroup({
      id: id,
      type_id: type_id,
      header_id: header_id,
      input_type: input_type,
      text: text,
      order: order,
      min:min,
      max:max,
      is_score:is_score,
      // is_subtext:is_subtext,
      sub_question: this.subdata(data[i].sub_question),
      Input_value: this.dropdowndata(data[i].Input_value)

    }))

    type_id.valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaservice.getquestypemaster(value, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.questypelist = data['data'];
    });

    header_id.valueChanges.pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(value => this.atmaservice.typebasedheaderget(value, this.questypeid, 1).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ))
    ).subscribe(data => {
      this.quesheaderlist = data['data'];
    });



  }
  }
  subdata(datas) {
    
    let arr = new FormArray([])

    // if (datas.length == 0) {
    //   arr.push(new FormGroup({
    //     id: new FormControl(''),
    //     text: new FormControl(''),
    //     input_type: new FormControl(''),
    //     order: new FormControl(''),
    //     min: new FormControl(''),
    //     max: new FormControl(''),
    //     is_score:  new FormControl(''),
    //   }))
    // }

    for (let sub of datas) {
      let id: FormControl = new FormControl;
      let text: FormControl = new FormControl;
      let input_type: FormControl = new FormControl;
      let order: FormControl = new FormControl;
      let min: FormControl = new FormControl('');
    let max: FormControl = new FormControl('');
    let is_score: FormControl = new FormControl('');

      id.setValue(sub?.id),
        text.setValue(sub?.text),
        input_type.setValue(sub?.input_type?.id),
        order.setValue(sub?.order)
        min.setValue(sub?.min)
        max.setValue(sub?.max)
        is_score.setValue(sub?.is_score)



      arr.push(new FormGroup({
        id: id,
        text: text,
        input_type: input_type,
        order: order,
        min:min,
        max:max,
        is_score:is_score,
        Input_value: this.subdddata(sub?.Input_value)
      }))

    }
    return arr;


  }

  subdddata(datas) {
    let subarr = new FormArray([])

    if (datas.length == 0) {
      subarr.push(new FormGroup({

        options: new FormControl(''),
        remarks: new FormControl(''),
        order: new FormControl('')
      }))
    }

    for (let subdd of datas) {
      let id: FormControl = new FormControl;
      let options: FormControl = new FormControl;
      let remarks: FormControl = new FormControl;
      let order: FormControl = new FormControl;

      id.setValue(subdd?.id),
        options.setValue(subdd?.options),
        remarks.setValue(subdd?.remarks),
        order.setValue(subdd?.order)

      subarr.push(new FormGroup({
        id: id,
        options: options,
        remarks: remarks,
        order: order,

      }))

    }
    return subarr;


  }


  dropdowndata(datas) {
    let array = new FormArray([])

    if (datas.length == 0) {
      array.push(new FormGroup({
      
        options: new FormControl(''),
        remarks: new FormControl(''),
        order: new FormControl('')
      }))
    }

    for (let dd of datas) {
      let id: FormControl = new FormControl;
      let options: FormControl = new FormControl;
      let remarks: FormControl = new FormControl;
      let order: FormControl = new FormControl;

      id.setValue(dd?.id),
        options.setValue(dd?.options),
        remarks.setValue(dd?.remarks),
        order.setValue(dd?.order)

      array.push(new FormGroup({
        id: id,
        options: options,
        remarks: remarks,
        order: order
      }))

    }
    return array;


  }

  gettypeid(type) {
    this.questypeid = type.id
  }
  getSections(forms) {
    return forms.controls.formheader.controls;
  }
  addSection() {
    const control = <FormArray>this.QuesForm.get('formheader');
    control.push(this.quedetails());

  }

  removeSection(i) {
    const control = <FormArray>this.QuesForm.get('formheader');
    control.removeAt(i);

  }

  addsubSection(userIndex) {
    const control = (<FormArray>this.QuesForm.controls['formheader']).at(userIndex).get('sub_question') as FormArray;
    control.push(this.subdetails());
  }

  removesubSection(i, ind) {
    const control = (<FormArray>this.QuesForm.controls['formheader']).at(i).get('sub_question') as FormArray;
    control.removeAt(ind);

  }

  adddropSection(Index) {
    (<FormArray>(<FormGroup>(<FormArray>this.QuesForm.controls['formheader'])
      .controls[Index]).controls['Input_value']).push(this.dropdowndetails());
  }

  removedropSection(i, ind) {
    (<FormArray>(<FormGroup>(<FormArray>this.QuesForm.controls['formheader'])
      .controls[i]).controls['Input_value']).removeAt(ind);

  }

  addsubdropSection(aindex, bindex) {
    const control = ((<FormArray>this.QuesForm.controls['formheader']).at(aindex).get('sub_question') as FormArray).at(bindex).get('Input_value') as FormArray;
    control.push(this.subdropdowndetails());

  }

  removesubdropSection(aindex, bindex, cindex) {
    const control = ((<FormArray>this.QuesForm.controls['formheader']).at(aindex).get('sub_question') as FormArray).at(bindex).get('Input_value') as FormArray;
    control.removeAt(cindex);
  }


  quedetails() {
    let group = new FormGroup({
      type_id: new FormControl(''),
      header_id: new FormControl(''),
      input_type: new FormControl(''),
      text: new FormControl(''),
      order: new FormControl(''),
      min: new FormControl(''),
      max: new FormControl(''),
      is_score:new FormControl(false),
      // is_subtext:new FormControl(false),
      sub_question: new FormArray([
        // this.subdetails()
      ]),
      Input_value: new FormArray([
        this.dropdowndetails()
      ])
    })

    // group.get('type_id').valueChanges.pipe(
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

    // group.get('header_id').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=>this.atmaservice.typebasedheaderget(value,this.questypeid,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.quesheaderlist=data['data'];
    // });

    return group
  }

  public getquestypelist(data?: questypelist): string | undefined {
    return data ? data.name : undefined;
  }
  public getquesheaderlist(data?: quesheaderlist): string | undefined {
    return data ? data.name : undefined;
  }
  getqueslists() {
    this.atmaservice.getquestypemaster('', 1).subscribe(data => {
      this.questypelist = data['data'];
    });
  }

  getquestionlistsearch(value){
    this.atmaservice.getquestypemaster(value, 1).subscribe(data => {
      this.questypelist = data['data'];
    });
  }

  getquesheaderlists() {
    this.atmaservice.typebasedheaderget('', this.questypeid, 1).subscribe(data => {
      this.quesheaderlist = data['data'];
    });
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
              if (this.has_next === true) {
                this.atmaservice.getquestypemaster(this.typeInput.nativeElement.value, this.currentpage + 1)
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

  quesheaderscroll() {

    setTimeout(() => {
      if (
        this.matheadername &&
        this.autocompleteTrigger &&
        this.matheadername.panel
      ) {
        fromEvent(this.matheadername.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matheadername.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matheadername.panel.nativeElement.scrollTop;
            const scrollHeight = this.matheadername.panel.nativeElement.scrollHeight;
            const elementHeight = this.matheadername.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaservice.typebasedheaderget(this.headerInput.nativeElement.value, this.questypeid, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.quesheaderlist = this.quesheaderlist.concat(datas);
                    if (this.quesheaderlist.length >= 0) {
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



  subdetails() {
    let group = new FormGroup({
      text: new FormControl(''),
      input_type: new FormControl(''),
      order: new FormControl(''),
      min: new FormControl(''),
      max: new FormControl(''),
      is_score:new FormControl(false),
      Input_value: new FormArray([
        this.subdropdowndetails()
      ])
    })
    return group
  }

  dropdowndetails() {
    let groups = new FormGroup({
      options: new FormControl(''),
      remarks: new FormControl(''),
      order: new FormControl('')
    })
    return groups
  }

  subdropdowndetails() {
    let subgroups = new FormGroup({
      options: new FormControl(''),
      remarks: new FormControl(''),
      order: new FormControl('')
    })
    return subgroups
  }


  checkselect(event, data, i) {
    if (event.target.checked == true) {
      this.QuesForm.get('formheader')['controls'][i].get('is_subtext').setValue(true)
    } else {
      this.QuesForm.get('formheader')['controls'][i].get('is_subtext').setValue(false)
    }
  }

  kyenbdata(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }

  questionsubmit() {
    const questiondata = this.QuesForm.value.formheader
    // for(let i in questiondata){
    //   if(questiondata[i].id == "" || questiondata[i].id == null || questiondata[i].id == undefined){
    //     delete questiondata[i].id
    //   }
    //   // if(typeof(questiondata[i].type_id) == 'object'){
    //   // questiondata[i].type_id = questiondata[i].type_id.id
    //   // }else{
    //   //   questiondata[i].type_id =  questiondata[i].type_id 
    //   // }
    //   // if(typeof(questiondata[i].header_id) == 'object'){
    //   // questiondata[i].header_id = questiondata[i].header_id.id
    //   // }else{
    //   //   questiondata[i].header_id = questiondata[i].header_id 
    //   // }
    //   let subdata =  questiondata[i]?.sub_question
    //   let dddata = questiondata[i]?.Input_value
    //   let subdddata = subdata[i]?.Input_value
    //   for(let j in subdata){
    //     if(subdata[j]?.id == "" ||subdata[j]?.id == null || subdata[j]?.id == undefined ){
    //       delete subdata[j]?.id
    //     }
    //     if(subdata[j]?.options == "" && subdata[j]?.input_type == "" && subdata[j]?.order == ""){
    //      subdata.length = 0  
    //     }
    //   }
    //   for(let k in dddata){
    //     if(dddata[k]?.id == "" ||dddata[k]?.id == null || dddata[k]?.id == undefined ){
    //       delete dddata[k]?.id
    //     }
    //     if(dddata[k]?.options == "" && dddata[k]?.order == ""){
    //       dddata.length = 0  
    //     }
    //   }
    //   for(let ab in subdddata){
    //     if(subdddata[ab]?.id == "" ||subdddata[ab]?.id == null || subdddata[ab]?.id == undefined ){
    //       delete subdddata[ab]?.id
    //     }
    //     if(subdddata[ab]?.options == ""  && subdddata[ab]?.order == ""){
    //       subdddata.length = 0  
    //     }
    //   }


    // }

    for (let i in questiondata) {
      if (questiondata[i].type_id == '') {
        this.notification.showError('Please select Type')
        return false
      }

      if (questiondata[i].header_id == '') {
        this.notification.showError('Please select Header')
        return false

      }
      if (questiondata[i].text == '') {
        this.notification.showError('Please enter Question')
        return false

      }

      for (let j in questiondata[i].sub_question) {

        if (questiondata[i].sub_question[j].text == '' &&
            questiondata[i].sub_question[j].input_type == '' &&
            questiondata[i].sub_question[j].order == '') {
              this.notification.showError('Please delete Sub questions')
              return false
            }

        if (questiondata[i].sub_question[j].text == '') {
          this.notification.showError('Please enter Question')
          return false

        }

        if (questiondata[i].sub_question[j].input_type == '') {
          this.notification.showError('Please select Input type')
          return false

        }

        if (questiondata[i].sub_question[j].order == '') {
          this.notification.showError('Please enter Order')
          return false

        }

        if (questiondata[i].sub_question[j].input_type == (1 || 3 || 4 || 7)) {
          for (let k in questiondata[i].sub_question[j].Input_value) {

            

            if (questiondata[i].sub_question[j].Input_value[k].options == '') {
              this.notification.showError('Please enter Sub questions Input value options')
              return false

            }

            if (questiondata[i].sub_question[j].Input_value[k].order == '') {
              this.notification.showError('Please enter Sub questions Input value Order')
              return false

            }

          }
          console.log('delted sub dropdonw', questiondata[i].sub_question[j].Input_value)
        }

      }

      if (questiondata[i].input_type == (1 || 3 || 4 || 7)) {
        for (let k in questiondata[i].Input_value) {
          
          if (questiondata[i].Input_value[k].options == '') {
            this.notification.showError('Please enter Input value Option')
            return false

          }

          if (questiondata[i].Input_value[k].order == '') {
            this.notification.showError('Please enter Input value Order')
            return false

          }
        }
        console.log('delted question dropdonw', questiondata[i].Input_value)
      }

      if (questiondata[i].order == '') {
        this.notification.showError('please enter order')
        return false

      }

    }

    for (let i in questiondata) {
      questiondata[i].type_id = questiondata[i].type_id.id

      questiondata[i].header_id = questiondata[i].header_id.id

      if (questiondata[i].text == '' && questiondata[i].input_type == '' && questiondata[i].order == '') {
        delete questiondata[i]

        questiondata.splice(i,1)

      }

      if (questiondata[i].input_type != (1 || 3 || 4 || 7)) {
        for (let k in questiondata[i].Input_value) {
          if (questiondata[i].Input_value[k].options == '' &&
            questiondata[i].Input_value[k].remarks == '' &&
            questiondata[i].Input_value[k].order == '') {
            // delete questiondata[i].Input_value[k]
            questiondata[i].Input_value.splice(k,1)
          }
        }
        console.log('delted question dropdonw', questiondata[i].Input_value)
      }

      if(!questiondata[i].is_score){
        questiondata[i].min=0
        questiondata[i].max=0
      }

      for (let j in questiondata[i].sub_question) {

        if (questiondata[i].sub_question[j].text == '' && questiondata[i].sub_question[j].input_type == '' && questiondata[i].sub_question[j].order == '') {
          console.log('delete question array', questiondata[i].sub_question[j])

          // delete questiondata[i].sub_question[j]
          questiondata[i].sub_question.splice(j,1)

        }

        if (questiondata[i].sub_question[j].input_type != (1 || 3 || 4 || 7)) {
          for (let k in questiondata[i].sub_question[j].Input_value) {
            if (questiondata[i].sub_question[j].Input_value[k].options == '' &&
              questiondata[i].sub_question[j].Input_value[k].remarks == '' &&
              questiondata[i].sub_question[j].Input_value[k].order == '') {

              // delete questiondata[i].sub_question[j].Input_value[k]
          questiondata[i].sub_question[j].Input_value.splice(k,1)


            }
          }
          console.log('delted sub dropdonw', questiondata[i].sub_question[j].Input_value)
        }

        if(!questiondata[i].sub_question[j].is_score){
          questiondata[i].sub_question[j].min=0
          questiondata[i].sub_question[j].max=0
        }

      }
    }
    console.log(questiondata)


    this.atmaservice.getquestionsubmit(questiondata)
      .subscribe(results => {
        if (results.status == "success") {
          this.notification.showSuccess("Success");
          this.shareservice.quesedit.next('')
          this.onSubmit.emit()
          // this.router.navigate(['atma/quessummary'])
        } else {
          this.notification.showError(results.description)
          return false
        }
      })
  }
  onQuestionCancel() {
    this.shareservice.quesedit.next('')

    this.onCancel.emit()
    // this.router.navigate(['atma/quessummary'])
  }


  only_numalpha(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getinputdropdown() {
    this.atmaservice.inputypesdropdown().subscribe(data => {
      this.inputdropdown = data['data'];
    });
  }
}
