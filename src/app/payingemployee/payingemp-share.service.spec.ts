import { TestBed } from '@angular/core/testing';

import { PayingempShareService } from './payingemp-share.service';

describe('PayingempShareService', () => {
  let service: PayingempShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayingempShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
