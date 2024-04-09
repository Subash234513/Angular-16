import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceFullReportComponent } from './attendance-full-report.component';

describe('AttendanceFullReportComponent', () => {
  let component: AttendanceFullReportComponent;
  let fixture: ComponentFixture<AttendanceFullReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceFullReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceFullReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
