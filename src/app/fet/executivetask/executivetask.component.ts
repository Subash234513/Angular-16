import { DatePipe, FormatWidth } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';
import { FetserviceService } from '../fetservice.service';

export interface employee {
  full_name: string;
  id: number;
}

export interface teamLead {
  id: string;
  name: string;
}

export interface unitHead {
  id: string;
  name: string;
}

@Component({
  selector: 'app-executivetask',
  templateUrl: './executivetask.component.html',
  styleUrls: ['./executivetask.component.scss']
})
export class ExecutivetaskComponent implements OnInit {
  isLoading: boolean;
  unitheadList: any;

  @ViewChild('unitHD') matunitheadAutocomplete: MatAutocomplete;
  @ViewChild('unitHDInput') unitHDInput: any;

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('teamld') matteamleadAutocomplete: MatAutocomplete;
  @ViewChild('teamldInput') teamldInput: any;

  has_next: boolean;
  currentpage: number;
  has_previous: any;
  teamldList: any;
  executiveeditid: any;
  executivedata: any;
  customerdata: any;
  taskdropdowndata: any;
  employeedropdown: any;
  employee_has_next: any;
  employee_has_previous: any;
  employeecurrentpage: any;


  constructor(private fb: FormBuilder, private fetservice: FetserviceService, private datepipe: DatePipe,
    private notification: NotificationService, private router: Router, private activateroute: ActivatedRoute) { }

  executiveform: FormGroup

  ngOnInit(): void {

    this.activateroute.queryParams.subscribe(
      params => {
        console.log('logs', params)
        if (params['executiveid']) {
          // this.goalid = atob(params['goalid']);
          this.executiveeditid = params['executiveid']
          console.log('headereditid', this.executiveeditid)
        }

      }
    )
    this.executiveform = this.fb.group({
      type: [''],
      unit_head: [''],
      team_lead: [''],
      task: [''],
      // customer: [''],
      start_date: [''],
      end_date: [''],
      actual_end_date: [''],
      actual_start_date: [''],
 
      reason_for_delay: [''],
      id:[''],
      taskfollow:new FormArray([])
    });

  

    // (this.executiveeditid) ? this.executiveeditdata(this.executiveeditid) : this.addSection()

    if(this.executiveeditid){
      this.executiveeditdata(this.executiveeditid)
    }
    else{
      this.addSection()
      this.getcustomerdatafromgold(1)
    }

    this.gettaskdata()

  }

  createItem() {
  
    let group = this.fb.group({
      remarks: ['', Validators.required],
      employee_id: ['', Validators.required],
      executive_action: ['', Validators.required],
      delay_days: ['', Validators.required],
      task_status: ['', Validators.required],
      is_complete: [''],
      customer: [''],
    });

    return group;
  }
  
  addSection() {
    const data = this.executiveform.get('taskfollow') as FormArray;
    data.push(this.createItem());
  }

  fieldGlobalIndex(index) {
    let dat = index;
    return dat
  }

  executiveeditdata(id) {
    this.fetservice.executiveedit(id).subscribe(
      result => {
        this.executiveform.patchValue({
          type: result?.type,
          unit_head: result?.unit_head,
          team_lead: result?.team_lead,
          task: result?.task,
          // customer: result?.customer,
          start_date: result?.start_date,
          end_date: result?.end_date,
          actual_end_date: result?.actual_end_date,
          actual_start_date: result?.actual_start_date,
          // delay_days: result.delay_days,
          // task_status: result.task_status,
          // executive_action: result.executive_action,
          reason_for_delay: result?.reason_for_delay,
          // comments: result?.taskfollow?.comments,
          id:result?.id,
          // taskfollow:this.executivetaskfollowedit(result?.taskfollow)
        })
        this.executivetaskfollowedit(result?.taskfollow)
      }
    )
  }

  executivetaskfollowedit(value){
 
    for (let detail of value) {

      console.log('check requirements', detail);

      const control  = this.executiveform.get('taskfollow') as FormArray;

      control.push(this.fb.group({
        id: detail?.id,
        is_complete: this.datepipe.transform(detail?.is_complete, 'yyyy-MM-dd'),
        customer: detail?.customer,
        task_status: detail?.task_status?.id,
        delay_days: detail?.delay_days,
        executive_action: detail?.executive_action,
        // toplace:toplace,
        employee_id: detail?.employee_id,
        remarks: detail?.remarks
      })
      )

    }
  }

  getFormArray(): FormArray {
    return this.executiveform.get('taskfollow') as FormArray;
  }

  executivesubmit() {

    let obj = {
      type: this.executiveform.value.type,
      unit_head: this.executiveform.value.unit_head.id,
      team_lead: this.executiveform.value.team_lead.id,
      task: this.executiveform.value.task,
      customer: this.executiveform.value.customer,
      start_date: this.executiveform.value.start_date ? this.datepipe.transform(this.executiveform.value.start_date, 'yyyy-MM-dd') : '',
      end_date: this.executiveform.value.end_date ? this.datepipe.transform(this.executiveform.value.end_date, 'yyyy-MM-dd') : '',
      actual_end_date: this.executiveform.value.actual_end_date ? this.datepipe.transform(this.executiveform.value.actual_end_date, 'yyyy-MM-dd') : '',
      actual_start_date: this.executiveform.value.actual_start_date ? this.datepipe.transform(this.executiveform.value.actual_start_date, 'yyyy-MM-dd') : '',
      delay_days: this.executiveform.value.delay_days,
      task_status: this.executiveform.value.task_status,
      executive_action: this.executiveform.value.executive_action,
      reason_for_delay: this.executiveform.value.reason_for_delay,
      taskfollow: [],
      id:this.executiveform.value.id
    }


    for(let i=0;i<this.executiveform.value.taskfollow.length;i++){
      let obj1={
        id: this.executiveform.value.taskfollow[i].id,
        is_complete:this.executiveform.value.taskfollow[i].is_complete ? this.datepipe.transform(this.executiveform.value.taskfollow[i].is_complete, 'yyyy-MM-dd') : '',
        customer: this.executiveform.value.taskfollow[i].customer,
        task_status:this.executiveform.value.taskfollow[i].task_status,
        delay_days: this.executiveform.value.taskfollow[i].delay_days,
        executive_action: this.executiveform.value.taskfollow[i].executive_action?.id,
        employee_id: this.executiveform.value.taskfollow[i].employee_id?.id? this.executiveform.value.taskfollow[i].employee_id?.id:'',
        remarks: this.executiveform.value.taskfollow[i].remarks,
      }

      if(obj1.id == '' || obj1.id == null){
        delete obj1.id
      }

      obj.taskfollow.push(obj1)

    }

    if(this.executiveform.value.id == '' || this.executiveform.value.id == null){
      delete obj.id
    }

    this.fetservice.executivesubmit(obj).subscribe(
      result => {
        if (result.status == "success") {
          this.notification.showSuccess(result.message)
          this.oncancelclick()
        }
      }
    )
  }

  oncancelclick() {
    this.router.navigate(['/fet/main/executivecustomersummary'])
  }

  unitHead() {
    let unithdkeyvalue: String = "";
    this.getUnitHead(unithdkeyvalue);

    this.executiveform.get('unit_head').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.fetservice.getUnitHeadFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.unitheadList = datas;

      })

  }


  private getUnitHead(unithdkeyvalue) {
    this.fetservice.getUnitHeadFilter(unithdkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.unitheadList = datas;
      })
  }


  autocompleteuntheadScroll() {
    setTimeout(() => {
      if (
        this.matunitheadAutocomplete &&
        this.autocompleteTrigger &&
        this.matunitheadAutocomplete.panel
      ) {
        fromEvent(this.matunitheadAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matunitheadAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matunitheadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matunitheadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matunitheadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.fetservice.getUnitHeadFilter(this.unitHDInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.unitheadList = this.unitheadList.concat(datas);
                    if (this.unitheadList.length >= 0) {
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

  public displayFnunitHD(unithd?: unitHead): string | undefined {
    return unithd ? unithd.name : undefined;
  }


  TeamLead() {
    let teamldkeyvalue: String = "";
    this.getTeamLead(teamldkeyvalue);

    this.executiveform.get('team_lead').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.fetservice.getTeamLeadFilter(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;

      })

  }

  private getTeamLead(teamldkeyvalue) {
    this.fetservice.getTeamLeadFilter(teamldkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.teamldList = datas;
      })
  }

  autocompleteteteamldScroll() {
    setTimeout(() => {
      if (
        this.matteamleadAutocomplete &&
        this.autocompleteTrigger &&
        this.matteamleadAutocomplete.panel
      ) {
        fromEvent(this.matteamleadAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matteamleadAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matteamleadAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matteamleadAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matteamleadAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.fetservice.getTeamLeadFilter(this.teamldInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.teamldList = this.teamldList.concat(datas);
                    if (this.teamldList.length >= 0) {
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

  public displayFnteamld(teamld?: teamLead): string | undefined {
    return teamld ? teamld.name : undefined;
  }

  executivedropdown(value){
    this.fetservice.executivedropdown(value).subscribe(
      result=>{
        this.executivedata=result['data'];
      }
    )
  }

  getcustomerdatafromgold(value){
    this.fetservice.getexecutivedropdown(value).subscribe(
      result=>{
        this.customerdata=result['data']

        for(let i=0;i<this.customerdata.length;i++){
          this.customerdata=result['data']
          // this.addSection()
          // this.executiveform.value.taskfollow[i].customer=this.customerdata[i]
        }

      }
    )
  }

  

  gettaskdata(){
    this.fetservice.gettaskdropdown().subscribe(
      result=>{
        this.taskdropdowndata=result['data'];
      }
    )
  }

  getemployeedropdown(value, page) {
    this.isLoading = false
    this.fetservice.getemployeedropdown(value, page).subscribe(results => {
      this.employeedropdown = results['data']
      let datapagination = results["pagination"];
      this.isLoading = true

      if (this.employeedropdown.length >= 0) {
        this.employee_has_next = datapagination.has_next;
        this.employee_has_previous = datapagination.has_previous;
        this.employeecurrentpage = datapagination.index;
      }
    })

  }

  displayFnname(employee: employee): string {
    return employee.full_name
  }

}
