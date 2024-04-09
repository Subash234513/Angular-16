import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PayingempService } from '../payingemp.service';

@Component({
  selector: 'app-payrollmapping',
  templateUrl: './payrollmapping.component.html',
  styleUrls: ['./payrollmapping.component.scss']
})
export class PayrollmappingComponent implements OnInit {

  constructor(private fb: FormBuilder, private notification: NotificationService,
    private router: Router, private SpinnerService: NgxSpinnerService, private payrollService: PayingempService,
    public datepipe: DatePipe) { }

    summarylist = [];
    limit = 10;
    pagination = {
      has_next: false,
      has_previous: false,
      index: 1
    }

  ngOnInit(): void {
    this.getSummary();
  }
  prevpage() {
    if (this.pagination.has_previous) {
      this.pagination.index = this.pagination.index - 1
    }
    this.getSummary();

  }
  nextpage() {
    if (this.pagination.has_next) {
      this.pagination.index = this.pagination.index + 1
    }
    this.getSummary();

  }
 
  getSummary()
  {
    this.payrollService.payrollMapping(this.pagination.index).subscribe(result => {
      this.summarylist = result['data'];
      // this.isShowTable = true;
      this.pagination = result.pagination ? result.pagination : this.pagination;
    })

  }

}
