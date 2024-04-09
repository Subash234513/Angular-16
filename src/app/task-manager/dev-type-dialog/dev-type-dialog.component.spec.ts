import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevTypeDialogComponent } from './dev-type-dialog.component';

describe('DevTypeDialogComponent', () => {
  let component: DevTypeDialogComponent;
  let fixture: ComponentFixture<DevTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
