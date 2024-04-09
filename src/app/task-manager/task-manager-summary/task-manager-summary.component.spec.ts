import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagerSummaryComponent } from './task-manager-summary.component';

describe('TaskManagerSummaryComponent', () => {
  let component: TaskManagerSummaryComponent;
  let fixture: ComponentFixture<TaskManagerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskManagerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
