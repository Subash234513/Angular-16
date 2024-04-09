import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SharedService } from './service/shared.service'
import { Idle } from '@ng-idle/core';
import { ShareService } from '../app/atma/share.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from './service/notification.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

const isSkipLocationChange = environment.isSkipLocationChange
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  redirect_tO_NAC = environment.redirect_TO_NAC;
  TimeoutGreen = environment.TimeoutGreen;
  TimeoutYellow = environment.TimeoutYellow;
  TimeoutRed = environment.TimeoutRed;
  isPremise = false; showModal: boolean;
  timed: boolean = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  countdown: any;
  adcolor: any;
  count = 100;
  timeout: any;

  // isLogged: boolean = true;
  isLoading: boolean = true;
  title = 'My First App';
  // Loginname = "";
  MODULES: any[];
  MODULES1: any[];
  TeamMembers = [];
  // MyModuleName = "";
  ionName: any;
  isIonName: boolean;
  // isSideNav: boolean;
  menurlList: any = [];
  menuId: number;
  subModuleList: any[];
  titleUrls: string;
  urlTitle: any;
  // transactionList = [];
  // masterList = [];
  isMasterList = false;
  isTransactionList = false;
  counter = 10;
  apiTimer: any
  masterUrl: any;
  otpflag = false;
  transactionUrl: any;
  branchViewName: string;
  isbranchView: boolean;
  headerName = '';
  vendorCode: string;
  vendorName: string;
  vendorCode_Name: string;
  premiseCode_Name: string
  premiseCode: string;
  premiseName: string;
  agreementCode: string;
  landLordViewCode: string;
  occupancyViewCode: string;
  premiseDetailsName: string;
  premiseHeaderTitle: string;
  public currentlyClickedCardIndex: number = 0;
  premisesData: any;
  header_Name: string;
  mobileupdationform: any;
  login_id: any;
  editflag = false;
  // mobileupdation=false;
  @ViewChild('closebutton') closebutton;
  login_code: any;
  mobileid: any;
  CommonSummaryNavigator: string;
  // entityList:any=[{id:1,value:"Client 1"},{id:2,value:"Client 2"},{id:3,value:"Client 3"},
  // {id:4,value:"Client 4"}]
  entityList: any;
  ReloadForm: FormGroup;
  @ViewChild('closeentityreload') closeentityreload;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective
  hide=true;
  hided = true;
  hideold = true;
  changepwd: FormGroup
  constructor(private idle: Idle, public cookieService: CookieService, private dataService: DataService, private formBuilder: FormBuilder, private notification: NotificationService,
    public sharedService: SharedService, private shareService: ShareService, private SpinnerService: NgxSpinnerService,
    private router: Router, private location: Location, private route: ActivatedRoute, private toastr: ToastrService) {


    // this.isPremise=this.router.getCurrentNavigation().extras.state.isPremise;
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(1);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(this.TimeoutGreen);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    //idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = '';
      this.timedOut = true;
      //let message="session expired"
      // alert(message)

      localStorage.removeItem("sessionData");
      this.cookieService.delete('my-key', '/');
      this.sharedService.Loginname = undefined;
      this.sharedService.isLoggedin = false; this.showModal = false;
      if (this.redirect_tO_NAC) {
        this.router.navigateByUrl('/logout');
      } else {
        this.router.navigateByUrl('/verify');
      }
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      // this.idleState = 'session expired in ' + countdown + ' seconds!';
      this.idleState = '(' + countdown + ' s)';
      if (countdown == 1) {
        this.timed = true;
      }
      if (countdown <= this.TimeoutYellow) {
        this.adcolor = 'red'
      }
      else {
        this.adcolor = 'grey'
      }
      if (countdown === this.TimeoutRed) {
        if (localStorage.getItem("sessionData") === null) {
          console.log("countdown", localStorage.getItem("sessionData"))
        } else {
          this.dataService.getRefresh()
            .subscribe(result => {
              console.log("countdown1", localStorage.getItem("sessionData"))
              console.log("countdown1", countdown)
              console.log("Refresh", result)
            })
        }
      }

      if (countdown === this.TimeoutRed) {
        this.showModal = true;
      }

    });

    this.reset();

    const data = this.cookieService.get("my-key")
    const item = localStorage.setItem('sessionData', data);
  } //end of constructor

  ngOnInit() {
    this.mobileupdationform = this.formBuilder.group({
      code: [''],
      name: [''],
      mobile_number: [''],
      otp: [''],
      id: ['']
    })
    this.ReloadForm = this.formBuilder.group({
      entity: [''],
    });


    // this.sharedService.isSideNav = false;
    this.sharedService.ionName.subscribe(data => {
      this.ionName = data;
      this.isIonName = this.ionName === '' ? false : true;
    });
    this.shareService.vendorViewHeaderName.subscribe(result => {
      let data: any = result;
      this.headerName = 'vendorView'
      this.vendorCode = data.code
      this.vendorName = data.name
      this.vendorCode_Name = this.vendorCode + "-" + this.vendorName;
      if (this.vendorCode_Name) {
        this.sharedService.MyModuleName = ""
      }
      if (this.vendorCode_Name === 'undefined-undefined') {
        this.headerName = '';
      }
    })

    this.shareService.branchView.subscribe(res => {
      let data: any = res;
      this.headerName = 'branchView'
      this.branchViewName = data.code + "-" + data.name;
      this.isbranchView = this.branchViewName === '' ? false : true;
      if (this.branchViewName === undefined) {
        this.headerName = ''
      }
      if (this.branchViewName === 'undefined-undefined') {
        this.headerName = ''
      }

    })
    const item = localStorage.getItem('sessionData');
    if (item !== null && item !== "") {
      let itemValue = JSON.parse(item);
      this.sharedService.Loginname = itemValue.name;
      this.sharedService.entity_Name = itemValue.entity_name;
      this.sharedService.isLoggedin = true;
      this.sharedService.loginUserId = itemValue.user_id;
      this.sharedService.loginEmpId = itemValue.employee_id;
      this.getMenuUrl();
    }
    // this.getPremiseData();

    // this.entityReload();

    this.changepwd = this.formBuilder.group({
      old_password: [''],
      new_password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      re_password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      code: ['']
    });


  }

  entityReload() {
    this.dataService.getEntityReload_List()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("entyreload-list", datas)
        this.entityList = datas;
      })
  }

  mobile_popu() {
    this.otpflag = false;
    const sessionData = localStorage.getItem("sessionData")
    let logindata = JSON.parse(sessionData);
    this.login_code = logindata.code;
    this.getmobilestatus()
  }
  getmobilestatus() {
    this.dataService.getempmobiedata(this.login_code)
      .then((results: any[]) => {
        let datas = results["data"];
        if (datas != null) {
          this.mobileupdationform.get('mobile_number').setValue(datas.mobile_number);
          this.mobileupdationform.get('code').setValue(datas.code);
          this.mobileupdationform.get('name').setValue(datas.full_name);
          this.mobileupdationform.get('id').setValue(datas.id);
          this.editflag = true;
        }
      })
  }

  submitForm() {
    this.mobileupdationform.get('otp').setValue('');
    this.otpflag = false;
    let data = localStorage.getItem("location")
    if (data == 'true') {
      this.notification.showWarning("You are trying to login from outside NAC environment.Kindly access the App via NAC environment and update your mobile number in the xxxxxxxxxx for getting the OTP")
      return false
    }
    if (this.mobileupdationform.value.mobile_number.length == 10) {
      this.count = 35;
      this.timeout = setInterval(() => {
        if (this.count > 0) {
          this.count -= 1;
        } else {
          clearInterval(this.timeout);
        }
      }, 500);
      this.dataService.mobiledatapost(this.mobileupdationform.value)
        .subscribe((results) => {
          let datas = results;
          if (results.id) {
            this.otpflag = true;
            this.mobileid = results.id;
            this.notification.showSuccess("Please enter the 8-digit verification code we sent via SMS:(we want to make sure it's you before update ")
          }
          else {
            this.notification.showWarning('failed')
            this.otpflag = false;
          }
        })
    }
  }

  updatemobile() {
    var otpdata = { "otp": this.mobileupdationform.value.otp }
    this.dataService.employeemobilenomicro(otpdata, this.mobileid)
      .then(data => {
        if (data['MESSAGE'] == 'SUCCESS') {
          this.notification.showSuccess("Success")
          this.mobileupdationform.reset()
          this.otpflag = false
          this.closebutton.nativeElement.click();
        } else {
          this.notification.showWarning(data['MESSAGE'])
          this.mobileupdationform.reset()
          this.closebutton.nativeElement.click();
        }
      })
  }


  private getMenuUrl() {
    this.dataService.getMenuUrl()
      .subscribe((results: any[]) => {
        let data = results['data'];
        this.sharedService.titleUrl = data[0].url;  
        this.sharedService.menuUrlData = data;
        let finallist =  this.sharedService.menuUrlData
        finallist.splice(0, 0, { 
          "id": 0,
          "logo": "fa fa-id-badge",
          "name": "ME",
          "role": [
              {
                  "code": "r1",
                  "id": 1,
                  "name": "Maker"
              }
          ],
          "submodule": [],
          "type": "transaction",
          "url": "hrms/empdetails" 
      })
         
        this.menurlList = finallist;
        this.titleUrls = this.sharedService.titleUrl;
        //this.router.navigateByUrl(this.titleUrls, { skipLocationChange: false });
        this.sharedService.transactionList = [];
        this.sharedService.masterList = [];  
        console.log("this.menurlList before push", this.menurlList)
        // this.menurlList.push( {id: null, name: 'Dashboard', 
        // type: "transaction", url: "hrms/dashboard", logo : null, role :[], submodule:[]})
        this.menurlList.forEach(element => {
          if (element.type === "transaction") {
            this.sharedService.transactionList.push(element); 
            console.log("urls", element )
          } else if (element.type === "master") {
            this.sharedService.masterList.push(element);
          }
        })
        // this.sharedService.transactionList.push() 
        console.log("this.menurlList", this.sharedService.transactionList);
        console.log("this.sharedService.transactionList", this.sharedService.transactionList);
      })
  }

  continue() {
    this.showModal = false;
    this.dataService.getRefresh()
      .subscribe(result => {
        this.reset();
      })
  }

  logout() {
    if (this.redirect_tO_NAC) {
      this.showModal = false;
      this.idleState = '';
      this.timedOut = true;
      this.logout1();
      this.idle.stop()
      localStorage.removeItem("sessionData");
      this.cookieService.delete('my-key', '/');
      // this.isLogged = false;
      // this.Loginname = undefined;
      this.sharedService.Loginname = undefined;
      this.sharedService.isLoggedin = false;
      this.sharedService.MyModuleName = ""
      this.headerName = '';
      // this.router.navigateByUrl('/loginlogo');
      this.currentlyClickedCardIndex = 0
      this.isMasterList = false;
      this.isTransactionList = false;
      this.router.navigateByUrl('/verify');
    } else {
      this.showModal = false;
      this.idleState = '';
      this.timedOut = true;
      this.logout1();
      this.idle.stop()
      localStorage.removeItem("sessionData");
      this.cookieService.delete('my-key', '/');
      localStorage.removeItem("menu");
      // this.isLogged = false;
      // this.Loginname = undefined;
      this.sharedService.Loginname = undefined;
      this.sharedService.isLoggedin = false;
      this.sharedService.MyModuleName = ""
      this.headerName = '';

      this.currentlyClickedCardIndex = 0
      this.isMasterList = false;
      this.isTransactionList = false;
      this.router.navigateByUrl('/verify');
    }


  }

  private logout1() {
    this.dataService.logout()
      .subscribe((results: any[]) => {
        let datas = results["data"];
      })
  }

  myModuleFunction(modrow, cardIndex) {

    this.isIonName = false;
    this.menuId = modrow.id;
    this.headerName = '';
    this.premiseHeaderTitle = ''
    this.sharedService.MyModuleName = modrow.name;
    this.currentlyClickedCardIndex = cardIndex;
    console.log("modrow.url", modrow.url, modrow)
    if (modrow.url === "/memosummary") {
      console.log("call1")
      // this.callingEmemo()
      this.router.navigate(['ememo', 'memosummary']);
      return true;
    }
    if (modrow.url === "/rems") {
      this.router.navigate(['rems/rems']);
      return true;
    }
    if (modrow.url === "/rcn") {
      this.router.navigate(['prpo/rcn']);
      return true;
    }
    if (modrow.url === "/bpa") {
      this.router.navigate(['prpo/bpa']);
      return true;
    }
    if (modrow.url === "/pca") {
      this.router.navigate(['prpo/pca']);
      return true;
    }
    if (modrow.url === "/pr") {
      this.router.navigate(['prpo/pr']);
      return true;
    }
    if (modrow.url === "/po") {
      this.router.navigate(['prpo/po']);
      return true;
    }
    if (modrow.url === "/grn") {
      this.router.navigate(['prpo/grn']);
      return true;
    }
    if (modrow.url === "/procurementmaster") {
      this.router.navigate(['prpo/procurementmaster']);
      return true;
    }
    if (modrow.url === "/vendor") {
      this.router.navigate(['atma/vendor']);
      return true;
    }
    if (modrow.url === "/vendormaster") {
      this.router.navigate(['atma/vendormaster']);
      return true;
    }
    if (modrow.url === "/master") {
      this.router.navigate(['master/master']);
      return true;
    }
    if (modrow.url === "/pprreport") {
      this.router.navigate(['ppr/pprreport']);
      return true;
    }
    if (modrow.url === "/inwardSummary") {
      this.router.navigate(['inwardd/inwardSummary']);
      return true;
    }
    if (modrow.url === "/securityguard") {
      this.router.navigate(['SGmodule/securityguardpayment']);
      return true;
    }
    if (modrow.url === "/securityguardmaster") {
      this.router.navigate(['SGmodule/sgmaster']);
      return true;
    }
    if (modrow.url === "/fa") {
      this.router.navigate(['fa/fa']);
      this.sharedService.submodulesfa.next(modrow.submodule)

      return true;
    }
    if (modrow.url === "/ta_summary") {
      this.router.navigate(['ta/ta_summary']);
      return true;
    }
    if (modrow.url === "/tamaster") {
      this.router.navigate(['ta/ta_master']);
      return true;
    }
    if (modrow.url === "/documentation") {
      this.router.navigate(['documentation/documentation']);
      return true;
    }
    if (modrow.url === "/los") {
      this.router.navigate(['dtpc/los']);
      return true;
    }
    if (modrow.url === "/ecf") {
      this.router.navigate(['ECF/ecf']);
      this.CommonSummaryNavigator = 'ECF'
      return true;
    }
    if (modrow.url === "/ap") {
      this.router.navigate(['ap/ap']);
      this.CommonSummaryNavigator = 'AP'
      return true;
    }
    if (modrow.url === "/inwardMaster") {
      this.router.navigate(['inward/inwardMaster']);
      return true;
    }
    if (modrow.url === "/inward") {
      this.router.navigate(['inward/inward']);
      return true;
    }
    if (modrow.url === "/jvsummary") {
      this.router.navigate(['JV/jvsummary']);
      this.CommonSummaryNavigator = 'JV'
      return true;
    }
    if (modrow.url === "/entrymaster") {
      this.router.navigate(['entry/entrymaster']);
      return true;
    }
    if (modrow.url === "/cmsservice") {
      this.router.navigate(['cms/cms']);
      return true;
    }
    if (modrow.url === "/cms_tran_agmt") {
      this.router.navigate(['cms/agmtbuilder']);
      return true;
    }
    if (modrow.url === "/cmsmaster") {
      this.router.navigate(['cms/cmsmaster']);
      return true;
    }
    if (modrow.url === "/report") {
      this.router.navigate(['report/report']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }
    // if (modrow.url === "/employeeinfo") {
    //   this.router.navigate(['hrms/eis']);
    //   return true;
    // }
    // if (modrow.url === "/attendance") {
    //   this.router.navigate(['hrms/attendance']);
    //   this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }
    // if (modrow.url === "/leaverequest") {
    //   this.router.navigate(['hrms/leaverequest']);
    //   this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }
    if(modrow.url === "/attendancemaster"){
      this.router.navigate(['hrms/attendancemaster']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }

    // if(modrow.url === "/employeedoument"){
    //   this.router.navigate(['hrms/employeedoument']);
    //   this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }

    if (modrow.url === "/payroll") {
      this.router.navigate(['payroll/payroll']);
      this.sharedService.submodulespayroll.next(modrow.submodule)
      return true;
    }
    if (modrow.url === "/taskreport") {
      this.router.navigate(['taskreport/tasksummary']);
      return true;
    }


    if(modrow.url === "/fet"){
      this.sharedService.fetsubmodule.next(modrow.submodule)

      this.router.navigate(['fet/main']);
      return true
    }
    if(modrow.url === '/appraisal'){
      this.sharedService.appraisalsubmodule.next(modrow.submodule)

      this.router.navigate(['appraisal/appraisal_main'])
      // this.router.navigate(['appraise/appraisaltransaction'])
      return true
    }
    if (modrow.url === "/taskmaster") {
      this.router.navigate(['taskreport/taskmaster']);
      return true;
    }
    if (modrow.url === "/employeepayroll") {
      this.router.navigate(['payingemployee/empnav']);
      return true;
    }
    if (modrow.url === "/employeepayrollmaster") {
      this.router.navigate(['payingemployee/paymasters']);
      return true;
    }
    if (modrow.url === "/taskmanagement") {
      this.router.navigate(['taskmanage/task_manage_summary']);
      return true;
    }
    // if (modrow.url === "/hrms/empdetails") {
    //   this.router.navigate(['/hrms/empdetails']);
    //   return true;
    // }
    // localStorage.removeItem('menu'); 
    localStorage.setItem('menu', JSON.stringify(modrow));
    // this.router.navigate([modrow.url], { skipLocationChange: isSkipLocationChange });//, 
    // let encode = btoa(JSON.stringify(modrow?.submodule))

    this.router.navigate(['refreshroutechange'], {skipLocationChange: true}).then(() => {
      this.router.navigate([modrow.url]);
    });



    // this.router.navigate([modrow.url]);//, 


  }

  public checkIfCardIsClicked(cardIndex: number, defaultmenu?:any): boolean {
    // if(defaultmenu === 'ME'){
    // console.log("cardindex, default", cardIndex, defaultmenu)

    //   this.currentlyClickedCardIndex = 9999999
    //   return cardIndex === this.currentlyClickedCardIndex;
    // }
    // else{
    return cardIndex === this.currentlyClickedCardIndex;
    // }
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  backNavigation() {
    this.isIonName = false;
    this.sharedService.ionName.next('')
    this.router.navigate(["/ememo/memosummary"], { skipLocationChange: isSkipLocationChange })
  }

  openNav() {
    if (this.sharedService.isSideNav) {
      document.getElementById("mySidenav").style.width = "12.02%";
      document.getElementById("main").style.marginLeft = "12%";
      document.getElementById("sidenavfoot").style.width = "12.02%";
      this.sharedService.isSideNav = false;
    } else {
      document.getElementById("mySidenav").style.width = "50px";
      document.getElementById("main").style.marginLeft = "40px";
      // document.getElementById("sidenavfooter").style.transform = "0.5s";
      document.getElementById("sidenavfoot").style.width = "50px";

      this.sharedService.isSideNav = true;
    }
  }
  masterData() {

    this.currentlyClickedCardIndex = 0
    let data = this.sharedService.masterList;
    this.masterUrl = data[this.currentlyClickedCardIndex].url
    this.sharedService.MyModuleName = data[this.currentlyClickedCardIndex].name;
    this.router.navigateByUrl(this.masterUrl, { skipLocationChange: isSkipLocationChange });
    this.isMasterList = true;
    this.isTransactionList = false;
    this.headerName = '';

    let modrow = this.masterUrl

    if (modrow === "/memosummary") {
      console.log("call1")
      this.router.navigate(['ememo', 'memosummary']);
      return true;
    }
    if (modrow === "/rems") {
      this.router.navigate(['rems/rems']);
      return true;
    }
    if (modrow === "/rcn") {
      this.router.navigate(['prpo/rcn']);
      return true;
    }
    if (modrow === "/bpa") {
      this.router.navigate(['prpo/bpa']);
      return true;
    }
    if (modrow === "/pca") {
      this.router.navigate(['prpo/pca']);
      return true;
    }
    if (modrow === "/pr") {
      this.router.navigate(['prpo/pr']);
      return true;
    }
    if (modrow === "/po") {
      this.router.navigate(['prpo/po']);
      return true;
    }
    if (modrow === "/grn") {
      this.router.navigate(['prpo/grn']);
      return true;
    }
    if (modrow === "/procurementmaster") {
      this.router.navigate(['prpo/procurementmaster']);
      return true;
    }
    if (modrow === "/vendor") {
      this.router.navigate(['atma/vendor']);
      return true;
    }
    if (modrow === "/vendormaster") {
      this.router.navigate(['atma/vendormaster']);
      return true;
    }
    if (modrow === "/master") {
      this.router.navigate(['master/master']);
      return true;
    }
    if (modrow === "/pprreport") {
      this.router.navigate(['ppr/pprreport']);
      return true;
    }
    if (modrow.url === "/inwardSummary") {
      this.router.navigate(['inwardd/inwardSummary']);
      return true;
    }
    if (modrow === "/securityguard") {
      this.router.navigate(['SGmodule/securityguardpayment']);
      return true;
    }
    if (modrow === "/securityguardmaster") {
      this.router.navigate(['SGmodule/sgmaster']);
      return true;
    }
    if (modrow === "/fa") {
      this.router.navigate(['fa/fa']);
      this.sharedService.submodulesfa.next(modrow.submodule)

      return true;
    }
    if (modrow === "/ta_summary") {
      this.router.navigate(['ta/ta_summary']);
      return true;
    }
    if (modrow === "/tamaster") {
      this.router.navigate(['ta/ta_master']);
      return true;
    }
    if (modrow === "/documentation") {
      this.router.navigate(['documentation/documentation']);
      return true;
    }
    if (modrow === "/los") {
      this.router.navigate(['dtpc/los']);
      return true;
    }
    if (modrow === "/ecf") {
      this.router.navigate(['ECF/ecf']);
      return true;
    }
    if (modrow.url === "/entrymaster") {
      this.router.navigate(['entry/entrymaster']);
      return true;
    }
    if (modrow.url === "/report") {
      this.router.navigate(['report/report']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }
    // if (modrow.url === "/employeeinfo") {
    //   this.router.navigate(['hrms/eis']);
    //   return true;
    // }
    // if (modrow.url === "/attendance") {
    //   this.router.navigate(['hrms/leaverequest']);
    //   this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }
    if(modrow.url === "/attendancemaster"){
      this.router.navigate(['hrms/attendancemaster']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }
    if (modrow.url === "/payroll") {
      this.router.navigate(['payroll/payroll']);
      this.sharedService.submodulespayroll.next(modrow.submodule)
      return true;
    }
    if (modrow.url === "/taskmaster") {
      this.router.navigate(['taskreport/taskmaster']);
      this.sharedService.submodulespayroll.next(modrow.submodule)
      return true;
    }

  }
  homes() {
    this.currentlyClickedCardIndex = 0;
    let data = this.sharedService.transactionList;
    this.transactionUrl = data[this.currentlyClickedCardIndex].url
    this.sharedService.MyModuleName = data[this.currentlyClickedCardIndex].name;
    // this.router.navigateByUrl(this.transactionUrl, { skipLocationChange: isSkipLocationChange });
    this.isTransactionList = true;
    this.isMasterList = false;
    this.headerName = '';

    let modrow = this.transactionUrl

    if (modrow === "/memosummary") {
      console.log("call1")
      this.router.navigate(['ememo', 'memosummary']);
      return true;
    }
    if (modrow === "/rems") {
      this.router.navigate(['rems/rems']);
      return true;
    }
    if (modrow === "/rcn") {
      this.router.navigate(['prpo/rcn']);
      return true;
    }
    if (modrow === "/bpa") {
      this.router.navigate(['prpo/bpa']);
      return true;
    }
    if (modrow === "/pca") {
      this.router.navigate(['prpo/pca']);
      return true;
    }
    if (modrow === "/pr") {
      this.router.navigate(['prpo/pr']);
      return true;
    }
    if (modrow === "/po") {
      this.router.navigate(['prpo/po']);
      return true;
    }
    if (modrow === "/grn") {
      this.router.navigate(['prpo/grn']);
      return true;
    }
    if (modrow === "/procurementmaster") {
      this.router.navigate(['prpo/procurementmaster']);
      return true;
    }
    if (modrow === "/vendor") {
      this.router.navigate(['atma/vendor']);
      return true;
    }
    if (modrow === "/vendormaster") {
      this.router.navigate(['atma/vendormaster']);
      return true;
    }
    if (modrow === "/master") {
      this.router.navigate(['master/master']);
      return true;
    }
    if (modrow === "/pprreport") {
      this.router.navigate(['ppr/pprreport']);
      return true;
    }
    if (modrow.url === "/inwardSummary") {
      this.router.navigate(['inwardd/inwardSummary']);
      return true;
    }
    if (modrow === "/securityguard") {
      this.router.navigate(['SGmodule/securityguardpayment']);
      return true;
    }
    if (modrow === "/securityguardmaster") {
      this.router.navigate(['SGmodule/sgmaster']);
      return true;
    }
    if (modrow === "/fa") {
      this.router.navigate(['fa/fa']);
      this.sharedService.submodulesfa.next(modrow.submodule)

      return true;
    }
    if (modrow === "/ta_summary") {
      this.router.navigate(['ta/ta_summary']);
      return true;
    }
    if (modrow === "/tamaster") {
      this.router.navigate(['ta/ta_master']
      );
      return true;
    }
    if (modrow === "/documentation") {
      this.router.navigate(['documentation/documentation']);
      return true;
    }
    if (modrow === "/los") {
      this.router.navigate(['dtpc/los']);
      return true;
    }
    if (modrow.url === "/ecf") {
      this.router.navigate(['ECF/ecf']);
      this.CommonSummaryNavigator = 'ECF'
      return true;
    }
    if (modrow.url === "/ap") {
      this.router.navigate(['ap/ap']);
      this.CommonSummaryNavigator = 'AP'
      return true;
    }
    if (modrow.url === "/entrymaster") {
      this.router.navigate(['entry/entrymaster']);
      return true;
    }
    if (modrow.url === "/report") {
      this.router.navigate(['report/report']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }

    // if (modrow.url === "/employeeinfo") {
    //   this.router.navigate(['hrms/eis']);
    //   return true;
    // }
    // if (modrow.url === "/attendance") {
    //   this.router.navigate(['hrms/leaverequest']);
    //   this.sharedService.submodulesreport.next(modrow.submodule)
    //   return true;
    // }
    if(modrow.url === "/attendancemaster"){
      this.router.navigate(['hrms/attendancemaster']);
      this.sharedService.submodulesreport.next(modrow.submodule)
      return true;
    }
    if (modrow.url === "/payroll") {
      this.router.navigate(['payroll/payroll']);
      this.sharedService.submodulespayroll.next(modrow.submodule)
      return true;
    }
    if (modrow.url === "/taskreport") {
      this.router.navigate(['taskreport/tasksummary']);
      return true;
    }

    if(modrow.url === "/employeepayroll") {
      this.router.navigate(['payingemployee/empnav'])
    }
    if (modrow.url === "/employeepayrollmaster") {
      this.router.navigate(['payingemployee/paymasters']);
      return true;
    }

    if(modrow.url === '/appraisal'){
      this.sharedService.appraisalsubmodule.next(modrow.submodule)

      this.router.navigate(['appraisal/appraisal_main'])
      return true

    }
  }

  backBranchView() {
    this.router.navigate(["/atma/vendorView"], { skipLocationChange: isSkipLocationChange })
  }

  backVendor() {
    let vendorName = "Vendor";
    this.sharedService.MyModuleName = vendorName;
    this.headerName = "";
    this.router.navigate(["/atma/vendor"], { skipLocationChange: isSkipLocationChange })
  }
  LOS() {
    this.router.navigate(["/los"], { skipLocationChange: true })
  }

  backpremise() {
    this.premisesData.forEach(element => {
      this.header_Name = element.headerName;
    });
    if (this.premisesData) {
      let index = this.premisesData.length - 1
      let data = this.premisesData[index]
      this.router.navigate([data.routerUrl], { skipLocationChange: isSkipLocationChange });
      this.sharedService.MyModuleName = this.header_Name;
      this.headerName = '';
    }
  }

  reports() {
    this.router.navigate(['/reports'], { skipLocationChange: isSkipLocationChange })

  }

  entityReloadId: any;
  select_entityName(data) {
    let list = data.id
    this.entityReloadId = list
    console.log("entity-id", this.entityReloadId)
  }

  onClickSwitchIcon() {
    this.ReloadForm.patchValue({
      "entity": ""
    })
  }


  viewDetail_Entityreload() {
    if (this.ReloadForm.value.entity === "") {
      this.toastr.error('', 'Please Enter Entity', { timeOut: 1500 });
      return false;
    }
    this.sharedService.entity_name.next(this.entityReloadId)
    this.formGroupDirective.resetForm();
    this.closeentityreload.nativeElement.click();
    this.dataService.getEntityReload_update(this.entityReloadId)
      .subscribe((result) => {
        console.log(result)
        if (result.status == "success") {
          this.notification.showSuccess("Updated Successfully")
          this.router.navigate(["/atma/vendor"], {
            skipLocationChange: true
          })
          // this.router.navigate([this.router.url])
          // window.location.reload();
        } else {
          this.notification.showError(result.description)
        }
      })

    // this.router.navigate(['/verify'], { skipLocationChange: true })
  }
  // getPremiseData() {
  //   this.remsshareService.premiseBackNavigation.subscribe(result => {
  //     if (result != null) {
  //       this.premisesData = result.data
  //       let index = this.premisesData.length - 1
  //       let data = this.premisesData[index]
  //       this.headerName = 'REMS';
  //       this.premiseCode = data.code;
  //       this.premiseName = data.name;
  //       if (data.title == BackNavigationData.premiseView) {
  //         this.premiseCode_Name = this.premiseCode + " (" + this.premiseName + ")";
  //       } else if (data.title == BackNavigationData.agreementView) {
  //         this.premiseCode_Name = this.premiseCode;
  //       } else if (data.title == BackNavigationData.landLordView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseName;
  //       } else if (data.title == BackNavigationData.occupancyView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseCode;
  //       } else if (data.title == BackNavigationData.premiseDetailsView) {
  //         this.premiseCode_Name = this.premiseCode_Name + " / " + this.premiseName;
  //       } else if (data.title == BackNavigationData.premisesIdentificationView) {
  //         this.premiseCode_Name = this.premiseCode + "(" + this.premiseName + ")";
  //       } else if (data.title == BackNavigationData.premisesDocInfoView) {
  //         this.premiseCode_Name = this.premiseName;
  //       } else if (data.title == BackNavigationData.scheduleView) {
  //         this.premiseCode_Name = this.premiseCode;
  //       } else if (data == "") {
  //         this.sharedService.MyModuleName = "REMS"
  //       }
  //     }
  //   })
  // }


  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {
    // event.preventDefault();
    event.stopPropagation();
    // console.log(event.code)
    if(event.altKey && event.code == 'KeyL' && this.sharedService.isLoggedin  ){
      console.log('logout')
      this.logout()
    }

}





login_codepwd: any;
@ViewChild('changepassword')changepassword;
    change_pwd(){
      let control = this.change_pwd 
      console.log("cointrol of password", control )
      this.SpinnerService.show();
      if (this.changepwd.value.old_password === "") {
        this.toastr.error('', 'Please Enter Old Password', { timeOut: 1500 });
        this.SpinnerService.hide();
        return false;
      }
      if (this.changepwd.value.new_password === "") {
        this.toastr.error('', 'Please Enter New Password', { timeOut: 1500 });
        this.SpinnerService.hide();
        return false;
      }
      if (this.changepwd.value.re_password === "") {
        this.toastr.error('', 'Please Enter Confirm Password', { timeOut: 1500 });
        this.SpinnerService.hide();
        return false;
      }
      const sessionData = localStorage.getItem("sessionData")
      let logindata = JSON.parse(sessionData);
      this.login_codepwd = logindata.code;
      this.changepwd.value.code = this.login_codepwd;
      this.dataService.getchange_pwd(this.changepwd.value)
        .subscribe((result) => {
          console.log(result)
      if (result.status == "success") {
      this.notification.showSuccess("Password Changed")
      this.changepassword.nativeElement.click();
      this.logout();
      this.SpinnerService.hide();
        } else {
          this.notification.showError(result.description)
          this.SpinnerService.hide();
        }
        }
        ,
        error => {
          this.SpinnerService.hide();
        }
        )
    }


    Dashboard(){
      // this.router.navigate(['hrms/dashboard']);
    }

    navigateappraisal(){
      // this.router.navigate(['appraisal_module/main']);
      this.router.navigate(['appraisal/appraisal_main'])
    }
    
    MydetailsView(){
      // this.router.navigate(['hrms/empdetails']);
    }








}

export enum BackNavigationData {
  agreementView = "AgreementView",
  premiseView = "PremiseView",
  landLordView = "LandLordView",
  occupancyView = "OccupancyView",
  premiseDetailsView = "PremiseDetailsView",
  premisesIdentificationView = "PremisesIdentificationView",
  premisesDocInfoView = "PremisesDocInfoView",
  scheduleView = "ScheduleView"
}