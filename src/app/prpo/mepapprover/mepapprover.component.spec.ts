import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MEPapproverComponent } from './mepapprover.component';

describe('MEPapproverComponent', () => {
  let component: MEPapproverComponent;
  let fixture: ComponentFixture<MEPapproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MEPapproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MEPapproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
