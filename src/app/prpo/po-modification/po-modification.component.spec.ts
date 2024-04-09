import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModificationComponent } from './po-modification.component';

describe('PoModificationComponent', () => {
  let component: PoModificationComponent;
  let fixture: ComponentFixture<PoModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
