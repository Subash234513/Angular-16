import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogfilter',
  templateUrl: './dialogfilter.component.html',
  styleUrls: ['./dialogfilter.component.scss']
})
export class DialogfilterComponent implements OnInit {
  myForm: FormGroup;
  filterRows: FormGroup[] = [];

  constructor(private fb:FormBuilder,    private dialogRef: MatDialogRef<DialogfilterComponent>) { }

  showCalendar = false;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  


  ngOnInit(): void {
    this.myForm = this.fb.group({
      dropdown1: [''], // First dropdown control
      dropdown2: ['is'], // Second dropdown control
      inputField: [''], // Input field control
    });

    this.addFilterRow();
  }
  sendValue()
  {
    let searchVal = this.myForm.value;
    this.dialogRef.close(searchVal);
  }
  selectFilter(filter: string) {
    this.myForm.get('dropdown1').setValue(filter);
    if (filter === 'startdate' || filter === 'enddate') {
      this.showCalendar = true;
      this.picker.open();
    } else {
      this.showCalendar = false;
    }
  }

  onDateChange(event: any) {
    // Handle the selected date here
    console.log("Selected date: ", event);
    // You can update your form control or do any other necessary actions here
  }
  addFilterRow() {
    const newRow = this.fb.group({
      dropdown1: ['', Validators.required],
      inputField: ['', Validators.required],
    });

    this.filterRows.push(newRow);
  }

  removeFilterRow(index: number) {
    this.filterRows.splice(index, 1);
  }
  







}
