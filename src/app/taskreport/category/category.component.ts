import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor() { }
  SearchForm=new FormGroup({
    name:new FormControl('')
  })
  CreateForm=new FormGroup({
    name:new FormControl('')
  })
  EditForm=new FormGroup({
    name:new FormControl('')
  })
  isSearch:boolean=true;
  isSummary:boolean=true;
  isCreate:boolean=false;
  isUpdate:boolean=false;
  ngOnInit(): void {
  }
  Add(){
    this.isSearch=false;
    this.isSummary=false;
    this.isCreate=true;
    this.isUpdate=false;
  }
  Edit(){
    this.isSearch=false;
    this.isSummary=false;
    this.isCreate=false;
    this.isUpdate=true;
  }

}
