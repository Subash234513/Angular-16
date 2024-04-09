import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MepcontigencyComponent } from './mepcontigency.component';

describe('MepcontigencyComponent', () => {
  let component: MepcontigencyComponent;
  let fixture: ComponentFixture<MepcontigencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MepcontigencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MepcontigencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
