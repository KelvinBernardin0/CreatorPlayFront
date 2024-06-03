import { TestBed } from '@angular/core/testing';

import { RegistraseService } from './registrase.service';

describe('RegistraseService', () => {
  let service: RegistraseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistraseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
