import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedformarrayComponent } from './nestedformarray.component';

describe('NestedformarrayComponent', () => {
  let component: NestedformarrayComponent;
  let fixture: ComponentFixture<NestedformarrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedformarrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedformarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
