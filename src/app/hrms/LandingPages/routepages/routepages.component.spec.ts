import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutepagesComponent } from './routepages.component';

describe('RoutepagesComponent', () => {
  let component: RoutepagesComponent;
  let fixture: ComponentFixture<RoutepagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutepagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutepagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
