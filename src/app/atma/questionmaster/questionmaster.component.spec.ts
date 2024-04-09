import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionmasterComponent } from './questionmaster.component';

describe('QuestionmasterComponent', () => {
  let component: QuestionmasterComponent;
  let fixture: ComponentFixture<QuestionmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
