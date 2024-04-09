import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoCreateComponent } from './employee-info-create.component';

describe('EmployeeInfoCreateComponent', () => {
  let component: EmployeeInfoCreateComponent;
  let fixture: ComponentFixture<EmployeeInfoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
