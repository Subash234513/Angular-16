import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityQuestionnaireComponent } from './activity-questionnaire.component';

describe('ActivityQuestionnaireComponent', () => {
  let component: ActivityQuestionnaireComponent;
  let fixture: ComponentFixture<ActivityQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
