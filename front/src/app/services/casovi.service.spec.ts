import { TestBed } from '@angular/core/testing';

import { CasoviService } from './casovi.service';

describe('CasoviService', () => {
  let service: CasoviService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasoviService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
