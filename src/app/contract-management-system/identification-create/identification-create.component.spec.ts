import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationCreateComponent } from './identification-create.component';

describe('IdentificationCreateComponent', () => {
  let component: IdentificationCreateComponent;
  let fixture: ComponentFixture<IdentificationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
