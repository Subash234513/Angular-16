import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrademasterComponent } from './grademaster.component';

describe('GrademasterComponent', () => {
  let component: GrademasterComponent;
  let fixture: ComponentFixture<GrademasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrademasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrademasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
