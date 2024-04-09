import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditMappingComponent } from './audit-mapping.component';

describe('AuditMappingComponent', () => {
  let component: AuditMappingComponent;
  let fixture: ComponentFixture<AuditMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
