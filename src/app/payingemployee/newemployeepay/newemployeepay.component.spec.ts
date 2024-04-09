import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewemployeepayComponent } from './newemployeepay.component';

describe('NewemployeepayComponent', () => {
  let component: NewemployeepayComponent;
  let fixture: ComponentFixture<NewemployeepayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewemployeepayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewemployeepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
