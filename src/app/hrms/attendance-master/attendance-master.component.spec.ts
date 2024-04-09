import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AttendanceMasterComponent } from './attendance-master.component';

describe('AttendanceMasterComponent', () => {
  let component: AttendanceMasterComponent;
  let fixture: ComponentFixture<AttendanceMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceMasterComponent ],
      imports: [FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  it('Attendance Form Create Test ==> Check In Mode Total No Of Inputs is 1', () => {
    // expect(component).toBeTruthy(); 
    const formCreateAttendance = fixture.debugElement.nativeElement.querySelector('#AttendanceCreateForm');
    const inputs = formCreateAttendance.querySelector('input');
    expect(inputs.length).toEqual(1);
  });






























});
