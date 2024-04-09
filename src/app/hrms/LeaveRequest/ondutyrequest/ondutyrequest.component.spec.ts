import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndutyrequestComponent } from './ondutyrequest.component';

describe('OndutyrequestComponent', () => {
  let component: OndutyrequestComponent;
  let fixture: ComponentFixture<OndutyrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndutyrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndutyrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
