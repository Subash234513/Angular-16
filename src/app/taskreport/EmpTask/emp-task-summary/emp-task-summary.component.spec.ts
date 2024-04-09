import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpTaskSummaryComponent } from './emp-task-summary.component';

describe('EmpTaskSummaryComponent', () => {
  let component: EmpTaskSummaryComponent;
  let fixture: ComponentFixture<EmpTaskSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpTaskSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpTaskSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
