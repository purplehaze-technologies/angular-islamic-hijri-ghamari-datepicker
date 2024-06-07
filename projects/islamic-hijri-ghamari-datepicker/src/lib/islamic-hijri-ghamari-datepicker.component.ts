import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment-hijri';

export interface ICalendarDate {
  gregorianDate: Date,
  hijriDate: string,
  disabled?: boolean,
  moment: moment.Moment
}
export interface IDate {
  jsDate: Date,
  hijriDate: string,
  moment: moment.Moment
}
@Component({
  selector: 'lib-islamic-hijri-ghamari-datepicker',
  templateUrl: './islamic-hijri-ghamari-datepicker.component.html',
  styleUrls: ['./islamic-hijri-ghamari-datepicker.component.css']
})
export class IslamicHijriGhamariDatepickerComponent implements OnInit {
  @Input() disabled = false;
  @Input() value = new Date();
  @Input() defaultDate = new Date();
  @Input() monthPicker = false;
  @Input() datePicker = true;
  @Input() timePicker = false;
  @Input() showLocaleSwitch = true;
  @Input() locale: 'en' | 'ar' = "en";
  @Input() inputFormat = "YYYY-MM-DD";
  @Input() placeholder = "date/time";
  @Input() disabledDates = [];
  @Input() disableFutureDates: boolean = false;
  @Input() disablePastDates: boolean = false;
  @Input() showPickerIcon = true;
  @Input() showTodayBtn = true;
  @Input() todayBtnText = "";
  @Input() showClearBtn = true;
  @Input() showYearNavigator = true;
  @Input() yearNavigatorRange = "1370,1410";
  @Input() showMonthNavigator = true;

  @Output() date: EventEmitter<IDate> = new EventEmitter();

  selected_date_text: string = null
  showDatepicker = false;
  showYearSelector = false;
  showMonthSelector = false;
  selectedDate: ICalendarDate | null = null;
  currentMonth: moment.Moment;
  dates: ICalendarDate[] = [];
  days_ar: string[] = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  days_en: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months: string[] = moment().localeData().months();
  years: number[] = [];

  ngOnInit() {
    this.currentMonth = moment().startOf('iMonth');
    this.generateCalendar();
    this.generateYears();
  }

  get currentMonthName(): string {
    return this.currentMonth.locale(this.locale).format('iMMMM');
  }

  get currentYear(): string {
    return this.currentMonth.locale(this.locale).format('iYYYY');
  }

  generateYears() {
    const [startYear, endYear] = this.yearNavigatorRange.split(',').map(Number);
    for (let i = startYear; i <= endYear; i++) {
      this.years.push(i);
    }
  }

  generateCalendar() {
    this.dates = [];
    const startOfMonth = this.currentMonth.clone().startOf('iMonth');
    const endOfMonth = this.currentMonth.clone().endOf('iMonth');

    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const date = startDate.clone().subtract(1, 'day');

    while (date.isBefore(endDate, 'day')) {
      date.add(1, 'day');
      if (date.isSameOrAfter(startOfMonth) && date.isSameOrBefore(endOfMonth)) {
        this.dates.push({
          moment: date,
          gregorianDate: date.toDate(),
          hijriDate: date.locale(this.locale).format('iD'),
          disabled: false
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

    console.log("Dates", this.dates)
  }



  previousMonth() {
    this.currentMonth.subtract(1, 'iMonth');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.add(1, 'iMonth');
    this.generateCalendar();
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
        this.selected_date_text = selected_date.gregorianDate
        break;
      default:
        break;
    }

  }
  composeOutput(selected_date) {
    this.date.emit(selected_date)
  }

  convertToHijri(gregorianDate: Date) {
    const hijriDate = moment(gregorianDate).format('iYYYY/iMM/iDD');
    const formattedHijriDate = moment(hijriDate)
      .locale(this.locale)
      .format('DD-iMMMM-YYYY');
    console.log('hijriDate', hijriDate, 'formattedHijriDate', formattedHijriDate);
    return formattedHijriDate;
  }

  // isSelectedDate(date: Date): boolean {
  //   return this.selectedDate && this.selectedDate?.toDateString() === date?.toDateString();
  // }

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
    this.generateCalendar();
  }

  selectYear(year: number) {
    this.currentMonth.iYear(year);
    this.showYearSelector = false;
    this.showMonthSelector = true;
  }
}
