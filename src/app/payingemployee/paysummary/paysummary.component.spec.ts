import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaysummaryComponent } from './paysummary.component';

describe('PaysummaryComponent', () => {
  let component: PaysummaryComponent;
  let fixture: ComponentFixture<PaysummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaysummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
