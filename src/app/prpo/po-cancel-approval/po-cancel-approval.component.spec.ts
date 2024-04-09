import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCancelApprovalComponent } from './po-cancel-approval.component';

describe('PoCancelApprovalComponent', () => {
  let component: PoCancelApprovalComponent;
  let fixture: ComponentFixture<PoCancelApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCancelApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCancelApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
