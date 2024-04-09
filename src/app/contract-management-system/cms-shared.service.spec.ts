import { TestBed } from '@angular/core/testing';

import { CMSSharedService } from './cms-shared.service';

describe('CMSSharedService', () => {
  let service: CMSSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CMSSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
