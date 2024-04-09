import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementBuilderComponent } from './agreement-builder.component';

describe('AgreementBuilderComponent', () => {
  let component: AgreementBuilderComponent;
  let fixture: ComponentFixture<AgreementBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgreementBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
