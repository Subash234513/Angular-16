import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AtmaService } from '../atma.service';
import { ErrorHandlingService } from '../error-handling.service';
import { NotificationService } from '../notification.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';

import { default as _rollupMoment, Moment } from 'moment';
import { DatePipe, formatDate } from '@angular/common';
import { ShareService } from '../share.service';
import { NgxSpinnerService } from 'ngx-spinner';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

export interface deptlist {
  id: number;
  name: string;
}

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: "standard" }, },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class EvaluationComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('deptauto') matdeptname: MatAutocomplete;
  @ViewChild('deptinput') deptInput;

  @ViewChild('submitclose') submitclose;
  @ViewChild('expiryclose') expiryclose;


  searchtypeform: FormGroup

  vendorid: any

  headerarray = []
  question = []
  questiondata: any = []

  yesornodropdown = [{
    "name": 'YES', "value": 1
  }, {
    "name": 'NO', "value": 0
  }]
  deptlist: any;
  dep_has_next = true;
  dep_has_previous = true;
  dep_currentpage = 1;
  submitarray: any[];
  bool: boolean = true;
  periodlist: any;
  act_or_vend = '';

  mapform: FormGroup

  pdfviewboolean = false
  imgviewboolean = false
  pdfpreviewurl: any
  imgprviewurl: any

  periodicity_half = [
    {
      "data": [],
      "id": 1,
      "text": "Jan to Jun"
    },
    {
      "data": [],
      "id": 2,
      "text": "Jul to Dec"
    }]
  periodicity_quaterly = [
    {
      "data": [],
      "id": 3,
      "text": "Jan to Mar"
    },
    {
      "data": [],
      "id": 4,
      "text": "Apr to Jun"
    },
    {
      "data": [],
      "id": 5,
      "text": "Jul to Sep"
    },
    {
      "data": [],
      "id": 6,
      "text": "Oct to Dec"
    }
  ]
  historydata: any;
  sorteddropdown: any[];
  historydropdown = [];

  currentcategorytype: any;
  current_tabselected: any;
  currenthistorydata: any;
  currenttypename: any;
  currenthistorydate: any;

  periodmodal = false;

  currentsubmitqusttype: any;
  historyshowdata = [];

  constructor(private activateroute: ActivatedRoute, private spinnerservice: NgxSpinnerService, private shareService: ShareService, private notification: NotificationService, private atmaService: AtmaService,
    private errorHandler: ErrorHandlingService, private formbuilder: FormBuilder, public datepipe: DatePipe,) { }

  ngOnInit(): void {

    this.mapform = this.formbuilder.group({
      "Activity": [''],
      "question_type": [''],
      "period": [''],
      "periodicity": [''],
      "remarks": [''],
      "type_status": [''],
    })

    this.activateroute.queryParams.subscribe(
      params => {
        console.log('logs', params)

        if (params['vendorid']) {
          this.vendorid = atob(params['vendorid']);
          console.log('vendorid', this.vendorid)
          console.log('vendoriiiiiddd', params['vendorid'])
          // this.shareService.vendorView.next(this.vendorid);


        }

        if (params['vendor_or_activity']) {
          this.act_or_vend = atob(params['vendor_or_activity'])
          console.log('act_or_vend', this.act_or_vend)
        }
      }
    )

    this.mapform = this.formbuilder.group({
      "Activity": this.act_or_vend,
      "question_type": [''],
      "period": [''],
      "periodicity": [''],
      "remarks": [''],
      "type_status": [''],
    })

    this.searchtypeform = this.formbuilder.group({
      type_id: ['']
    })

    if (this.act_or_vend == '0') {
      this.getquestiondata(this.vendorid)
      // this.getquestionhistory(this.vendorid)
    }
    else {
      this.getactivityleveluestion(this.vendorid)
      // this.getquestionhistory(this.vendorid)

    }
    this.getperiodlists()
    // this.searchtypeform.value.type_id
  }

  // getsummaryarray(value) {

  //   //li alingment table view

  //   console.log(value);
  //   let arr = value['data'];


  //   for (let i = 0; i < arr.length; i++) {
  //     i == 0 ? (arr[i].index = 0) : (arr[i].index = -1);
  //     arr[i]['question_header'] = arr[i]['question_header'].sort((a, b) =>
  //       a.order > b.order ? 1 : -1
  //     );

  //     arr[i]['question'] = arr[i]['question'].sort((a, b) =>
  //       a.header_id.order > b.header_id.order ? 1 : -1
  //     );


  //     for (let k = 0; k < arr[i].question_header.length; k++) {
  //       arr[i].question_header[k].orderquestion = [];

  //       for (let l = 0; l < arr[i].question.length; l++) {

  //         if (arr[i].question_header[k].id == arr[i].question[l].header_id.id) {
  //           arr[i].question_header[k].orderquestion.push(arr[i].question[l]);

  //         } else {

  //           let obj = {
  //             header_id: arr[i].question_header[k].id,
  //             id: '',
  //             question_id:arr[i].question[l].id,
  //             input_type: null,
  //             is_subtext: false,
  //             order: l+1,
  //             sub_options: '',
  //             text: (k==0)? l+1 :'' ,
  //             type_id:arr[i].type_id.id
  //           }

  //           arr[i].question_header[k].orderquestion.push(obj);

  //         }
  //       }
  //     }

  //   }

  //   console.log('arr', arr);
  //   return arr;
  // }

  // getsummaryarray(value) {
  //   console.log(value);
  //   let arr = value['data'];

  //   for (let i = 0; i < arr.length; i++) {
  //     i == 0 ? (arr[i].index = 0) : (arr[i].index = -1);
  //     arr[i]['question_header'] = arr[i]['question_header'].sort((a, b) =>
  //       a.order > b.order ? 1 : -1
  //     );

  //     arr[i]['question'] = arr[i]['question'].sort((a, b) =>
  //       a.header_id.order > b.header_id.order ? 1 : -1
  //     );

  //     arr[i].tablearray = [];

  //     for (let k = 0; k < arr[i].question.length; k++) {
  //       let objtd = {
  //         tdarray: [],
  //       };
  //       arr[i].tablearray.push(objtd);
  //       for (let m = 0; m < arr[i].question_header.length; m++) {
  //         if (arr[i].question_header[m].id == arr[i].question[k].header_id.id) {
  //           //   console.log('header equeal')
  //           let obj1 = {
  //             is_input: arr[i].question_header[m].is_input,
  //             input_type: arr[i].question_header[m].input_type,
  //             tdvalue: arr[i].question[k].text,
  //             question_id: arr[i].question[k].id,
  //             header_id: arr[i].question[k].header_id.id,
  //             vendor_id: this.vendorid,
  //             type_id: arr[i].type_id.id,
  //             sub_options: [],
  //           };

  //           for (let h = 0; h < arr[i].question[k].sub_options.length; h++) {
  //             let subobj = {
  //               tdvalue: k + 1 + '.' + (h + 1) + '  ' + arr[i].question[k].sub_options[h].options,
  //               option_id: arr[i].question[k].sub_options[h].id,
  //               question_id: arr[i].question[k].sub_options[h].question_id,
  //             };
  //             obj1.sub_options.push(subobj);
  //           }

  //           arr[i].tablearray[k].tdarray.push(obj1);
  //         } else {
  //           //   console.log('header not equeal')

  //           let obj2 = {
  //             is_input: arr[i].question_header[m].is_input,
  //             input_type: null,
  //             tdvalue: arr[i].question_header[m].order == 1 ? k + 1 : '',
  //             question_id: arr[i].question[k].id,
  //             header_id: arr[i].question[k].header_id.id,
  //             vendor_id: this.vendorid,
  //             type_id: arr[i].type_id.id,
  //             sub_options: [],
  //           };

  //           for (let h = 0; h < arr[i].question[k].sub_options.length; h++) {
  //             if (arr[i].question_header[m].order != 1) {
  //               let subobj = {
  //                 // answer: (k+1)+'.'+(h+1)+'  '+arr[i].question[k].sub_options[h].options,
  //                 answer: '',
  //                 option_id: arr[i].question[k].sub_options[h].id,
  //                 question_id: arr[i].question[k].sub_options[h].question_id,
  //               };
  //               obj2.sub_options.push(subobj);
  //             }
  //           }

  //           arr[i].tablearray[k].tdarray.push(obj2);
  //         }
  //       }
  //     }
  //     //   console.log(arr[i].tablearray);
  //   }
  //   //   console.log(arr[i].tablearray);


  //   console.log('arr', arr);
  //   return arr;
  // }





  // getsummaryarray(value){
  //   console.log(value);
  //   let arr = value['data'];
  //   console.log(arr);

  //   for(let i=0;i<arr.length;i++){
  //     (i == 0)? arr[i].index = 0: arr[i].index =-1
  //     console.log(arr[i]['question'])
  //     arr[i]['question_header'] = arr[i]['question_header'].sort( (a,b) =>(a.order > b.order ? 1 : -1) )

  //     arr[i]['question'] = arr[i]['question'].sort( (a,b) =>(a.order > b.order ? 1 : -1) )
  //     console.log(arr[i]['question'])

  //     arr[i].answer = [];
  //     for (let j = 0; j < arr[i].question.length; j++) {
  //       let obj = {
  //         quest:arr[i].question[j].text,
  //         question_id: arr[i].question[j].id,
  //         type_id: arr[i].type_id.id,
  //         vendor_id: this.vendorid,
  //         answer: '',
  //         sub_options: [],
  //         tdarray:[]
  //       };

  //       arr[i].answer.push(obj);

  //       for (let k = 0; k < arr[i].question[j].sub_options.length; k++) {
  //         let subobj = {
  //           quest:arr[i].question[j].sub_options[k].options,
  //           option_id: arr[i].question[j].sub_options[k].id,
  //           answer: '',
  //         };
  //         arr[i].answer[j].sub_options.push(subobj)
  //       }

  //       for(let l=0;l<arr[i].question_header.length;l++){

  //         let questiontd={
  //           td_value:(l == 0)? j+1: (l==1)? arr[i].question[j].text: (arr[i].question_header[l].is_input)? '':''  ,
  //           is_input:arr[i].question_header[l].is_input,
  //           input_type:arr[i].question_header[l].input_type,
  //           subtd_value:[]
  //         }
  //         arr[i].answer[j].tdarray.push(questiontd)

  //         // for(let o=0;o< arr[i].question[j].sub_options.length ;o++){

  //         //   let subtd={
  //         //     td_value:(0 == 0)? j+1+'.'+0+1: (o==1)? arr[i].question[j].sub_options[o].options: (arr[i].question_header[l].is_input)? '':''  ,
  //         //     is_input:arr[i].question_header[l].is_input,
  //         //     input_type:arr[i].question_header[l].input_type,

  //         //   }

  //         // }

  //       }

  //     } 

  //   }

  //   console.log('arr',arr);

  //   return arr
  // }

  getsummaryarray(value) {
    console.log(value);
    let arr = value['data'];

    arr = arr.sort((a, b) =>
      a.order > b.order ? 1 : -1
    );

    for (let i = 0; i < arr.length; i++) {
      i == 0 ? (arr[i].index = 0) : (arr[i].index = -1);
      i == 0 ? (arr[i].historyindex = 0) : (arr[i].historyindex = -1)


      arr[i]['question_header'] = arr[i]['question_header'].sort((a, b) =>
        a.order > b.order ? 1 : -1
      );

      arr[i]['question'] = arr[i]['question'].sort((a, b) =>
        a.header_id.order > b.header_id.order ? -1 : 1
      );

      arr[i].tablearray = [];

      if (arr[i].mapping.length == 0) {
        arr[i].mappinghtml = {

          period_start: moment(),
          period_end: (arr[i]?.period?.id == 1) ? moment(moment().add(2, 'months').calendar()) : (arr[i]?.period?.id == 2) ? moment(moment().add(5, 'months').calendar()) : moment(moment().add(11, 'months').calendar()),
          period: arr[i]?.period,
          remarks: '',
          expiry_date: false
        };
      } else {
        arr[i].mappinghtml = {
          id: arr[i].mapping[arr[i]?.mapping?.length - 1]?.id,
          period_start: moment(arr[i]?.mapping[arr[i]?.mapping?.length - 1]?.period_start),
          period_end: moment(arr[i]?.mapping[arr[i]?.mapping?.length - 1]?.period_end),
          // periodicity: arr[i].mapping[0].periodicity?.id,
          period: arr[i]?.mapping[arr[i]?.mapping?.length - 1]?.period,
          remarks: arr[i]?.mapping[arr[i]?.mapping?.length - 1]?.remarks,
          expiry_date: arr[i]?.mapping[arr[i]?.mapping?.length - 1]?.expiry

        }
      }


      i == 0 ? this.getquestionhistory(this.vendorid, arr[i].type_id.id, arr[i].mappinghtml.expiry_date) : ''


      // i ==0 && arr[i].mappinghtml.period_end ? :''

      // (i == 0)? console.log('date',arr[i].mappinghtml.period_end.month(),new Date(arr[i].mappinghtml.period_end).getMonth()):''

      // arr[i].header_split = {};

      // for (let n = 0; n < arr[i].question_header.length; n++) {
      //   arr[i].header_split[arr[i].question_header[n].id] =
      //     arr[i].question_header[n];

      //   arr[i].header_split[arr[i].question_header[n].id]['question'] = [];
      // }

      // for (let p = 0; p < arr[i].question.length; p++) {
      //   arr[i].header_split[arr[i].question[p].header_id.id]['question'].push(
      //     arr[i].question[p]
      //   );
      // }

      for (let k = 0; k < arr[i].question.length; k++) {
        let objtd = {
          tdarray: [],
        };
        arr[i].tablearray.push(objtd);
        for (let m = 0; m < arr[i].question_header.length; m++) {
          if (arr[i].question_header[m].id == arr[i].question[k].header_id.id) {
            //   console.log('header equeal')
            let obj1 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question_header[m].input_type,
              tdvalue: arr[i].question[k].text,
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              filedata: [],


            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              let subobj = {
                answer: k + 1 + '.' + (h + 1) + '  ' + arr[i].question[k].sub_question[h].text,
                option_id: arr[i].question[k].sub_question[h].id,
                question_id: arr[i].question[k].sub_question[h].id,
                input_type: arr[i].question[k].sub_question[h]?.input_type,
                input_value: arr[i].question[k].sub_question[h]?.Input_value


              };
              obj1.sub_question.push(subobj);
            }

            arr[i].tablearray[k].tdarray.push(obj1);
          }
          else if (arr[i].question[k].answer_text.length != 0 && arr[i].question_header[m].is_input == true) {
            let obj2 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question[k].input_type,
              tdvalue: arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].answer,
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              approveranswer: arr[i].question[k].answer_text,
              input_value: arr[i].question[k]?.Input_value,
              filedata: (arr[i].question[k].input_type.name == 'FILE') ? (arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].file_data) ? arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].file_data : [] : [],
              ques_ans_id: arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].id
            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              if (arr[i].question_header[m].order != 1) {
                let subobj = {
                  // answer: (k+1)+'.'+(h+1)+'  '+arr[i].question[k].sub_options[h].options,
                  answer: arr[i].question[k]?.sub_question[h]?.answer_text[arr[i].question[k]?.sub_question[h]?.answer_text?.length - 1]?.answer,
                  option_id: arr[i].question[k].sub_question[h].id,
                  question_id: arr[i].question[k].sub_question[h].id,
                  input_type: arr[i].question[k].sub_question[h]?.input_type,
                  input_value: arr[i]?.question[k]?.sub_question[h]?.Input_value,
                  ques_ans_id: arr[i].question[k]?.sub_question[h]?.answer_text[arr[i].question[k]?.sub_question[h]?.answer_text?.length - 1]?.id
                };
                obj2.sub_question.push(subobj);
              }
            }
            // arr[i].approverindex = arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].approving_level.name
            arr[i].tablearray[k].tdarray.push(obj2);

          }
          else {
            //   console.log('header not equeal')

            let obj2 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question[k].input_type,
              tdvalue: arr[i].question_header[m].order == 1 ? k + 1 : '',
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              input_value: arr[i].question[k]?.Input_value,
              filedata: []

            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              if (arr[i].question_header[m].order != 1) {
                let subobj = {
                  // answer: (k+1)+'.'+(h+1)+'  '+arr[i].question[k].sub_options[h].options,
                  answer: '',
                  option_id: arr[i].question[k].sub_question[h].id,
                  question_id: arr[i].question[k].sub_question[h].id,
                  input_type: arr[i].question[k]?.sub_question[h]?.input_type,
                  input_value: arr[i]?.question[k]?.sub_question[h]?.Input_value

                };
                obj2.sub_question.push(subobj);
              }
            }

            arr[i].tablearray[k].tdarray.push(obj2);
          }
        }
      }
      //   console.log(arr[i].tablearray);
    }



    console.log('arr', arr);
    this.currentsubmitqusttype = arr[0]
    return arr;
  }



  getquestiondata(value) {
    this.spinnerservice.show()

    this.atmaService.getevaluation(value).subscribe(
      result => {
        this.spinnerservice.hide()
        // this.questiondata = result['data']
        this.questiondata = this.getsummaryarray(result)
        // this.getfunction()

      }

    )
  }

  getactivityleveluestion(value) {
    this.atmaService.evaluateactivitysubmit(value).subscribe(
      result => {
        // this.questiondata = result['data']
        this.questiondata = this.getsummaryarray(result)
        // this.getfunction()
      }

    )
  }

  changeindex(index) {
    for (let i = 0; i < this.questiondata.length; i++) {
      (i == index) ? this.questiondata[i].index = index : this.questiondata[i].index = -1;
      (i == index) ? this.getquestionhistory(this.vendorid, this.questiondata[i].type_id.id, this.questiondata[i].mappinghtml.expiry_date) : '';
      (i == index) ? this.current_tabselected = i : '';
      (i == index) ? this.currentsubmitqusttype = this.questiondata[i] : '';
    }
  }

  reset() {
    this.searchtypeform.reset()
  }


  questionsubmit(value, typestatus, renew) {

    // console.log(value);

    // // let submitarray=[]
    // this.submitarray = []
    let submitarray = []
    //   for(let i=0;i<value.question_header.length;i++){
    // li alingment submit

    //     console.log(i)
    //     if(value.question_header[i].is_input){
    //       console.log('fasdf',value.question_header[i])
    //       for(let j=0;j<value.question_header[i].orderquestion.length;j++){
    //         console.log('orderquestion',j)
    //         let obj={
    //           "question_id":value.question_header[i].orderquestion[j].question_id ,
    //           "type_id":value.question_header[i].orderquestion[j].type_id ,
    //           "vendor_id": this.vendorid,
    //           "answer":value.question_header[i].orderquestion[j].text,
    //           "sub_options": []
    //         }
    //         console.log(obj)
    //         this.submitarray.push(obj)
    //       }

    //     }
    //   }
    //   console.log(this.submitarray)

    for (let i = 0; i < value.tablearray.length; i++) {

      for (let j = 0; j < value.tablearray[i].tdarray.length; j++) {

        if (value.tablearray[i].tdarray[j].is_input && value.tablearray[i].tdarray[j].input_type.name != 'FILE') {

          let obj = {
            question_id: value.tablearray[i].tdarray[j].question_id,
            type_id: value.tablearray[i].tdarray[j].type_id,
            // vendor_id: this.vendorid,
            answer: value.tablearray[i].tdarray[j].tdvalue,
            sub_question: [],
            header_id: value.tablearray[i].tdarray[j].header_id,
            activity_id: this.act_or_vend,
            input_type: value.tablearray[i].tdarray[j].input_type?.id,
            input_value: value.tablearray[i].tdarray[j].input_value.map(({ id: option_id, ...rest }) => ({
              option_id,
              ...rest,
            })),
            id: value.tablearray[i].tdarray[j].ques_ans_id,


          };
          (obj.id == '' || obj.id == undefined || renew == 0) ? delete obj.id : ''

          for (let k = 0; k < value.tablearray[i].tdarray[j].sub_question.length; k++) {

            let obj1 = {
              "question_id": value.tablearray[i].tdarray[j].sub_question[k].question_id,
              "answer": value.tablearray[i].tdarray[j].sub_question[k].answer,
              "type_id": value.tablearray[i].tdarray[j].type_id,
              "activity_id": +this.act_or_vend,
              "header_id": value.tablearray[i].tdarray[j].header_id,
              "input_type": value.tablearray[i].tdarray[j].sub_question[k].input_type?.id,
              "input_value": value.tablearray[i].tdarray[j].sub_question[k].input_value.map(({ id: option_id, ...rest }) => ({
                option_id,
                ...rest,
              })),
              "id": value.tablearray[i].tdarray[j].sub_question[k].ques_ans_id
            };


            (obj1.id == '' || obj1.id == undefined || renew == 0) ? delete obj1.id : ''

            obj.sub_question.push(obj1)

          }


          // console.log('hh', obj)

          submitarray.push(obj);

        }
      }
    }


    let finalobj = {
      "activity_flag": +this.act_or_vend,
      "question_type": value.type_id.id,
      "period": value.mappinghtml.period?.id,
      // "periodicity":value.mappinghtml.periodicity,
      "period_start": this.datepipe.transform(value.mappinghtml.period_start, "yyyy-MM-dd"),
      "period_end": this.datepipe.transform(value.mappinghtml.period_end, "yyyy-MM-dd"),

      // "periodicity": this.datepipe.transform(value.mappinghtml.periodicity, 'yyyy-MM-dd'),
      "remarks": value.mappinghtml.remarks,
      "type_status": typestatus,
      "vendor_id": this.vendorid,
      "Activity": null,
      "answers": submitarray,
      "id": value?.mappinghtml?.id
    };

    (typestatus == 1 )? delete finalobj.id :'';

     console.log(this.submitarray);
    console.log(finalobj)

    if (typestatus == 1) {

      this.atmaService.evaluatedraft(finalobj).subscribe(
        result => {
          if (result.message == "Successfully Created") {
            console.log(result)
            this.notification.showSuccess(result.message)
          }
          else {
            this.notification.showError(result)

          }

        }

      )
    }
    else {

      this.atmaService.evaluatesubmit(finalobj).subscribe(
        result => {
          if (result.message == "Successfully Created") {
            console.log(result)
            this.notification.showSuccess(result.message)
            this.submitclose.nativeElement.click()
          }
          else {
            this.notification.showError(result.message)

          }

        }

      )

    }





    console.log('submitted data ', value)
  }

  getdepartment(value, page) {
    this.atmaService.getdeptlists(value, page).subscribe(results => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.deptlist = datas
      this.dep_has_next = datapagination.has_next;
      this.dep_has_previous = datapagination.has_previous;
      this.dep_currentpage = datapagination.index;

    });
  }

  departmentscroll() {

    setTimeout(() => {
      if (
        this.matdeptname &&
        this.autocompleteTrigger &&
        this.matdeptname.panel
      ) {
        fromEvent(this.matdeptname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matdeptname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matdeptname.panel.nativeElement.scrollTop;
            const scrollHeight = this.matdeptname.panel.nativeElement.scrollHeight;
            const elementHeight = this.matdeptname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.dep_has_next === true) {
                this.atmaService.getdeptlists(this.deptInput.nativeElement.value, this.dep_currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.deptlist = this.deptlist.concat(datas);
                    if (this.deptlist.length >= 0) {
                      this.dep_has_next = datapagination.has_next;
                      this.dep_has_previous = datapagination.has_previous;
                      this.dep_currentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });


  }

  public getdeptlist(data?: deptlist): string | undefined {
    return data ? data.name : undefined;
  }

  getapproverchange(i) {
    this.bool = !this.bool
    let value = 1
    if (this.bool) {
      value = 1
    }
    else {

      value = 0

    }

    for (let j = 0; j < this.questiondata[i].tablearray.length; j++) {
      for (let k = 0; k < this.questiondata[i].tablearray[j].tdarray.length; k++) {

        if (this.questiondata[i].tablearray[j].tdarray[k].approveranswer) {
          this.questiondata[i].approverindex = this.questiondata[i].tablearray[j].tdarray[k].approveranswer[value].approving_level.name

          console.log(this.questiondata[i].tablearray[j].tdarray[k].approveranswer)
          this.questiondata[i].tablearray[j].tdarray[k].tdvalue = this.questiondata[i].tablearray[j].tdarray[k].approveranswer[value].answer
        }
      }
    }

  }

  getperiodlists() {
    this.atmaService.getperiodlist().subscribe(result => {
      this.periodlist = result['data']
    })
  }

  getnavbarcolor(val) {
    // if (val?.mapping[0]?.type_status?.id == 2) {
    //   return {
    //     'color': 'green',
    //     'font-weight': 'bold'
    //   }
    // }
    // else if (val?.mapping[0]?.type_status?.id == 1) {
    //   return {
    //     'color': 'black',
    //     'font-weight': 'bold'
    //   }
    // }
    // else {
    //   return
    // }

  }

  period(value) {
    if (value.mappinghtml.period == 1) {
      this.periodicity_quaterly
    }
    else if (value.mappinghtml.period == 2) {
      this.periodicity_half

    }
    else {
      return this.periodicity_half
    }
  }

  getcheckboxchecked(check, value, i, j, k) {
    console.log(check, i, j, k)
    console.log(value)
    // this.questiondata[i].tablearray[j].tdarray[k].checkboxvalue.push(value.id)
    console.log(this.questiondata[i].tablearray[j]);


    if (check == true) {
      // this.questiondata[i].tablearray[j].tdarray[k].checkboxvalue.push(value.id)
    }
    else {
      // this.questiondata[i].tablearray[j].tdarray[k].checkboxvalue.splice( this.questiondata[i].tablearray[j].tdarray[k].checkboxvalue.indexOf(value.id),1)
    }
    // console.log(this.questiondata[i].tablearray[j].tdarray[k])

  };

  fileuploadquestionnaire(files, value, i, j, k) {
    let filesarr = []
    console.log('before', files)
    for (let n = 0; n < files.length; n++) {
      filesarr.push(files[n])
      // this.questiondata[i].tablearray[j].tdarray[k].filedata.push(files[n])

    }


    console.log('before data', value)
    // console.log(filesarr)

    let obj = {
      "question_id": value.question_id,
      "type_id": value.type_id,
      "answer": value.tdvalue,
      "sub_options": value.sub_options,
      "header_id": value.header_id,
      "activity_id": this.act_or_vend,
      "id": (value.filedata.length != 0) ? value.ques_ans_id : ''
    }

    if (obj.id == '') {
      delete obj.id
    }



    console.log('data', obj)

    console.log('data', filesarr)



    this.atmaService.questionnairedocumentupload(this.vendorid, obj, filesarr).subscribe(
      result => {
        if (result.data) {
          console.log(result)
          let file = result.data
          for (let n = 0; n < file.length; n++) {
            this.questiondata[i].tablearray[j].tdarray[k].filedata.push(file[n])
            console.log('questiondata file', this.questiondata[i].tablearray[j].tdarray[k].filedata)
          }



          this.notification.showSuccess('Successfully uploaded')
        }
        else {
          this.notification.showError(result)

        }

      }

    )
  }

  getfiledelete(i, j, k, l) {

    console.log(this.questiondata[i].tablearray[j].tdarray[k].filedata)


    this.atmaService.getfiledelete(this.questiondata[i].tablearray[j].tdarray[k].filedata[l].id).subscribe(
      result => {
        if (result.status == "success") {
          console.log(result)
          this.notification.showSuccess("Succesfully deleted")
          this.questiondata[i].tablearray[j].tdarray[k].filedata.splice(l, 1)

        }
        else {
          this.notification.showError(result)

        }

      }

    )
    console.log(this.questiondata[i].tablearray[j].tdarray[k].filedata)


  }

  getfileview(i, j, k, l) {

    let file_name = this.questiondata[i].tablearray[j].tdarray[k].filedata[l].name
    let id = this.questiondata[i].tablearray[j].tdarray[k].filedata[l].id
    let stringValue = file_name.split('.')
    let filetype = stringValue[stringValue.length - 1]



    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    const headers = { 'Authorization': 'Token ' + token }
    if (stringValue[stringValue.length - 1] === "PNG" || stringValue[stringValue.length - 1] === "png" || stringValue[stringValue.length - 1] === "jpeg" || stringValue[stringValue.length - 1] === "jpg" || stringValue[stringValue.length - 1] === "JPG" || stringValue[stringValue.length - 1] === "JPEG") {


      this.imgviewboolean = true
      this.pdfviewboolean = false

      this.imgprviewurl = environment.apiURL + "venserv/fileview/QUS_" + id + "?token=" + token;

      // this.atmaService.getfiledownload(id)
      // .subscribe((results) => {
      //   console.log("re", results)
      //   let binaryData = [];
      //   binaryData.push(results)
      //   let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      //   let link = document.createElement('a');
      //   this.imgprviewurl = downloadUrl;

      // })
      // console.log('downloadurl',this.imgprviewurl)

    }
    else if (stringValue[stringValue.length - 1] === "pdf") {
      this.pdfviewboolean = true
      this.imgviewboolean = false
      this.atmaService.getfiledownload(id)
        .subscribe((data) => {
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          this.pdfpreviewurl = downloadUrl
          console.log('downloadurl', downloadUrl)
        }, (error) => {
          this.errorHandler.handleError(error);
          this.imgviewboolean = false
          this.pdfviewboolean = false


        })
    }
    else {
      this.imgviewboolean = false
      this.pdfviewboolean = false
      this.fileDownload(id, file_name, filetype)
    }


  }

  getdownload(i, j, k, l) {
    let file_name = this.questiondata[i].tablearray[j].tdarray[k].filedata[l].name
    let id = this.questiondata[i].tablearray[j].tdarray[k].filedata[l].id
    let stringValue = file_name.split('.')
    let filetype = stringValue[stringValue.length - 1]
    this.fileDownload(id, file_name, filetype)

  }


  fileDownload(id, fileName, filetype) {
    this.atmaService.getfiledownload(id)
      .subscribe((results) => {
        console.log("re", results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.click();
      })
  }


  chosenYearHandler(normalizedYear: Moment, i) {
    const ctrlValue = this.questiondata[i].mappinghtml.periodicity
    ctrlValue.year(normalizedYear.year());
    // this.date.setValue(ctrlValue);
    this.questiondata[i].mappinghtml.periodicity = ctrlValue
    console.log(this.questiondata[i].mappinghtml)

  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, i) {
    const ctrlValue = this.questiondata[i].mappinghtml.periodicity
    ctrlValue.month(normalizedMonth.month());
    // this.date.setValue(ctrlValue);

    this.questiondata[i].mappinghtml.periodicity = ctrlValue
    datepicker.close();
    console.log(this.questiondata[i].mappinghtml)
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, i) {

    this.questiondata.forEach(element => {
      if (element.index != -1) {
        i = element.index
      }
    });

    console.log(normalizedMonthAndYear)
    const ctrlValue = normalizedMonthAndYear
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    datepicker.close();
    this.questiondata[i].mappinghtml.period_start = ctrlValue
    // console.log(this.questiondata[i].mappinghtml.periodicity.format("YYYY-MM-DD"))
    let date = moment(this.questiondata[i].mappinghtml.period_start)
    if (this.questiondata[i].mappinghtml?.period?.id == 1) {
      this.questiondata[i].mappinghtml.period_end = moment(date.add(2, 'months').calendar())
    }
    else if (this.questiondata[i].mappinghtml.period?.id == 2) {
      this.questiondata[i].mappinghtml.period_end = moment(date.add(5, 'months').calendar())
    }
    else {
      this.questiondata[i].mappinghtml.period_end = moment(date.add(11, 'months').calendar())

    }
    console.log(this.questiondata[i].mappinghtml)

  }

  setMonthAndYearend(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, i) {



    console.log(normalizedMonthAndYear)
    const ctrlValue = normalizedMonthAndYear
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    datepicker.close();
    this.questiondata[i].mappinghtml.remarks = ctrlValue
    // console.log(this.questiondata[i].mappinghtml)
    // console.log(this.questiondata[i].mappinghtml.periodicity.format("YYYY-MM-DD"))
    // console.log(moment(this.questiondata[i].mappinghtml.periodicity.format("YYYY-MM-DD")).add(3, 'months').calendar())
    // this.questiondata[i].mappinghtml.remarks=moment(this.questiondata[i].mappinghtml.periodicity.format("MM-YYYY")).add(3, 'months').calendar()
  }


  periodselect(i) {
    let date = moment(this.questiondata[i].mappinghtml.period_start)
    console.log("function start", this.questiondata[i].date)

    if (this.questiondata[i].mappinghtml.period == 1) {
      console.log('1')
      this.questiondata[i].mappinghtml.period_end = moment(date.add(2, 'months').calendar())
    }
    else if (this.questiondata[i].mappinghtml.period == 2) {
      console.log('2');

      this.questiondata[i].mappinghtml.period_end = moment(date.add(5, 'months').calendar())
    }
    else {
      this.questiondata[i].mappinghtml.period_end = moment(date.add(11, 'months').calendar())

    }

  }

  getquestionhistory(value, cat, history) {

    if (history) {
      // document.getElementById("expiryopen").click();
      setTimeout(() => {
        document.getElementById("expiryopen").click();

      }, 1000);

    }
    this.spinnerservice.show()

    this.atmaService.getquestionhistory(value, cat).subscribe(
      result => {
        this.spinnerservice.hide()

        this.historydata = result
        console.log(result)
        this.historyfun(result)

        this.historyshowdata = this.historyfunction(result)


      })

  }

  historyfunction(value) {
    let historyarr = []

    let date = value.date
    let typedata = value.question_data

    for (let i = 0; i < date.length; i++) {

      for (let j = 0; j < typedata.length; j++) {

        if (date[i].created_date == typedata[j].question[0].created_date) {

          let obj = {
            date: this.datepipe.transform(date[i].created_date, 'MM/yyyy'),
            questiondata: this.gethistorydata(typedata[i])[0]
          }

          historyarr.push(obj)

        }

      }


    }

    console.log('historyarra', historyarr)
    return historyarr

  }

  historyfun(value) {
    console.log('before empty array', this.historydropdown)

    this.historydropdown = []
    console.log('after empty array', this.historydropdown)

    let date = value.date
    for (let i = 0; i < date.length; i++) {
      let dates = String(this.datepipe.transform(date[i].created_date, 'MM/yyyy'))
      let obj = {
        date: dates,
        non_transfor_date: date[i].created_date
      }

      this.historydropdown.push(obj)
    }
    console.log(this.historydropdown)



  }

  historyselect(value, expiry_date) {
    for (let i = 0; i < this.historydata.question_data.length; i++) {
      if (value == this.historydata.question_data[i].question[0].created_date) {
        // this.currentcategorytype = this.questiondata[this.current_tabselected]
        // this.questiondata[this.current_tabselected] = this.gethistorydata(this.historydata.question_data[i])

        this.currenthistorydata = this.gethistorydata(this.historydata.question_data[i])
        console.log(this.currenthistorydata)
      }
    }
  }


  fulldata = ''

  gethistorydata(value) {
    console.log(value);
    value.order = this.current_tabselected
    this.currenthistorydate = String(this.datepipe.transform(value?.question[0]?.created_date, 'MM/yyyy'))
    this.currenttypename = value?.type_id?.name
    this.fulldata = this.currenttypename + " - " + String(this.currenthistorydate)
    console.log("date nd type", this.currenthistorydate, this.currenttypename)
    let arr = [value];



    arr = arr.sort((a, b) =>
      a.order > b.order ? 1 : -1
    );

    for (let i = 0; i < arr.length; i++) {
      i == 0 ? this.current_tabselected : (arr[i].index = -1);
      arr[i]['question_header'] = arr[i]['question_header'].sort((a, b) =>
        a.order > b.order ? 1 : -1
      );

      arr[i]['question'] = arr[i]['question'].sort((a, b) =>
        a.header_id.order > b.header_id.order ? -1 : 1
      );

      arr[i].mapping = [
        [
          {
            "Activity": null,
            "id": 12,
            "period": {
              "id": 1,
              "name": "QUERTERLY"
            },
            "period_end": "2022-10-26 00:00:00+00:00",
            "period_start": "2022-08-26 00:00:00+00:00",
            "question_type": 20,
            "remarks": "asdf",
            "type_status": {
              "id": 2,
              "text": "Approve"
            },
            "vendor": 16
          }
        ]
      ]
      arr[i].tablearray = [];

      arr[i].mappinghtml = {
        period_start: moment(),
        period_end: (arr[i]?.period?.id == 1) ? moment(moment().add(2, 'months').calendar()) : (arr[i]?.period?.id == 2) ? moment(moment().add(5, 'months').calendar()) : moment(moment().add(11, 'months').calendar()),
        period: 1,
        remarks: '',
      }

      // if (arr[i].mapping.length == 0) {
      //   arr[i].mappinghtml = {

      //     period_start: moment(),
      //     period_end: (arr[i]?.period?.id == 1) ? moment(moment().add(2, 'months').calendar()) : (arr[i]?.period?.id == 2) ? moment(moment().add(5, 'months').calendar()) : moment(moment().add(11, 'months').calendar()),
      //     period: arr[i]?.period,
      //     remarks: '',
      //   };
      // } else {
      //   arr[i].mappinghtml = {
      //     id: arr[i].mapping[0].id,
      //     period_start: moment(arr[i].mapping[0].period_start),
      //     period_end: moment(arr[i].mapping[0].period_end),
      //     // periodicity: arr[i].mapping[0].periodicity?.id,
      //     period: arr[i].mapping[0].period,
      //     remarks: arr[i].mapping[0].remarks
      //   }
      // }


      // arr[i].header_split = {};

      // for (let n = 0; n < arr[i].question_header.length; n++) {
      //   arr[i].header_split[arr[i].question_header[n].id] =
      //     arr[i].question_header[n];

      //   arr[i].header_split[arr[i].question_header[n].id]['question'] = [];
      // }

      // for (let p = 0; p < arr[i].question.length; p++) {
      //   arr[i].header_split[arr[i].question[p].header_id.id]['question'].push(
      //     arr[i].question[p]
      //   );
      // }

      for (let k = 0; k < arr[i].question.length; k++) {
        let objtd = {
          tdarray: [],
        };
        arr[i].tablearray.push(objtd);
        for (let m = 0; m < arr[i].question_header.length; m++) {
          if (arr[i].question_header[m].id == arr[i].question[k].header_id.id) {
            //   console.log('header equeal')
            let obj1 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question_header[m].input_type,
              tdvalue: arr[i].question[k].text,
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              filedata: [],


            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              let subobj = {
                answer: k + 1 + '.' + (h + 1) + '  ' + arr[i].question[k].sub_question[h].text,
                option_id: arr[i].question[k].sub_question[h].id,
                question_id: arr[i].question[k].sub_question[h].id,
                input_type: arr[i].question[k].sub_question[h]?.input_type,
                input_value: arr[i].question[k].sub_question[h]?.Input_value,
                // answer: '',


              };
              obj1.sub_question.push(subobj);
            }

            arr[i].tablearray[k].tdarray.push(obj1);
          }
          else if (arr[i].question[k].answer_text.length != 0 && arr[i].question_header[m].is_input == true) {
            let obj2 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question[k].input_type,
              tdvalue: arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].answer,
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              approveranswer: arr[i].question[k].answer_text,
              input_value: arr[i].question[k]?.Input_value,
              // filedata: (arr[i].question[k].input_type.name == 'FILE') ? (arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].file_data) ? arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].file_data : [] : [],
              // ques_ans_id: arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].id
            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              if (arr[i].question_header[m].order != 1) {
                let subobj = {
                  answer: '',
                  
                  // answer: (k+1)+'.'+(h+1)+'  '+arr[i].question[k].sub_options[h].options,
                  // answer: arr[i].question[k]?.sub_question[h]?.answer_text[arr[i].question[k]?.sub_question[h]?.answer_text?.length - 1]?.answer,
                  option_id: arr[i].question[k].sub_question[h].id,
                  question_id: arr[i].question[k].sub_question[h].id,
                  input_type: arr[i].question[k].sub_question[h]?.input_type,
                  input_value: arr[i]?.question[k]?.sub_question[h]?.Input_value,
                  // ques_ans_id: arr[i].question[k]?.sub_question[h]?.answer_text[arr[i].question[k]?.sub_question[h]?.answer_text?.length - 1]?.id
                };
                obj2.sub_question.push(subobj);
              }
            }
            // arr[i].approverindex = arr[i].question[k].answer_text[arr[i].question[k].answer_text.length - 1].approving_level.name
            arr[i].tablearray[k].tdarray.push(obj2);

          }
          else {
            //   console.log('header not equeal')

            let obj2 = {
              is_input: arr[i].question_header[m].is_input,
              input_type: arr[i].question[k].input_type,
              tdvalue: arr[i].question_header[m].order == 1 ? k + 1 : '',
              question_id: arr[i].question[k].id,
              header_id: arr[i].question[k].header_id.id,
              vendor_id: this.vendorid,
              type_id: arr[i].type_id.id,
              sub_question: [],
              input_value: arr[i].question[k]?.Input_value,
              filedata: []

            };

            for (let h = 0; h < arr[i].question[k].sub_question.length; h++) {
              if (arr[i].question_header[m].order != 1) {
                let subobj = {
                  // answer: (k+1)+'.'+(h+1)+'  '+arr[i].question[k].sub_options[h].options,
                  answer: '',
                  option_id: arr[i].question[k].sub_question[h].id,
                  question_id: arr[i].question[k].sub_question[h].id,
                  input_type: arr[i].question[k]?.sub_question[h]?.input_type,
                  input_value: arr[i]?.question[k]?.sub_question[h]?.Input_value

                };
                obj2.sub_question.push(subobj);
              }
            }

            arr[i].tablearray[k].tdarray.push(obj2);
          }
        }
      }
      //   console.log(arr[i].tablearray);
    }



    console.log('arr', arr);

    return arr;
  }

  getrenew() {
    // arr.map(object => object.id).indexOf('c');
    // console.log(this.questiondata.indexOf(this.currentsubmitqusttype))
    let index = this.questiondata.indexOf(this.currentsubmitqusttype)
    this.questiondata[index].mapping[this.questiondata[index].mapping.length - 1].type_status = { "id": 1, "text": 'Draft' }
    this.questiondata[index].mapping[this.questiondata[index].mapping.length - 1].remarks = ''

    for (let i = 0; i < this.questiondata[index].tablearray.length; i++) {

      for (let j = 0; j < this.questiondata[index].tablearray[i].tdarray.length; j++) {

        if (this.questiondata[index].tablearray[i].tdarray[j].is_input) {

          this.questiondata[index].tablearray[i].tdarray[j].tdvalue = ''
          this.questiondata[index].tablearray[i].tdarray[j].ques_ans_id = ''
          this.questiondata[index].tablearray[i].tdarray[j].filedata = []

          for (let k = 0; k < this.questiondata[index].tablearray[i].tdarray[j].sub_question.length; k++) {

            this.questiondata[index].tablearray[i].tdarray[j].sub_question[k].answer = ''
            // this.questiondata[index].tablearray[i].tdarray[j].sub_question[k].question_id=''
            // this.questiondata[index].tablearray[i].tdarray[j].sub_question[k].filedata=[]


          }


        }

      }
    }

    this.expiryclose.nativeElement.click()
  }

  historychangeindex(index) {
    for (let i = 0; i < this.questiondata.length; i++) {
      (i == index) ? this.questiondata[i].historyindex = index : this.questiondata[i].historyindex = -1;

    }
  }

  historyopen() {

    this.questiondata.forEach(element => {
      if (element.historyindex != -1) {

        this.getquestionhistory(this.vendorid, element.type_id.id, false)

      }
    });


  }

}
