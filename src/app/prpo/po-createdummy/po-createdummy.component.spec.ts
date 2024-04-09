import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoCreatedummyComponent } from './po-createdummy.component';

describe('PoCreatedummyComponent', () => {
  let component: PoCreatedummyComponent;
  let fixture: ComponentFixture<PoCreatedummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoCreatedummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoCreatedummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
