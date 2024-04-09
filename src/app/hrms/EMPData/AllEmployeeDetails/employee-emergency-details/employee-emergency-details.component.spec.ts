import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEmergencyDetailsComponent } from './employee-emergency-details.component';

describe('EmployeeEmergencyDetailsComponent', () => {
  let component: EmployeeEmergencyDetailsComponent;
  let fixture: ComponentFixture<EmployeeEmergencyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeEmergencyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEmergencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
