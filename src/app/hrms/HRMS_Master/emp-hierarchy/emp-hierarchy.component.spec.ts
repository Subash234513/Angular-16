import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMPHierarchyComponent } from './emp-hierarchy.component';

describe('EMPHierarchyComponent', () => {
  let component: EMPHierarchyComponent;
  let fixture: ComponentFixture<EMPHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMPHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMPHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
