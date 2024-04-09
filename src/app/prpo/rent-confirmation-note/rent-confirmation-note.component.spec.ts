import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentConfirmationNoteComponent } from './rent-confirmation-note.component';

describe('RentConfirmationNoteComponent', () => {
  let component: RentConfirmationNoteComponent;
  let fixture: ComponentFixture<RentConfirmationNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentConfirmationNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentConfirmationNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
