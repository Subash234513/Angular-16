import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PfcategoryComponent } from './pfcategory.component';

describe('PfcategoryComponent', () => {
  let component: PfcategoryComponent;
  let fixture: ComponentFixture<PfcategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PfcategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PfcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
