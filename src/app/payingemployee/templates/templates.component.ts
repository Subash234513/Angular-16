import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { distinctUntilChanged, map, takeUntil, debounceTime, tap, finalize, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  has_next = true;
  has_previous = true;
  isLoading: boolean
  currentpage: number = 1;
  isSummaryContent: boolean = true;
  datassearch: FormGroup;
  gradeList: any=[];
  limit = 10;
  pagination = {
    has_next: false,
    has_previous: false,
    index: 1
  }
  summarylist: [];
  send_value: String = "";
  isShowTable: boolean = false;


  @ViewChild('map') matgradeAutocomplete: MatAutocomplete;
  @ViewChild('MatAutocompleteTrigger') autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('getgradeInput') getgradeInput: any;
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {

    this.datassearch = this.fb.group({
      name: '',
      gradelevel: ''
    })

    this.getGrade();

  }

  getGrade() {
    let gstkeyvalue: String = "";
    this.getFunctional(gstkeyvalue);
    this.datassearch
      .get('gradelevel')
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.payrollService.getGrade(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.gradeList = datas;
      });
  }

  private getFunctional(gstkeyvalue) {
    this.payrollService
      .getmapApi(gstkeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results['data'];
        this.gradeList = datas;
      });
  }

  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.searchData();

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.searchData();

  }

  searchData() {

    let formValue = this.datassearch.value;
    let gradeid = this.datassearch.get('gradelevel').value.id;
    if (gradeid == '' || gradeid == null || gradeid == undefined) {
      this.notification.showError("Please select the Grade Level");
      return false;
    }
    let grade = gradeid;
    let name = formValue.name;
    this.send_value = ""
    let page = 1;
    this.SpinnerService.show();
    this.payrollService.searchGradeLevel(grade, name, this.pagination.index).subscribe(result => {
      this.SpinnerService.hide();
      this.summarylist = result['data'];
      this.isShowTable = true;
      this.pagination = result.pagination ? result.pagination : this.pagination;
    })

  }
  clearData() {
    this.datassearch = this.fb.group({
      name: '',
      gradelevel: ''
    })
    this.isShowTable = false;
  }


  public displayfnGrade(map?: any): string | undefined {
    return map ? map.name : undefined;
  }
  autocompletegradeScroll() {
    setTimeout(() => {
      if (
        this.matgradeAutocomplete &&
        this.autocompleteTrigger &&
        this.matgradeAutocomplete.panel
      ) {
        fromEvent(this.matgradeAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map((x: Event) => (x.target as HTMLElement).scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe((scrollTop) => {
            const scrollHeight = this.matgradeAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matgradeAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;

            if (atBottom) {
              if (this.has_next === true) {
                this.payrollService
                  .getmapApi(this.getgradeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let data = results['data'];
                    let dataPagination = results['pagination'];
                    this.gradeList = this.gradeList.concat(data);
                    if (this.gradeList.length > 0) {
                      this.has_next = dataPagination.has_next;
                      this.has_previous = dataPagination.has_pagination;
                      this.currentpage = dataPagination.index;
                    }
                  });
              }
            }
          });
      }
    });
  }


}
