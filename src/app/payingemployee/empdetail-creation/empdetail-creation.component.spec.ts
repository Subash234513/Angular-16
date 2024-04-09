import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpdetailCreationComponent } from './empdetail-creation.component';

describe('EmpdetailCreationComponent', () => {
  let component: EmpdetailCreationComponent;
  let fixture: ComponentFixture<EmpdetailCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpdetailCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpdetailCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
