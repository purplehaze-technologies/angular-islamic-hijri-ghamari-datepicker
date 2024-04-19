import { TestBed } from '@angular/core/testing';

import { IslamicHijriGhamariDatepickerService } from './islamic-hijri-ghamari-datepicker.service';

describe('IslamicHijriGhamariDatepickerService', () => {
  let service: IslamicHijriGhamariDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IslamicHijriGhamariDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
