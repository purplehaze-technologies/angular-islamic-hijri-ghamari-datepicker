import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslamicHijriGhamariDatepickerComponent } from './islamic-hijri-ghamari-datepicker.component';

describe('IslamicHijriGhamariDatepickerComponent', () => {
  let component: IslamicHijriGhamariDatepickerComponent;
  let fixture: ComponentFixture<IslamicHijriGhamariDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IslamicHijriGhamariDatepickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IslamicHijriGhamariDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
