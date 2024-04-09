import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestSummaryComponent } from './leave-request-summary.component';

describe('LeaveRequestSummaryComponent', () => {
  let component: LeaveRequestSummaryComponent;
  let fixture: ComponentFixture<LeaveRequestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRequestSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
