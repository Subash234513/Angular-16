import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoSummaryComponent } from './employee-info-summary.component';

describe('EmployeeInfoSummaryComponent', () => {
  let component: EmployeeInfoSummaryComponent;
  let fixture: ComponentFixture<EmployeeInfoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
