import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetcustomerComponent } from './fetcustomer.component';

describe('FetcustomerComponent', () => {
  let component: FetcustomerComponent;
  let fixture: ComponentFixture<FetcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
