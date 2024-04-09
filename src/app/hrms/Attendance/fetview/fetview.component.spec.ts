import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetviewComponent } from './fetview.component';

describe('FetviewComponent', () => {
  let component: FetviewComponent;
  let fixture: ComponentFixture<FetviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
