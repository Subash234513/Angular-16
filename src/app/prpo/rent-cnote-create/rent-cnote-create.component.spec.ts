import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCNoteCreateComponent } from './rent-cnote-create.component';

describe('RentCNoteCreateComponent', () => {
  let component: RentCNoteCreateComponent;
  let fixture: ComponentFixture<RentCNoteCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentCNoteCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCNoteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
