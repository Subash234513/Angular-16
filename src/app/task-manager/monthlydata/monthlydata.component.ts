import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { TaskManagerService } from '../task-manager.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from '../../service/error-handling-service.service';
import { FormGroup,FormArray,FormBuilder,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { ShareddataService } from '../shareddata.service';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-monthlydata',
  templateUrl: './monthlydata.component.html',
  styleUrls: ['./monthlydata.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class MonthlydataComponent implements OnInit {

  constructor(private TaskManagerService:TaskManagerService,private SpinnerService: NgxSpinnerService,
    private fb: FormBuilder, private router: Router, private toastr: ToastrService,
    private errorHandler: ErrorHandlingServiceService,private LocalShareService:ShareddataService,private datePipe:DatePipe) {}
  @Output() OnCancel = new EventEmitter<any>();
  ReportMonthly : FormGroup;
  send_value: String = "";

  ngOnInit(): void {
    this.ReportMonthly = this.fb.group({
      monthyear: [moment()],
    });
  }

  backtoTaskSummary(){
    this.OnCancel.emit()
    }

    reportDownload() {
      // this.isShowAddTemplate = true; 
      // this.isShowtimesheet = false;
      this.SpinnerService.show();
  
      let data =this.ReportMonthly.value
      if (this.ReportMonthly.get('monthyear').value == '' || this.ReportMonthly.get('monthyear').value == null || this.ReportMonthly.get('monthyear').value == undefined || this.ReportMonthly.get('monthyear').value == 'None') {
        this.toastr.error("Please Select Month and Year to Proceed");
        return false;
      }
      let formValue = this.ReportMonthly.value;
      let monthyeardata: any = this.datePipe.transform(formValue.monthyear, 'yyyy-MM')
      let splitdata = monthyeardata.split('-')
      // console.log("Spilt Data",splitdata)
      let month = splitdata[1]
      let year = splitdata[0]
      this.send_value = ""
  
      if (month) {
        this.send_value = this.send_value + 'month=' + month
      }
      if (year) {
        this.send_value = this.send_value + '&year=' + year
      }
  
      this.TaskManagerService.getreportmonthly(this.send_value).subscribe(
        (result) => {
          this.SpinnerService.hide();
          let binaryData = [];
          binaryData.push(result)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'MonthlyTimesheet.xlsx';
          // link.download ='action:excelreport'
          link.click();
        },
        (error) => {
          this.errorHandler.handleError(error);
          this.SpinnerService.hide();
        }
      );
    }

    resetTasks(){
      this.ReportMonthly.reset();
      
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
      this.ReportMonthly.patchValue({
        monthyear: this.monyear.value
      })
    }
    Date=['21/11/2002','22/11/2002','23/11/2002','24/11/2002','25/11/2002','26/11/2002','27/11/2002','28/11/2002']
    Summary=[
      {
        Empname:'Rahul D',
        Date:[
          {
            currentStatus:null 
          },
          {
            currentStatus:null 
          },
          {
            currentStatus:'weekend' 
          },
          {
            currentStatus:8 
          },
          {
            currentStatus:9 
          },
          {
            currentStatus:null 
          },
          {
            currentStatus:'weekend' 
          },
          {
            currentStatus:10 
          }
        ]
           
        
        
      },
      {
        Empname:'HariKrishnan M',
        Date:[
          {
            currentStatus:'weekend'  
          },
          {
            currentStatus:null 
          },
          {
            currentStatus:null
          },
          {
            currentStatus:8 
          },
          {
            currentStatus:9 
          },
          {
            currentStatus:null 
          },
          {
            currentStatus:'weekend' 
          },
          {
            currentStatus:10 
          }
        ]
           
        
        
      },

    ]
}
