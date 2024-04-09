import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PARMakeDetailsComponent } from './par-make-details.component';

describe('PARMakeDetailsComponent', () => {
  let component: PARMakeDetailsComponent;
  let fixture: ComponentFixture<PARMakeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PARMakeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PARMakeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
