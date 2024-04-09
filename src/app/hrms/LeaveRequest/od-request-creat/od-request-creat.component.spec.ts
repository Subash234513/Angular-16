import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdRequestCreatComponent } from './od-request-creat.component';

describe('OdRequestCreatComponent', () => {
  let component: OdRequestCreatComponent;
  let fixture: ComponentFixture<OdRequestCreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdRequestCreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdRequestCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
