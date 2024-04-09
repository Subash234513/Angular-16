import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortaluserComponent } from './portaluser.component';

describe('PortaluserComponent', () => {
  let component: PortaluserComponent;
  let fixture: ComponentFixture<PortaluserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortaluserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortaluserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
