import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDetailSummaryComponent } from './emp-detail-summary.component';

describe('EmpDetailSummaryComponent', () => {
  let component: EmpDetailSummaryComponent;
  let fixture: ComponentFixture<EmpDetailSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDetailSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
