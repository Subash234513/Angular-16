import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestPageComponent } from './leave-request-page.component';

describe('LeaveRequestPageComponent', () => {
  let component: LeaveRequestPageComponent;
  let fixture: ComponentFixture<LeaveRequestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveRequestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
