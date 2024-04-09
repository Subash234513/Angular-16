import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  dashboardObjects: any = {
    empData: new Object(),
    others: ''
  }

  ngOnInit(): void {
    let dataFromLocalStorage: any = localStorage.getItem('sessionData')
    let empdata = JSON.parse(dataFromLocalStorage) 
    this.dashboardObjects.empData.name = empdata.name 
    this.dashboardObjects.empData.code = empdata.code 
    this.dashboardObjects.empData.employee_id = empdata.employee_id 
    this.dashboardObjects.empData.user_id = empdata.user_id  


    console.log("get data from local storage", dataFromLocalStorage, this.dashboardObjects)
  }

}

