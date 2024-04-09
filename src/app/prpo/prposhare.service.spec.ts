import { TestBed } from '@angular/core/testing';

import { PRPOshareService } from './prposhare.service';

describe('PRPOshareService', () => {
  let service: PRPOshareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PRPOshareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
