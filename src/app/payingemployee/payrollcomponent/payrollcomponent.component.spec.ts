import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollcomponentComponent } from './payrollcomponent.component';

describe('PayrollcomponentComponent', () => {
  let component: PayrollcomponentComponent;
  let fixture: ComponentFixture<PayrollcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
