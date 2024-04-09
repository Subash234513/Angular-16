import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepayrollinfoComponent } from './employeepayrollinfo.component';

describe('EmployeepayrollinfoComponent', () => {
  let component: EmployeepayrollinfoComponent;
  let fixture: ComponentFixture<EmployeepayrollinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeepayrollinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeepayrollinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
