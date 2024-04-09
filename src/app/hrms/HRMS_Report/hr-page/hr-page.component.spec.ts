import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HRPageComponent } from './hr-page.component';

describe('HRPageComponent', () => {
  let component: HRPageComponent;
  let fixture: ComponentFixture<HRPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HRPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HRPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
