import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCatlogComponent } from './supplier-catlog.component';

describe('SupplierCatlogComponent', () => {
  let component: SupplierCatlogComponent;
  let fixture: ComponentFixture<SupplierCatlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCatlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCatlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
