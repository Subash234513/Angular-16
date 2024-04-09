import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCloseApprovalComponent } from './po-close-approval.component';

describe('PoCloseApprovalComponent', () => {
  let component: PoCloseApprovalComponent;
  let fixture: ComponentFixture<PoCloseApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCloseApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCloseApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
