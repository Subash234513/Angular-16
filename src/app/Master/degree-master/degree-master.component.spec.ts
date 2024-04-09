import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeMasterComponent } from './degree-master.component';

describe('DegreeMasterComponent', () => {
  let component: DegreeMasterComponent;
  let fixture: ComponentFixture<DegreeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DegreeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
