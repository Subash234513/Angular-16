import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelUploadDataComponent } from './excel-upload-data.component';

describe('ExcelUploadDataComponent', () => {
  let component: ExcelUploadDataComponent;
  let fixture: ComponentFixture<ExcelUploadDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelUploadDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelUploadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
