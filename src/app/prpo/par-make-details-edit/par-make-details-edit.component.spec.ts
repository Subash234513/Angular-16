import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParMakeDetailsEditComponent } from './par-make-details-edit.component';

describe('ParMakeDetailsEditComponent', () => {
  let component: ParMakeDetailsEditComponent;
  let fixture: ComponentFixture<ParMakeDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParMakeDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParMakeDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
