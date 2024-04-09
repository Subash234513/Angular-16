import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrMakerComponent } from './pr-maker.component';

describe('PrMakerComponent', () => {
  let component: PrMakerComponent;
  let fixture: ComponentFixture<PrMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
