import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-icon-dialog',
  templateUrl: './icon-dialog.component.html',
  styleUrls: ['./icon-dialog.component.scss']
})
export class IconDialogComponent {

  selectedOption: string;

  constructor(
    public dialogRef: MatDialogRef<IconDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { icon: string }
  ) {}

  selectOption(option: string) {
    this.selectedOption = option;
    this.dialogRef.close(this.selectedOption);
  }

  closeDialog() {
    this.dialogRef.close(this.selectedOption);
  }

}
