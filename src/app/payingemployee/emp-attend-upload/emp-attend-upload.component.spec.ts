import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendUploadComponent } from './emp-attend-upload.component';

describe('EmpAttendUploadComponent', () => {
  let component: EmpAttendUploadComponent;
  let fixture: ComponentFixture<EmpAttendUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpAttendUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttendUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
