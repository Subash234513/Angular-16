import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinereleaseComponent } from './pipelinerelease.component';

describe('PipelinereleaseComponent', () => {
  let component: PipelinereleaseComponent;
  let fixture: ComponentFixture<PipelinereleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelinereleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinereleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
