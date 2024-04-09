import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoTabsGRNComponent } from './prpo-tabs-grn.component';

describe('PrpoTabsGRNComponent', () => {
  let component: PrpoTabsGRNComponent;
  let fixture: ComponentFixture<PrpoTabsGRNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoTabsGRNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoTabsGRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
