import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinetransactionComponent } from './pipelinetransaction.component';

describe('PipelinetransactionComponent', () => {
  let component: PipelinetransactionComponent;
  let fixture: ComponentFixture<PipelinetransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelinetransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinetransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
