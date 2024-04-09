import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendSummaryComponent } from './emp-attend-summary.component';

describe('EmpAttendSummaryComponent', () => {
  let component: EmpAttendSummaryComponent;
  let fixture: ComponentFixture<EmpAttendSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpAttendSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttendSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
