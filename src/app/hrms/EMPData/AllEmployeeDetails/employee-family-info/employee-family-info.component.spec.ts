import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFamilyInfoComponent } from './employee-family-info.component';

describe('EmployeeFamilyInfoComponent', () => {
  let component: EmployeeFamilyInfoComponent;
  let fixture: ComponentFixture<EmployeeFamilyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFamilyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFamilyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
