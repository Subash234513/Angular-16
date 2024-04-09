import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { TaskService } from '../task.service';
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto'
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingService } from '../error-handling.service';

@Component({
  selector: 'app-taskchart',
  templateUrl: './taskchart.component.html',
  styleUrls: ['./taskchart.component.scss']
})
export class TaskchartComponent implements OnInit {
  public def_weeklychart: any;
  public barchart: any;
  public linechart: any;
  chartform:FormGroup;
  projectbasedtaskList:any;
  selectedProjectList:any;
  chart_status_List:any = [ {'id':1,'name':'Weekly'},{'id':2,'name':'Monthly'}]

  constructor(private formBuilder: FormBuilder,private taskservice:TaskService,private SpinnerService: NgxSpinnerService,
    private errorHandler: ErrorHandlingService) { }

  ngOnInit(): void {
    this.chartform = this.formBuilder.group({
      chartaction: [''],
    })
    this.createChart();
    this.projectbasedtask();
    this.chartform.patchValue({
      "chartaction":1
    })
  }


  gg:any;
  createChart(){


  this.SpinnerService.show();
  
  let barchart_stylejson = {
    "barThickness": 50,
    "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)"
    ],
    "borderColor": [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)"
    ],
    "borderWidth": 1,
    "borderRadius": 8
  }

  let type = 1;
  this.taskservice.taskChart(type)
        .subscribe(results => {
          console.log("chart result",results)
          // this.SpinnerService.hide();

          // bar chart
          for(let i=0; i< results.weekly.data.datasets.length;i++){
            let object = results.weekly.data.datasets[0]
            let temp = Object.assign({},object,barchart_stylejson)
            results.weekly.data.datasets[0]=temp;
          }
          this.def_weeklychart = new Chart("Mydefaultweeklychart", results.weekly);
          console.log("default weekly BAR CHART",this.def_weeklychart)
           this.SpinnerService.hide();
        })
  
  }


  defaultweekly:boolean = true
  isShowMonthly:boolean = false
  isShowWeekly:boolean = false
  gettingRecord(data){
    console.log("data",data)
    if(data.name == "Weekly"){
      this.isShowWeekly = true;
      this.isShowMonthly = false;
      this.defaultweekly = false;     
    }if(data.name == "Monthly"){
        this.isShowWeekly = false;
        this.isShowMonthly = true;
        this.defaultweekly = false;
    }

  }


  projectbasedtask() {
    this.taskservice.projectbasedtask()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.projectbasedtaskList = datas;
        this.selectedProjectList = this.projectbasedtaskList[0].task_data
      }, (error) => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  Selectedproject(project){
    console.log("selected project",project)
    this.selectedProjectList = project.task_data

  }


  startdate_icon:boolean = true;
  startdate_iconclick(){
    this.startdate_icon = !this.startdate_icon;
  }




  
}
