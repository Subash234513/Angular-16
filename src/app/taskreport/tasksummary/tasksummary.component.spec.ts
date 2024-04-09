import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksummaryComponent } from './tasksummary.component';

describe('TasksummaryComponent', () => {
  let component: TasksummaryComponent;
  let fixture: ComponentFixture<TasksummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
