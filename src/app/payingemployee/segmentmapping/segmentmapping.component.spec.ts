import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentmappingComponent } from './segmentmapping.component';

describe('SegmentmappingComponent', () => {
  let component: SegmentmappingComponent;
  let fixture: ComponentFixture<SegmentmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
