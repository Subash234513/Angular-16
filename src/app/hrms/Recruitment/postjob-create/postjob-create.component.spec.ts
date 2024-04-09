import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostjobCreateComponent } from './postjob-create.component';

describe('PostjobCreateComponent', () => {
  let component: PostjobCreateComponent;
  let fixture: ComponentFixture<PostjobCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostjobCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostjobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
