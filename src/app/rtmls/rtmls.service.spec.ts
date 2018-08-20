import { TestBed, inject } from '@angular/core/testing';

import { RtmlsService } from './rtmls.service';

describe('RtmlsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RtmlsService]
    });
  });

  it('should be created', inject([RtmlsService], (service: RtmlsService) => {
    expect(service).toBeTruthy();
  }));
});
