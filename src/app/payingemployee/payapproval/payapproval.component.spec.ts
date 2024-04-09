import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayapprovalComponent } from './payapproval.component';

describe('PayapprovalComponent', () => {
  let component: PayapprovalComponent;
  let fixture: ComponentFixture<PayapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
