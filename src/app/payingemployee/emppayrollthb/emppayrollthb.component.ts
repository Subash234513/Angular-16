import { Component, Directive, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { PayingempShareService } from '../payingemp-share.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { BooleanLiteral } from 'typescript';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
@Component({
  selector: 'app-emppayrollthb',
  templateUrl: './emppayrollthb.component.html',
  styleUrls: ['./emppayrollthb.component.scss']
})
export class EmppayrollthbComponent implements OnInit, OnChanges {
  myControl: FormControl = new FormControl();
  seg_id = false;
  payrollgenform: FormGroup;
  emp_paysrtuctureform: any;
  gross_pay = 0;
  emp_esi: number;
  emppf: number;
  empesi: number;
  is_company = false;
  pf_cal_prec: number;
  pfsegment_prec: number;
  esisement_prec: number;
  esi_cal_prec: number;
  is_paycomponent = false;
  paycomponent_data = [];
  employee_data: any;
  gradedata: any;
  finaldata: any;
  list = []
  emp_id: any;
  is_pf: any;
  ctc_amout = 0;
  pfcalamount: number;
  esicalamount: number;
  no_esi = false
  std_pf = false
  vpf = false
  sum: number
  amount: number
  toaster: any
  is_esi = true
  totalCompany: number
  totalEmployee: number
  paycomponentvalue = []
  totalCompanyYearly: number;
  totalEmployeeYearly: number;
  deduction_type_data: any;
  paycomponentflagmaster: any;
  finalCC: any;
  pfFinal: any;
  esiFinal: any;
  PercentageValue = []
  indexes = [];
  datas: any
  emp_grade_id: any;
  selectedBonusType: any;
  selectedBonusTypes: any;
  yrlyAmt: any;
  deductPatch: any;
  bonusPatch: any;
  deductPatchYr: any;
  bonusPatchYr: any;
  yearly_amounts: number;
  yearly_amountss: number;
  yearly_amoun: number;
  Sumd1: number;
  Sumb1: number;
  bonusValue: number;
  bonusValueY: any;
  deductValue: number;
  deductValueY: any;
  is_pfs: boolean;
  yrlyAmts: number;
  showDedcutEntry : boolean = true;
  deductPatchrow: boolean = false;
  typeVal: any;
  takeHomeWBDMon: number;
  yrlyAmtd: number;
  totalMon: number;
  amountD: any;
  typeD: any;
  totalMons: number;
  bonusTypes: any;
  yrlyAmtD: number;
  amountYearlyControls: any;
  templatedrop: any;
  takeHomeYr: number;
  selectedTemplateId: any;
  Sumy2: number;
  newsum: number;
  sumdata: any;
  revisePay : FormGroup;
  selectedOption : any ;
  enableRevise: boolean = true;
  monthlyTakeHome: any;
  calcAmount: number;
  showPercent: boolean = false;
  showRupee: boolean = false;
  yrcalcAmount: number;
  showpreference: boolean = false;
  intialCTC: number;
  constructor(private http: HttpClient, private fb: FormBuilder, private payrollShareService: PayingempShareService, private apiservice: PayingempService, private router: Router, private toast: ToastrService, 
    private datepipe: DatePipe,) {
    let emp_info = this.payrollShareService.empView_id.value
    this.employee_data = emp_info;
    this.list = emp_info
    this.emp_id = emp_info?.id;
    this.payrollgenform = this.fb.group({
      employee_id: [emp_info?.id],
      employee_name: [emp_info.employee_name],
      pf: [''],
      esi: [''],
      take_home: new FormControl(0, [Validators.required]),
      takehome_monthly: [''],
      cmp_percentage: [0],
      cmp_monthly: [0],
      cmp_yearly: [0],
      emp_percentage: [0],
      emp_monthly: [0],
      emp_yearly: [0],
      takehome_yearly: [''],
      gross_pay_monthly: [''],
      gross_pay_yearly: [''],
      gross_pay: [0],
      ctc_monthly: [''],
      ctc_yearly: [''],
      standard_ctc: [''],
      companycontribution: new FormArray([this._cc_contribution()]),
      employeecontribution: new FormArray([this._pf_contribution()]),
      deductions : new FormArray([this._deductions()]),
      is_pf: [false],
      segment_data: new FormArray([this._CreateSegmentroup(),
      ]),
      takehomeWBD: new FormControl(0, [Validators.required]),
      takehome_monthlyWBD: [''],
      takehome_yearlyWBD: [''],
    })
    const totall = this.payrollgenform.get('companycontribution') as FormArray
    let n = 0
    for (let z in totall.value) {
      n += Number(this.payrollgenform.value.companycontribution[z].amount)
    }
    console.log('totalll', n)
    this.totalCompany = n
    const totall2 = this.payrollgenform.get('employeecontribution') as FormArray
    let s = 0
    for (let z in totall2.value) {
      s += Number(this.payrollgenform.value.employeecontribution[z].amount)
    }
    console.log('totalll', s)
    this.totalEmployee = s

    this.getgradeinfo();
    this.deduction_type();

  }
  showpaycom(data, index) {
    this.paycomponent_data = data[index].paycomponent_data;
    this.seg_id = data[index].segment_name;
    if (this.payrollgenform.value.segment_data[index].is_paycomponent) {
      (this.payrollgenform.get('segment_data') as FormArray).get([index, 'is_paycomponent']).patchValue(false);
    }
    else {
      (this.payrollgenform.get('segment_data') as FormArray).get([index, 'is_paycomponent']).patchValue(true)
    }
  }
  showhidecc(data) {
    if (this.is_company) {
      this.is_company = false
    }
    else {
      this.is_company = true;
    }
  }

  showhideec(data) {
    if (this.is_pf) {
      this.is_pf = false;
    }
    else {
      this.is_pf = true;
    }
  }
  showhideecs(data) 
  {
    this.is_pfs = !this.is_pfs;
  }
  ngOnInit(): void {
    this.myControl.valueChanges.pipe(switchMap(value => this.apiservice.getGradeApi(value, 1))).subscribe(data => {
      this.gradedata = data['data'];
    })
    if (this.employee_data?.grade) {
      this.myControl.setValue(this.employee_data.grade.name)
      this.LevelClick(this.employee_data.grade)
      // this.getgradebasedemployeeinfo(this.employee_data.grade.id)
      console.log('ONitID', this.employee_data.grade.id)
      this.validation()
    }
    console.log('ONit', this.employee_data)
    console.log('GradeData', this.gradedata)
    console.log('takehome', this.payrollgenform.get('take_home').value)
    // this.gettemplatedata();

    this.revisePay = this.fb.group({
        revPercent : '',
        revValue : '',
        monthyear:'',
        revisedate:'',
      })
  }
  ngOnChanges(changes: SimpleChanges): void {
     }
  _check(value, flag) {
    if (flag == 'std_pf') {
      this.std_pf = (value);    
        this.getAmount(this.payrollgenform.get('take_home').value);      
    }
    else if (flag == 'no_esi') {
      this.no_esi = (value);
          this.getAmount(this.payrollgenform.get('take_home').value);
    }
    else if (flag == 'vpf') {
      this.vpf = value;
        this.getAmount(this.payrollgenform.get('take_home').value);      
    }
  }
  validation() {
    const totall = this.payrollgenform.get('companycontribution') as FormArray
    let n = 0
    for (let z in totall.value) {
      n += Number(this.payrollgenform.value.companycontribution[z].amount)
    }
    console.log('totalll', n)
    this.totalCompany = n

    const totall2 = this.payrollgenform.get('employeecontribution') as FormArray
    let r = 0
    for (let z in totall2.value) {
      r += Number(this.payrollgenform.value.employeecontribution[z].amount)
    }
    this.totalEmployee = r
  }
  LevelClick(name) {
    // this.getgradebasedemployeeinfo(name.id)
    this.emp_grade_id=name.id
    this.gettemplatedata();
    console.log('LEvelclick', name.id);
    console.log('success')
    this.payrollgenform.reset();
    this.validation();

  }
  _CreateSegmentroup(): FormGroup {
    return new FormGroup({
      'segment_id': new FormControl(''),
      'component_type': new FormControl(''),
      'segment_name': new FormControl(''),
      'segment_percentage': new FormControl(''),
      'amount': new FormControl(''),
      'amount_yearly': new FormControl(''),
      'is_paycomponent': new FormControl(false),
        'paycomponent_data': new FormArray([this._CreatePaycomponentgp()]),
      'paycomponent_type': new FormControl(''),
    })
  }
  private _CreatePaycomponentgp(): any {
    return new FormGroup({
      'paycomponent': new FormControl(''),
      'paycomponent_name': new FormControl(''),
      'paycomponent_percentage': new FormControl(''),
      'pf': new FormControl(''),
      'paycom': new FormControl([]),
      'amount': new FormControl(0),
      'amount_yearly': new FormControl(0),
      'segment': new FormControl(''),
      'company_contribution': new FormControl(false),
      'type': new FormControl(''),
      'segment_percentage': new FormControl(''),
      'from_date': new FormControl(null),
       'to_date': new FormControl(null)
    })
  }
  private _cc_contribution(): any {
    return new FormGroup({
      'id': new FormControl(''),
      'paycomponent': new FormControl(''),
      'paycomponent_name': new FormControl(''),
      'paycomponent_percentage': new FormControl(''),
      'paycomponent_type': new FormControl(1),
      'company_contribution': new FormControl(true),
      'deduction_data': new FormControl([]),
      'amount': new FormControl(''),
      'amount_yearly': new FormControl(''),
      'max_amount': new FormControl(''),
      'sal_amount': new FormControl(''),
    })
  }
  private _pf_contribution(): any {
    return new FormGroup({
      'id': new FormControl(''),
      'paycomponent_id': new FormControl(''),
      'paycomponent_percentage': new FormControl(0.00),
      'paycomponent_type': new FormControl(1),
      'company_contribution': new FormControl(false),
      'deduction_data': new FormControl([]),
      'amount': new FormControl(''),
      'amount_yearly': new FormControl(''),
      'paycomponent_name': new FormControl(''),
      'max_amount': new FormControl(''),
      'sal_amount': new FormControl(''),
      'is_customdeduct' : new FormControl(false)
    })
  }
  private _deductions(): any {
    return new FormGroup({
      'id': new FormControl(''),
      'paycomponent_id': new FormControl(''),
      'paycomponent_percentage': new FormControl(0.00),
      'paycomponent_type': new FormControl(1),
      'company_contribution': new FormControl(false),
      'deduction_data': new FormControl([]),
      'amount': new FormControl(''),
      'amount_yearly': new FormControl(''),
      'paycomponent_name': new FormControl(''),
      'max_amount': new FormControl(''),
      'sal_amount': new FormControl(''),
      'is_customdeduct' : new FormControl(false),
      'type': new FormControl(''), 
      'from_date': new FormControl(null),
      'to_date': new FormControl(null)
      
    })
  }
  segmentdata() {
    if (this.finaldata?.id) {
      this.payrollgenform.addControl("id", new FormControl(this.finaldata?.id))
    }
    this.monthlyTakeHome = this.finaldata?.take_home
    this.payrollgenform.patchValue({
      "employee_id": this.finaldata?.employee_id,
      "standard_ctc": this.finaldata?.standard_ctc,
      "gross_pay": this.finaldata?.gross_pay,
      "pf_type": 1,
      "take_home": this.finaldata?.take_home,
      "takehome_monthly": this.finaldata?.take_home,
      "takehome_yearly": (parseFloat(this.finaldata?.take_home) * 12),
      "gross_pay_monthly": this.finaldata?.gross_pay,
      "gross_pay_yearly": (parseFloat(this.finaldata?.gross_pay) * 12),
      "ctc_monthly": this.finaldata?.standard_ctc,
      "ctc_yearly": (parseFloat(this.finaldata?.standard_ctc) * 12),
    });
    (this.payrollgenform.get('segment_data') as FormArray).clear();
    console.log('final data', this.finaldata)
    this.finaldata.segment_details.forEach((data) => {
      const segmentform = this._CreateSegmentroup();
      console.log('SegmentData', data)
      if(data?.paycomponent_type === 'Deductions')
      {
        this.deductPatch = data?.paycomponent_data[0]?.amount;
        if(data?.paycomponent_data[0]?.type == 1)
        {
        this.deductPatchYr = this.deductPatch * 4;
        this.deductPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 2)
        {
        this.deductPatchYr = this.deductPatch * 2;
        this.deductPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 3)
        {
        this.deductPatchYr = this.deductPatch ;
        this.deductPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 4)
        {
        this.deductPatchYr = this.deductPatch * 12;
        }
      }
      if(data?.paycomponent_type == 'Monthly Bonus')
      {
        this.bonusPatch = data?.paycomponent_data[0]?.amount;
        if(data?.paycomponent_data[0]?.type == 1)
        {
        this.bonusPatchYr = this.bonusPatch * 4;
        this.bonusPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 2)
        {
        this.bonusPatchYr = this.bonusPatch * 2;
        this.bonusPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 3)
        {
        this.bonusPatchYr = this.bonusPatch ;
        this.bonusPatch = 0;
        }
        else if(data?.paycomponent_data[0]?.type == 4)
        {
        this.bonusPatchYr = this.bonusPatch * 4;
        }
      }     
      if(data.paycomponent_data)
      {
      segmentform.patchValue(data);
      if (this.finaldata?.id && data.paycomponent_data) {
        segmentform.addControl('segment_id', new FormControl(data?.segment_id))
      }
      (segmentform.get('paycomponent_data') as FormArray).clear();
    }  
      if(data.paycomponent_data)
      {
      data.paycomponent_data.forEach((item) => {
        const paycomform = this._CreatePaycomponentgp();
        paycomform.patchValue(item);
        paycomform.get('segment_percentage').patchValue(data.segment_percentage);
        if (this.finaldata?.id) {
          paycomform.addControl('details_id', new FormControl(item?.details_id))
        }
        (segmentform.get('paycomponent_data') as FormArray).push(paycomform);
      });    
      (this.payrollgenform.get('segment_data') as FormArray).push(segmentform);
      console.log("PAYS DATA", this.payrollgenform.get('segment_data') as FormArray)
    }
    this.calculateDeduct();
    });
    (this.payrollgenform.get('companycontribution') as FormArray).clear();
    this.finaldata.company_contribution.forEach((ccdata) => {
      const ccc = this._cc_contribution();
      if (ccdata?.details_id) {
        ccc.addControl("details_id", new FormControl(ccdata?.details_id))
      }
      ccc.patchValue({
        'id': ccdata?.id,
        'paycomponent': ccdata?.id,
        'paycomponent_percentage': ccdata?.percentage,
        'paycomponent_name': ccdata?.name,
        'sal_amount': ccdata?.sal_amount,
        'max_amount': ccdata?.max_amount
      });
      (this.payrollgenform.get('companycontribution') as FormArray).push(ccc);
    });
    (this.payrollgenform.get('employeecontribution') as FormArray).clear();
    (this.payrollgenform.get('deductions') as FormArray).clear();
    this.finaldata.employee_contribution.forEach((ecdata) => {
      const ecc = this._pf_contribution();
      const dcc = this._deductions();
      console.log("EC DATA", ecdata)
      if (ecdata?.deduction_id) {
        ecc.addControl("deduction_id", new FormControl(ecdata?.deduction_id))
        dcc.addControl("deduction_id", new FormControl(ecdata?.deduction_id))

      }
  
      ecc.patchValue({
        'id': ecdata?.id,
        'paycomponent_id': ecdata?.id,
        'paycomponent_percentage': ecdata?.percentage,
        'paycomponent_name': ecdata?.name,
        'max_amount': ecdata?.max_amount,
        'sal_amount': ecdata?.sal_amount,
      });
      if(ecdata?.type?.id)
      {

        this.typeVal = ecdata?.type?.id;
        switch (this.typeVal) {
          case 1:          
            this.yrlyAmts =  ecdata.deduction_amount * 4;
            break;
          case 2:
            this.yrlyAmts =  ecdata.deduction_amount * 2;
            break;
          case 3:
            this.yrlyAmts =  ecdata.deduction_amount * 1;
            break;
          case 4:
            this.yrlyAmts =  ecdata.deduction_amount * 12;
            break;

          default:
            this.yrlyAmts =  0;
            break;

        }
    

      }
      dcc.patchValue({
        'id': ecdata?.id,
        'paycomponent_id': ecdata?.id,
        'paycomponent_percentage': ecdata?.percentage,
        'paycomponent_name': ecdata?.name,
        'max_amount': ecdata?.max_amount,
        'amount': ecdata?.deduction_amount,
        'amount_yearly' : this.yrlyAmts,
        'type': ecdata?.type?.id
      });
      if(ecdata.name == 'PF' || ecdata.name == 'ESI')
      {
      (this.payrollgenform.get('employeecontribution') as FormArray).push(ecc);
      console.log(this.payrollShareService)
      }
      else
      {
        this.deductPatch = ecdata.deduction_amount;
        this.deductPatchYr = this.yrlyAmts;
        this.calculateDeduct();
        // this.deductPatch = ecdata.deduction_amount;
        // this.deductPatchYr = this.yrlyAmts;
        this.deductPatchrow = true;
        this.showDedcutEntry = false;
        console.log('This is the Deduction data', dcc);
        // let deducts = this.transformData(ecdata);
        if(this.deductPatch !== 0 || this.deductPatch !== null || this.deductPatch !== undefined)
        {
        (this.payrollgenform.get('deductions') as FormArray).push(dcc);
        }
      }
    });
    if (this.finaldata?.id) {
      this.payrollgenform.addControl('id', new FormControl(this.finaldata?.id));
      this._letcalculate(this.finaldata?.gross_pay)
    }
  
  }
  getAmount(data) {
    let dataFormArray = this.payrollgenform.get('segment_data').value
    this.finaldata
    this.pf_cal_prec = 0;
    this.esi_cal_prec = 0;
    this.pfsegment_prec = 0;
    this.esisement_prec = 0;

    let pf_array = [];
    let esi_array = [];
    let emp_esi: any;
    let esi_ori = 0;
    let _cal_esi = 0;
    let pf_ori = 0;
    let _cal_pf = 0;
    for (let i in dataFormArray) {
      console.log('*********')
      this.esi_cal_prec = 0;
      this.pf_cal_prec = 0;

      for (let j in dataFormArray[i].paycomponent_data) {
        // employee pf and esi
        if (dataFormArray[i].paycomponent_data[j]?.paycom?.includes('PF')) {
          this.pf_cal_prec = this.pf_cal_prec + parseFloat(dataFormArray[i].paycomponent_data[j]?.paycomponent_percentage);

          if (!pf_array?.includes(dataFormArray[i].segment_id)) {
            pf_array.push(dataFormArray[i].segment_id)
            this.pfsegment_prec = this.pfsegment_prec + parseFloat(dataFormArray[i].segment_percentage)
          }
        }
        if (dataFormArray[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
          this.esi_cal_prec = this.esi_cal_prec + parseFloat(dataFormArray[i].paycomponent_data[j]?.paycomponent_percentage)
          if (!esi_array?.includes(dataFormArray[i].segment_id)) {
            esi_array.push(dataFormArray[i].segment_id)
            this.esisement_prec = this.esisement_prec + parseFloat(dataFormArray[i].segment_percentage)
          }
        }
      }
      if (this.finalCC != 0) {
        if (esi_array.includes(dataFormArray[i].segment_id)) {
          esi_ori = (parseFloat(dataFormArray[i].segment_percentage) / 100) * (this.esi_cal_prec / 100)
          _cal_esi = _cal_esi + esi_ori;
        }
      }
      else {
        _cal_esi = 0;
      }
      if (pf_array.includes(dataFormArray[i].segment_id)) {
        pf_ori = (parseFloat(dataFormArray[i].segment_percentage) / 100) * (this.pf_cal_prec / 100)
        _cal_pf = _cal_pf + pf_ori;
      }
    }
    console.log('pfsegment_prec:', this.pfsegment_prec, 'this.pf_cal_prec:-', this.pf_cal_prec)
    console.log('esisegment_prec:', this.esisement_prec, 'esi_cal_prec:-', this.esi_cal_prec)
    let prec = this.get_pf_esi_frommaster();
    this.emppf = _cal_pf * (prec['e_pf'] / 100);
    emp_esi = _cal_esi * (prec['e_esi'] / 100);
    console.log(_cal_esi, _cal_pf)
    let company_pf = _cal_pf * (prec['c_pf'] / 100)
    let comesi = _cal_esi * (prec['c_esi'] / 100)
    if (this.no_esi) {
      emp_esi = 0;
    }
    this.gross_pay = Math.round(parseFloat(data) / (1 - this.emppf - emp_esi))
    if (this.std_pf) {
      this.gross_pay = Math.round(parseFloat(data) + prec['max_amout_epf'] + emp_esi);
    }
    let cc_final = company_pf + comesi;
    let ec_final = this.emppf + emp_esi;
    console.log(this.emppf)
    this.payrollgenform.get('takehomeWBD').setValue(this.payrollgenform.get('take_home').value)
    this.payrollgenform.get('gross_pay_monthly').setValue(this.gross_pay)
    this.payrollgenform.get('gross_pay').setValue(this.gross_pay)
    this.payrollgenform.get('gross_pay_yearly').setValue(Math.round(this.gross_pay * 12))
    this.payrollgenform.get('takehome_monthly').setValue(parseFloat(data))
    this.payrollgenform.get('takehome_yearly').setValue(parseFloat(data) * 12)
    this.payrollgenform.get('takehome_monthlyWBD').setValue( this.payrollgenform.get('takehome_monthly').value)
    this.payrollgenform.get('takehome_yearlyWBD').setValue( this.payrollgenform.get('takehome_yearly').value)
    console.log("Gross Pays", this.gross_pay)
    this._letcalculate(this.gross_pay)
  }
  get_pf_esi_frommaster() {
    let esi_c = 0, esi_e = 0, pf_c = 0, pf_e = 0, epf_amout = 0, cpf_amount = 0;
    for (let k = 0; k < this.payrollgenform.value.companycontribution.length; k++) {

      if (this.payrollgenform.value?.companycontribution[k]?.paycomponent_name == 'ESI') {
        esi_c = parseFloat(this.payrollgenform.value?.companycontribution[k]?.paycomponent_percentage)
      }
      if (this.payrollgenform.value?.companycontribution[k]?.paycomponent_name == 'PF') {
        pf_c = parseFloat(this.payrollgenform.value?.companycontribution[k]?.paycomponent_percentage)
        cpf_amount = parseFloat(this.payrollgenform.value?.companycontribution[k]?.max_amount)
      }

    }
    for (let k = 0; k < this.payrollgenform.value.employeecontribution.length; k++) {

      if (this.payrollgenform.value?.employeecontribution[k]?.paycomponent_name == 'ESI') {
        esi_e = parseFloat(this.payrollgenform.value?.employeecontribution[k]?.paycomponent_percentage)

      }
      if (this.payrollgenform.value?.employeecontribution[k]?.paycomponent_name == 'PF') {
        pf_e = parseFloat(this.payrollgenform.value?.employeecontribution[k]?.paycomponent_percentage)
        epf_amout = parseFloat(this.payrollgenform.value?.employeecontribution[k]?.max_amount)
      }
    }

    return { "c_esi": esi_c, "c_pf": pf_c, "e_esi": esi_e, "e_pf": pf_e, 'max_amout_epf': epf_amout, 'max_amount_cpf': cpf_amount }

  }

  Formsubmission() {
    console.log("Final Datas", this.payrollgenform.value)
    let segment_array = [];
    let segment_datas = this.payrollgenform.value.segment_data;
    let employeecontribution = this.payrollgenform.value.employeecontribution
console.log("My Segment Datas", segment_datas)
for (let k = 0; k < segment_datas.length; k++) {
  for (let p = 0; p < segment_datas[k]?.paycomponent_data.length; p++) {
    console.log(segment_datas[k])
    if (this.payrollgenform.value.segment_data[k].paycomponent_data[p]?.from_date === null) {
      delete this.payrollgenform.value.segment_data[k].paycomponent_data[p]['from_date'];
    } else {

      const from_date = this.payrollgenform.value.segment_data[k].paycomponent_data[p]['from_date'];
      this.payrollgenform.value.segment_data[k].paycomponent_data[p]['from_date'] = this.datepipe.transform(from_date, 'yyyy-MM-dd');
    }

    if (this.payrollgenform.value.segment_data[k].paycomponent_data[p]?.to_date === null) {
      delete this.payrollgenform.value.segment_data[k].paycomponent_data[p]['to_date'];
    } else {
      const to_date = this.payrollgenform.value.segment_data[k].paycomponent_data[p]['to_date'];
      this.payrollgenform.value.segment_data[k].paycomponent_data[p]['to_date'] = this.datepipe.transform(to_date, 'yyyy-MM-dd');
    }
    if (this.payrollgenform.value.segment_data[k].paycomponent_data[p]?.segment != undefined) {
      this.payrollgenform.value.segment_data[k].paycomponent_data[p]['segment'] = segment_datas[k].segment_id;
    }
    if (this.payrollgenform.value.segment_data[k].segment_name === 'Deductions') {
      this.payrollgenform.value.segment_data[k].paycomponent_data[p]['is_customdeduct'] = true;
    } else {
      this.payrollgenform.value.segment_data[k].paycomponent_data[p]['is_customdeduct'] = false;
    }
    if(this.payrollgenform.value.segment_data[k].segment_name === 'Deductions')
    {
      employeecontribution.push(this.payrollgenform.value.segment_data[k].paycomponent_data[p])
    }
    else
    {
      segment_array.push(this.payrollgenform.value.segment_data[k].paycomponent_data[p])
    }

   
  }
}
// if(this.payrollgenform.get('deductions') !== null)
// {
//   employeecontribution.push(this.payrollgenform.value.deductions[0]);
// }
if (this.payrollgenform.get('deductions') !== null) {
  const newDeduction = this.payrollgenform.value.deductions[0];
  if (newDeduction !== null && newDeduction !== undefined) {  
    delete newDeduction.deduction_id;
    const existingIndex = employeecontribution.findIndex(
      (item) => item && item?.paycomponent_name === newDeduction?.paycomponent_name
    );

    if (existingIndex !== -1) {
      employeecontribution[existingIndex] = newDeduction;
    } else {
      employeecontribution.push(newDeduction);
    }
  }
}

    console.log("Segments My Arrat",segment_array)
    let params = {
      "employee_id": this.employee_data?.id,
      "standard_ctc": this.payrollgenform.value.ctc_monthly,
      "gross_pay": this.payrollgenform.value.gross_pay_monthly,
      "pf_type": 1,
      "take_home": this.payrollgenform.value.takehome_monthly,
      'emp_grade':this.emp_grade_id,
      'emp_template': this.selectedTemplateId,
      "is_tds": "False",
       "company_contribution": this.payrollgenform.value.companycontribution,
      "employee_contribution": this.payrollgenform.value.employeecontribution,
      "segment_details": segment_array.filter(Boolean),
    }

    if (this.finaldata?.id) {
      params['id'] = this.finaldata?.id;
    }
    console.log(params)
    const paycom_per = this._CreatePaycomponentgp()
    const pay = (paycom_per.get('paycomponent_percentage') as FormControl).value
    const mainform = this.payrollgenform.get('segment_data') as FormArray;
    for (let i in mainform.value) {
      console.log('mainframe', this.payrollgenform.value.segment_data[i].paycomponent_data)
      console.log('mainframeAmount', this.payrollgenform.value.segment_data[i].segment_percentage)
      this.amount = Number(this.payrollgenform.value.segment_data[i].segment_percentage)
      let s = 0
      for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
        s += Number(this.payrollgenform.value.segment_data[i].paycomponent_data[j].paycomponent_percentage)
      }
      this.sum = Number((s / 100) * this.amount)
      if (this.sum != this.amount && this.payrollgenform.value.segment_data[i].segment_name !== 'Deductions' ) {

        this.toast.error('The' + this.payrollgenform.value.segment_data[i].segment_name + ' Block  Sum of precentage should equal to 100')
        return false
      }

    }
    this.apiservice.paystructurecreation(params).subscribe(data => {
      this.toaster = this.toast.success(data?.message)
      this.router.navigate(['/payingemployee/empdetailsummary'])
      this.router.navigate(['/payingemployee/empnav'])
    })
  }
  getgradeinfo() {
    this.apiservice.getGradeApi('', 1).subscribe(data => {
      this.gradedata = data['data'];
      console.log('gradeDataInfo', data)
    });

  }

  getgradebasedemployeeinfo(grade_id) {
    this.apiservice.getemployeegradeinfo(grade_id, this.employee_data?.id).subscribe(data => {
      console.log(data)
      this.finaldata = data;
      this.segmentdata();
    });




  }
  _letcalculate(gross_pay_monthly) {
    gross_pay_monthly = this.payrollgenform.value.gross_pay_monthly;

    const mainform = this.payrollgenform.get('segment_data') as FormArray;
    let find_pf = 0
    let find_esi = 0;
    console.log("Main form data", mainform)

    for (let i in mainform.value) {
      if (this.payrollgenform.value.segment_data[i]?.paycomponent_type === 'Monthly Bonus')
      {
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round(parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.amount));
        // let yearly_amount = amout * 12
        mainform.get([i, 'amount']).patchValue(amout)
        // mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)

        if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 1)
        {
           this.yearly_amountss = amout * 4;
        mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amountss)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 2)
        {
          this.yearly_amountss= amout * 2;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amountss)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 3)
        {
          this.yearly_amountss = amout ;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amountss)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 4)
        {
          this.yearly_amountss= amout * 12;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amountss)
        }

        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].amount
          //  let segment_percentage=this.payrollgenform.value.segment_data[i]?.segment_percentage
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl)));
          // let yearly_amount = resultPiesTablares * 12

          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(this.yearly_amountss)
          mainform.get([i, 'amount']).patchValue(resultPiesTablares)
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amountss)
          console.log("Bonus Values",resultPiesTablares )
          console.log("Bonus yearly", this.yearly_amountss)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)



          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)


          }
        }
      } 
      else if (this.payrollgenform.value.segment_data[i]?.paycomponent_type === 'Deductions')
      {
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round(parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.amount));
     
        mainform.get([i, 'amount']).patchValue(amout)
        if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 1)
        {
          let yearly_amount = amout * 4;
        mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 2)
        {
          let yearly_amount = amout * 2;
          mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 3)
        {
          let yearly_amount = amout ;
          mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 4)
        {
          let yearly_amount = amout * 12;
          mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
        }

        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].amount
          //  let segment_percentage=this.payrollgenform.value.segment_data[i]?.segment_percentage
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl)));
          let yearly_amount = resultPiesTablares * 12

          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(yearly_amount)
          mainform.get([i, 'amount']).patchValue(resultPiesTablares)
          mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
          console.log("Bonus Values",resultPiesTablares )
          console.log("Bonus yearly", yearly_amount)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)



          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)


          }
        }
      } 
      else
       {
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round((parseFloat(this.payrollgenform.value.segment_data[i]?.segment_percentage) * gross_pay_monthly) / 100);
        let yearly_amount = amout * 12
        mainform.get([i, 'amount']).patchValue(amout)
        mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)


        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].paycomponent_percentage
          let segment_percentage = this.payrollgenform.value.segment_data[i]?.segment_percentage
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl) / 100 * parseFloat(segment_percentage) / 100 * gross_pay_monthly));
          // let resultPiesTablares:any = Math.round((parseFloat(payComponentPercentageControl)/100 *parseFloat(segment_percentage)/100* this.gross_pay) );

          let yearly_amount = resultPiesTablares * 12

          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(yearly_amount)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)



          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)

          }
        }
      }
  

    }
    let pf_amt: any
    let cc_amount: any;

    for (let k = 0; k < this.payrollgenform.value.companycontribution.length; k++) {

      let prec_ = this.payrollgenform.value?.companycontribution[k]?.paycomponent_percentage;
      let sal_amount = this.payrollgenform.value?.companycontribution[k]?.sal_amount;
      (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'paycomponent_percentage']).patchValue(prec_);
      if (this.payrollgenform.value?.companycontribution[k]?.paycomponent_name == 'ESI') {
        console.log('finde', find_esi)
        if (parseFloat(sal_amount) > find_esi) {
          cc_amount = Math.round(find_esi * parseFloat(prec_) / 100);
          let cc_amount1 = Math.round((find_esi * parseFloat(prec_) / 100) * 12);
          // cc_pf=find_pf*13/100
          (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount']).patchValue(cc_amount);
          (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount_yearly']).patchValue(cc_amount1);
          this.esiFinal = cc_amount;
        }
        else {
          (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount']).patchValue(0);
          (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount_yearly']).patchValue(0);
          cc_amount = 0;
          this.esiFinal = cc_amount;
        }
      }

      else {
        // cc_pf=find_pf*13/100
        pf_amt = Math.round(find_pf * parseFloat(prec_) / 100);
        if(this.vpf == true)
        {
          (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount']).patchValue(pf_amt);
        (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount_yearly']).patchValue(Math.round(parseFloat(pf_amt) * 12));
        this.pfFinal = pf_amt
        }
        else
        {
        if (pf_amt > parseFloat(this.payrollgenform.value?.companycontribution[k]?.max_amount)) {
          pf_amt = parseFloat(this.payrollgenform.value?.companycontribution[k]?.max_amount)
        }
        (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount']).patchValue(pf_amt);
        (this.payrollgenform.get('companycontribution') as FormArray).get([k, 'amount_yearly']).patchValue(Math.round(parseFloat(pf_amt) * 12));
        this.pfFinal = pf_amt
      }
    }



    }
    ;

    let ctc = Math.round(parseFloat(this.payrollgenform.value.gross_pay_monthly) + (parseFloat(pf_amt) + parseFloat(cc_amount)));
    console.log(ctc, 'ctc')
    // this.ctc_amout=ctc;
    this.payrollgenform.get('ctc_monthly').setValue(ctc)
    this.payrollgenform.get('ctc_yearly').setValue(Math.round(ctc * 12))
    this.payrollgenform.get('standard_ctc').setValue(ctc)

    let cc_total = 0;
    cc_total = pf_amt + cc_amount;
    this.payrollgenform.get('cmp_monthly').setValue(cc_total);
    this.payrollgenform.get('cmp_yearly').setValue(cc_total * 12);


    // employee contribution

    for (let k = 0; k < this.payrollgenform.value.employeecontribution.length; k++) {

      let eprec_ = this.payrollgenform.value?.employeecontribution[k]?.paycomponent_percentage;
      let sal_amount = this.payrollgenform.value?.employeecontribution[k]?.sal_amount;
      (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'paycomponent_percentage']).patchValue(eprec_);
      if (this.payrollgenform.value?.employeecontribution[k]?.paycomponent_name == 'ESI') {
        if (parseFloat(sal_amount) > find_esi) {
          cc_amount = Math.round(find_esi * parseFloat(eprec_) / 100);
          let cc_amount1 = Math.round((find_esi * parseFloat(eprec_) / 100) * 12);
          // cc_pf=find_pf*13/100
          this.finalCC = cc_amount;
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount']).patchValue(cc_amount);
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount_yearly']).patchValue(cc_amount1);
        }
        else {
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount']).patchValue(0);
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount_yearly']).patchValue(0);
          cc_amount = 0;
          this.finalCC = cc_amount;
        }
        // this.getAmount(this.payrollgenform.get('take_home').value)
        console.log("Final CC", this.finalCC)
      }

      else {
        // cc_pf=find_pf*13/100
        if(this.vpf == true)
        {
          pf_amt = Math.round(find_pf * parseFloat(eprec_) / 100);
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount']).patchValue(pf_amt);
          (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount_yearly']).patchValue(Math.round(parseFloat(pf_amt) * 12));
        }
        else
        {
        pf_amt = Math.round(find_pf * parseFloat(eprec_) / 100);
        if (pf_amt > parseFloat(this.payrollgenform.value?.employeecontribution[k]?.max_amount)) {
          pf_amt = parseFloat(this.payrollgenform.value?.employeecontribution[k]?.max_amount)
        }
        (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount']).patchValue(pf_amt);
        (this.payrollgenform.get('employeecontribution') as FormArray).get([k, 'amount_yearly']).patchValue(Math.round(parseFloat(pf_amt) * 12));
      }
      }
    }
    gross_pay_monthly = parseFloat(this.payrollgenform.value?.takehome_monthly) + pf_amt + cc_amount;
    this.payrollgenform.get('gross_pay_monthly').setValue(gross_pay_monthly)
    this.payrollgenform.get('gross_pay').setValue(gross_pay_monthly)
    this.payrollgenform.get('gross_pay_yearly').setValue(Math.round(gross_pay_monthly * 12))
    for (let i in mainform.value) {
      if(this.payrollgenform.value.segment_data[i]?.paycomponent_type === 'Monthly Bonus')
      {
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round(parseFloat(this.payrollgenform.value.segment_data[i]?.amount));
        // let yearly_amount = amout * 12
        mainform.get([i, 'amount']).patchValue(amout)
        // mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)

        if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 1)
        {
           this.yearly_amoun = amout * 4;
        mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amoun)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 2)
        {
          this.yearly_amoun= amout * 2;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amoun)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 3)
        {
          this.yearly_amoun = amout ;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amoun)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 4)
        {
          this.yearly_amoun= amout * 12;
          mainform.get([i, 'amount_yearly']).patchValue( this.yearly_amoun)
        }


        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].amount
          //  let segment_percentage=this.payrollgenform.value.segment_data[i]?.segment_percentage
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl)));
          // let yearly_amount = resultPiesTablares * 12

          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(this.yearly_amoun)
          mainform.get([i, 'amount']).patchValue(resultPiesTablares)
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amoun)
          console.log("Bonus Values",resultPiesTablares , this.yearly_amoun)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)


          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)

          }
        }

      }
      else if(this.payrollgenform.value.segment_data[i]?.paycomponent_type === 'Deductions')
      {
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round(parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.amount));
        // let yearly_amount = amout * 12
        mainform.get([i, 'amount']).patchValue(amout)
        // mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)
        if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 1)
        {
           this.yearly_amounts = amout * 4;
        mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 2)
        {
          this.yearly_amounts = amout * 2;
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 3)
        {
          this.yearly_amounts = amout ;
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)
        }
        else if(this.payrollgenform.value.segment_data[i]?.paycomponent_data[0]?.type == 4)
        {
          this.yearly_amounts = amout * 12;
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)
        }
        else
        {
          this.yearly_amounts = 0;
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)
        }

        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].amount
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl)));


          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(this.yearly_amounts)
          mainform.get([i, 'amount']).patchValue(resultPiesTablares)
          mainform.get([i, 'amount_yearly']).patchValue(this.yearly_amounts)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)


          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)

          }
        }
      }
     else{
        const mainform = this.payrollgenform.get('segment_data') as FormArray;
        let amout: any = Math.round((parseFloat(this.payrollgenform.value.segment_data[i]?.segment_percentage) * gross_pay_monthly) / 100);
        let yearly_amount = amout * 12
        mainform.get([i, 'amount']).patchValue(amout)
        mainform.get([i, 'amount_yearly']).patchValue(yearly_amount)


        for (let j in this.payrollgenform.value.segment_data[i].paycomponent_data) {
          const sub = mainform.get([i, 'paycomponent_data'])
          console.log('-----')

          const payComponentPercentageControl = this.payrollgenform.value.segment_data[i].paycomponent_data[j].paycomponent_percentage
          let segment_percentage = this.payrollgenform.value.segment_data[i]?.segment_percentage
          let resultPiesTablares: any = Math.round((parseFloat(payComponentPercentageControl) / 100 * parseFloat(segment_percentage) / 100 * gross_pay_monthly));
          let yearly_amount = resultPiesTablares * 12

          sub.get([j, 'amount']).patchValue(resultPiesTablares)
          sub.get([j, 'amount_yearly']).patchValue(yearly_amount)



          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('PF')) {
            find_pf = find_pf + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)


          }
          if (this.payrollgenform.value.segment_data[i].paycomponent_data[j]?.paycom?.includes('ESI')) {
            find_esi = find_esi + parseFloat(this.payrollgenform.value.segment_data[i]?.paycomponent_data[j]?.amount)

          }
        }
      }
  }
    let ctcs = Math.round(parseFloat(this.payrollgenform.value.gross_pay_monthly) + (parseFloat(this.pfFinal)) + (parseFloat(this.esiFinal)));
    console.log(ctc, 'ctcs')
    this.payrollgenform.get('ctc_monthly').setValue(ctcs)
    this.payrollgenform.get('ctc_yearly').setValue(Math.round(ctcs * 12))
    this.payrollgenform.get('standard_ctc').setValue(ctcs)
    this.validation()
    


  }
  Submit() {
    this.router.navigate(['/payingemployee/empdetailsummary'])
    this.router.navigate(['/payingemployee/empnav'])
  }


  deduction_type() {
    this.apiservice.deductiontype().subscribe(data => {
      this.deduction_type_data = data['data'];

    });
  }
  calculateAmountYearly(index: number): void {
  if(this.showDedcutEntry == true) {
    const segmentData = this.payrollgenform.get('segment_data').value[index];
    const mainform = this.payrollgenform.get('segment_data') as FormArray;
    if (segmentData.paycomponent_type === 'Monthly Bonus' || segmentData.paycomponent_type === 'Deductions') {
      const amountControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount']);
      const amountYearlyControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount_yearly']);

      if (amountControl && amountYearlyControl) {
        const selectedDropdownValue = this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type;
        switch (selectedDropdownValue) {
          case 1:
            amountYearlyControl.setValue(amountControl.value * 4);
            this.yrlyAmt =  amountControl.value * 4;
            break;
          case 2:
            amountYearlyControl.setValue(amountControl.value * 2);
            this.yrlyAmt =  amountControl.value * 2;
            break;
          case 3:
            amountYearlyControl.setValue(amountControl.value * 1);
            this.yrlyAmt =  amountControl.value * 1;
            break;
          case 4:
            amountYearlyControl.setValue(amountControl.value * 12);
            this.yrlyAmt =  amountControl.value * 12;
            break;

          default:
            amountYearlyControl.setValue(amountControl.value);
            this.yrlyAmt =  0;
            break;

        }
      }
      let Val1 = this.payrollgenform.get('takehome_monthly').value;
      let Val2 = this.payrollgenform.get('takehome_yearly').value;

      this.bonusValue = parseInt(amountControl.value);
      this.bonusValueY = this.yrlyAmt;
      // let Sum1 = parseInt(this.payrollgenform.get('takehome_monthly').value) + parseInt(amountControl.value);
      if(this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type == 4)
      {
        // this.deductValue == undefined?  0 : this.deductValue;
        this.deductValue = (this.deductValue === undefined) ? 0 : this.deductValue;

        this.Sumb1 = parseInt(this.payrollgenform.get('takehome_monthly').value) + parseInt(amountControl.value) - this.deductValue;
        this.intialCTC = parseInt(this.payrollgenform.get('ctc_monthly').value) + parseInt(amountControl.value) - this.deductValue 
      } 
      else
      {
      this.Sumb1 =  parseInt(this.payrollgenform.get('takehome_monthlyWBD').value);
      }
      if(this.yrlyAmt !== undefined && this.deductPatch !== undefined )
      {
      this.Sumy2 = this.payrollgenform.get('takehome_yearly').value + this.yrlyAmt  - this.deductValueY;
      }
      else if(this.yrlyAmt !== undefined)
      {
        this.Sumy2= this.payrollgenform.get('takehome_yearly').value + this.yrlyAmt  
      }
      else if(this.deductPatch!== undefined)
      {
        this.Sumy2= this.payrollgenform.get('takehome_yearly').value - this.deductValueY;
      }
      else
      {
        this.Sumy2= this.payrollgenform.get('takehome_yearly').value;
      }

      this.payrollgenform.valueChanges.subscribe(() => {
        this.payrollgenform.get('takehomeWBD').setValue(this.Sumb1)
        this.payrollgenform.get('ctc_monthly').setValue(this.intialCTC)
        this.payrollgenform.get('standard_ctc').setValue(this.intialCTC)
        this.payrollgenform.get('takehome_monthlyWBD').setValue(this.Sumb1)
        this.payrollgenform.get('takehome_yearlyWBD').setValue(this.Sumy2)
      });
    
      mainform.get([index, 'amount']).patchValue(amountControl.value)
      mainform.get([index, 'amount_yearly']).patchValue(this.yrlyAmt)
      
    }
  }
    else
    {
      const segmentData = this.payrollgenform.get('segment_data').value[index];
      const mainform = this.payrollgenform.get('segment_data') as FormArray;
      if (segmentData.paycomponent_type === 'Monthly Bonus' || segmentData.paycomponent_type === 'Deductions') {
        const amountControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount']);
        const amountYearlyControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount_yearly']);
  
        if (amountControl && amountYearlyControl) {
          const selectedDropdownValue = this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type;
          this.bonusTypes = selectedDropdownValue;
          switch (selectedDropdownValue) {
            case 1:
              amountYearlyControl.setValue(amountControl.value * 4);
              this.yrlyAmt =  amountControl.value * 4;
              break;
            case 2:
              amountYearlyControl.setValue(amountControl.value * 2);
              this.yrlyAmt =  amountControl.value * 2;
              break;
            case 3:
              amountYearlyControl.setValue(amountControl.value * 1);
              this.yrlyAmt =  amountControl.value * 1;
              break;
            case 4:
              amountYearlyControl.setValue(amountControl.value * 12);
              this.yrlyAmt =  amountControl.value * 12;
              break;
  
            default:
              amountYearlyControl.setValue(amountControl.value);
              this.yrlyAmt =  0;
              break;
  
          }
        }
        let Val1 = this.payrollgenform.get('takehome_monthly').value;
        let Val2 = this.payrollgenform.get('takehome_yearly').value;
  
        this.bonusValue = parseInt(amountControl.value);
        this.bonusValueY = this.yrlyAmt;
       
        // let Sum1 = parseInt(this.payrollgenform.get('takehome_monthly').value) + parseInt(amountControl.value);
        let deductAmount = this.payrollgenform.get('deductions').value[0].amount;
        let dedtype = this.payrollgenform.get('deductions').value[0].type;
        switch (dedtype) {
          case 1:
           
            this.yrlyAmtd = deductAmount * 4;
            break;
          case 2:
           
            this.yrlyAmtd =  deductAmount* 2;
            break;
          case 3:
          
            this.yrlyAmtd =  deductAmount * 1;
            break;
          case 4:
            this.yrlyAmtd =  deductAmount * 12;
            break;

          default:
          
            this.yrlyAmtd =  0;
            break;

        }

        if(dedtype == 4)
        {
          this.totalMon = parseInt(this.payrollgenform.get('takehome_monthly').value) + this.bonusValue - deductAmount
        }
        else if(this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type == 4)
        {
          this.totalMon = parseInt(this.payrollgenform.get('takehome_monthly').value) + this.bonusValue
        }
        else
        {
          this.totalMon = parseInt(this.payrollgenform.get('takehome_monthly').value) 
        }
        if(this.yrlyAmt !== undefined && this.yrlyAmtd !== undefined)
        {
         this.newsum = parseInt(this.payrollgenform.get('takehome_yearly').value) + parseInt(this.yrlyAmt)  - this.yrlyAmtd ;
        }
        else if(this.yrlyAmt!== undefined)
        {
          this.newsum= parseInt(this.payrollgenform.get('takehome_yearly').value) + parseInt(this.yrlyAmt)
        }
        else if(this.yrlyAmtd!== undefined)
        {
          this.newsum= parseInt(this.payrollgenform.get('takehome_yearly').value) - this.yrlyAmtd;
        }
        else
        {
          this.newsum= parseInt(this.payrollgenform.get('takehome_yearly').value);
        }
        this.payrollgenform.valueChanges.subscribe(() => {
          this.payrollgenform.get('takehomeWBD').setValue(this.totalMon)
          this.payrollgenform.get('takehome_monthlyWBD').setValue(this.totalMon)
          this.payrollgenform.get('takehome_yearlyWBD').setValue(this.newsum)
        });
      
        mainform.get([index, 'amount']).patchValue(amountControl)
        mainform.get([index, 'amount_yearly']).patchValue(this.yrlyAmt)
    }
  }
}
  
    


    
  previewPay() {

  }
  onBonusTypeChange(data, index)
  {
    this.selectedBonusType = data.value;
    this.clearBonusTypeValues(index);
    this.resetAmount(index);

  }
  onBonusTypeChanges(data, index)
  {
    this.selectedBonusTypes = data.value;
    this.clearBonusTypeValue(index);
    // this.calculateAmountYearly();
  }

  clearBonusTypeValues(index: number) {

    const segmentData = this.payrollgenform.get('segment_data').value[index];
    const mainform = this.payrollgenform.get('segment_data') as FormArray;

    this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount']).setValue(0);
    this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount_yearly']).setValue(0);

   
    
  }
  clearBonusTypeValue(index: number) {

    const segmentData = this.payrollgenform.get('segment_data').value[index];
    const mainform = this.payrollgenform.get('segment_data') as FormArray;

    this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount']).setValue(0);
    this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount_yearly']).setValue(0);

   
    
  }

  calculateAmountYearlys(index: number): void {
    const segmentData = this.payrollgenform.get('segment_data').value[index];
    const mainform = this.payrollgenform.get('segment_data') as FormArray;
    if ((segmentData.paycomponent_type).toLowerCase() === 'deductions') {
      const amountControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount']);
      const amountYearlyControl = this.payrollgenform.get('segment_data').get([index, 'paycomponent_data', 0, 'amount_yearly']);

      if (amountControl && amountYearlyControl) {
        const selectedDropdownValue = this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type;
        switch (selectedDropdownValue) {
          case 1:
            amountYearlyControl.setValue(amountControl.value * 4);
            this.yrlyAmt =  amountControl.value * 4;
            break;
          case 2:
            amountYearlyControl.setValue(amountControl.value * 2);
            this.yrlyAmt =  amountControl.value * 2;
            break;
          case 3:
            amountYearlyControl.setValue(amountControl.value * 1);
            this.yrlyAmt =  amountControl.value * 1;
            break;
          case 4:
            amountYearlyControl.setValue(amountControl.value * 12);
            this.yrlyAmt =  amountControl.value * 12;
            break;

          default:
            amountYearlyControl.setValue(amountControl.value);
            this.yrlyAmt =  amountControl.value;
            break;

        }
      }
      let Val1 = this.payrollgenform.get('takehome_monthlyWBD').value;
      let Val2 = this.payrollgenform.get('takehome_yearlyWBD').value;
      this.deductValue = parseInt(amountControl.value);
      this.deductValueY = this.yrlyAmt;
      if(this.payrollgenform.get('segment_data').value[index].paycomponent_data[0].type == 4)
      {
        console.log("NET PAY", parseInt(this.payrollgenform.get('takehome_monthlyWBD').value));
        // this.bonusValue == undefined? 0 : this.bonusValue;
        this.bonusValue = (this.bonusValue === undefined) ? 0 : this.bonusValue;

        this.Sumd1 = parseInt(this.payrollgenform.get('takehome_monthly').value) - parseInt(amountControl.value) + this.bonusValue ;
      }
      else
      {
      this.Sumd1 =  parseInt(this.payrollgenform.get('takehome_monthlyWBD').value);
      }
      if(this.yrlyAmt !== undefined && this.bonusValueY !== undefined)
      {
      this.sumdata = this.payrollgenform.get('takehome_yearly').value - this.yrlyAmt + this.bonusValueY;
      }
      else if(this.yrlyAmt !== undefined)
      {
        this.sumdata= this.payrollgenform.get('takehome_yearly').value - this.yrlyAmt;
      }
      else if(this.bonusValueY!== undefined)
      {
        this.sumdata= this.payrollgenform.get('takehome_yearly').value + this.bonusValueY;
      }
      else
      {
        this.sumdata= this.payrollgenform.get('takehome_yearly').value;
      }

      this.payrollgenform.valueChanges.subscribe(() => {
        this.payrollgenform.get('takehomeWBD').setValue(this.Sumd1)
        this.payrollgenform.get('takehome_monthlyWBD').setValue(this.Sumd1)
        this.payrollgenform.get('takehome_yearlyWBD').setValue(this.sumdata)
      });    
      mainform.get([index, 'amount']).patchValue(amountControl.value)
      mainform.get([index, 'amount_yearly']).patchValue(this.yrlyAmt);      
    }


    
  }

  resetAmount(index)
  {
    let Val1 = this.payrollgenform.get('takehome_monthly').value;
    let Val2 = this.payrollgenform.get('takehome_yearly').value;    
      this.payrollgenform.get('takehomeWBD').setValue(Val1);
      this.payrollgenform.get('takehome_monthlyWBD').setValue(Val1);
      this.payrollgenform.get('takehome_yearlyWBD').setValue(Val2); 
  }
  calculateDeduct()
  {
    let yrAmt = this.finaldata.take_home * 12;
    if(this.typeVal === 4 && this.bonusPatch !== undefined && this.deductPatch !== undefined)
    {
    this.takeHomeWBDMon = parseFloat(this.finaldata?.take_home) + parseFloat(this.bonusPatch) - parseFloat(this.deductPatch);
    }
    else if(this.bonusPatch !== undefined)
    {
      this.takeHomeWBDMon = parseFloat(this.finaldata?.take_home) + parseFloat(this.bonusPatch) ;
    }
    else if(this.deductPatch !== undefined)
    {
      this.takeHomeWBDMon = parseFloat(this.finaldata?.take_home) - parseFloat(this.deductPatch) ;
    }
    else
    {
      this.takeHomeWBDMon = parseFloat(this.finaldata?.take_home)
    }
    if(this.bonusPatchYr !== undefined && this.deductPatchYr !== undefined )
    {
    this.takeHomeYr =  (yrAmt) + parseFloat(this.bonusPatchYr) - parseFloat(this.deductPatchYr)
    }
    else if(this.deductPatchYr !== undefined)
    {
      this.takeHomeYr =  (yrAmt) - parseFloat(this.deductPatchYr)
    }
    else if(this.bonusPatchYr !== undefined)
    {
      this.takeHomeYr =  (yrAmt) - parseFloat(this.bonusPatchYr)
    }
    else
    {
      this.takeHomeYr =  (yrAmt);
    }
    
    console.log("Take Home ",  this.takeHomeWBDMon)
    this.payrollgenform.patchValue({
      "takehomeWBD":  this.takeHomeWBDMon,
      "takehome_monthlyWBD":  this.takeHomeWBDMon,
      "takehome_yearlyWBD" : this.takeHomeYr
    })
  }
  calculateAmountYearVal()
  {
    console.log("Deduct VALUES PAT", this.payrollgenform.get('deductions').value)
    this.amountD = this.payrollgenform.get('deductions').value[0]?.amount;
    this.typeD = this.payrollgenform.get('deductions').value[0]?.type;
    this.amountYearlyControls = this.payrollgenform.get('deductions').value[0]?.amount_yearly;
    switch ( this.typeD) {
      case 1:
        this.yrlyAmtD =  this.amountD  * 4;
        (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(this.yrlyAmtD);
        break;
      case 2:
        this.yrlyAmtD =  this.amountD  * 2;
        (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(this.yrlyAmtD);
        break;
      case 3:
        this.yrlyAmtD =  this.amountD  * 1;
        (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(this.yrlyAmtD);
        break;
      case 4:
        this.yrlyAmtD =  this.amountD  * 12;
        // this.amountYearlyControls.setValue(this.yrlyAmtD);
        (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(this.yrlyAmtD);
        break;

      default:
        this.yrlyAmtD =  this.amountD ;
        (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(this.yrlyAmtD);
        break;

    }
    if(this.typeD == 4)
        {
          this.totalMons = parseInt(this.payrollgenform.get('takehome_monthly').value) - this.amountD + this.bonusPatch;
        }
        // else if(this.bonusTypes == 4)
        // {
        //   this.totalMons = parseInt(this.payrollgenform.get('takehome_monthly').value) + this.bonusValue
        // }
        else
        {
          this.totalMons = parseInt(this.payrollgenform.get('takehome_monthly').value) + this.bonusPatch;
        }
        let Sum2 = parseInt(this.payrollgenform.get('takehome_yearly').value)  - this.yrlyAmtD+ parseInt(this.bonusPatchYr) ;
        this.payrollgenform.valueChanges.subscribe(() => {
          this.payrollgenform.get('takehomeWBD').setValue(this.totalMons)
          this.payrollgenform.get('takehome_monthlyWBD').setValue(this.totalMons)
          this.payrollgenform.get('takehome_yearlyWBD').setValue(Sum2)
        });
  }
  onBonusTypeChangeD(event, data)
  {
    (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount']).patchValue(0);
    (this.payrollgenform.get('deductions') as FormArray).get([0, 'amount_yearly']).patchValue(0);
    this.calculateAmountYearVal();
  }

  gettemplatedata()
  {
    let gradeId = this.emp_grade_id;
    let page = 1;
    this.apiservice.gettemplates(gradeId, page).subscribe(res=>{
      this.templatedrop = res['data']

    })

 
 
  }

  TemplateClick(value)
  {
    this.selectedTemplateId = value.id;
    // this.getgradebasedemployeeinfo(value.id);
    this.apiservice.getemployeegradeinfodetails(this.emp_grade_id, this.employee_data?.id, value.id).subscribe(data => {
      console.log(data)
      this.finaldata = data;
   
      this.segmentdata();
      this.validation();
      this.enableRevise = false;
      
    });
  }

  onSelectionChange()
  {
    if(this.selectedOption == 1)
    {
      this.calcAmount = this.revisePay.get('revPercent').value * this.monthlyTakeHome /100;
      console.log("REVISED AMOUNT" + this.calcAmount);
      this.showPercent = true;
      this.showRupee = false;
      this.revisePay.get('revPercent').setValue(0);
      this.calcAmount = 0;
      this.yrcalcAmount = 0;

    }
    else
    {
      this.calcAmount = this.revisePay.get('revPercent').value ;
      console.log("REVISED AMOUNT" + this.calcAmount);
      this.showPercent = false;
      this.showRupee = true;
      this.revisePay.get('revPercent').setValue(0);
      this.calcAmount = 0;
      this.yrcalcAmount = 0;

    }
  }
  calculateVal()
  {
    if(this.selectedOption == 1)
    {
      this.calcAmount = (this.revisePay.get('revPercent').value * this.monthlyTakeHome /100) + Number(this.monthlyTakeHome);
      this.yrcalcAmount  = this.calcAmount * 12;
      console.log("REVISED AMOUNT" + this.calcAmount);
     
    }
    else
    {
      this.calcAmount = this.revisePay.get('revPercent').value ;
      this.yrcalcAmount  = this.calcAmount * 12;
      console.log("REVISED AMOUNT" + this.calcAmount);
      
    }
  }

  monyear = new FormControl(moment())
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.monyear.value;
    ctrlValue.year(normalizedYear.year());
    this.monyear.setValue(ctrlValue);


  }
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.monyear.value;
    ctrlValue.month(normalizedMonth.month());
    this.monyear.setValue(ctrlValue);
    datepicker.close();
    this.revisePay.patchValue({
      monthyear: this.monyear.value
    })

  }

  reviseProcess()
  {
    this.payrollgenform.get('take_home').setValue(this.calcAmount);
    let newAmount = this.calcAmount;
    this.getAmount(this.calcAmount);
    this.showpreference = true;
   }
  
  }

  export const DATE_FORMAT_2 = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MMM YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };


  
  @Directive({
    selector: '[dateFormat2]',
    providers: [
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_2 },
    ],
  })
  export class FullCustomDateFormat2 { }
  
  






