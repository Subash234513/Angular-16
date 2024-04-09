import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManualRunComponent } from './employee-manual-run.component';

describe('EmployeeManualRunComponent', () => {
  let component: EmployeeManualRunComponent;
  let fixture: ComponentFixture<EmployeeManualRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeManualRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeManualRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
