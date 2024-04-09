import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamMasterComponent } from './stream-master.component';

describe('StreamMasterComponent', () => {
  let component: StreamMasterComponent;
  let fixture: ComponentFixture<StreamMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
