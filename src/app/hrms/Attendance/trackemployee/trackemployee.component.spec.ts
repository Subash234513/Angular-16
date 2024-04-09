import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackemployeeComponent } from './trackemployee.component';

describe('TrackemployeeComponent', () => {
  let component: TrackemployeeComponent;
  let fixture: ComponentFixture<TrackemployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackemployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
