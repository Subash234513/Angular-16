import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementviewComponent } from './incrementview.component';

describe('IncrementviewComponent', () => {
  let component: IncrementviewComponent;
  let fixture: ComponentFixture<IncrementviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
