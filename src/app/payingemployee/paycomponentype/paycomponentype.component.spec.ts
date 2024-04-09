import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaycomponentypeComponent } from './paycomponentype.component';

describe('PaycomponentypeComponent', () => {
  let component: PaycomponentypeComponent;
  let fixture: ComponentFixture<PaycomponentypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaycomponentypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaycomponentypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
