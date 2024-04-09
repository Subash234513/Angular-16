import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-pay-structure',
  templateUrl: './pay-structure.component.html',
  styleUrls: ['./pay-structure.component.scss']
})
export class PayStructureComponent implements OnInit {

  constructor(private fb:FormBuilder) { }
  empdetails: FormGroup;
  isDisabled: boolean = true;
  gradeList: any;
  paydata: any;
  groupedData: any
  apiResponse: any;
  matcardsBySegment: { [segmentName: string]: any[] } = {};
  formArrayData: any[] = [];
  paycomponentData: any;
  segments = {};
  pfSelection : string;
  emp_info : any;
  isExpanded: boolean =  true;
  isSegmenShow: boolean = false
  segmentData: any = {};
  dynamicform: FormGroup;
  ngOnInit(): void {
    this.empdetails = this.fb.group({
      empName: '',
      gradelevel: '',
      roles: '',
      GrossRemuneration:this.fb.array([
        
        this.fb.group({
            Grossper:'38.00',
            monthGrossGenerationFirst:'10000',
            yrGrossGenerationFirst:'10000'
        }),

    //     this.fb.group({
    //       Grossper:'38.00',
    //       monthGrossGenerationFirst:'10000',
    //       yrGrossGenerationFirst:'10000'
    //   }),
    //   this.fb.group({
    //     Grossper:'13.50',
    //     monthGrossGenerationFirst:'10000',
    //     yrGrossGenerationFirst:'10000'
    // }),
  //   this.fb.group({
  //     GrossName:'',
  //     monthGrossGenerationFirst:'',
  //     yrGrossGenerationFirst:''
  // }),
        // this.fb.group({
        //     GrossName:new FormControl(),
        //     monthGrossGenerationFirst:new FormControl(),
        //     yrGrossGenerationFirst:new FormControl()
        // })
      ]),
      showRemuneration:this.fb.array([
        this.fb.group({
          Grossper:'38.00',
          monthGrossGenerationFirst:'10000',
          yrGrossGenerationFirst:'10000'
      }),
      ]),
      // monthRemun:  { value: null, disabled: this.isDisabled },
      // yrRemun: { value: null, disabled: this.isDisabled },
      // monthGross: '',
      // yrGross: { value: null, disabled: this.isDisabled },
      // basicpercnt: [50],
      // monthBasic: '',
      // monthAllow: '',
      // allowpercnt: [50],
      // monthsplRemun: { value: null, disabled: this.isDisabled },
      // yrsplRemun: { value: null, disabled: this.isDisabled },
      // monthSegA: '',
      // yrSegA: { value: null, disabled: this.isDisabled },
      // monthSegB: '',
      // yrSegB: { value: null, disabled: this.isDisabled },
      // // yrSegX: '',
      // monthDeduct: { value: null, disabled: this.isDisabled },
      // yrDeduct: { value: null, disabled: this.isDisabled },
      // monthD: '',
      monthtakeHome: '10000',
      monthGrossGeneration:'',
      yrGrossGeneration:'',
      monthGrossGenerationFirst:'12000',
      monthGrossGenerationSecond:'20000',
      monthGrossGenerationThird:'30000',
      monthGrossGenerationFourth:'40000',
      yrGrossGenerationFirst:'',
      yrGrossGenerationSecond:'',
      yrGrossGenerationThird:'',
      yrGrossGenerationFourth:'',
      yrtakeHome: { value: null, disabled: this.isDisabled },
      // monthCTC: { value: null, disabled: this.isDisabled },
      // yrCTC: { value: null, disabled: this.isDisabled },
      // monthSegC: '',
      // yrSegC: { value: null, disabled: this.isDisabled },
      // monthSegE: '',
      // monthCC: { value: null, disabled: this.isDisabled },
      // yrCC: { value: null, disabled: this.isDisabled },
      // stmonthDeduct: { value: null, disabled: this.isDisabled },
      // styrDeduct : { value: null, disabled: this.isDisabled },
      // stmonthPF: { value: null, disabled: this.isDisabled},
      // pfSelect:'',
      // esiSelect:'',
      // stmonthESI: { value: null, disabled: this.isDisabled},
      // monthCCPF: { value: null, disabled: this.isDisabled},
      // monthCCESI: { value: null, disabled: this.isDisabled},
     
    
      
    })
  }
  array(){
    let array=new FormGroup({
      GrossName:new FormControl(''),
      monthGrossGenerationFirst:new FormControl(''),
      yrGrossGenerationFirst:new FormControl('')

    })
  }
  foods= [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  hide:boolean=false
  show:boolean=false
  Gross(){
    this.hide= !this.hide
    let n=this.sampledata[0]
    console.log(this.sampledata[0]['paycompoent_dta'][0]['paycomponent_name'])
  }
  showG(){
    this.show=!this.show
  }
 
  sampledata=[
    {
        "component_type": "salary",
        "segment_id": 5,
        "segment_name": "Basic",
        "segment_percentage": "61.00",
        "paycompoent_dta": [
            {
                "paycomponent": 2,
                "paycomponent_name": "HRA",
                "paycomponent_percentage": "38.00"
            },
            {
                "paycomponent": 1,
                "paycomponent_name": "Basic & DA",
                "paycomponent_percentage": "38.00"
            },
            {
                "paycomponent": 6,
                "paycomponent_name": "LTA",
                "paycomponent_percentage": "13.50"
            }
        ]
    },
    {
        "component_type": "salary",
        "segment_id": 6,
        "segment_name": "Allowance",
        "percentage": "39.00",
        "paycompoent_dta": [
            {
                "paycomponent": 3,
                "paycomponent_name": "Conveyance",
                "paycomponent_percentage": "10.00"
            },
            {
                "paycomponent": 4,
                "paycomponent_name": "Telephone",
                "paycomponent_percentage": "5.00"
            }
        ]
    },
    {
        "component_type": "other earning",
        "segment_id": 7,
        "segment_name": "annual incentive",
        "percentage": "3.00",
        "paycompoent_dta": [
            {
                "paycomponent": 5,
                "paycomponent_name": "Medical",
                "paycomponent_percentage": "8.00"
            }
        ]
    },
    // [
    //     {
    //         "template_name": "Trainee",
    //         "grade": 2
    //     }
    // ]
]
Sampledatafirst=this.sampledata[0]['paycompoent_dta']

}

