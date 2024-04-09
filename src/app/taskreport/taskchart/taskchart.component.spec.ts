import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskchartComponent } from './taskchart.component';

describe('TaskchartComponent', () => {
  let component: TaskchartComponent;
  let fixture: ComponentFixture<TaskchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
