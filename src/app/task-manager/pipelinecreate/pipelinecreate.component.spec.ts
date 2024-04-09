import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinecreateComponent } from './pipelinecreate.component';

describe('PipelinecreateComponent', () => {
  let component: PipelinecreateComponent;
  let fixture: ComponentFixture<PipelinecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelinecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
