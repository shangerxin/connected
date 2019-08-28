import { TestBed } from '@angular/core/testing';

import { BrowserInfoServiceService } from './browserInfoService';

describe('BrowserInfoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrowserInfoServiceService = TestBed.get(BrowserInfoServiceService);
    expect(service).toBeTruthy();
  });
});
