import { Component, OnInit, EventEmitter, Output,ViewChild } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { Router } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, FormArrayName } from '@angular/forms';
import * as imp from '../../AppAutoEngine/import-services/CommonimportFiles'
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, from, fromEvent, } from 'rxjs';


export interface Sprint {
  id: string;
  name: string;
}

export interface emplistss {
  id: string;
  name: string;
}
@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {
  storiesForm:FormGroup;
  sprintList: Array<Sprint>;
  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage:number =1;


  
  teamList: emplistss[];
  public chipSelectedTeam: emplistss[] = [];
  public chipSelectedTeamid = [];
  team_arr = new FormControl('');



    // sprint 
    @ViewChild('spt') matsprintAutocomplete: MatAutocomplete;
    @ViewChild('sprintInput') sprintInput: any;

    // team
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    // @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
    @ViewChild('tem') matteamAutocomplete: MatAutocomplete;
    @ViewChild('teamInput') teamInput: any;


  constructor(private fb: FormBuilder, private router: Router, private SpinnerService: imp.NgxSpinnerService,
    private errorHandler: imp.ErrorHandlingServiceService, private datePipe: DatePipe, private notify: imp.ToastrService,
    private taskmanagerservice: TaskManagerService) { }
 
 
  @Output() OnSubmit = new EventEmitter<any>();
  @Output() OnCancel = new EventEmitter<any>();
 
  ngOnInit(): void {
    
    this.storiesForm = this.fb.group({
      name: '',
      details:'',
      sprint: '',

    })
    let key: any = ""
    this.getemp(key);
  }


  
  BackToSummary(){
    this.OnCancel.emit()

  }

  createFormate() {
    let data = this.storiesForm.controls;
    
    let storyclass = new story();
    storyclass.name = data['name'].value;
    storyclass.sprint_id = data['sprint'].value.id;
    storyclass.details = data['details'].value;
    storyclass.team_arr = this.chipSelectedTeamid

    console.log("storyclass", storyclass)
    return storyclass;
  }
  

  SubmitStories(){
    this.SpinnerService.show();
    if (this.storiesForm.value.name === "") {
      this.notify.error('Please Enter Name');
      this.SpinnerService.hide();
      return false;
    }
    if (this.storiesForm.value.details === "") {
      this.notify.error('Please Enter Story Details');
      this.SpinnerService.hide();
      return false;
    }
    // if (this.storiesForm.value.sprint.id === undefined || this.storiesForm.value.sprint === undefined) {
    //   this.notify.error('Please Select Sprint');
    //   this.SpinnerService.hide();
    //   return false;
    // }
    if (this.chipSelectedTeamid.length <= 0) {
      this.notify.warning('Please Select Team')
      this.SpinnerService.hide();
      return false
    }
    // this.storiesForm.value.team = this.chipSelectedTeamid

    this.taskmanagerservice.createStory(this.createFormate())
    .subscribe(res => {
      console.log("story creation click", res)
      if(res.message){
        this.teamList=[]
        this.notify.success("Created Successfully!...");
        this.chipSelectedTeam=[]
        this.chipSelectedTeamid = [];
        this.storiesForm.reset()
        this.OnSubmit.emit();
        this.SpinnerService.hide();
       } else {
        this.notify.error(res.description)
        this.SpinnerService.hide();
        return false;
      }
    },
    error => {
      this.errorHandler.handleError(error);
      this.SpinnerService.hide();
    }
    )
  }

  formreset(){
    this.teamList=[]
    this.chipSelectedTeam=[]
    this.storiesForm.reset()
    this.teamInput.nativeElement.value=''
    this.OnSubmit.emit();
        this.SpinnerService.hide();

  }


  

   // sprint name
   sprintClick(){
    let devkeyvalue: String = "";
      this.getsprint(devkeyvalue);
      // (this.taskAddForm.get('data') as FormArray).at(i).get('developer').valueChanges
      this.storiesForm.get('sprint').valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
            console.log('inside tap')
  
          }),
          switchMap(value => this.taskmanagerservice.getSprintFilter(value,1)
            .pipe(
              finalize(() => {
                this.isLoading = false
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.sprintList = datas;
  
        })
  
  }
  
    private getsprint(unithdkeyvalue) {
        this.taskmanagerservice.getSprintFilter(unithdkeyvalue,1)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.sprintList = datas;
          })
      }
  
      public displayFn(sprint?: Sprint): string | undefined {
        return sprint ? sprint.name : undefined;
      }
    
      get sprint() {
        return this.storiesForm.value.get('sprint');
      }


      // autocompleteScroll() {
      //   setTimeout(() => {
      //     if (
      //       this.matsprintAutocomplete &&
      //       this.autocompleteTrigger &&
      //       this.matsprintAutocomplete.panel
      //     ) {
      //       fromEvent(this.matsprintAutocomplete.panel.nativeElement, 'scroll')
      //         .pipe(
      //           map(x => this.matsprintAutocomplete.panel.nativeElement.scrollTop),
      //           takeUntil(this.autocompleteTrigger.panelClosingActions)
      //         )
      //         .subscribe(x => {
      //           const scrollTop = this.matsprintAutocomplete.panel.nativeElement.scrollTop;
      //           const scrollHeight = this.matsprintAutocomplete.panel.nativeElement.scrollHeight;
      //           const elementHeight = this.matsprintAutocomplete.panel.nativeElement.clientHeight;
      //           const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
      //           if (atBottom) {
      //             if (this.has_next === true) {
      //               this.taskmanagerservice.getSprintFilter(this.sprintInput.nativeElement.value, this.currentpage + 1)
      //                 .subscribe((results: any[]) => {
      //                   let datas = results["data"];
      //                   let datapagination = results["pagination"];
      //                   this.sprintList = this.sprintList.concat(datas);
      //                   if (this.sprintList.length >= 0) {
      //                     this.has_next = datapagination.has_next;
      //                     this.has_previous = datapagination.has_previous;
      //                     this.currentpage = datapagination.index;
      //                   }
      //                 }, (error) => {
    
      //                 })
      //             }
      //           }
      //         });
      //     }
      //   });
      // }




      
    
    
      getemp(keyvalue) {
        this.taskmanagerservice.getTeamFilter(keyvalue, 1)
          .subscribe((results: any[]) => {
            this.SpinnerService.hide();
            let datas = results["data"];
            this.teamList = datas;
           
          }, (error) => {
            this.errorHandler.handleError(error);
            this.SpinnerService.hide();
          })
      }
   



      public removedTeam(emp: emplistss) {
        const index = this.chipSelectedTeam.indexOf(emp);
  
    
        if (index >= 0) {
    
          this.chipSelectedTeam.splice(index, 1);
          console.log(this.chipSelectedTeam);
          this.chipSelectedTeamid.splice(index, 1);
          console.log(this.chipSelectedTeamid);
          this.teamInput.nativeElement.value = '';
        }
    
      }
    
    
  public teamSelected(event: MatAutocompleteSelectedEvent): void {
    console.log("mmmm",event)
        this.selectempByName(event.option.value.name);
        this.teamInput.nativeElement.value = '';
  }
  private selectempByName(emp) {
        let foundemp1 = this.chipSelectedTeam.filter(e => e.name == emp);
    if (foundemp1.length) {
      return;
    }
    let foundemp = this.teamList.filter(e => e.name == emp);
    if (foundemp.length) {
      this.chipSelectedTeam.push(foundemp[0]);
      this.chipSelectedTeamid.push(foundemp[0].id)
    }
  }

}



class story {
  name: string;
  sprint_id: string;
  team_arr: any;
  details: any;

}