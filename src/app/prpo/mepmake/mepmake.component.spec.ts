import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEPmakeComponent } from './mepmake.component';

describe('MEPmakeComponent', () => {
  let component: MEPmakeComponent;
  let fixture: ComponentFixture<MEPmakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEPmakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEPmakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
