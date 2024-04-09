import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollsummaryComponent } from './payrollsummary.component';

describe('PayrollsummaryComponent', () => {
  let component: PayrollsummaryComponent;
  let fixture: ComponentFixture<PayrollsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
