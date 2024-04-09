import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffertemplateComponent } from './offertemplate.component';

describe('OffertemplateComponent', () => {
  let component: OffertemplateComponent;
  let fixture: ComponentFixture<OffertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
