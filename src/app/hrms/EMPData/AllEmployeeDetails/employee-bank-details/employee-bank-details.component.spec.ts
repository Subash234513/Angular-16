import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBankDetailsComponent } from './employee-bank-details.component';

describe('EmployeeBankDetailsComponent', () => {
  let component: EmployeeBankDetailsComponent;
  let fixture: ComponentFixture<EmployeeBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
