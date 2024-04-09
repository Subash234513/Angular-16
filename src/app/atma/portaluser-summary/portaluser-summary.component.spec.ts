import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortaluserSummaryComponent } from './portaluser-summary.component';

describe('PortaluserSummaryComponent', () => {
  let component: PortaluserSummaryComponent;
  let fixture: ComponentFixture<PortaluserSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortaluserSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortaluserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
