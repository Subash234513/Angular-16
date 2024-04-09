import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MepStatusScreenComponent } from './mep-status-screen.component';

describe('MepStatusScreenComponent', () => {
  let component: MepStatusScreenComponent;
  let fixture: ComponentFixture<MepStatusScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MepStatusScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MepStatusScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
