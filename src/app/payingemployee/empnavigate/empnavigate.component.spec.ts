import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpnavigateComponent } from './empnavigate.component';

describe('EmpnavigateComponent', () => {
  let component: EmpnavigateComponent;
  let fixture: ComponentFixture<EmpnavigateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpnavigateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpnavigateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
