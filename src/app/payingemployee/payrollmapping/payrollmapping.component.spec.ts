import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollmappingComponent } from './payrollmapping.component';

describe('PayrollmappingComponent', () => {
  let component: PayrollmappingComponent;
  let fixture: ComponentFixture<PayrollmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
