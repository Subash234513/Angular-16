import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktemplateComponent } from './banktemplate.component';

describe('BanktemplateComponent', () => {
  let component: BanktemplateComponent;
  let fixture: ComponentFixture<BanktemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanktemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
