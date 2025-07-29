import { TestBed } from '@angular/core/testing';

import { BeersCompany } from './beers-company';

describe('BeersCompany', () => {
  let service: BeersCompany;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeersCompany);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
