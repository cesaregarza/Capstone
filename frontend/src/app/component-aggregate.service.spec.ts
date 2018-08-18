import { TestBed, inject } from '@angular/core/testing';

import { ComponentAggregateService } from './component-aggregate.service';

describe('ComponentAggregateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentAggregateService]
    });
  });

  it('should be created', inject([ComponentAggregateService], (service: ComponentAggregateService) => {
    expect(service).toBeTruthy();
  }));
});
