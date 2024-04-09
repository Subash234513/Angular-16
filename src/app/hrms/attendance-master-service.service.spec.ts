import { TestBed } from '@angular/core/testing';

import { AttendanceMasterServiceService } from './attendance-master-service.service';

describe('AttendanceMasterServiceService', () => {
  let service: AttendanceMasterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceMasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
