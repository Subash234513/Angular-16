import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIconComponent } from './report-icon.component';

describe('ReportIconComponent', () => {
  let component: ReportIconComponent;
  let fixture: ComponentFixture<ReportIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
