import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoTabsPRComponent } from './prpo-tabs-pr.component';

describe('PrpoTabsPRComponent', () => {
  let component: PrpoTabsPRComponent;
  let fixture: ComponentFixture<PrpoTabsPRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoTabsPRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoTabsPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
