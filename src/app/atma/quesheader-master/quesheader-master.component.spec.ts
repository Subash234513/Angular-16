import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesheaderMasterComponent } from './quesheader-master.component';

describe('QuesheaderMasterComponent', () => {
  let component: QuesheaderMasterComponent;
  let fixture: ComponentFixture<QuesheaderMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuesheaderMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesheaderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
