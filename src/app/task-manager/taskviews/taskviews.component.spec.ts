import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskviewsComponent } from './taskviews.component';

describe('TaskviewsComponent', () => {
  let component: TaskviewsComponent;
  let fixture: ComponentFixture<TaskviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
