import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeaddressComponent } from './employeeaddress.component';

describe('EmployeeaddressComponent', () => {
  let component: EmployeeaddressComponent;
  let fixture: ComponentFixture<EmployeeaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
