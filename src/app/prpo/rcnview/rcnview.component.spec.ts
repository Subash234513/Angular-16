import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RCNViewComponent } from './rcnview.component';

describe('RCNViewComponent', () => {
  let component: RCNViewComponent;
  let fixture: ComponentFixture<RCNViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RCNViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RCNViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
