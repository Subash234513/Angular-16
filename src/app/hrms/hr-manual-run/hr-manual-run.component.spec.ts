import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrManualRunComponent } from './hr-manual-run.component';

describe('HrManualRunComponent', () => {
  let component: HrManualRunComponent;
  let fixture: ComponentFixture<HrManualRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrManualRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrManualRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
