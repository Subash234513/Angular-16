import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-icon',
  templateUrl: './report-icon.component.html',
  styleUrls: ['./report-icon.component.scss']
})
export class ReportIconComponent implements OnInit {
 reportsummary:boolean=false;
 reportcard:boolean = true;
 reportchart:boolean = false;
 clientreport:boolean=false
 reportDashboard:boolean=false;
 monthlydata:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }
  reportmytask(){
    this.reportsummary=true;
    this.reportcard=false;
    this.reportchart=false;
    this.clientreport=false;
    this.reportDashboard=false;
    this.monthlydata=false;
  }
  reportganttchart(){
    this.reportsummary=false;
    this.reportcard=false;
    this.reportchart=true;
    this.clientreport=false;
    this.reportDashboard=false
    this.monthlydata=false;

  }
  backtoreportcard(){
    this.reportsummary=false;
    this.reportcard=true;
    this.reportchart=false;
    this.clientreport=false;
    this.reportDashboard=false
    this.monthlydata=false;

  }
  clientreportdownload(){
    this.reportsummary=false;
    this.reportcard=false;
    this.reportchart=false;
    this.clientreport=true;
    this.reportDashboard=false
    this.monthlydata=false;

  }
  ReportDashboardFunc(){
    this.reportsummary=false;
    this.reportcard=false;
    this.reportchart=false;
    this.clientreport=false;
    this.reportDashboard=true
    this.monthlydata=false;
  }
  monthlyTimesheet()
  {
    this.reportsummary=false;
    this.reportcard=false;
    this.reportchart=false;
    this.clientreport=false;
    this.reportDashboard=false;
    this.monthlydata=true;
  }

}
