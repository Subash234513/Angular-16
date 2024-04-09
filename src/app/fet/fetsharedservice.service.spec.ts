import { TestBed } from '@angular/core/testing';

import { FetsharedserviceService } from './fetsharedservice.service';

describe('FetsharedserviceService', () => {
  let service: FetsharedserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetsharedserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
