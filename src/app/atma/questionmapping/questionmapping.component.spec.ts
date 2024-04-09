import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionmappingComponent } from './questionmapping.component';

describe('QuestionmappingComponent', () => {
  let component: QuestionmappingComponent;
  let fixture: ComponentFixture<QuestionmappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionmappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
