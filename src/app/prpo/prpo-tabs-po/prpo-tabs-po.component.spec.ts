import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoTabsPOComponent } from './prpo-tabs-po.component';

describe('PrpoTabsPOComponent', () => {
  let component: PrpoTabsPOComponent;
  let fixture: ComponentFixture<PrpoTabsPOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoTabsPOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoTabsPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
