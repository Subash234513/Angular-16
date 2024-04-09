import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeenewcreateComponent } from './employeenewcreate.component';

describe('EmployeenewcreateComponent', () => {
  let component: EmployeenewcreateComponent;
  let fixture: ComponentFixture<EmployeenewcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeenewcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeenewcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
