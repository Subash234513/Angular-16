import { TestBed } from '@angular/core/testing';

import { PRPOSERVICEService } from './prposervice.service';

describe('PRPOSERVICEService', () => {
  let service: PRPOSERVICEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PRPOSERVICEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
