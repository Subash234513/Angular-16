import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrdviewComponent } from './brdview.component';

describe('BrdviewComponent', () => {
  let component: BrdviewComponent;
  let fixture: ComponentFixture<BrdviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrdviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrdviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
