import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLeaveRequestComponent } from './track-leave-request.component';

describe('TrackLeaveRequestComponent', () => {
  let component: TrackLeaveRequestComponent;
  let fixture: ComponentFixture<TrackLeaveRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackLeaveRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
