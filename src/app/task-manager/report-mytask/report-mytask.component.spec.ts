import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMytaskComponent } from './report-mytask.component';

describe('ReportMytaskComponent', () => {
  let component: ReportMytaskComponent;
  let fixture: ComponentFixture<ReportMytaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMytaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMytaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
