import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanycontribComponent } from './companycontrib.component';

describe('CompanycontribComponent', () => {
  let component: CompanycontribComponent;
  let fixture: ComponentFixture<CompanycontribComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanycontribComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanycontribComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
