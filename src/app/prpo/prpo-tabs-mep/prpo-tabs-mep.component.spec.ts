import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoTabsMEPComponent } from './prpo-tabs-mep.component';

describe('PrpoTabsMEPComponent', () => {
  let component: PrpoTabsMEPComponent;
  let fixture: ComponentFixture<PrpoTabsMEPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoTabsMEPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoTabsMEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
