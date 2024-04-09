import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrmsReportComponent } from './hrms-report.component';

describe('HrmsReportComponent', () => {
  let component: HrmsReportComponent;
  let fixture: ComponentFixture<HrmsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrmsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrmsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
