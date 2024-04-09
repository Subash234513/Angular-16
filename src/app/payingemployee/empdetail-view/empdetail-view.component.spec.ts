import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpdetailViewComponent } from './empdetail-view.component';

describe('EmpdetailViewComponent', () => {
  let component: EmpdetailViewComponent;
  let fixture: ComponentFixture<EmpdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
