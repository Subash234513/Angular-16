import { Component, ViewChild, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Ap1Service } from "../ap1.service";
import { NotificationService } from "../../service/notification.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApShareServiceService } from "../ap-share-service.service";

export interface Master {
  title: string;
  model: number;
}

@Component({
  selector: "app-preparepayment",
  templateUrl: "./preparepayment.component.html",
  styleUrls: ["./preparepayment.component.scss"],
})
export class PreparepaymentComponent implements OnInit {
  perpay: any = FormGroup;
  crno: any;
  branch: any = [];
  ischeck = true;
  invoicetype: any = [];
  invtyp: any;
  invoicedate: any;
  apinvoicehdr_id: any;
  raiser_employeename: any = [];
  invdate: any;
  data: any = [];
  has_next = true;
  isLoading = false;
  has_previous = true;
  pageSizeApp = 10;
  absolutedata: any;
  parAppList: any;
  presentpage: any = 1;
  pageNumber: any;
  pageSize: any;
  sup: any;
  raiser: any;
  date: any;
  bank: any;
  invoice_no: any;
  invoice_date: any;
  beni: any;
  ifsc: any;
  acno: any;
  d: any = [];
  incamt: any;
  invoice_amount: any;
  paymode: any;
  latest_date: any;
  apamount: any;
  istrue: boolean = true;
  year: any;
  time: any;
  glno: any;
  payto: any;
  invdet: any = [];
  creditrefno: any;
  apinvHeader_id: any;
  oracalinput: any;
  entryflage: boolean = false;
  creditamount: any;
  dbtamt: any;
  type: any;
  typeinput: any;
  bankdetails_idinput: any;
  apcredit_idid: any;
  headerid: any;
  iserrorflase: boolean;
  rasierbranchid:any;
  rasierbranchcode:any;
  payementsubmitflage:boolean=false;
  datamissingflage:boolean=false;
  TypeList:any=[];
  // intyp = ["Po", "Non-PO", "Advance,Emp","Emp Claim"];
  intyp: Master[] = [
    { title: "PO", model: 1 },
    { title: "Non PO", model: 2 },
    { title: "ADVANCE", model: 3 },
    { title: "EMP Claim", model: 4 },
    { title: "BRANCH EXP", model: 5 },
    { title: "PETTY CASH", model: 6 },
    { title: "SI", model: 7 },
    { title: "TAF", model: 8 },
    { title: "TCF", model: 9 },
    { title: "EB", model: 10 },
    { title: "RENT", model: 11 },
    { title: "DTPC", model: 12 },
    { title: "SGB", model: 13 },
    { title: "ICR", model: 14 },
  ];
  checknumb: number;
  routeData: any = [];
  RoutingECFValue: any = [];
  newDataRouting: any = [];
  invoiceTypeValue: any = [];
  payemententryinput: any = [];
  invCreditList: any = [];
  invCreditList1: any = [];
  typeid:any;
  @ViewChild("payementsubmit") payementsubmit;
  constructor(
    private formbuilder: FormBuilder,
    private service: Ap1Service,
    private router: Router,
    private datepipe: DatePipe,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private shareservice: ApShareServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.routeData = this.shareservice.commonsummary.value;
    this.RoutingECFValue = this.routeData["key"];
    this.newDataRouting = this.routeData["data"];
    this.time = new Date().toLocaleTimeString();
    this.perpay = this.formbuilder.group({
      crno: [""],
      invoicetype: [],
      sup: [],
      bar: [],
      invoiceno: [""],
      inmt: [""],
      invoice_from_date: [""],
      raiser_employeename: [""],
      invoice_to_date: [""],
    });
    this.getdata();
    this.getbranch();
    this.getecftype();
    this.perpay.get("bar").valueChanges.subscribe((value) => {
      this.service.branchget(value).subscribe((data) => {
        console.log("h");
        this.branch = data["data"];
        console.log(this.branch);
      });
    });
  }

  getdata() {
    this.spinner.show();
    // if(this.RoutingECFValue==1){
    //   console.log('santhoshECF',this.newDataRouting)
    //   this.data = this.newDataRouting
    //   this.spinner.hide();
    // }
    // else{
    this.date = new Date();
    this.latest_date = this.datePipe.transform(this.date, "yyyy-MM-dd");
    this.year = this.datePipe.transform(this.date, "yyyy");
    this.service.prepayi({}, this.presentpage).subscribe((data) => {
      if (data?.code == "INVALID_DATA") {
        this.notification.showError(data.description);
        this.spinner.hide();
      } else {
        console.log("payment=", data);
        this.data = data["data"];
        let datapagination = data["pagination"];
        this.spinner.hide();

        if (this.data.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.presentpage = datapagination.index;
        }
        if (data) {
          this.updatewhilePagination();
        }
      }
    });
    // }
    return true;
  }
  nextClick() {
    if (this.has_next === true) {
      //   this.service.apicallservice({}, this.presentpage+1)
      this.presentpage = this.presentpage + 1;
      //  this.search();
      this.getdata();
    }
  }
  previousClick() {
    if (this.has_previous === true) {
      //       this.service.apicallservice({}, this.presentpage-1)
      this.presentpage = this.presentpage - 1;
      // this.search();
      this.getdata();
    }
  }
  getbranch() {
    this.service.branchget("").subscribe((data) => {
      console.log("h");
      this.branch = data["data"];
      console.log(this.branch);
    });
  }
  search() {
    let values = this.perpay.value.crno;
    let fill: any = {};
    if (
      this.perpay.get("crno").value != null &&
      this.perpay.get("crno").value != ""
    ) {
      fill["crno"] = this.perpay.get("crno").value;
    }
    if (
      this.perpay.get("invoice_from_date").value != null &&
      this.perpay.get("invoice_from_date").value != ""
    ) {
      fill["invoice_from_date"] = this.datepipe.transform(
        this.perpay.get("invoice_from_date").value,
        "yyyy-MM-dd"
      );
    }
    if (
      this.perpay.get("invoice_to_date").value != null &&
      this.perpay.get("invoice_to_date").value != ""
    ) {
      fill["invoice_to_date"] = this.datepipe.transform(
        this.perpay.get("invoice_to_date").value,
        "yyyy-MM-dd"
      );
    }
    if (
      this.perpay.get("invoiceno").value != null &&
      this.perpay.get("invoiceno").value != ""
    ) {
      fill["invoiceno"] = this.perpay.get("invoiceno").value;
    }
    if (
      this.perpay.get("sup").value != null &&
      this.perpay.get("sup").value != ""
    ) {
      fill["supplier_id"] = this.perpay.get("sup").value;
    }
    if (
      this.perpay.get("bar").value != null &&
      this.perpay.get("bar").value != ""
    ) {
      fill["branch_id"] = this.perpay.get("bar").value;
    }
    if (
      this.perpay.get("raiser_employeename").value != null &&
      this.perpay.get("raiser_employeename").value != ""
    ) {
      fill["raisername"] = this.perpay.get("raiser_employeename").value;
    }
    if (
      this.perpay.get("invoicetype").value != null &&
      this.perpay.get("invoicetype").value != ""
    ) {
      fill["invoicetype_id"] = this.invoiceTypeValue;
    }

    let val = this.perpay.value.crno;
    this.crno = this.perpay.value.crno;
    this.service.prepayi(fill, this.presentpage).subscribe((data) => {
      console.log("search=", data);
      this.data = data["data"];
      let datapagination = data["pagination"];
      if (this.data.length > 0) {
        this.has_next = datapagination?.has_next;
        this.has_previous = datapagination?.has_previous;
        this.presentpage = datapagination?.index;
      }
    });
    console.log("Crno", this.crno);
    console.log("Crno", this.crno);
  }
  cancel() {
    this.spinner.show();
    this.perpay.reset();
    this.invoiceTypeValue = "";
    this.perpay.reset();
    this.service.prepayi({}, this.presentpage).subscribe((data) => {
      console.log("rr=", data);
      this.data = data["data"];
      this.spinner.hide();
    });
  }
  checkboxData = Array(100).fill(false);
  dataToPatch: any;
  compareIdData: any;
  getcredit() {
    this.service.getInvCredit(this.apinvHeader_id).subscribe(
      (result) => {
        if (result) {
          this.invCreditList = result?.data;
          console.log("Invoice Credit Detail ", this.invCreditList);
          this.invCreditList1 = this.invCreditList.filter(
            (x) => x.is_display == "YES"
          );
          console.log("Invoice Credit Detail filter ", this.invCreditList1);
          for (let k = 0; k < this.invCreditList1?.length; k++) {
            this.service.catget(121014).subscribe((result=>{
              let catno=result["data"][0]?.apcat_no
              let subcatno=result["data"][0]?.subcat_no
            if (this.invCreditList1[k]?.paymode?.gl_flag == "Payable") {
              this.dbtamt = this.invCreditList1[k]?.amount;
              console.log(this.invCreditList1[k]);
              let credit = {
                branch_id: this.rasierbranchid.toString(),
                branch_code:this.rasierbranchcode.toString(),
                fiscalyear: this.year.toString(),
                period: "1",
                module: 2,
                screen: 2,
                valuedate: this.latest_date.toString(),
                valuetime: this.time.toString(),
                cbsdate: this.latest_date.toString(),
                localcurrency: "1",
                localexchangerate: "12",
                currency: "1",
                exchangerate: "10",
                isprevyrentry: "1",
                reversalentry: "2",
                refno: this.invCreditList1[k]?.creditrefno?.toString(),
                crno: this.crno.toString(),
                refid: "AP",
                reftableid: this.apinvHeader_id.toString(),
                type: "2",
                gl: "121014",
                apcatno: catno.toString(),
                apsubcatno: subcatno.toString(),
                wisefinmap: "12",
                glremarks: "12",
                amount: this.invCreditList1[k].amount.toString(),
                fcamount: "13",
                ackrefno: "123",
                entry_status: 1,
                vendor_type: "default"
              };
              this.payemententryinput.push(credit);
            }
          }))
          }
          console.log("credit", this.payemententryinput);
          // for(let j=0; j < this.invdet.length; j++)
          // {
          let entrydata: any = {
            crno: this.crno.toString(),
            invoiceheader_id: this.apinvHeader_id,
            invoicedetails_id: this.invdet[0].id,
            module_name: this.typeinput,
          };
          console.log("entrydata", entrydata);

          this.service.payement(entrydata).subscribe((payementresult) => {
            console.log("payemententry", payementresult);
            // if( payementresult["apdebit"][0].amount==0)
            // {
            //   this.creditamount=payementresult["apdebit"][0].invheaderamount
            // }
            // else{
            //   this.creditamount=payementresult["apdebit"][0].amount
            // }
            for (let i = 0; i < payementresult.apdebit.length; i++) {
              this.service.catget(payementresult["apdebit"][i].debitglno).subscribe((result=>{
                let catno=result["data"][0]?.apcat_no
                let subcatno=result["data"][0]?.subcat_no  
              let debit = {
                branch_id: this.rasierbranchid.toString(),
                branch_code:this.rasierbranchcode.toString(),
                fiscalyear: this.year.toString(),
                period: "1",
                module: 2,
                screen: 2,
                valuedate: this.latest_date.toString(),
                valuetime: this.time.toString(),
                cbsdate: this.latest_date.toString(),
                localcurrency: "1",
                localexchangerate: "12",
                currency: "1",
                exchangerate: "10",
                isprevyrentry: "1",
                reversalentry: "2",
                refno: this.creditrefno?.toString(),
                crno: this.crno.toString(),
                refid: "AP",
                reftableid: this.apinvHeader_id.toString(),
                type: "1",
                gl: payementresult["apdebit"][i].debitglno.toString(),
                apcatno: catno.toString(),
                apsubcatno: subcatno.toString(),
                wisefinmap: "12",
                glremarks: "12",
                amount: this.dbtamt.toString(),
                fcamount: "13",
                ackrefno: "123",
                entry_status: 1,
                vendor_type:"default"
              };
              this.payemententryinput.push(debit);
              console.log("payemententryinput", this.payemententryinput);
            }))
            }
          });
          // }
        }
      }
      // error=>{
      //   console.log("Inv Credit Detail data not found")

      // }
    );

    this.oracalinput = {
      AP_Type: "AP_PAYMENT",
      CR_Number: this.crno.toString(),
    };
  }
  checkbox(index, data, e) {
    this.datamissingflage=false
    console.log("data", data);
    this.apinvHeader_id = data?.id;
    this.rasierbranchid=data?.raiserbranch_id
    this.rasierbranchcode=data?.raiserbranch?.code
    this.paymode=data?.credit_paymode?.name
    this.service.payementvalidation(this.apinvHeader_id).subscribe((validationresult)=>
    {
      if(validationresult["status"]=="Success")
      {
        this.payemententryinput.splice(0, this.payemententryinput.length);    
        this.crno = data?.crno;
        this.type = data?.invoicetype?.text;
        this.typeid=data?.invoicetype?.id
        console.log("typeid",this.typeid)
        if (this.typeid == 8) {
          this.typeinput = "TCF PAYMENT";
          console.log("this.typeinput",this.typeinput)
        } 
        else if(this.typeid == 3)
        {
          this.typeinput = "EMP REIMP PAYMENT";
        }
        else if(this.typeid  ==4)
        {
          let advancetype=this.crno.slice(0, 3);
          console.log("advancetype",advancetype)
          if(advancetype == "ADV")
          {
            this.typeinput = "ADV PAYMENT";
          }
          else {
            this.typeinput = "ADE PAYMENT";
          }
        }
        else {
          this.typeinput = "PAYMENT";
          console.log("this.typeinput",this.typeinput)
        }
        // this.invdetdbt();
        
        this.invdet = data?.invoicedetails["data"];
        this.getcredit();
        console.log("invdet", this.invdet);
        this.date = new Date();
        this.latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd");
        this.ischeck = false;
        this.invtyp = data?.invoicetype?.text;
        this.sup = data?.supplier?.name;
        this.raiser = data?.raiser_employeename;
        this.payto = data?.pay_to;
        if (this.typeid == 8 || this.typeid == 3) {
          if (data.pay_to == "E") {  
            if(data?.employee_accountdtls["data"]?.length==0)
            {
              this.datamissingflage=true
              this.notification.showError("employee_accountdtls Empty");
            }
            else
            {
              this.bank = data?.employee_accountdtls?.bank_name;
              this.beni = data?.employee_accountdtls?.beneficiary_name;
              this.ifsc = data?.employee_accountdtls?.bankbranch?.ifsccode;
              this.acno = data?.employee_accountdtls?.account_number;
            }
          } else {
            this.datamissingflage=true
            this.notification.showError("Payement Type MisMatch");
          }
        }
        if (this.typeid == 2) {
          if (data.pay_to == "S") {
            if (data?.supplierpayment_details["data"]?.length == 0 || data?.supplierpayment_details?.length == 0) {
              this.datamissingflage=true
              this.notification.showError("Supplierpayment_details Is Empty");
            } else {
              this.bank = data?.supplierpayment_details["data"][0]?.bank_id?.name;
              this.beni = data?.supplierpayment_details["data"][0]?.beneficiary;
              this.ifsc =
                data?.supplierpayment_details["data"][0]?.branch_id?.ifsccode;
              this.acno = data?.supplierpayment_details["data"][0]?.account_no;
            }
          } else {
            this.datamissingflage=true
            this.notification.showError("Payement Type MisMatch");
          }
        }
        if(this.typeid == 4)
        {
          if(data.pay_to == "E")
          {
            if(data?.employee_accountdtls["data"]?.length==0)
            {
              this.datamissingflage=true
              this.notification.showError("employee_accountdtls Empty");
            }
            else
            {
              this.bank = data?.employee_accountdtls?.bank_name;
              this.beni = data?.employee_accountdtls?.beneficiary_name;
              this.ifsc = data?.employee_accountdtls?.bankbranch?.ifsccode;
              this.acno = data?.employee_accountdtls?.account_number;
            }    
          }
          else
          {
            if (data?.supplierpayment_details["data"]?.length == 0 || data?.supplierpayment_details?.length == 0) {
              this.datamissingflage=true
              this.notification.showError("Supplierpayment_details Is Empty");
            }
            else
            {
              this.bank = data?.supplierpayment_details["data"][0]?.bank_id?.name;
              this.beni = data?.supplierpayment_details["data"][0]?.beneficiary;
              this.ifsc =
                data?.supplierpayment_details["data"][0]?.branch_id?.ifsccode;
              this.acno = data?.supplierpayment_details["data"][0]?.account_no;
            }            
          }
        }
        this.invoice_no = data.invoice_no;
        this.invoice_date = data.invoice_date;
        this.invoice_amount = data.invoice_amount;
        this.apamount = data.apamount;
        this.compareIdData = data.id;
        if (data.apcredit["data"].length == 0) {
          this.datamissingflage=true
          this.notification.showError("Credit Details Is Empty");
        } else {
          this.incamt = data.apcredit["data"][0].amount;
          // this.paymode = data.apcredit["data"][0].paymode.name;
          if (data.apcredit["data"][0].creditglno == "null") {
            this.notification.showError("GL Number is Empty");
          } else {
            this.glno = data?.apcredit["data"][0]?.creditglno;
          }
          this.creditrefno = data?.apcredit["data"][0]?.creditrefno;
          if (data.apcredit["data"][0].bankdetails.code == "INVALID_BANK_ID") {
            this.notification.showError("INVALID_BANK_ID");
          } else {
            this.bankdetails_idinput =
              data?.apcredit["data"][0]?.bankdetails?.bankbranch?.bank?.id;
          }
          this.apcredit_idid = data?.apcredit["data"][0]?.id;
          this.headerid = data?.apcredit["data"][0]?.apinvoiceheader;
        }

        let absolutedata = this.data;

        for (let idata in absolutedata) {
          if (absolutedata[idata].id == data.id) {
            this.checkboxData[idata] = !this.checkboxData[idata];

            this.d = absolutedata[idata];
          } else {
            this.checkboxData[idata] = false;
          }
        }
        for (let i in this.checkboxData) {
          if (this.checkboxData[i] == true) {
            this.istrue = false;
            break;
          } else {
            this.istrue = true;
          }
        }
      }
      else
      {
        this.notification.showError(validationresult["message"])
      }
    })
   console.log(" this.payementsubmitflage", this.payementsubmitflage) 
  }

  checks(i) {
    if (this.checknumb == i) {
      return false;
    } else {
      return true;
    }
  }

  prepare(absolutedata) {}
  paymentsubmit() {
    this.payementsubmitflage=true
    console.log("paysub", this.d);
    let paymentini_input:any={
      "apinvoiceheader_id":this.headerid.toString(),
      "remarks":"ok"
    }
    let pay: any = {
      paymentheader_date: this.latest_date.toString(),
      paymentheader_amount: this.incamt.toString(),
      ref_id: "1",
      reftable_id: "2",
      paymode: this.paymode.toString(),
      bankdetails_id: this.bankdetails_idinput.toString(),
      beneficiaryname: this.beni.toString(),
      bankname: this.bank.toString(),
      ifsc_code: this.ifsc.toString(),
      pay_to: this.payto.toString(),
      accno: this.acno.toString(),
      remarks: this.d?.remarks.toString(),
      payment_dtls: [
        {
          apinvhdr_id: this.headerid.toString(),
          apcredit_id: this.apcredit_idid.toString(),
          paymntdtls_amt: this.incamt.toString(),
        },
      ],
    };
    console.log("this.payemententryinput", this.payemententryinput);
    this.spinner.show();
    this.service.crtdbt(this.payemententryinput).subscribe((entryresult) => {
      console.log("entrycrt", entryresult);
      if (entryresult.status == "success") {
               let statusinput = {
                status_id: "11",
                remark: "NA",
                apinvoicehdr_id: this.headerid.toString(),
              };
        this.service.bounce(statusinput).subscribe((data) => {
          if (data["status"] == "success") {
            this.service.paymentsubmit(pay).subscribe((pvdata=>
              {
                if(pvdata?.id)
                  {
                    this.service.oracal(this.oracalinput).subscribe((result) => {
                      console.log("oracal", result);
                      if (result.Message == "SUCCESS") {
                        this.service.payementstatusupdate(paymentini_input).subscribe((payinit) => {
                          if (payinit["status"]== "success") {
                            this.notification.showSuccess(payinit["message"]);
                            this.payementsubmitflage=false
                            this.getdata();
                            this.spinner.hide();
                          } else {
                            this.payementsubmitflage=false
                            this.notification.showError(
                              payinit["message"]
                            );
                            this.getdata();
                            this.spinner.hide();
                          }
                        });
                      } else {
                        this.notification.showError(JSON.stringify(result));
                        this.payementsubmitflage=false
                        this.getdata();
                        this.spinner.hide();
                      }
                    });
                  }
                  else {
                      this.payementsubmitflage=false
                      this.spinner.hide();
                      this.notification.showError(pvdata["description"]);
                  }
              }))
          
          } else {
            this.payementsubmitflage=false
            this.spinner.hide();
            this.notification.showError(data["description"]);
          }
        });
      } else {
        this.notification.showError(entryresult["description"]);
        this.getdata();
        this.payementsubmitflage=false
        this.spinner.hide();
      }
    });
    this.payementsubmit.nativeElement.click();
  }

  updatewhilePagination() {
    let absolutedata = this.data;
    for (let idata in absolutedata) {
      if (absolutedata[idata].id == this.compareIdData) {
        this.checkboxData[idata] = !this.checkboxData[idata];
        // this.istrue=false;
      } else {
        this.checkboxData[idata] = false;
      }
    }
  }
  getecftype() {
    this.spinner.show();
    this.service.getecftype()
      .subscribe(result => {
        this.TypeList = result["data"]
        console.log("TypeList",this.TypeList)
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showWarning(error.status+error.statusText)
      });
  }
  selectionChangeType(event) {
    console.log("event",event)
   if(event.isUserInput && event.source.selected == true){
        this.invoiceTypeValue = event.source.value.id.toString();
    } 
  }
}
