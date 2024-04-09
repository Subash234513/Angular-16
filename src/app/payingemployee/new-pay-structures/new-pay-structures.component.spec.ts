import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayStructuresComponent } from './new-pay-structures.component';

describe('NewPayStructuresComponent', () => {
  let component: NewPayStructuresComponent;
  let fixture: ComponentFixture<NewPayStructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPayStructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPayStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
