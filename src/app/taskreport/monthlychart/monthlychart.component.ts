import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { TaskService } from '../task.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-monthlychart',
  templateUrl: './monthlychart.component.html',
  styleUrls: ['./monthlychart.component.scss']
})
export class MonthlychartComponent implements OnInit {
  public linechart: any;
  constructor(private taskservice:TaskService,private SpinnerService: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.monthlycreateChart();
  }




  monthlycreateChart(){
    this.SpinnerService.show();
     let linechart_stylejson = {
        "borderColor": 'rgb(75, 192, 192)',     
      }
      let type = 2
      this.taskservice.taskChart(type)
      .subscribe(results => {
         // line chart 
         for(let i=0; i< results.monthly.data.datasets.length;i++){
          let object = results.monthly.data.datasets[0]
          let temp = Object.assign({},object,linechart_stylejson)
          results.monthly.data.datasets[0]=temp;
        }
        this.linechart = new Chart("MylineChart", results.monthly);
        console.log("line CHART",this.linechart)
        this.SpinnerService.hide();
    })
  
    }

}
