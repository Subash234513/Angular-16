import { TestBed } from '@angular/core/testing';

import { FetserviceService } from './fetservice.service';

describe('FetserviceService', () => {
  let service: FetserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
