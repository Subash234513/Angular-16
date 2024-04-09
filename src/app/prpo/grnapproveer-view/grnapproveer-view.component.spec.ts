import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnapproveerViewComponent } from './grnapproveer-view.component';

describe('GrnapproveerViewComponent', () => {
  let component: GrnapproveerViewComponent;
  let fixture: ComponentFixture<GrnapproveerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnapproveerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnapproveerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
