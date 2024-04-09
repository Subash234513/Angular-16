import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrdsummaryComponent } from './brdsummary.component';

describe('BrdsummaryComponent', () => {
  let component: BrdsummaryComponent;
  let fixture: ComponentFixture<BrdsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrdsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrdsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
