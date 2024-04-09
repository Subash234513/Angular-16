import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParStatusScreenComponent } from './par-status-screen.component';

describe('ParStatusScreenComponent', () => {
  let component: ParStatusScreenComponent;
  let fixture: ComponentFixture<ParStatusScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParStatusScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParStatusScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
