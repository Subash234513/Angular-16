import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobViewComponent } from './post-job-view.component';

describe('PostJobViewComponent', () => {
  let component: PostJobViewComponent;
  let fixture: ComponentFixture<PostJobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
