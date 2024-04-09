import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogfilterComponent } from './dialogfilter.component';

describe('DialogfilterComponent', () => {
  let component: DialogfilterComponent;
  let fixture: ComponentFixture<DialogfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
