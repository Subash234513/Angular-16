import { TestBed } from '@angular/core/testing';

import { PayingempService } from './payingemp.service';

describe('PayingempService', () => {
  let service: PayingempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayingempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
