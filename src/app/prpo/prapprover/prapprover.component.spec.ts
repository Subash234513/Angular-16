import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrapproverComponent } from './prapprover.component';

describe('PrapproverComponent', () => {
  let component: PrapproverComponent;
  let fixture: ComponentFixture<PrapproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrapproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrapproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
