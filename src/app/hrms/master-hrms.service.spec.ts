import { TestBed } from '@angular/core/testing';

import { MasterHrmsService } from './master-hrms.service';

describe('MasterHrmsService', () => {
  let service: MasterHrmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterHrmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
