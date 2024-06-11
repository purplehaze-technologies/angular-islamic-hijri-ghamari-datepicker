import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment-hijri';

export interface ICalendarDate {
  gregorianDate: Date,
  hijriDate: string,
  disabled?: boolean,
  moment: moment.Moment
}
export interface IDate {
  js_date: Date,
  moment: moment.Moment
}
@Component({
  selector: 'lib-islamic-hijri-ghamari-datepicker',
  templateUrl: './islamic-hijri-ghamari-datepicker.component.html',
  styleUrls: ['./islamic-hijri-ghamari-datepicker.component.css']
})
export class IslamicHijriGhamariDatepickerComponent implements OnInit {
  @Input() disabled = false;
  @Input() defaultDate: Date | null = null;
  // @Input() monthPicker = false;
  // @Input() datePicker = true;
  // @Input() timePicker = false;
  // @Input() showLocaleSwitch = true;
  // @Input() locale: 'en' | 'ar' = "en";
  // @Input() inputFormat = "YYYY-MM-DD";
  @Input() placeholder = "date/time";
  @Input() disabledDates: Date[] = [];
  @Input() disableFutureDates: boolean = false;
  @Input() disablePastDates: boolean = false;
  @Input() disableDatesFrom: Date | null = null;
  @Input() disableDatesTo: Date | null = null;
  // @Input() showPickerIcon = true;
  // @Input() showTodayBtn = true;
  // @Input() todayBtnText = "";
  // @Input() showClearBtn = true;
  @Input() showYearNavigator = true;
  // @Input() yearNavigatorRange = "1370,1410";
  @Input() showMonthNavigator = true;
  @Output() date: EventEmitter<IDate> = new EventEmitter();



  selected_date_text: string = null

  showDatepicker = false;
  showYearSelector = false;
  showMonthSelector = false;

  selectedDate: ICalendarDate | null = null;
  currentMonth: any
  dates: ICalendarDate[] = [];
  // days_ar: string[] = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  days_ar: string[] = ['أح', 'إث', 'ثلا', 'أر', 'خم', 'جم', 'سب'];
  days_en: string[] = ['ʾAḥ', 'Ith', 'Thul', 'ʾArb', 'Kha', 'Jum', 'Sabt'];
  days: string[] = []
  months_ar: string[] = ["ٱلْمُحَرَّم", "صَفَر", "رَبِيع ٱلْأَوَّل", "رَبِيع ٱلثَّانِي", "جُمَادَىٰ ٱلْأُولَىٰ", "جُمَادَىٰ ٱلثَّانِيَة", "رَجَب", "شَعْبَان", "رَمَضَان", "شَوَّال", "ذُو ٱلْقَعْدَة", "ذُو ٱلْحِجَّة"]
  months_en: string[] = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
  months: string[] = [];

  years: number[] = [];
  locale = 'en'
  yearNavigatorRange = "1370,1410";

  constructor() {
    this.currentMonth = moment().startOf('iMonth');
  }
  ngOnInit() {
    this.initCalendar()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initCalendar()
  }

  initCalendar() {
    this.generateYears();
    this.generateMonths()
    this.generateDays()
    this.generateCalendarDates()

    if (this.defaultDate) {
      const defaultMoment = moment(this.defaultDate);
      this.selectedDate = {
        gregorianDate: this.defaultDate,
        hijriDate: defaultMoment.locale(this.locale).format('iD'),
        moment: defaultMoment
      };
      this.updateView(this.selectedDate);
    }
  }
  get currentMonthName(): string {
    return this.currentMonth.locale(this.locale).format('iMMMM');
  }

  get currentYear(): string {
    return this.currentMonth.locale(this.locale).format('iYYYY');
  }

  generateDays() {
    switch (this.locale) {
      case 'en':
        this.days = this.days_en
        break;
      case 'ar':
        this.days = this.days_ar
      default:
        break;
    }

  }
  generateMonths() {
    switch (this.locale) {
      case 'en':
        this.months = this.months_en
        break;
      case 'ar':
        this.months = this.months_ar
      default:
        break;
    }
  }
  generateYears() {
    const [startYear, endYear] = this.yearNavigatorRange.split(',').map(Number);
    for (let i = startYear; i <= endYear; i++) {
      this.years.push(i);
    }
  }

  generateCalendarDates() {
    this.dates = [];
    const startOfMonth = this.currentMonth.clone().startOf('iMonth');
    const endOfMonth = this.currentMonth.clone().endOf('iMonth');

    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const date = startDate.clone().subtract(1, 'day');

    while (date.isBefore(endDate, 'day')) {
      date.add(1, 'day');

      // Check if the date is disabled
      let disabled = false;

      // Check for specific disabled dates

      if (this.disabledDates.some(d => date.isSame(d, 'day'))) {
        disabled = true;
      }

      // Check for future dates
      if (this.disableFutureDates && date.isAfter(moment(), 'day')) {
        disabled = true;
      }

      // Check for past dates
      if (this.disablePastDates && date.isBefore(moment(), 'day')) {
        disabled = true;
      }

      // Check for dates within the disable range
      if (this.disableDatesFrom && this.disableDatesTo) {
        const disableFrom = moment(this.disableDatesFrom);
        const disableTo = moment(this.disableDatesTo);
        if (date.isBetween(disableFrom, disableTo, 'day', '[]')) {
          disabled = true;
        }
      }
      if (date.isSameOrAfter(startOfMonth) && date.isSameOrBefore(endOfMonth)) {
        this.dates.push({
          moment: date,
          gregorianDate: date.toDate(),
          hijriDate: date.locale(this.locale).format('iD'),
          disabled: disabled
        });
      } else {
        this.dates.push({
          moment: date,
          gregorianDate: null,
          hijriDate: '',
          disabled: true
        });
      }
    }
  }



  previousMonth() {
    this.currentMonth.subtract(1, 'iMonth');
    this.generateCalendarDates();
  }

  nextMonth() {
    this.currentMonth.add(1, 'iMonth');
    this.generateCalendarDates();
  }

  selectDate(date) {

    if (date.disabled) {
      return
    }
    this.selectDate = date
    this.updateView(this.selectDate)
    this.showDatepicker = false;

    this.composeOutput(this.selectDate)
  }

  updateView(selected_date) {
    switch (this.locale) {
      case 'en':
        this.selected_date_text = this.convertToHijri(selected_date.gregorianDate);
        break;
      case 'ar':
        this.selected_date_text = this.convertToHijri(selected_date.gregorianDate);
        break;
      default:
        break;
    }

  }
  composeOutput(selected_date) {

    const output = {
      "moment": selected_date.moment,
      "js_date": selected_date.gregorianDate
    }
    this.date.emit(output)
  }

  convertToHijri(gregorianDate: Date) {
    const hijriDate = moment(gregorianDate).format('iYYYY/iMM/iDD');
    const formattedHijriDate = moment(hijriDate).locale(this.locale)
      .format('DD-iMMMM-YYYY');
    return formattedHijriDate;
  }


  toggleMonthSelector() {
    this.showMonthSelector = !this.showMonthSelector;
  }

  toggleYearSelector() {
    this.showYearSelector = !this.showYearSelector;
    if (this.showYearSelector) {
      this.showMonthSelector = false;
    }
  }

  selectMonth(monthIndex: number) {
    this.currentMonth.iMonth(monthIndex);
    this.showMonthSelector = false;
    this.generateCalendarDates();
  }

  selectYear(year: number) {
    this.currentMonth.iYear(year);
    this.showYearSelector = false;
    this.showMonthSelector = true;
  }
}
