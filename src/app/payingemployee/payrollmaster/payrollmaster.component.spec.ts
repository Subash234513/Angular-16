import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollmasterComponent } from './payrollmaster.component';

describe('PayrollmasterComponent', () => {
  let component: PayrollmasterComponent;
  let fixture: ComponentFixture<PayrollmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
