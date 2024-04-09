import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGanttchartComponent } from './report-ganttchart.component';

describe('ReportGanttchartComponent', () => {
  let component: ReportGanttchartComponent;
  let fixture: ComponentFixture<ReportGanttchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportGanttchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGanttchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
