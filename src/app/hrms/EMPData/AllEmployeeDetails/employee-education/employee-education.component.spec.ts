import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEducationComponent } from './employee-education.component';

describe('EmployeeEducationComponent', () => {
  let component: EmployeeEducationComponent;
  let fixture: ComponentFixture<EmployeeEducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeEducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
