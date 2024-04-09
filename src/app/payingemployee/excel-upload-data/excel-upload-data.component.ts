import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-upload-data',
  templateUrl: './excel-upload-data.component.html',
  styleUrls: ['./excel-upload-data.component.scss']
})

export class ExcelUploadDataComponent implements OnInit {
[x: string]: any;
@ViewChild('labelImport')  labelImport: ElementRef;
  constructor() { }

  ngOnInit(): void {
    
  }
  
  images:any
  uploadForms:FormGroup;
  fileChange(file, files:FileList) {
    const target: DataTransfer = <DataTransfer>(<unknown>file.target);
   
    this.labelImport.nativeElement.innerText = Array.from(files)
    .map(f => f.name)
    .join(', ');
    this.images = file.target.files;
  

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      
      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.data);
    console.log('Images',this.images)
    // this.tableData = this.data;
    //   this.tableTitle = Object.keys(this.tableData[0]);
    //   this.tableRecords = this.tableData.slice(
    //     this.pageStartCount,
    //     this.pageEndCount
    //   );
      
  }

}
}
