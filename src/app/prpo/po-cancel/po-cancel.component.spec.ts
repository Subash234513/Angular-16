import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCancelComponent } from './po-cancel.component';

describe('PoCancelComponent', () => {
  let component: PoCancelComponent;
  let fixture: ComponentFixture<PoCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
