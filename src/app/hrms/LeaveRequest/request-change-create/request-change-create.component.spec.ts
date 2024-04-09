import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChangeCreateComponent } from './request-change-create.component';

describe('RequestChangeCreateComponent', () => {
  let component: RequestChangeCreateComponent;
  let fixture: ComponentFixture<RequestChangeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChangeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
