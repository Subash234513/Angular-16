import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParCheckerEditComponent } from './par-checker-edit.component';

describe('ParCheckerEditComponent', () => {
  let component: ParCheckerEditComponent;
  let fixture: ComponentFixture<ParCheckerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParCheckerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParCheckerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
