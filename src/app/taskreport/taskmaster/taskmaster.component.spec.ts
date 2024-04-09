import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskmasterComponent } from './taskmaster.component';

describe('TaskmasterComponent', () => {
  let component: TaskmasterComponent;
  let fixture: ComponentFixture<TaskmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
