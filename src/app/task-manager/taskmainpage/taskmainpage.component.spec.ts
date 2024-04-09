import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskmainpageComponent } from './taskmainpage.component';

describe('TaskmainpageComponent', () => {
  let component: TaskmainpageComponent;
  let fixture: ComponentFixture<TaskmainpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskmainpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskmainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
