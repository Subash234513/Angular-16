import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipelinetransaction',
  templateUrl: './pipelinetransaction.component.html',
  styleUrls: ['./pipelinetransaction.component.scss']
})
export class PipelinetransactionComponent implements OnInit {
  piplinelise:any=[{"id":1,"name":"Verfied Task"},{"id":2,"name":"Pipeline"}]
returnnav: number;
tabname:any="Verfied Task"
  constructor() { }
  verified_task:boolean=true
  pipeline:boolean=false
  ngOnInit(): void {
  }
  subModuleData(data){
if(data.id==1){
this.verified_task=true
this.pipeline=false

}
else if(data.id==2){
  this.verified_task=false
this.pipeline=true

}
this.tabname=data.name
  }
}
