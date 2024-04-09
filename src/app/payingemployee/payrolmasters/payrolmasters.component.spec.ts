import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrolmastersComponent } from './payrolmasters.component';

describe('PayrolmastersComponent', () => {
  let component: PayrolmastersComponent;
  let fixture: ComponentFixture<PayrolmastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrolmastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrolmastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
