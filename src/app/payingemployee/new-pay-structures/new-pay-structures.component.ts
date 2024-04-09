import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment'; import { NgxSpinnerService } from "ngx-spinner";
import { PayingempService } from '../payingemp.service';
import { PayingempShareService } from '../payingemp-share.service';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Advances } from '../models/advances';
import { MatTableDataSource } from '@angular/material/table';
import { NUMPAD_NINE } from '@angular/cdk/keycodes';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-new-pay-structures',
  templateUrl: './new-pay-structures.component.html',
  styleUrls: ['./new-pay-structures.component.scss'],
  // encapsulation : ViewEncapsulation.Emulated
})
export class NewPayStructuresComponent implements OnInit {

  constructor(private fb: FormBuilder, private payRollService: PayingempService, private notification: NotificationService, private currencyPipe: CurrencyPipe,
    private router: Router, private SpinnerService: NgxSpinnerService, public datepipe: DatePipe, private sharedservice: SharedService, private payrollShareService: PayingempShareService) {

       this.emp_info = this.payrollShareService.empView_id.value
      console.log("Employee Id", this.emp_info)
  }

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
      monthRemun:  { value: null, disabled: this.isDisabled },
      yrRemun: { value: null, disabled: this.isDisabled },
      monthGross: '',
      yrGross: { value: null, disabled: this.isDisabled },
      basicpercnt: [50],
      monthBasic: '',
      monthAllow: '',
      allowpercnt: [50],
      monthsplRemun: { value: null, disabled: this.isDisabled },
      yrsplRemun: { value: null, disabled: this.isDisabled },
      monthSegA: '',
      yrSegA: { value: null, disabled: this.isDisabled },
      monthSegB: '',
      yrSegB: { value: null, disabled: this.isDisabled },
      // yrSegX: '',
      monthDeduct: { value: null, disabled: this.isDisabled },
      yrDeduct: { value: null, disabled: this.isDisabled },
      monthD: '',
      monthtakeHome: '',
      yrtakeHome: { value: null, disabled: this.isDisabled },
      monthCTC: { value: null, disabled: this.isDisabled },
      yrCTC: { value: null, disabled: this.isDisabled },
      monthSegC: '',
      yrSegC: { value: null, disabled: this.isDisabled },
      monthSegE: '',
      monthCC: { value: null, disabled: this.isDisabled },
      yrCC: { value: null, disabled: this.isDisabled },
      stmonthDeduct: { value: null, disabled: this.isDisabled },
      styrDeduct : { value: null, disabled: this.isDisabled },
      stmonthPF: { value: null, disabled: this.isDisabled},
      pfSelect:'',
      esiSelect:'',
      stmonthESI: { value: null, disabled: this.isDisabled},
      monthCCPF: { value: null, disabled: this.isDisabled},
      monthCCESI: { value: null, disabled: this.isDisabled},

    })



    this.empdetails.get('monthRemun').valueChanges.subscribe((value) => {
      const yrRemun = value * 12;
      this.empdetails.get('yrRemun').setValue(yrRemun);

      this.calculateCTC();
      this.calculateAndStoreESIcalc();
      this.calculateAndStoreCompanyESI();
    });
    this.empdetails.get('monthSegA').valueChanges.subscribe((val) => {
      const cyrSegA = val * 12;
      this.empdetails.get('yrSegA').setValue(cyrSegA);
      this.calculateMonthSpl();
    })
    this.empdetails.get('monthSegB').valueChanges.subscribe((val) => {
      const cyrSegB = val * 12;
      this.empdetails.get('yrSegB').setValue(cyrSegB);
      this.calculateMonthSpl();
    })
    this.empdetails.get('monthSegC').valueChanges.subscribe((val) => {
      const cyrSegC = val * 12;
      this.empdetails.get('yrSegC').setValue(cyrSegC);
      this.calculateMonthSpl();
    })
    // this.empdetails.get('yrSegX').valueChanges.subscribe((val) => {
    //   this.calculateMonthSpl();
    // })
    this.empdetails.get('basicpercnt').valueChanges.subscribe((vals) => {
      this.calculateMonthBasic();
      this.calculatePercent();
    })
    this.empdetails.get('allowpercnt').valueChanges.subscribe((vals) => {
      this.calculateMonthAllow();
    })
    this.empdetails.get('monthD').valueChanges.subscribe((values) => {
      let stDeduct = this.empdetails.get('stmonthDeduct').value;
      let ccDeduct = this.empdetails.get('monthCC').value;
      let calcM = values + stDeduct + ccDeduct;
      let calcY = calcM * 12;
      this.empdetails.get('monthDeduct').setValue(calcM);
      this.empdetails.get('yrDeduct').setValue(calcY);
      // this.calculateTakeHome();
      // this.calculateAndStoreGrossSal()
    })
    this.empdetails.get('monthSegE').valueChanges.subscribe((vals) => {
      let yrCCv = vals * 12;
      this.empdetails.get('monthCC').setValue(vals);
      this.empdetails.get('yrCC').setValue(yrCCv);
      this.calculateCTC();
    })
    this.empdetails.get('monthtakeHome').valueChanges.subscribe((vals)=>{
      let yrtake = vals * 12;
      this.empdetails.get('yrtakeHome').setValue(yrtake);
      this.calculateAndStoreGrossSal();
    })
    this.empdetails.get('monthGross').valueChanges.subscribe((val)=>{
      const monthspl = +this.empdetails.get('monthsplRemun')!.value || 0;
      let newVal = val + monthspl;
      this.empdetails.get('monthRemun').setValue(newVal);
    })

    this.empdetails.get('monthCCPF').valueChanges.subscribe((val)=>{
      this.calculateCompContrib();
      // this.calculateTotalDed();
    })
    this.empdetails.get('monthCCESI').valueChanges.subscribe((val)=>{
      this.calculateCompContrib();
      // this.calculateTotalDed();
    })
    this.empdetails.get('stmonthPF').valueChanges.subscribe((val)=>{
      this.calculateStatury();
      // this.calculateTotalDed();
    })
    this.empdetails.get('stmonthESI').valueChanges.subscribe((val)=>{
      this.calculateStatury();
      // this.calculateTotalDed();
    })
    

    // this.getpaydetails();
    this.getGrade();



    this.dynamicform = this.fb.group({});
    this.segmentData.Earnings.forEach(segment => {
      this.dynamicform.addControl(this.getMonthFormControlName(segment), new FormControl(''));
      this.dynamicform.addControl(this.getYearFormControlName(segment), new FormControl(''));
    });


    

    
   
  }

  calculateMonthSpl() {
    const monthSegoneValue = +this.empdetails.get('monthSegA')!.value || 0;
    const monthSegtwoValue = +this.empdetails.get('monthSegB')!.value || 0;
    const monthSegthreeValue = +this.empdetails.get('monthSegC')!.value || 0;
    // const monthSegFinal = this.empdetails.get('yrSegX')!.value || 0;
    const totalValue = monthSegoneValue + monthSegtwoValue + monthSegthreeValue;
    const totalValues = Number((monthSegoneValue + monthSegtwoValue + monthSegthreeValue) * 12);

    this.empdetails.get('monthsplRemun')!.setValue(totalValue);
    this.empdetails.get('yrsplRemun')!.setValue(totalValues);
    const monthspl = +this.empdetails.get('monthGross')!.value || 0;
    let newVal = totalValue + monthspl;
    this.empdetails.get('monthRemun').setValue(newVal);
    // this.calculateGross();
    this.calculateAndStoreCompanyESI();
    this.calculateAndStoreGrossSal();
    this.calculateAndStoreESIcalc();
   
  }

  calculateGross() {
    const monthSegoneVal = +this.empdetails.get('monthRemun')!.value || 0;
    const monthSegtwoVal = +this.empdetails.get('monthsplRemun')!.value || 0;
    const totVal = Number(monthSegoneVal - monthSegtwoVal)
    const totVals = Number(monthSegoneVal - monthSegtwoVal) * 12;
    this.empdetails.get('monthGross')!.setValue(totVal);
    this.empdetails.get('yrGross')!.setValue(totVals);
    this.calculateMonthBasic();
    this.calculateMonthAllow();
  }

  calculateMonthBasic() {
    const monthSal = this.empdetails.get('monthGross').value;
    const basicpercnt = this.empdetails.get('basicpercnt').value;
    const monthBasics = (monthSal * basicpercnt / 100);
    let rMonth = Math.round(monthBasics)
    this.empdetails.get('monthBasic')!.setValue(rMonth);
    this.calculateAndStorePFcalc();
  }
  calculateMonthAllow() {
    const monthSals = this.empdetails.get('monthGross').value;
    const allowpercent = this.empdetails.get('allowpercnt').value;
    const monthAllow = (monthSals * allowpercent / 100);
    let rAllow =  Math.round(monthAllow)
    this.empdetails.get('monthAllow')!.setValue(rAllow);
  }
  calculatePercent() {
    const basicP = this.empdetails.get('basicpercnt').value;
    const allowP = this.empdetails.get('allowpercnt').value;
    let allowUpd = (100 - basicP);
    this.empdetails.get('allowpercnt')!.setValue(allowP);
  }
  calculateTakeHome() {
    const monthRenum = this.empdetails.get('monthRemun')!.value || 0;
    const monthDed = this.empdetails.get('monthDeduct')!.value || 0;
    let takeHome = monthRenum - monthDed;
    let yrtakeHome = takeHome * 12;
    this.empdetails.get('monthtakeHome')!.setValue(takeHome);
    this.empdetails.get('yrtakeHome')!.setValue(yrtakeHome);

  }

  calculateCTC() {
    const monthRenum = this.empdetails.get('monthRemun')!.value || 0;
    const monthCC = this.empdetails.get('monthCC')!.value || 0;
    let monthC = Number(monthRenum) + Number(monthCC);
    let yrC = monthC * 12;
    this.empdetails.get('monthCTC').setValue(monthC);
    this.empdetails.get('yrCTC').setValue(yrC);

  }
  calculateGrossSal(): number {
    const E10 = this.empdetails.get('monthtakeHome').value;
    const E20 = this.empdetails.get('monthsplRemun').value;
    const E28 = this.empdetails.get('monthDeduct').value;
    const D17 = this.empdetails.get('basicpercnt').value;

    const step1 = E10 - E20 + E28;
    console.log("step1", step1)

    if (step1 > 30000) {
      return Math.round((step1 + 1800));
    } else {
      return Math.round((step1 / (1 - (D17/100) * 0.12)) / 0.9919);
    }
  }
  calculateAndStoreGrossSal(): void {
    const grossSal = this.calculateGrossSal();
    console.log('Calculated Gross Salary:', grossSal);
    this.empdetails.get('monthGross').setValue(grossSal);
    let yrGross = grossSal * 12;
    this.empdetails.get('yrGross').setValue(yrGross);
    this.calculateMonthBasic();
    this.calculateMonthAllow();
  }

  calculatePFcalc(): number {
    const E17 = this.empdetails.get('monthBasic').value;
    const result = E17 * 0.12 > 1800 ? 1800 : E17 * 0.12;
    // console.log("PF Selection",this.pfSelection)
    return Math.round(result);
   
  }
  calculateAndStorePFcalc(): void {
    const PFcalc = this.calculatePFcalc();
    console.log('Calculated PFcalc:', PFcalc);
    console.log("PF SLeection", this.pfSelection)

    this.empdetails.get('stmonthPF').setValue(PFcalc)
    this.calculateAndStoreCompanyPF();
  }

  
  calculateESIcalc(): number {
    const G4 = this.empdetails.get('esiSelect').value; 
    const E14 = this.empdetails.get('monthRemun').value;
    const K11 = 0.0075;

    if (G4 === '1') {
      return Math.round(E14 * K11);
    } else {
      return 0;
    }
  }
  calculateAndStoreESIcalc(): void {
    const ESIcalc = this.calculateESIcalc();
    console.log('Calculated ESIcalc:', ESIcalc);
    this.empdetails.get('stmonthESI').setValue(ESIcalc);
  }
  calculateCompanyESI(): number {
    const G4 = this.empdetails.get('esiSelect').value;
    const E14 = this.empdetails.get('monthRemun').value;
    const K12 = 0.0325;

    if (G4 === '1') {
      return Math.round(E14 * K12);
    } else {
      return 0;
    }
  }

  calculateAndStoreCompanyESI(): void {
    const companyESI = this.calculateCompanyESI();
    console.log('Calculated companyESI:', companyESI);
    this.empdetails.get('monthCCESI').setValue(companyESI);

  }

  
  calculateCompanyPF(): number {
    const E30 = this.empdetails.get('stmonthPF').value;

    if (E30 > 1800) {
      return 1950;
    } else {
      return Math.round((E30 * 13) / 12);
    }
  }

  calculateAndStoreCompanyPF(): void {
    const companyPF = this.calculateCompanyPF();
    console.log('Calculated companyPF:', companyPF);
    this.empdetails.get('monthCCPF').setValue(companyPF);

  }

  getpaydetails() {
    let gradel = this.empdetails.get('gradelevel').value;
    this.payRollService.getGradeComponents(gradel)
     .subscribe((results) => {
        let datas = results;
        this.paydata = datas;
        this.apiResponse = datas;
        this.apiResponse.forEach((item: any) => {
          const { segment_name, paycompoent_dta } = item;
          if (!this.segmentData[segment_name]) {
            this.segmentData[segment_name] = [];
          }
          this.segmentData[segment_name] = this.segmentData[segment_name].concat(
            paycompoent_dta
          );
        });
        console.log("SegmentData", this.segmentData)
    
});

  }
  getGrade() {

    this.payRollService.getGrade('')
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.gradeList = datas;
      })
  }

  get groupNames(): string[] {
    if (this.groupedData) {
      return Object.keys(this.groupedData);
    }
    return [];
  }
  processApiResponse(): void {
    this.paycomponentData.forEach(item => {
      const segmentName = item.segment_name;
      if (!this.segments[segmentName]) {
        this.segments[segmentName] = [];
      }
      this.segments[segmentName].push({
        paycomponent_name: item.paycomponent_name,
        paycomponent_percentage: item.paycomponent_percentage,
        monthly: '', 
        yearly: ''  
      });
    });

    for (const segmentName in this.segments) {
      if (this.segments.hasOwnProperty(segmentName)) {
        this.formArrayData.push({
          segment_name: segmentName,
          paycomponents: this.segments[segmentName]
        });
      }
    }

       console.log("PF SLeection", this.pfSelection)
    

  }
  calculateCompContrib()
  {
    let esi = this.empdetails.get('monthCCESI').value;
    let pf = this.empdetails.get('monthCCPF').value;
    let total = esi + pf;
    let yrtotal = total * 12;
    this.empdetails.get('monthCC').setValue(total);
    this.empdetails.get('yrCC').setValue(yrtotal);
    // this.calculateTotalDed();
  }
  calculateStatury()
  {
    let esi = this.empdetails.get('stmonthESI').value;
    let pf = this.empdetails.get('stmonthPF').value;
    let total = esi + pf;
    let yrtotal = total * 12;
    this.empdetails.get('stmonthDeduct').setValue(total);
    this.empdetails.get('styrDeduct').setValue(yrtotal);
    // this.calculateTotalDed();
  }

  calculateTotalDed()
  {
    let values = this.empdetails.get('monthD').value;
    let stDeduct = this.empdetails.get('stmonthDeduct').value;
    let ccDeduct = this.empdetails.get('monthCC').value;
    let calcM = values + stDeduct + ccDeduct;
    let calcY = calcM * 12;
    this.empdetails.get('monthDeduct').setValue(calcM);
    this.empdetails.get('yrDeduct').setValue(calcY);
    // this.calculateTakeHome();
    // this.calculateAndStoreGrossSal()
  }


  // pflogSelection()
  // {
  //   console.log("PF SLeection", this.pfSelection)
  // }

  viewSegments()
  {

  }

  togglePanel()
  {
      this.isExpanded  =  false;
      this.isSegmenShow = true;
  }
  togglePanels()
  {
    this.isSegmenShow = false;
  }

  getMonthFormControlName(segment): string {
    return `month${segment.paycomponent_name}`;
  }

  getYearFormControlName(segment): string {
    return `yr${segment.paycomponent_name}`;
  }





}
