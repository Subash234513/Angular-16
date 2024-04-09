import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  urls=[
    {
      "id": 237,
      "logo": null,
      "name": "EXECUTIVE",
      "role": [
          {
              "code": "r1",
              "id": 1,
              "name": "Maker"
          }
      ],
      "type": "transaction",
      "url": "/executivecustomersummary"
  },
  {
    "id": 237,
    "logo": null,
    "name": "FET VIEW",
    "role": [
        {
            "code": "r1",
            "id": 1,
            "name": "Maker"
        }
    ],
    "type": "transaction",
    "url": "/fetview"
}
  ]
  currenttabindex:any='';
  currenttabname:any='';

  constructor(private sharedservice:SharedService) { }

  ngOnInit(): void {
    let data=this.sharedservice.fetsubmodule.value
    this.currenttabname=this.urls[0]
    this.tabselect(0,this.currenttabname)
    
  }

  tabselect(i,menu){
    this.currenttabindex=i;
    this.currenttabname=menu
  }

}
