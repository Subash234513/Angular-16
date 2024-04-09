import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractManagementSystemComponent } from './contract-management-system.component';

describe('ContractManagementSystemComponent', () => {
  let component: ContractManagementSystemComponent;
  let fixture: ComponentFixture<ContractManagementSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractManagementSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
