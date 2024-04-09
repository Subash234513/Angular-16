import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayingempService } from '../payingemp.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Paytable } from '../models/paytable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-offertemplate',
  templateUrl: './offertemplate.component.html',
  styleUrls: ['./offertemplate.component.scss']
})
export class OffertemplateComponent implements OnInit {

  summary : FormGroup;
  offerForm: FormGroup;
  summaryView : boolean = true;
  offerCreateView: boolean = false;
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  constructor(private fb: FormBuilder, private apiservice: PayingempService, private notification: NotificationService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.summary = this.fb.group({

    })
    this.offerForm = this.fb.group({
      content: ['']
    })

   
  }

  editTemplate()
  {
    this.summaryView = false;
    this.offerCreateView = true;
  }
  addCancel()
  {
    this.summaryView = true;
    this.offerCreateView = false;
  }

  Submit()
  {

  }

}
