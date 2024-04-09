import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeadvancesComponent } from './employeeadvances.component';

describe('EmployeeadvancesComponent', () => {
  let component: EmployeeadvancesComponent;
  let fixture: ComponentFixture<EmployeeadvancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeadvancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeadvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
