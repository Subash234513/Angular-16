import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutivetaskComponent } from './executivetask.component';

describe('ExecutivetaskComponent', () => {
  let component: ExecutivetaskComponent;
  let fixture: ComponentFixture<ExecutivetaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutivetaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutivetaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
