import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeinsuranceComponent } from './employeeinsurance.component';

describe('EmployeeinsuranceComponent', () => {
  let component: EmployeeinsuranceComponent;
  let fixture: ComponentFixture<EmployeeinsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeinsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeinsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
