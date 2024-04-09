import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesmainComponent } from './storiesmain.component';

describe('StoriesmainComponent', () => {
  let component: StoriesmainComponent;
  let fixture: ComponentFixture<StoriesmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoriesmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoriesmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
