import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPopviewComponent } from './custom-popview.component';

describe('CustomPopviewComponent', () => {
  let component: CustomPopviewComponent;
  let fixture: ComponentFixture<CustomPopviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPopviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPopviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
