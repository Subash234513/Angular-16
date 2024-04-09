import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShareddataService } from '../shareddata.service';

@Component({
  selector: 'app-dev-type-dialog',
  templateUrl: './dev-type-dialog.component.html',
  styleUrls: ['./dev-type-dialog.component.scss']
})
export class DevTypeDialogComponent implements OnInit   {

  
  constructor(private sharedDataService: ShareddataService) {}
  devTypeList: any[]; 
  @Output() optionSelected = new EventEmitter<string>();

  
  

  selectedOption: string;

  
  ngOnInit(): void {
    this.devTypeList = this.sharedDataService.getDevTypeList();

    console.log("data DEV", this.devTypeList)
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  confirmSelection() {
    if (this.selectedOption) {
      this.optionSelected.emit(this.selectedOption);
    }
  }

}
