import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmppayrollthbComponent } from './emppayrollthb.component';

describe('EmppayrollthbComponent', () => {
  let component: EmppayrollthbComponent;
  let fixture: ComponentFixture<EmppayrollthbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmppayrollthbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmppayrollthbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
