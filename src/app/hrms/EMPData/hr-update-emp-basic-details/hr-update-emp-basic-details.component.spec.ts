import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRUpdateEMPBasicDetailsComponent } from './hr-update-emp-basic-details.component';

describe('HRUpdateEMPBasicDetailsComponent', () => {
  let component: HRUpdateEMPBasicDetailsComponent;
  let fixture: ComponentFixture<HRUpdateEMPBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRUpdateEMPBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRUpdateEMPBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
