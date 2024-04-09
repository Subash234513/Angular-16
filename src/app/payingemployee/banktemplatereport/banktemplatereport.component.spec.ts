import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktemplatereportComponent } from './banktemplatereport.component';

describe('BanktemplatereportComponent', () => {
  let component: BanktemplatereportComponent;
  let fixture: ComponentFixture<BanktemplatereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanktemplatereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktemplatereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
