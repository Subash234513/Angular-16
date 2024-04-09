import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMPTaskCreateComponent } from './emptask-create.component';

describe('EMPTaskCreateComponent', () => {
  let component: EMPTaskCreateComponent;
  let fixture: ComponentFixture<EMPTaskCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMPTaskCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMPTaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
