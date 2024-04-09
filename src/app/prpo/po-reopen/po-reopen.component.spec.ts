import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReopenComponent } from './po-reopen.component';

describe('PoReopenComponent', () => {
  let component: PoReopenComponent;
  let fixture: ComponentFixture<PoReopenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReopenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
