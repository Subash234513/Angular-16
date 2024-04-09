import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestypemasterComponent } from './questypemaster.component';

describe('QuestypemasterComponent', () => {
  let component: QuestypemasterComponent;
  let fixture: ComponentFixture<QuestypemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestypemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
