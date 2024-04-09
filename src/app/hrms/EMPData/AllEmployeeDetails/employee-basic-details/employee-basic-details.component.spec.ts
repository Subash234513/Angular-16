import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBasicDetailsComponent } from './employee-basic-details.component';

describe('EmployeeBasicDetailsComponent', () => {
  let component: EmployeeBasicDetailsComponent;
  let fixture: ComponentFixture<EmployeeBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
