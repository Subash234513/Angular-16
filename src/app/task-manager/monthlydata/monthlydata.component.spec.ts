import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlydataComponent } from './monthlydata.component';

describe('MonthlydataComponent', () => {
  let component: MonthlydataComponent;
  let fixture: ComponentFixture<MonthlydataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlydataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlydataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
