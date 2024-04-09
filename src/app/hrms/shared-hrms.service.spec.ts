import { TestBed } from '@angular/core/testing';

import { SharedHrmsService } from './shared-hrms.service';

describe('SharedHrmsService', () => {
  let service: SharedHrmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedHrmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
