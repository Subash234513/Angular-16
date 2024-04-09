import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetaddComponent } from './timesheetadd.component';

describe('TimesheetaddComponent', () => {
  let component: TimesheetaddComponent;
  let fixture: ComponentFixture<TimesheetaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
