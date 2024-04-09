import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentQuestionerMappingComponent } from './document-questioner-mapping.component';

describe('DocumentQuestionerMappingComponent', () => {
  let component: DocumentQuestionerMappingComponent;
  let fixture: ComponentFixture<DocumentQuestionerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentQuestionerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentQuestionerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
