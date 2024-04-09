import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnInwardCreateeditdeleteComponent } from './grn-inward-createeditdelete.component';

describe('GrnInwardCreateeditdeleteComponent', () => {
  let component: GrnInwardCreateeditdeleteComponent;
  let fixture: ComponentFixture<GrnInwardCreateeditdeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnInwardCreateeditdeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrnInwardCreateeditdeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
