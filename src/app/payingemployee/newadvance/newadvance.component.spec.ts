import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewadvanceComponent } from './newadvance.component';

describe('NewadvanceComponent', () => {
  let component: NewadvanceComponent;
  let fixture: ComponentFixture<NewadvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewadvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewadvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
