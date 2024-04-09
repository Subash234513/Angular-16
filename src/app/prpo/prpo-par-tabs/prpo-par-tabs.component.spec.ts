import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoParTabsComponent } from './prpo-par-tabs.component';

describe('PrpoParTabsComponent', () => {
  let component: PrpoParTabsComponent;
  let fixture: ComponentFixture<PrpoParTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoParTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoParTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
