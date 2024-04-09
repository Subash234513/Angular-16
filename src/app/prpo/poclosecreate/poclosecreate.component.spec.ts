import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoclosecreateComponent } from './poclosecreate.component';

describe('PoclosecreateComponent', () => {
  let component: PoclosecreateComponent;
  let fixture: ComponentFixture<PoclosecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoclosecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoclosecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
