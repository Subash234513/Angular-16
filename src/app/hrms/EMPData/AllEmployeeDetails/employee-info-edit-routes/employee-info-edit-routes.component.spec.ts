import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoEditRoutesComponent } from './employee-info-edit-routes.component';

describe('EmployeeInfoEditRoutesComponent', () => {
  let component: EmployeeInfoEditRoutesComponent;
  let fixture: ComponentFixture<EmployeeInfoEditRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeInfoEditRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoEditRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
