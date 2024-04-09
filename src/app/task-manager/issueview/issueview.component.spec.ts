import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueviewComponent } from './issueview.component';

describe('IssueviewComponent', () => {
  let component: IssueviewComponent;
  let fixture: ComponentFixture<IssueviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
