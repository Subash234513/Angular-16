import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentBasePageComponent } from './recruitment-base-page.component';

describe('RecruitmentBasePageComponent', () => {
  let component: RecruitmentBasePageComponent;
  let fixture: ComponentFixture<RecruitmentBasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentBasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
