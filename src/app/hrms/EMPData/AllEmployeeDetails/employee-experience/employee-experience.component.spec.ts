import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExperienceComponent } from './employee-experience.component';

describe('EmployeeExperienceComponent', () => {
  let component: EmployeeExperienceComponent;
  let fixture: ComponentFixture<EmployeeExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
