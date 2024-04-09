import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PayingempShareService } from '../payingemp-share.service';
import { Router } from '@angular/router';
import { Subscription, combineLatest, forkJoin, of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Action } from 'rxjs/internal/scheduler/Action';
export interface paycomonent {
  id: number;
  name: string;
}

export interface displaypftype {
  id: number; name: string; code: string;
}
@Component({
  selector: 'app-employeepayrollinfo',
  templateUrl: './employeepayrollinfo.component.html',
  styleUrls: ['./employeepayrollinfo.component.scss']
})

export class EmployeepayrollinfoComponent implements OnInit {
  emp_paysrtuctureform: FormGroup;
  deductionform: FormGroup;
  emp_companycontribution: FormGroup;
  otherpayForm: FormGroup;
  bouspayform: FormGroup;
  paycomponent_array: any;
  paycomponent_arraydeduct: any;
  isLoading: false
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  pftype_array: any;
  pf_array: any;
  userdata: any;
  sumof_block1pres = 0
  sumof_block1prest = 0
  emp_name = ''
  items: FormArray;
  orderForm: FormGroup;
  deduction_type_data: any;
  subscription: Subscription;
  totalAmt: any;
  percentTotal: any;
  pfPercent: any;
  pfPercentage: any;
  globalId : any;
  totalCalcV: any;
  totalCC:any;

  total: number = 0;
  amount_total: number = 0;
  amount_totals: number = 0;
  bonus_amount: number = 0;
  deduction_sum: any;
  paycomponent_arrays: any;
  grosspays: any;
  pftypes: any;
  selectedPercent: any;
  totalA : any = 0;
  totalB : any = 0;
  totalC : any = 0;
  totalD : any = 0;
  totals : any = 0;
  takeHome: any = 0;
  defaultValue = 4;
  // totalAmount = 0;
  // selected = 'MONTHLY';
  private valueChangesSubscription: Subscription | undefined;
  constructor(private router: Router, private payrollShareService: PayingempShareService, private fb: FormBuilder, private apiservice: PayingempService, private Notification: NotificationService, private Error: ErrorHandlingServiceService) { }
  ngOnInit(): void {
    this.orderForm = new FormGroup({
      items: new FormArray([])
    });
    let emp_info = this.payrollShareService.empView_id.value
    // this.emp_id = emp_id;
    console.log("empview id", emp_info)
    this.paystructure_infoget(emp_info)
    this.getoverview_info(emp_info)
    this.emp_name = emp_info.full_name
    this.emp_paysrtuctureform = this.fb.group({
      employeepay_detail: new FormArray([

      ]),
      employee_id: [emp_info?.id],
      standard_ctc: [''],
      gross_pay: [''],
      disability: [emp_info?.disabality],
      pf_type: [''],
      is_tds: [false],
      id: [''],
      take_home:[''],
      employee_name: [emp_info?.full_name],


    })
    this.deductionform = this.fb.group({
      emp_id: [emp_info?.id],
      // deduction_data: this.fb.array([this.deduction_formelements()])
      deduction_data: new FormArray([])
    })
    this.emp_companycontribution = this.fb.group({
      employeepay_details: new FormArray([
      ]),
      employee_id: [emp_info?.id],
      standard_ctc: [''],
      gross_pay: [''],
      disability: [emp_info?.disabality],
      pf_type: [''],
      is_tds: [false],
      id: [''],
      employee_name: [emp_info?.full_name],


    })
    this.otherpayForm = this.fb.group({
      otherpays: new FormArray([]),
      otherpaycomponent: [''],
      type_name: [''],
      paycomponent_percentage: [''],
      amount: ['']
    })
    this.bouspayform = this.fb.group({
      employeepay_detail: new FormArray([
      ]),
      employee_id: [emp_info?.id],
      standard_ctc: [''],
      gross_pay: [''],
      disability: [emp_info?.disabality],
      pf_type: [''],
      is_tds: [false],
      id: [''],
      employee_name: [emp_info?.full_name]

    })

    this.subscription = this.emp_paysrtuctureform.get('employeepay_detail').valueChanges.subscribe(data => {
      this.total = data.reduce((a, b) => a + +b.paycomponent_percentage, 0).toFixed(2);
      this.amount_total = data.reduce((a, b) => a + +b.amount, 0)     
    })

    
    // this.subscription = this.emp_paysrtuctureform.get('employeepay_detail').valueChanges.subscribe(data => {
      
    // })
    this.subscription = this.deductionform.get('deduction_data').valueChanges.subscribe(data => {
      this.deduction_sum = data.reduce((a, b) => a + +b.amount, 0)
    })
    this.subscription = this.emp_companycontribution.get('employeepay_details').valueChanges.subscribe(data => {
      this.amount_totals = data.reduce((a, b) => a + +b.amount, 0)
    })
    this.subscription = this.bouspayform.get('employeepay_detail').valueChanges.subscribe(data => {
      this.bonus_amount = data.reduce((a, b) => a + +b.amount, 0)
    })

    // this.emp_paysrtuctureform.get('standard_ctc').valueChanges.subscribe(a=>{
    //   console.log(a)
    //   const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];

    //   for (let i in a.employeepay_detail) {
    //       let resultPiesTablares = (parseFloat( a.employeepay_detail[i]?.paycomponent_percentage)* this.emp_paysrtuctureform.value.standard_ctc)/100;
    //       console.log(resultPiesTablares)

    //       control.at(+i).get('amount')?.setValue(resultPiesTablares);

    //       this.emp_paysrtuctureform.get('employeepay_detail')[i]['controls'].get('amount').setValue(resultPiesTablares)


    //   }

    // })

    //below code creates infinite loops

    // this.emp_paysrtuctureform.get('employeepay_detail')?.valueChanges.subscribe(value_arrya => {
    //   const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
    //   this.sumof_block1pres = 0;
    //   for (let i in value_arrya) {
    //     control.at(+i).get('paycomponent_percentage')?.valueChanges.subscribe(res => {
    //       let resultPiesTablares = (parseFloat(res) * this.emp_paysrtuctureform.value.standard_ctc) / 100;
    //       control.at(+i).get('amount')?.setValue(resultPiesTablares);


          // if(res==0||null){
          //   let percentage=this.emp_paysrtuctureform.value.employeepay_detail[+i].amount/100
          //   control.at(+i).get('amount')?.setValue(percentage);
          // }else{

          // }

          // if(this.emp_paysrtuctureform.value.employeepay_detail[+i].paycomponent_type==1){
          //   console.log(this.sumof_block1pres,'jjj')
          //   // console.log(parseFloat(this.emp_paysrtuctureform.value.employeepay_detail[+i].paycomponent_percentage))
          //   this.sumof_block1pres=this.sumof_block1pres+parseFloat(this.emp_paysrtuctureform.value.employeepay_detail[+i].paycomponent_percentage);
          // }
    //     });





    //   }

    // });
//abovr code

// this.emp_paysrtuctureform.get('employeepay_detail')?.valueChanges.pipe(
//   switchMap((value_arrya) => {
//     const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
//     this.sumof_block1pres = 0;

//     const observables = value_arrya.map((value, index) => {
//       return control.at(index).get('paycomponent_percentage')?.valueChanges.pipe(
//         switchMap((res) => {
//           let resultPiesTablares = (parseFloat(res) * this.emp_paysrtuctureform.value.standard_ctc) / 100;
//           control.at(index).get('amount')?.setValue(resultPiesTablares);
//           return of(null); 
//         })
//       );
//     });

//     return forkJoin(observables);
//   })
// ).subscribe(() => {
  
// });

this.emp_paysrtuctureform.get('employeepay_detail')?.valueChanges.subscribe(value_arrya => {
  const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
  this.sumof_block1pres = 0;
  for (let i in value_arrya) {
    const payComponentPercentageControl = control.at(+i).get('paycomponent_percentage');
    payComponentPercentageControl.valueChanges.pipe(
      distinctUntilChanged() 
    ).subscribe(res => {
      let resultPiesTablares = ((parseFloat(res) * this.emp_paysrtuctureform.value.gross_pay) / 100).toFixed(2);
      control.at(+i).get('amount')?.patchValue(resultPiesTablares, { emitEvent: false });
      

    });
  }

});

this.emp_paysrtuctureform.get('employeepay_detail')?.valueChanges.subscribe(value_arryas => {
  const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
  this.sumof_block1pres = 0;
  for (let i in value_arryas) {
    const payComponentPercentageControl = control.at(+i).get('amount');
    payComponentPercentageControl.valueChanges.pipe(
      distinctUntilChanged() 
    ).subscribe(res => {
      console.log("Gross Pay Value", this.emp_paysrtuctureform.get('gross_pay').value )
      const grossPay = this.emp_paysrtuctureform.get('gross_pay').value
      if (grossPay !== null && grossPay !== 0 && grossPay !== undefined && grossPay !== "")
      {
      let resultPiesTablares = ((parseFloat(res) * 100 ) / this.emp_paysrtuctureform.value.gross_pay).toFixed(2);
      control.at(+i).get('paycomponent_percentage')?.patchValue(resultPiesTablares, { emitEvent: false });
      
      }
    });
  }

});


  }

  // getpfstrutureinfo
  paystructure_infoget(emp_id) {

    this.apiservice.emp_levelpf(emp_id.id,'').subscribe(data => {
      this.pf_array = data['data'];
      console.log("Employee Structure Pay", this.pf_array)
      const emp_array = <FormArray>this.emp_paysrtuctureform.get('employeepay_detail');
      emp_array.clear();
      const control = <FormArray>this.deductionform.get('deduction_data');
      control.clear();
      const dataFormArray = <FormArray>this.emp_companycontribution.get('employeepay_details');
      dataFormArray.clear();
      const emp_arrays = <FormArray>this.bouspayform.get('employeepay_detail');
      emp_arrays.clear();
      
      if (this.pf_array.length > 0) {
        this.formdatabinding(this.pf_array, emp_id)
        this.deduction_binding(this.pf_array, emp_id)
        this.compdatabinding(this.pf_array, emp_id)
        this.bonus_binding(this.pf_array, emp_id)
      }

    });
    this.deduction_type();

  }
  getoverview_info(emp_id) {
    this.apiservice.emp_levelpf(emp_id.id,'').subscribe(data => {
      this.userdata = data['data'];
      let payValue = this.userdata[0].employeepay_detail
      console.log("Pay Component Value", payValue)
     
      let totalAmount = 0;
      let totalAmountB = 0;
      let totalAmountA = 0;
      for (const item of payValue) {
        // console.log("Item Values", item)
        if(item.company_contribution)
        {
          const amount = parseFloat(item.amount);
          totalAmount += amount;
        }
        else if(item?.paycomponent?.allowance_type?.name === 'BONUS')
        {
          const amounts = parseFloat(item.amount);
          totalAmountB += amounts;
        }
        else
        {
          const amountPay = parseFloat(item.amount)
          totalAmountA += amountPay;
        }

      }
      this.totalA = totalAmountA.toFixed(2);
      this.totalB = totalAmountB.toFixed(2);
      this.totalD = totalAmount.toFixed(2)
      console.log("Total Amount", totalAmount)

      let dedValue = this.userdata[0].deduction_data;
      let dedAmount = 0;
      for(const ded of dedValue)
      {
        const amounts = parseFloat(ded.amount);
        dedAmount += amounts
      }
      this.totalC = dedAmount.toFixed(2)
      
      this.takeHome =     (Number(this.totalA) + Number(this.totalB) - Number(this.totalC) ).toFixed(2);  
      this.totals = (Number(this.totalA) + Number(this.totalB) + Number(this.totalD)).toFixed(2);
     
      console.log("USER DATA", this.userdata)
      this.globalId = this.userdata[0].id;
      console.log("User Data Id", this.globalId)

    })


  }
  calculatepercentage(index) {
    console.log("Gross Pay Value", this.emp_paysrtuctureform.get('gross_pay').value )
    const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];
    control.at(index).get('amount')?.valueChanges.subscribe(res => {
      let percentage = res / 100
      control.at(index).get('paycomponent_percentage')?.setValue(percentage);
    });  
  }
  formdatabinding(value, emp_id) {

    this.emp_paysrtuctureform.patchValue({
      employee_id: emp_id.id,
      gross_pay: value[0].gross_pay,
      standard_ctc: value[0].standard_ctc,      
      disability: value[0].disability,
      pf_type: value[0].pf_type,
      is_tds: value[0].is_tds,
      employee_name: emp_id.full_name,
      id: value[0].id

    }


    )
    for (let i = 0; i < value[0].employeepay_detail.length; i++) {

      if ((!value[0].employeepay_detail[i].hasOwnProperty('company_contribution'))&&value[0].employeepay_detail[i].type &&
      value[0].employeepay_detail[i].type.id == null &&
      value[0].employeepay_detail[i].type.name == null) {

        const emp_array = <FormArray>this.emp_paysrtuctureform.get('employeepay_detail');

        let formdata = value[0].employeepay_detail[i];


        // for (const data in formdata) {
        //   console.log("Total Data", data)
          // console.log(this.pf_array[data])
          // console.log(this.pf_array.employeepay_detail)

          const grp = this.fb.group({
            paycomponent: formdata.paycomponent,
            paycomponent_percentage: formdata?.paycomponent_percentage,
            paycomponent_type: formdata.paycomponent?.allowance_type?.id,
            is_deduction: formdata?.is_deduction,
            amount: formdata.amount,
            type_name: formdata.paycomponent?.allowance_type?.name,

            id: formdata.id,
            deduction_data: new FormArray([
              //      {
              //       "type":1,
              // "from_date":"2023-05-03",
              // "to_date":"2023-05-04"
              //      }
            ])

          })

          emp_array.push(grp);
        // }
        this.getAmount(value[0].gross_pay)
        // this.getAmount(value[0].gross_pay)
    

      }
    }
  }

  deduction_binding(value, emp_id) {
    this.deductionform.patchValue({
      emp_id: emp_id.id,
    })
    const deduction_array = <FormArray>this.deductionform.get('deduction_data');
    let formdata = value[0].deduction_data
    for (const data in formdata) {
      const grp = this.fb.group({
        paycomponent_id: formdata[data].paycomponent,
        type: formdata[data].type.id,
        from_date: formdata[data].from_date,
        amount: formdata[data].amount,
        to_date: formdata[data].to_date,
        id: formdata[data].id

      })
      deduction_array.push(grp);
    }

  }

  // form array intitalized
  getSections(forms) {
    return forms.controls.employeepay_detail.controls;
  }
  getSections_de(forms) {
    return forms.controls.deduction_data.controls;
  }
  getSections_cc(forms) {
    return forms.controls.employeepay_details.controls;
  }
  getSections_others(forms) {
    return forms.controls.otherpays.controls;
  }
  getSections_bonus(forms) {
    return forms.controls.employeepay_detail.controls;
  }

  // add button
  addSection() {
    const control = <FormArray>this.emp_paysrtuctureform.get('employeepay_detail');
    control.push(this.getemp_payinfo());
    // let emp_info = this.payrollShareService.empView_id.value
    // this.paystructure_infoget(emp_info)

  }
  addSection_deduction() {
    const control = <FormArray>this.deductionform.get('deduction_data');
    control.push(this.deduction_formelements());
    console.log(control)

  }
  addSection_comcontribution() {
    const control = <FormArray>this.emp_companycontribution.get('employeepay_details');
    control.push(this.compcontribution_formelements());
    console.log(control)

  }
  addSectionOthers() {
    const control = <FormArray>this.otherpayForm.get('otherpays');
    control.push(this.others_formelements());
    console.log(control)

  }
  addSectionBonus() {
    const control = <FormArray>this.bouspayform.get('employeepay_detail');
    control.push(this.bonus_formelements());
    console.log(control)

  }
  // form array elements
  getemp_payinfo() {
    let group = new FormGroup({
      paycomponent: new FormControl(''),
      paycomponent_percentage: new FormControl(''),
      paycomponent_type: new FormControl(''),
      is_deduction: new FormControl(false),
      amount: new FormControl(''),
      type_name: new FormControl(''),
      company_contribution: new FormControl(false),
      deduction_data: new FormArray([

      ])
    })
    return group
  }

  deduction_formelements() {
    return this.fb.group({
      paycomponent_id: new FormControl(''),
      type: new FormControl(''),
      from_date: new FormControl(''),
      amount: new FormControl(''),
      to_date: new FormControl(''),
      deduction_data: new FormArray([

      ])

    })



  }
  compcontribution_formelements() {
    return this.fb.group({
      paycomponent: new FormControl(''),
      paycomponent_percentage: new FormControl(),
      paycomponent_type: new FormControl('1'),
      is_deduction: new FormControl(false),
      amount: new FormControl(''),
      // type_name:new FormControl('null'),
      company_contribution: [true],

      deduction_data: new FormArray([

      ])


    })
  }
  others_formelements() {
    return this.fb.group({
      paycomponent_id: new FormControl(''),
      type: new FormControl(''),
      percentage: new FormControl(),
      amount: new FormControl(''),
      to_date: new FormControl(),

    })

  }
  bonus_formelements() {
    return this.fb.group({
      paycomponent: new FormControl(''),
      type: new FormControl(''),
      paycomponent_percentage: new FormControl(),
      amount: new FormControl(''),
      to_date: new FormControl(''),
      from_date: new FormControl(''),
      company_contribution: new FormControl(false),
      // bonus_pay: new FormControl(true),

    })
  }



  // paycomponent
  getpaymentcomponentinfo() {

    this.apiservice.getpaycomponents('', 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }

  //get deduction component
  getdecuctpaymentcmpt() {

    this.apiservice.getdeductpaycomponent('', 1).subscribe(data => {
      this.paycomponent_arraydeduct = data['data'];
    });
  }

  getpaymentcomponentinfos() {

    this.apiservice.getcompanycontributions('', 1).subscribe(data => {
      this.paycomponent_arrays = data['data'];
    });
  }

  deduction_type() {
    this.apiservice.deductiontype().subscribe(data => {
      this.deduction_type_data = data['data'];
      // this.defaultType = this.deduction_type_data[2].
    });
  }
  getpftype() {

    this.apiservice.getpftype('', 1).subscribe(data => {
      this.pftype_array = data['data'];
    });
  }

  // Display
  public displaycom(data?: paycomonent): any | undefined {
    return data ? data.name : undefined;
  }
  // Displaypftype
  public displaypftype(data?: displaypftype): any | undefined {
    return data ? data.name : undefined;
  }
  Cancelclick() {

    this.router.navigate(['/payingemployee/empdetailsummary'], { skipLocationChange: true })

  }

  Formsubmission() {
    let values = this.emp_paysrtuctureform.value;
    console.log("Pay Form Data", values)
    

    if(values.gross_pay === null || values.gross_pay === undefined || values.gross_pay === "")
    {
      this.Notification.showError('Please Add Gross Pay Amount')
      return false
    }
    if (this.emp_paysrtuctureform.value.pf_type === undefined || this.emp_paysrtuctureform.value.pf_type === "" || this.emp_paysrtuctureform.value.pf_type === null) {
      this.Notification.showError('Choose a Pf type')
      return false
    } else {
      values.pf_type = this.emp_paysrtuctureform.value.pf_type.id
    }
    
    if ((values.employeepay_detail.length == 0)) {
      console.log('kindly add necc...')
      this.Notification.showError('Atleast One PayComponent should be Added')
      return false
    }

   


    for (let form_info = 0; form_info < values.employeepay_detail.length; form_info++) {
      if (values.employeepay_detail[form_info]?.paycomponent == undefined || '' || null) {
        let row = form_info + 1
        this.Notification.showError('Choose paycoment on -' + String(row) + '-Row')
        return false
      }

      else {
        values.employeepay_detail[form_info].paycomponent = values.employeepay_detail[form_info]?.paycomponent?.id
        console.log(values.employeepay_detail[form_info]?.paycomponent?.id)
      }
      if (values.employeepay_detail[form_info]?.paycomponent_type == 1) {
        // console.log(this.sumof_block1pres,'jjj')
        this.sumof_block1pres = this.sumof_block1pres + parseFloat(values.employeepay_detail[form_info]?.paycomponent_percentage);
      }
      if (values.employeepay_detail[form_info]?.paycomponent_type == 1) {
        // console.log(this.sumof_block1pres,'jjj')
        this.sumof_block1prest = this.sumof_block1prest + parseFloat(values.employeepay_detail[form_info]?.amount);
      }

    }

    if (this.sumof_block1pres < 50) {
      this.Notification.showError('Basic block should contribute 50% of Gross Pay')
      return false
    }

    if(this.sumof_block1prest < ((values.gross_pay)/2))
    {
      this.Notification.showError('Basic block total amount should be 50% of Gross Pay')
    }
    // if(this.total != 100){
    //   this.Notification.showError("Total Percentage should be equal to 100")
    //   return false
    // }
    // values.gross_pay = values.standard_ctc;
    console.log(values)
    this.apiservice.paystructuresubmit(values
    )
      .subscribe(results => {
        if (results.status == "success") {
          this.Notification.showSuccess("Success");
          this.globalId = results.id;
          // this.emp_paysrtuctureform.clea
          (this.emp_paysrtuctureform.controls['employeepay_detail'] as FormArray).clear();
          this.emp_paysrtuctureform.reset;
          let emp_info = this.payrollShareService.empView_id.value
          this.paystructure_infoget(emp_info)
          this.onSubmit.emit()
          
          // this.router.navigate(['/payingemployee/empdetailsummary'], { skipLocationChange: true })
        } else {
          this.Notification.showError(results.message)
          return false
        }
      })

  }


  deductionsubmission() {
    let values = this.deductionform.value
    console.log("Deduction Submission", values)
    for (let form_info = 0; form_info < this.deductionform.value.deduction_data.length; form_info++) {
      values.deduction_data[form_info].paycomponent_id = values.deduction_data[form_info].paycomponent_id.id
    }
    for (let form_info = 0; form_info < this.deductionform.value.deduction_data.length; form_info++) {
      let none: any;
      if (values.deduction_data[form_info].from_date == " " || null || 'None') {
        values.deduction_data[form_info].from_date = none;
      }
    }
    for (let form_info = 0; form_info < this.deductionform.value.deduction_data.length; form_info++) {
      let none: any;
      if (values.deduction_data[form_info].to_date == " " || null || 'None') {
        values.deduction_data[form_info].to_date = none;
      }
    }
    //   let none: any;
    //   if(values.from_date = '' )
    //   {

    //   }
    //   let payload = {
    //     "emp_id": values.emp_id,
    //     "deduction_data": [
    //         {
    //             "paycomponent_id": values.paycomponent_id,
    //             "type": values.type,
    //             "from_date": none,
    //             "amount": "1850.00",
    //             "to_date": none,
    //             "id": values.id
    //         }
    //     ]
    // }
    this.apiservice.deductionsubmit(values)
      .subscribe(results => {
        if (results.status == "success") {
          this.Notification.showSuccess("Success");
          (this.deductionform.controls['deduction_data'] as FormArray).clear();
          this.deductionform.reset;
          let emp_info = this.payrollShareService.empView_id.value
          this.paystructure_infoget(emp_info)

          this.onSubmit.emit()
          // this.router.navigate(['/payingemployee/empdetailsummary'], { skipLocationChange: true })
        } else {
          this.Notification.showError(results.message)
          return false
        }
      })

  }
  // 
  type_info(type_info, index) {

    var arrayControl = this.emp_paysrtuctureform.get('employeepay_detail') as FormArray;
    arrayControl.at(index).get('paycomponent_type').setValue(type_info?.allowance_type.id)
    arrayControl.at(index).get('type_name').setValue(type_info?.allowance_type.name)
    arrayControl.at(index).get('paycomponent_percentage').setValue(type_info?.percentage)
    let amount = this.amount_calculation(type_info?.percentage, this.emp_paysrtuctureform.value.gross_pay, 1)
    arrayControl.at(index).get('amount').setValue(amount)


  }


  amount_calculation(pay_compercentage, ctc, is_monthly) {
    let cal_amount = (ctc * parseFloat(pay_compercentage)) / 100;
    return cal_amount

  }
  validation(event: any) {
    let d: any = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    if (d.test(event.key) == true) {
      return false;
    }
    return true;
  }
  paycomponent_search(value) {
    this.apiservice.getpaycomponents(value, 1).subscribe(data => {
      this.paycomponent_array = data['data'];
    });
  }
  paytype_search(value) {
    this.apiservice.getpftype(value, 1).subscribe(data => {
      this.pftype_array = data['data'];
    });
  }


  createItem(): FormGroup {
    return this.fb.group({
      name: '',
      description: '',
      price: ''
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }


  getAmount(data) {
    let dataFormArray = this.emp_paysrtuctureform.get('employeepay_detail').value

    const control = <FormArray>this.emp_paysrtuctureform.controls['employeepay_detail'];

    for (let i in dataFormArray) {
      let resultPiesTablares = ((parseFloat(dataFormArray[i]?.paycomponent_percentage) * data) / 100).toFixed(2);
      console.log(resultPiesTablares)

      control.at(+i).get('amount')?.setValue(resultPiesTablares);

      // this.emp_paysrtuctureform.get('employeepay_detail')['controls'][i].get('amount').setValue(resultPiesTablares)
      // this.emp_paysrtuctureform.get('employeepay_detail')['controls'][i].get('amount').setValue(resultPiesTablares)

    }






  }

  // isCustomTypeSelected(): boolean {
  //   const deductionDataArray = this.deductionform.get('deduction_data') as FormArray;
  //   const typeControl = deductionDataArray.at(0).get('type');
  //   return typeControl && typeControl.value === 5;
  // }

  isCustomTypeSelected(index: number): boolean {
    const deductionDataArray = this.deductionform.get('deduction_data') as FormArray;
    const typeControl = deductionDataArray.at(index).get('type');
    return typeControl && typeControl.value === 5;
  }
  
  //delete components

  deleteSectionBonus(i: number) {
    (<FormArray>this.bouspayform.get('employeepay_detail')).removeAt(i);
    // this.tablewidthchange(i);
  }

  deleteSectionOthers(i: number) {
    (<FormArray>this.otherpayForm.get('otherpays')).removeAt(i);
    // this.tablewidthchange(i);
  }
  deleteCC(i: number) {
    (<FormArray>this.emp_companycontribution.get('employeepay_details')).removeAt(i);
  }
  deleteDeduct(i) {
    (<FormArray>this.deductionform.get('deduction_data')).removeAt(i);
   
  }

  deletepay(i) {
    (<FormArray>this.emp_paysrtuctureform.get('employeepay_detail')).removeAt(i); 
    
  }

  //form submission of companycontribution
  ContribFormsubmission() {
    let values = this.emp_companycontribution.value;
    console.log("Comapany Contribution", values)
    // let obj = JSON.parse(values);
    if (values.employeepay_details) {

      if ((values.employeepay_details.length == 0)) {

        this.Notification.showError('Please Add New Company Contribution')
        return false
      }
      let dataFormArray = this.emp_companycontribution.get('employeepay_details').value;

      for (let form_info = 0; form_info < values.employeepay_details.length; form_info++) {
        if (values.employeepay_details[form_info]?.paycomponent == undefined || '' || null) {
          let row = form_info + 1
          this.Notification.showError('Choose paycoment on -' + String(row) + '-Row')
          return false
        }

        else {
          values.employeepay_details[form_info].paycomponent = values.employeepay_details[form_info]?.paycomponent?.id
          // values.employeepay_details[form_info]?.paycomponent_percentage = this.selectedPercent;
          console.log(values.employeepay_details[form_info]?.paycomponent?.id)
        }
        // if(values.employeepay_detail[form_info]?.paycomponent_type==1){
        //   // console.log(this.sumof_block1pres,'jjj')
        // values.employeepay_detail[form_info]?.paycomponent_percentage = this.selectedPercent;
        // }
      }

      values.employeepay_detail = values.employeepay_details;
      // values.id = this.globalId
      delete values.employeepay_details;
    }

    // let obj = JSON.parse(values);
    // obj.employeepay_detail = obj.employeepay_detail;
    // delete obj.employeepay_detail;
    // let updatedJson = JSON.stringify(obj);
    // console.log("Updated JSON", obj)


    if(this.globalId == undefined)
    {
      let emp_info = this.payrollShareService.empView_id.value
       this.getoverview_info(emp_info)
    }
    this.apiservice.compcontributionsubmit(values, this.globalId)
      .subscribe(results => {
        if (results.status == "success") {
          this.Notification.showSuccess("Success");
          (this.emp_companycontribution.controls['employeepay_details'] as FormArray).clear();
          this.emp_companycontribution.reset;
          let emp_info = this.payrollShareService.empView_id.value
          this.paystructure_infoget(emp_info)

          this.onSubmit.emit()
          // this.router.navigate(['/payingemployee/empdetailsummary'], { skipLocationChange: true })

        } else {

          this.Notification.showError(results.message)
          return false

        }
      })

  }

  paycomponent_searchs(value) {
    this.apiservice.searchcompcontrib(value, 1).subscribe(data => {
      this.paycomponent_arrays = data['data'];
    });
  }

  getCurrentEmployee() {

  }
  compdatabinding(value, emp_id) {

    // this.emp_companycontribution.patchValue({
    //   employee_id: emp_id.id,
    //   standard_ctc: value[0].standard_ctc,
    //   gross_pay: value[0].standard_ctc,
    //   disability: value[0].disability,
    //   // pf_type:value[0].pf_type,
    //   is_tds: value[0].is_tds,
    //   employee_name: emp_id.full_name,
    //   id: value[0].id

    // }


    // )

    for (let i = 0; i < value[0].employeepay_detail.length; i++) {

      if (value[0].employeepay_detail[i].hasOwnProperty('company_contribution')) {


    const emp_arrays = <FormArray>this.emp_companycontribution.get('employeepay_details');
    console.log('FormArray',emp_arrays)

    let formdata = value[0].employeepay_detail[i];


    // for (const data in formdata) {
      const grps = this.fb.group({
        paycomponent: formdata.company_contribution,
        // paycomponent: formdata.amount,
        paycomponent_percentage: null,
        paycomponent_type: formdata.paycomponent?.allowance_type?.id,
        is_deduction: formdata?.is_deduction,
        amount: formdata.amount,
        type_name: formdata.paycomponent?.allowance_type?.name,
        company_contribution: [true],
        id: formdata.id,
        deduction_data: new FormArray([
          //      {
          //       "type":1,
          // "from_date":"2023-05-03",
          // "to_date":"2023-05-04"
          //      }
        ])

      })

      emp_arrays.push(grps);
      console.log("EMP ARRAY", emp_arrays.value)

   
    // }
    // this.getAmount(value[0].standard_ctc)


  }
}
  }

  type_infos(type_info, index) {

    var arrayControls = this.emp_companycontribution.get('employeepay_details') as FormArray;
    // arrayControl.at(index).get('paycomponent_type').setValue(type_info?.allowance_type.id)
    // arrayControl.at(index).get('paycomponent').setValue(type_info?.allowance_type.id)
    // arrayControl.at(index).get('type_name').setValue(type_info?.allowance_type.name)
    // arrayControl.at(index).get('paycomponent_percentage').setValue(this.percentTotal)
    // arrayControl.at(index).get('amount').setValue(this.totalAmt)


  }

  getSelectedOption(event: MatAutocompleteSelectedEvent, index) {
    // Handle the selected option event here
    console.log('Selected option:', event.option.value);
    // const percentageValue = event.option.value.percentage.replace('%', '');
    // this.selectedPercent = percentageValue;
    // console.log("Selected Percent", this.selectedPercent)

    // let selPercent = event.option.value.percentage;

    let emp_info = this.payrollShareService.empView_id.value
    console.log("Employee Id", emp_info.id)

    let Selid = event.option.value.id;
    console.log("Selected Id", Selid)

    this.apiservice.getCalcValCC(emp_info.id, Selid)
    .subscribe(results => {
      this.totalCC = results.data[0]
      console.log("RESULTS DATA", results.data[0])
      var arrayControl = this.emp_companycontribution.get('employeepay_details') as FormArray;
      arrayControl.at(index).get('amount').setValue(this.totalCC)
    })

    // let gPay = this.emp_paysrtuctureform.get('gross_pay').value;
    // console.log("Gross Pay Value", gPay)
    // let totalCalc = this.selectedPercent * gPay / 100;
    // let dataFormArray = this.emp_companycontribution.get('employeepay_details').value;
    // const control = <FormArray>this.emp_companycontribution.controls['employeepay_details'];
    // for (let j in dataFormArray) {
      // let result = totalCalc;
      // control.at(+j).get('amount')?.setValue(result);
      // control.at(+j).get('paycomponent_percentage').setValue(this.selectedPercent)
      // this.totalAmt = totalCalc;
      // this.percentTotal = this.selectedPercent;

      
    // var arrayControl = this.emp_companycontribution.get('employeepay_details') as FormArray;
    // arrayControl.at(index).get('paycomponent_type').setValue(type_info?.allowance_type.id)
    // arrayControl.at(index).get('paycomponent').setValue(type_info?.allowance_type.id)
    // arrayControl.at(index).get('type_name').setValue(type_info?.allowance_type.name)
    // arrayControl.at(index).get('paycomponent_percentage').setValue(this.percentTotal)
    // arrayControl.at(index).get('amount').setValue(this.totalAmt)
    // }
    // dataFormArray.get('amount').setValue(totalCalc);
  }
  bonusSubmission()
  {
    let values = this.bouspayform.value;
    console.log("Bonus Submission", values)
    // let obj = JSON.parse(values);


      if ((values.employeepay_detail.length == 0)) {

        this.Notification.showError('Please Add New Bonus Component')
        return false
      }
      let dataFormArray = this.bouspayform.get('employeepay_detail').value;

      for (let form_info = 0; form_info < values.employeepay_detail.length; form_info++) {
        if (values.employeepay_detail[form_info]?.paycomponent == undefined || '' || null) {
          let row = form_info + 1
          this.Notification.showError('Choose Bonus paycomponent on -' + String(row) + '-Row')
          return false
        }

        else {
          values.employeepay_detail[form_info].paycomponent = values.employeepay_detail[form_info]?.paycomponent?.id
          // values.employeepay_details[form_info]?.paycomponent_percentage = this.selectedPercent;
          console.log(values.employeepay_detail[form_info]?.paycomponent?.id)
        }

      }
      for (let form_info = 0; form_info < this.bouspayform.value.employeepay_detail.length; form_info++) {
        let none: any;
        if (values.employeepay_detail[form_info].from_date == " " || null || 'None') {
          values.employeepay_detail[form_info].from_date = none;
        }
      }
      for (let form_info = 0; form_info < this.bouspayform.value.employeepay_detail.length; form_info++) {
        let none: any;
        if (values.employeepay_detail[form_info].to_date == " " || null || 'None') {
          values.employeepay_detail[form_info].to_date = none;
        }
      }
    this.apiservice.compcontributionsubmit(values, this.globalId)
      .subscribe(results => {
        if (results.status == "success") {
          this.Notification.showSuccess("Success");
          (this.bouspayform.controls['employeepay_detail'] as FormArray).clear();
          this.bouspayform.reset;
          let emp_info = this.payrollShareService.empView_id.value
          this.paystructure_infoget(emp_info)
          this.onSubmit.emit()
          // this.router.navigate(['/payingemployee/empdetailsummary'], { skipLocationChange: true })

        } else {

          this.Notification.showError(results.message)
          return false

        }
      })

  }

  type_infob(type_info, index) {
    // var arrayControl = this.bouspayform.get('employeepay_detail') as FormArray;
    // arrayControl.at(index).get('paycomponent_type').setValue(type_info?.allowance_type.id)
    // arrayControl.at(index).get('type').setValue(type_info?.type)
    // arrayControl.at(index).get('paycomponent_percentage').setValue(type_info?.percentage)
    // let amount = this.amount_calculation(type_info?.percentage, this.bouspayform.value.standard_ctc, 1)
    // arrayControl.at(index).get('amount').setValue(amount)
  }

  bonus_binding(value, emp_id) {

    // this.bouspayform.patchValue({
    //   employee_id: emp_id.id,
    //   standard_ctc: value[0].standard_ctc,
    //   gross_pay: value[0].standard_ctc,
    //   disability: value[0].disability,
    //   // pf_type:value[0].pf_type,
    //   is_tds: value[0].is_tds,
    //   employee_name: emp_id.full_name,
    //   id: value[0].id

    // })

    //check 
    for (let i = 0; i < value[0].employeepay_detail.length; i++) {

      if ((!value[0].employeepay_detail[i].hasOwnProperty('company_contribution'))&&value[0].employeepay_detail[i].type &&
      value[0].employeepay_detail[i].type.id !== null &&
      value[0].employeepay_detail[i].type.name !== null ) {


    const emp_arrays = <FormArray>this.bouspayform.get('employeepay_detail');
    console.log('FormArray',emp_arrays)

    let formdata = value[0].employeepay_detail[i];
    console.log("BONUS FORM DATA", formdata)
      const grps = this.fb.group({
        paycomponent: formdata.paycomponent,
        // paycomponent: formdata.amount,
        paycomponent_percentage: null,
        paycomponent_type: formdata.paycomponent?.allowance_type?.id,
        is_deduction: formdata?.is_deduction,
        amount: formdata.amount,
        type: formdata?.type?.id,

        id: formdata.id,
        deduction_data: new FormArray([
   
        ])

      })

      emp_arrays.push(grps);
      console.log("EMP ARRAY BONUS", emp_arrays.value)
  }
}
  }

  // isCustomTypeSelect(): boolean {
  //   const bonusdataArray = this.bouspayform.get('employeepay_detail') as FormArray;
  //   console.log("Bonus form data", bonusdataArray)
  //   const typeControl = bonusdataArray.at(0).get('type');
  //   return typeControl && typeControl.value === 5;
  // }

  delPay(data)
  {
    console.log("Delete Pay Structure", data)
   let id : any;
   console.log("EMP ID", this.payrollShareService.empView_id.value.id)
   if(data.value.id == undefined)
   {
    this.Notification.showSuccess("Empty Row Deleted Successfully") 

   }
   else
   {
    this.apiservice.deletepaystructure(data.value.id, this.payrollShareService.empView_id.value.id).subscribe(results => {
      if (results.status == 'success') {

        this.Notification.showSuccess("Deleted Successfully")
        // this.getAdvanceSummary();
      } else {
        this.Notification.showError(results.description)

        return false;
      }
    })
  }
  
  }
  delDeduct(data)
  {
    if(data.value.id == undefined)
   {
    this.Notification.showSuccess("Empty Row Deleted Successfully") 

   }
   else
   {    this.apiservice.deletedeductstructure(data.value.id).subscribe(results => {
      if (results.status == 'success') {

        this.Notification.showSuccess("Deleted Successfully")
        // this.getAdvanceSummary();
      } else {
        this.Notification.showError(results.description)

        return false;
      }
    })
  }
  }

  delCompany(data)
  {
    if(data.value.id == undefined)
   {
    this.Notification.showSuccess("Empty Row Deleted Successfully") 

   }
   else
   {
    this.apiservice.deletecompanycont(data.value.id).subscribe(results => {
      if (results.status == 'success') {

        this.Notification.showSuccess("Deleted Successfully")
        // this.getAdvanceSummary();
      } else {
        this.Notification.showError(results.description)

        return false;
      }
    })
  }

  }

  getSelectedOptions(event: MatAutocompleteSelectedEvent, index) {
    console.log('Selected option:', event.option.value);
    // const percentageValue = event.option.value.percentage.replace('%', '');
    // this.selectedPercent = percentageValue;
    // console.log("Selected Percent", this.selectedPercent)
    let selPercent = event.option.value.percentage;

    let emp_info = this.payrollShareService.empView_id.value
    console.log("Employee Id", emp_info.id)

    let Selid = event?.option?.value?.paycomponentflagmaster[0]?.map_id;
    console.log("Selected Id", Selid)

    this.apiservice.getCalcValue(emp_info.id, Selid)
    .subscribe(results => {
      this.totalCalcV = results.data[0]
      console.log("RESULTS DATA", results.data[0])
      var arrayControl = this.deductionform.get('deduction_data') as FormArray;
      arrayControl.at(index).get('amount').setValue(this.totalCalcV)
    })
    
    // arrayControl.at(index).get('paycomponent_percentage').setValue(this.percentTotal)
    

    // let gPay = this.emp_paysrtuctureform.get('gross_pay').value;
    // console.log("Gross Pay Value", gPay)
    // if(this.pfPercentage == undefined)
    // {
    //   this.pfPercent = this.pf_array[0].pf_type.percentage;
    //   this.pfPercentage = this.pfPercent.replace('%', '');

      // let totalCalc = this.pfPercentage * gPay / 100;
    
    //   let result = totalCalc;
    //   this.totalAmt = totalCalc;
    //   this.percentTotal = this.selectedPercent;      
    // var arrayControl = this.deductionform.get('deduction_data') as FormArray;
    // // arrayControl.at(index).get('paycomponent_percentage').setValue(this.percentTotal)
    // arrayControl.at(index).get('amount').setValue(this.totalCalcV)

    // }
    // else
    // {
    // let totalCalc = this.pfPercentage * gPay / 100;
    
    //   let result = totalCalc;
    //   this.totalAmt = totalCalc;
    //   this.percentTotal = this.selectedPercent;      
    // var arrayControl = this.deductionform.get('deduction_data') as FormArray;
    // arrayControl.at(index).get('paycomponent_percentage').setValue(this.percentTotal)
    // arrayControl.at(index).get('amount').setValue(totalCalc)
    // }
  }

  handlePfTypeSelection(event:any)
  {
    
    this.pfPercent = event.option.value.percentage;   
    this.pfPercentage = this.pfPercent.replace('%', '');
    console.log("EVENT SELECTED", this.pfPercentage)

  }
  getOverViewData()
  {
    let emp_info = this.payrollShareService.empView_id.value
    this.getoverview_info(emp_info)
   
  }

  gotoNewPay()
  {
      this.router.navigate(['payingemployee/paystructcreate'])
    
  }
  gotoAnotherNewPay(){
       this.router.navigate(['payingemployee/emp_struc'])
  }
 
}