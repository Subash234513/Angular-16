import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { TaskService } from '../task.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-weeklychart',
  templateUrl: './weeklychart.component.html',
  styleUrls: ['./weeklychart.component.scss']
})
export class WeeklychartComponent implements OnInit {
  public barchart: any;

  constructor(private taskservice:TaskService,private SpinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.weeklycreateChart();
  }


  weeklycreateChart(){
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
            console.log("bar chart result",results)
           
            // bar chart
            for(let i=0; i< results.weekly.data.datasets.length;i++){
              let object = results.weekly.data.datasets[0]
              let temp = Object.assign({},object,barchart_stylejson)
              results.weekly.data.datasets[0]=temp;
            }
          
  
           this.barchart = new Chart("MybarChart", results.weekly);
           console.log("BAR CHART",this.barchart)
           this.SpinnerService.hide();
    
          })
  }

}
