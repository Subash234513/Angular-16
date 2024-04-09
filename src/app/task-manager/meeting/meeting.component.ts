import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { formatDate, DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/service/notification.service';
import { SharedService } from '../../service/shared.service';
import { TaskManagerService } from 'src/app/task-manager/task-manager.service';
import { TaskService } from 'src/app/taskreport/task.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, fromEvent } from "rxjs";
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map,
} from "rxjs/operators";
interface TeamObject {
  user_id: number;
  type: number;
}
import data from 'jquery';

export interface emp {
  id: string;
  name: string;
}

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  send_value: string;

  meetList: any;
  pagesizemeetlog = 10;

  meetView: any;
  // pagesizeviewlog = 10;

  meetingSummaryForm: FormGroup;
  meetingpopup:FormGroup;
  meetingsubmit:FormGroup;
  getmeetingSummary: boolean;
  viewList: any;
  from_date: any;
  to_date: any;
  meetingViewForm: FormGroup;
  pageNumb: any = 1;
  pageNumbers: any = 1;
  has_nextStoryTask:boolean = true;
  has_previousStoryTask:boolean = true;
  presentpageStoryTask: number = 1;
  isShowView: boolean = false;
  isShowmeet: boolean = true;
  isShowAdd: boolean;
  isShowMeeting: boolean;
  meetPopups: boolean = false;
  pageNumbi : any = 1;
  updatePaginationIss: any;
  updatePaginationSpr: any;
  has_sprintnext: any;
  isLastPage: boolean;
  pageMeet : any = 1;
  meetingAddForm: FormGroup;
  meetingPopupForm: FormGroup;
  selectemployee: any;
  selectclient: any;
  empdataarray:any[]=[ ]
  meetingdataarray:any[]=[]
  typeList = [{ id: 3, text: "Canceled" }, { id: 2, text: "Meeting Over" },{ id: 4, text: "Rescheduled" }]
  editList = [{ id: 2, text: "Attended" }, { id: 3, text: "Not Attended" }]
  statuslist = [{id: 1, text: "Scheduled" },{ id: 4, text: "Rescheduled" }, { id: 2, text: "Meeting Over" },{ id: 3, text: "Canceled" }]
  @ViewChild("autoemp") matempAutocomplete: MatAutocomplete;
  @ViewChild("autoclient") matclientAutocomplete: MatAutocomplete;
  @ViewChild("closeModal")  closeModal : ElementRef ;
  @ViewChild("closeModal1")  closeModal1 : ElementRef ;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("empInput") empInput: any;
  @ViewChild("positionInput")positionInput : any;
  @ViewChild("clientInput") clientInput: any;
  isLoading: boolean=false;
  empList: Array<emp>;
  clientList: Array<emp>;
  has_next: any;
  has_previous: any;
  currentpage: number=1;
  currentpagenew: number=1;
  empId: any;
  empdata: any;
  clientdata: any;
  selectedValue: any;
  position_id: any;
  posdata: { type: number; };
  employeeid: number;
  selectedId: number = 2;
  showPopup: boolean;
  Rescheduled:boolean
  popup_id: number;
  meeting_ID:number;
  meetdes: string;
  meetaction:boolean;
  showeditbutton:boolean;
  meetedit:boolean;
  showactionbutton:boolean;
  editid: any;
  resechduleform: FormGroup;
  // meetingnote: any;

  constructor( private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService, private errorHandler: ErrorHandlingServiceService,
    private TaskManagerService: TaskManagerService, private datepipe: DatePipe, private taskreportservice: TaskService,
    private notification: NotificationService, private datePipe: DatePipe, private shareservice: SharedService,
    private dialog: MatDialog, private taskmanagerservice: TaskManagerService) { }

  ngOnInit(): void {
    this.meetingSummaryForm = this.fb.group({
      from_date :'',
      to_date :  '',
      query:'',
      meetstatus:''
    })
    this.meetingpopup = this.fb.group({
      popupmom:''
    })
    this.resechduleform = this.fb.group({
      fromdate:'',
      todate:''
    })
    this.meetingsubmit = this.fb.group({
      from_dates :'',
      to_dates :  '',
      name:''
    })

    this.meetingViewForm = this.fb.group({
      // startdate :'',
      // enddate :  ''
    })

    this.meetingSummary(1)
    
    // this.meetingView()

    this.meetingAddForm = this.fb.group({
      
    })

    this.meetingPopupForm = this.fb.group({
      selectemployee:[''],
      selectclient:['']
    })
  }

  backmeetsummary(){
    this.isShowMeeting = false;
    this.isShowView = false;
    this.isShowmeet = true;
    this.meetingSummary(1);
    this.currentpagenew = 1;


    
  }

  previousPageSummary() {
    this.pageNumb--;
    this.updatePaginationSpr();
    
  }
  nextPageSummary() {
    this.pageNumb++;
    if(!this.has_sprintnext)
    {
      this.isLastPage = false;
    }
    else
    {
      this.isLastPage = true;
    }
    this.updatePaginationSpr();

  }

  onclickMeetingView(id){
    this.SpinnerService.show()
   
    this.meeting_ID=id.id
    console.log(this.meeting_ID)
    this.isShowView = true;
    this.isShowMeeting = false;
    this.isShowmeet = false;
    this.meetingView(this.meeting_ID)
    this.SpinnerService.hide()
   
  }

  onclickMeetingAdd(){
    this.isShowAdd = true;
    this.isShowmeet = false;
    this.isShowView = false;

  }

  openPopup(){
    this.meetPopups = !this.meetPopups;
  }
  onSelectionChange(event): void {
    this.selectedValue = event.value;
  }
  
savePopup() {
  if (this.meetingPopupForm.value.selectemployee==='' || this.meetingPopupForm.value.selectemployee===null || this.meetingPopupForm.value.selectemployee===undefined) {
          this.toastr.error("Choose Employee");
          
          return false; 
        }
        
        // if (this.meetingPopupForm.value.selectclient==='' || this.meetingPopupForm.value.selectclient===null || this.meetingPopupForm.value.selectclient=== undefined) {
        //   this.toastr.error("choose Type");
          
        //  return;
        // }
  const empdata = this.meetingPopupForm.get('selectemployee').value;
  const newEmployeeId = empdata.id;

  const isEmployeeAlreadySelected = this.empdataarray.some(item => item.employee.id === newEmployeeId);

  if (isEmployeeAlreadySelected) {
    this.toastr.error("This Employee is Already Selected");
    this.empInput.nativeElement.value = '';
    this.clientList = [];
    this.empList = [];
    return;
  }

  // this.employeeid = newEmployeeId;
  // const clientdata = this.meetingPopupForm.get('selectclient').value;
  this.empdataarray.push({ employee: empdata, client: this.selectedValue });
  this.empInput.nativeElement.value = '';
  this.clientList = [];
  this.empList = [];
}
nextpage(){
  this.currentpagenew=this.currentpagenew+1
  this.meetingSummary(this.currentpagenew)
}
previouspage(){
  this.currentpagenew=this.currentpagenew-1
  this.meetingSummary(this.currentpagenew)

  
}
  meetingSummary(page) {
    this.SpinnerService.show();

    this.TaskManagerService.getmeetingSummary(page)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.meetList = result['data']
        let dataPagination = result['pagination'];
        this.meetPopups = false;
        if (this.meetList.length > 0) {
          this.has_nextStoryTask = dataPagination.has_next;
          this.has_previousStoryTask = dataPagination.has_previous;
          this.presentpageStoryTask = dataPagination.index;
        }
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }
  meetSearch(){
    let formValue = this.meetingSummaryForm.value
    formValue.from_date = this.datepipe.transform(formValue.from_date, 'yyyy-MM-dd');
    formValue.to_date = this.datepipe.transform(formValue.to_date, 'yyyy-MM-dd');
    
    console.log("Search Values", formValue)
    this.send_value = ""
    
    if (formValue.query) {
      // this.send_value =  &query + formValue.query
      this.send_value=this.send_value+"&query="+formValue.query
    }
    if(formValue.meetstatus){
      this.send_value=this.send_value+"&meeting_status="+formValue.meetstatus.id
    }
    if (formValue.from_date && formValue.from_date != undefined ) {
      this.send_value=this.send_value+"&from_date="+formValue.from_date
    }
    if (formValue.to_date && formValue.to_date != undefined) {
      this.send_value=this.send_value+"&to_date="+formValue.to_date
    }
    // let page = 1;
    this.TaskManagerService.searchmeetcategory(this.send_value).subscribe(result => {
      this.meetList = result['data'];
  
  
    })
    
  }

  resetSearch(){
    this.meetingSummaryForm.reset();
    
    this.meetingSummary(1)
    // this.statuslist=[]
  }

  meetingView(id) {
    
 this.SpinnerService.show()
    this.TaskManagerService.getmeetingView(id)
      .subscribe(result => {
        
        
        this.SpinnerService.hide();
        this.meetView = result;
        this.viewList = result.meeting_attendees;
        // console.log("meetview",this.meetView);
        // let dataPagination = result['pagination'];
        // if (this.meetView.length > 0) {
        //   this.has_nextStoryTask = dataPagination.has_next;
        //   this.has_previousStoryTask = dataPagination.has_previous;
        //   this.presentpageStoryTask = dataPagination.index;
        //}
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }
  employeename() {
    let empkeyvalue: String = "";
    // this.getemp(empkeyvalue);
    this.meetingPopupForm
      .get("selectemployee")
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.taskmanagerservice.get_emp(value, 1).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.empList = datas;
      });
  }
  clientname() {
    // let clientkeyvalue: String = "";
    // // this.getclient(clientkeyvalue);
    // this.meetingPopupForm
    //   .get("selectclient")
    //   .valueChanges.pipe(
    //     debounceTime(100),
    //     distinctUntilChanged(),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap((value) =>
    //       this.taskmanagerservice.get_client(value).pipe(
    //         finalize(() => {
    //           this.isLoading = false;
    //         })
    //       )
    //     )
    //   )
    //   .subscribe((results: any[]) => {
    //     let datas = results;
    //     this.clientList = datas;
    //   });
      this.TaskManagerService.get_client().subscribe(res=>{
        this.clientList = res
      })
  }


  empScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, "scroll")
          .pipe(
            map((x) => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((x) => {
            const scrollTop =
              this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight =
              this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight =
              this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.taskmanagerservice
                  .get_emp(
                    this.empInput.nativeElement.value,
                    this.currentpage + 1
                  )
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.empList = this.empList.concat(datas);
                    if (this.empList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }

  // clientScroll() {
  //   setTimeout(() => {
  //     if (
  //       this.matclientAutocomplete &&
  //       this.autocompleteTrigger &&
  //       this.matclientAutocomplete.panel
  //     ) {
  //       fromEvent(this.matclientAutocomplete.panel.nativeElement, "scroll")
  //         .pipe(
  //           map((x) => this.matclientAutocomplete.panel.nativeElement.scrollTop),
  //           takeUntil(this.autocompleteTrigger.panelClosingActions)
  //         )
  //         .subscribe((x) => {
  //           const scrollTop =
  //             this.matclientAutocomplete.panel.nativeElement.scrollTop;
  //           const scrollHeight =
  //             this.matclientAutocomplete.panel.nativeElement.scrollHeight;
  //           const elementHeight =
  //             this.matclientAutocomplete.panel.nativeElement.clientHeight;
  //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
  //           if (atBottom) {
  //             if (this.has_next === true) {
  //               this.taskmanagerservice
  //                 .get_client(
  //                   this.clientInput.nativeElement.value,
  //                   this.currentpage + 1
  //                 )
  //                 .subscribe((results: any[]) => {
  //                   let datas = results["data"];
  //                   let datapagination = results["pagination"];
  //                   this.clientList = this.clientList.concat(datas);
  //                   if (this.clientList.length >= 0) {
  //                     this.has_next = datapagination.has_next;
  //                     this.has_previous = datapagination.has_previous;
  //                     this.currentpage = datapagination.index;
  //                   }
  //                 });
  //             }
  //           }
  //         });
  //     }
  //   });
  // }
  public displayemp(autoemp?: emp): string | undefined {
    return autoemp ? autoemp.name : undefined;
  }
  getemp(empkeyvalue) {
    this.taskmanagerservice.get_emp(empkeyvalue,1).subscribe((results: any[]) => {
      let datas = results["data"];
      this.empList = datas;
    });
  }

  public displayclient(autoclient?: emp): string | undefined {
    return autoclient ? autoclient.name : undefined;
  }
  private getclient(clientkeyvalue) {
    this.taskmanagerservice.getclientSearch(clientkeyvalue,data).subscribe((results: any[]) => {
      let datas = results["data"];
      this.clientList = datas;
      // console.log("city", datas)
    });
  }

  emps(data) {
    this.empId = data;
    this.meetingPopupForm.patchValue({
    
    });
  }

  clients(data) {
    this.empId = data;
    this.meetingPopupForm.patchValue({
    
    });
  }
  addEmpsubmit(){
    if (this.meetingsubmit.value.name === "") {
      this.toastr.error("Please Enter Meeting Description");
      return false;
    }
    if (this.meetingsubmit.value.from_dates === "") {
      this.toastr.error("Please Choose From date");
      return false;
    }
    if (this.meetingsubmit.value.to_dates === "") {
      this.toastr.error("Please Choose To date");
      return false;
    }
    if (this.meetingPopupForm.value.selectemployee === "") {
      this.toastr.error("Please Choose Employee");
      return false;
    }
    if (this.meetingdataarray.length < 2) {
      this.toastr.error("Atleast need two employees to create a meeting");
      return false;
    }
   
    let formvalue=this.meetingsubmit.value
    formvalue.from_dates=this.datePipe.transform(formvalue.from_dates,'yyyy-MM-dd HH:mm:ss');
    formvalue.to_dates=this.datePipe.transform(formvalue.to_dates,'yyyy-MM-dd HH:mm:ss');
    // this.meetingdataarray.push({empid,this.posdata})
    let obj = {
      "description":formvalue.name,
      "from_date":formvalue.from_dates,
      "to_date":formvalue.to_dates,
       "user_arr":this.meetingdataarray
    }
    this.taskmanagerservice.projectteamsubmit(obj).subscribe(result => {
      if(result.code){
        this.notification.showError(result.description)
      }
      else{
      
        this.notification.showSuccess(result.message)
        this.meetingSummary(1)
      }
     
      
    })
    this.meetingsubmit.reset()
    this.meetingPopupForm.reset()
    this.empdataarray=[]
    this.clientList=[]
    this.empList=[]
    this.meetingdataarray=[]
    this.isShowAdd=false
    this.isShowmeet=true
   
    
  }
  position(clint_id){
    const empid = this.meetingPopupForm.get('selectemployee').value.id;
    this.position_id=clint_id.id
    let type;

    if (this.position_id === 1 || this.position_id === 2 || this.position_id === 3) {
      type = this.position_id;
    }
  
    if (type !== undefined) {
      const team_data: TeamObject = {
        type: type,
        user_id: empid,
      };
  
      this.meetingdataarray.push(team_data);
    }
    
  }
  backsummary(){
    this.isShowAdd=false;
    this.isShowmeet=true;
    this.meetingsubmit.reset()
    this.meetingPopupForm.reset()
    this.empdataarray=[]
    this.clientList=[]
    this.empList=[]
    this.meetingdataarray=[]
    this.meetingSummary(1)
  }
  // checkAndOpenPopup(pop_id) {
  //   this.popup_id=pop_id.id
  
  //   if (this.popup_id === 2) {
      
  //     this.showPopup = true;
  //   }
  // }
  checkAndOpenPopup(selectedValue) {
    this.popup_id = selectedValue.id;
    if(this.popup_id === 3){
      var answer = window.confirm("Do you want to cancel?");
    }
    if(answer){
      let obj={
        "id":this.meeting_ID,
      "meeting_status":this.popup_id,
      "meeting_note":null
     }
      this.taskmanagerservice.popupmeetsubmit(obj).subscribe(result => {
        if(result.code){
          this.notification.showError(result.description)
        }
        else{
        
          this.notification.showSuccess(result.message)
          this.meetingView(this.meeting_ID)
        }
      })
    }
    if (this.popup_id === 2) {
      this.showPopup = true;
      this.Rescheduled = false;
    } 
    else if(this.popup_id === 4){
      this.Rescheduled = true;
      this.showPopup = false;
    }
    else {
      this.showPopup = false;
      this.Rescheduled = false;
    } 
   
   
  }
  clickback(){
    this.showPopup = false;
  }
  resechduleback(){
    this.Rescheduled = false;
  }
  submitepopupmeeting(){
    if (this.meetingpopup.value.popupmom==='' || this.meetingpopup.value.popupmom===null || this.meetingpopup.value.popupmom===undefined  ) {
      this.toastr.error("Choose MOM");
      
      return; 
    }
    
    let meetingnote=this.meetingpopup.get("popupmom").value
    // this.meetdes=meetingnote.popupmom
    // let meetid=this.meeting_ID
    // let popid=this.popup_id

    let obj= {
      "id":this.meeting_ID,
      "meeting_status":this.popup_id,
      "meeting_note":meetingnote
  }
    this.taskmanagerservice.popupmeetsubmit(obj).subscribe(result => {
      if(result.code){
        this.notification.showError(result.description)
      }
      else{
      
        this.notification.showSuccess(result.message)
        this.meetingView(this.meeting_ID)
      }
     
      
    })
    this.meetingpopup.reset()
    this.showPopup = false;

  }
  remove(data){
    this.empdataarray = this.empdataarray.filter(item => item !== data);

  }
  meetingEdit(editing_id){
    this.editid=editing_id.id
    if(this.editid===2){
      let obj={
        "id": this.meeting_ID,
        "response":this.editid
      }
      this.taskmanagerservice.meetEditDropdown(obj).subscribe(result => {
        if(result.code){
          this.notification.showError(result.description)
        }
        else{
        
          this.notification.showSuccess(result.message)
          this.meetingView(this.meeting_ID)
        }
       
      })

    }
    if(this.editid===3){
      let obj={
        "id": this.meeting_ID,
        "response":this.editid
      }
      this.taskmanagerservice.meetEditDropdown(obj).subscribe(result => {
        if(result.code){
          this.notification.showError(result.description)
        }
        else{
        
          this.notification.showSuccess(result.message)
          this.meetingView(this.meeting_ID)
        }
       
      })

    }
    


  }
  submiteresechdule(){
  
    
    let formvalue=this.resechduleform.value
    formvalue.fromdate=this.datePipe.transform(formvalue.fromdate,'yyyy-MM-dd HH:mm:ss');
    formvalue.todate=this.datePipe.transform(formvalue.todate,'yyyy-MM-dd HH:mm:ss');
    

    let obj= {
      "id":this.meeting_ID,
      "meeting_status":this.popup_id,
      "from_date":formvalue.fromdate,
      "to_date":formvalue.todate
  }
    this.taskmanagerservice.popupmeetsubmit(obj).subscribe(result => {
      if(result.code){
        this.notification.showError(result.description)
      }
      else{
      
        this.notification.showSuccess(result.message)
        this.meetingView(this.meeting_ID)
      }
     
      
    })
    this.resechduleform.reset()
    this.Rescheduled = false;
  }
  deletetask_meet(){
    
    if (confirm("Confirm?")) {
    this.SpinnerService.show();
    this.taskmanagerservice.deletemeeting(this.meeting_ID)
        .subscribe(res => {
          console.log("task delete", res)
          if(res.code){
            this.notification.showError(res.description)
            this.SpinnerService.hide()
          }
          else{
          
            this.notification.showSuccess(res.message)
           this.isShowView=false
           this.isShowmeet=true
           this.meetingSummary(1)
           this.SpinnerService.hide()
          }
          
          
        }
        
        
        )}
     
        this.SpinnerService.hide()
  }
  clearToDate()
  {
    this.meetingpopup.value.to_dates == '';
  }

}
// (opened)="clientScroll()"