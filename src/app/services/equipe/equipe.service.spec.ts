/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipeService } from './equipe.service';

describe('Service: Equipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipeService]
    });
  });

  it('should ...', inject([EquipeService], (service: EquipeService) => {
    expect(service).toBeTruthy();
  }));
});
