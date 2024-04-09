import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrdaddComponent } from './brdadd.component';

describe('BrdaddComponent', () => {
  let component: BrdaddComponent;
  let fixture: ComponentFixture<BrdaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrdaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrdaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
