import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestCreateComponent } from './leave-request-create.component';

describe('LeaveRequestCreateComponent', () => {
  let component: LeaveRequestCreateComponent;
  let fixture: ComponentFixture<LeaveRequestCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRequestCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
