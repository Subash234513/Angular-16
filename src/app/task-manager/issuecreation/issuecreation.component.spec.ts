import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuecreationComponent } from './issuecreation.component';

describe('IssuecreationComponent', () => {
  let component: IssuecreationComponent;
  let fixture: ComponentFixture<IssuecreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuecreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuecreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
