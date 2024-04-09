import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpomasterComponent } from './prpomaster.component';

describe('PrpomasterComponent', () => {
  let component: PrpomasterComponent;
  let fixture: ComponentFixture<PrpomasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpomasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpomasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
