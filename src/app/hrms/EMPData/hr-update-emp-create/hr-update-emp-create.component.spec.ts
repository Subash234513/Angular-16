import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRUpdateEMPCreateComponent } from './hr-update-emp-create.component';

describe('HRUpdateEMPCreateComponent', () => {
  let component: HRUpdateEMPCreateComponent;
  let fixture: ComponentFixture<HRUpdateEMPCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRUpdateEMPCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRUpdateEMPCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
