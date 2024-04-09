import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlysummaryComponent } from './yearlysummary.component';

describe('YearlysummaryComponent', () => {
  let component: YearlysummaryComponent;
  let fixture: ComponentFixture<YearlysummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlysummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
