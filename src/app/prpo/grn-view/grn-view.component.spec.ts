import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnViewComponent } from './grn-view.component';

describe('GrnViewComponent', () => {
  let component: GrnViewComponent;
  let fixture: ComponentFixture<GrnViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
