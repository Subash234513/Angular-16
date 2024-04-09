import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcreateEditComponent } from './parcreate-edit.component';

describe('ParcreateEditComponent', () => {
  let component: ParcreateEditComponent;
  let fixture: ComponentFixture<ParcreateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcreateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
