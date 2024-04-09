import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMasterComponent } from './cms-master.component';

describe('CmsMasterComponent', () => {
  let component: CmsMasterComponent;
  let fixture: ComponentFixture<CmsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
