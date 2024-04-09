import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintmainComponent } from './sprintmain.component';

describe('SprintmainComponent', () => {
  let component: SprintmainComponent;
  let fixture: ComponentFixture<SprintmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
