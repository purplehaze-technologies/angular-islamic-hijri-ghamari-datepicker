import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment-hijri';

@Component({
  selector: 'lib-islamic-hijri-ghamari-datepicker',
  templateUrl: './islamic-hijri-ghamari-datepicker.component.html',
  styleUrls: ['./islamic-hijri-ghamari-datepicker.component.css'],

})
export class IslamicHijriGhamariDatepickerComponent implements OnInit {
  @Input() disabled = false;
  @Input() value = new Date();
  @Input() defaultDate = new Date();
  @Input() monthPicker = false;
  @Input() datePicker = true;
  @Input() timePicker = false;
  @Input() showLocaleSwitch = true;
  @Input() locale = "en";
  @Input() inputFormat = "YYYY-MM-DD";
  @Input() placeholder = "date/time";
  @Input() disabledDates = [];
  @Input() disableFutureDates: boolean = false
  @Input() disablePastDates: boolean = false
  @Input() showPickerIcon = true;
  @Input() showTodayBtn = true;
  @Input() todayBtnText = "";
  @Input() showClearBtn = true;
  @Input() showYearNavigator = true;
  @Input() yearNavigatorRange = "1370,1410";
  @Input() showMonthNavigator = true;


  showDatepicker = false;
  selectedDate: any;
  currentMonth: moment.Moment;
  dates: { gregorianDate: Date, hijriDate: string }[] = [];
  days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  ngOnInit() {
    this.currentMonth = moment().startOf('iMonth');
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return this.currentMonth.locale(this.locale).format('iMMMM');
  }

  get currentYear(): string {
    return this.currentMonth.locale(this.locale).format('iYYYY');
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
          gregorianDate: date.toDate(),
          hijriDate: date.locale(this.locale).format('iD')
        });
      } else {
        this.dates.push({
          gregorianDate: null,
          hijriDate: ''
        });
      }
    }
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
    this.selectedDate = this.convertToHijri(date.gregorianDate)
    console.log("selectedDate", date, this.selectedDate)
    this.showDatepicker = false;
  }
  convertToHijri(gregorianDate: Date) {
    const hijriDate = moment(gregorianDate).format('iYYYY/iMM/iDD');
    const formattedHijriDate = moment(hijriDate)
      .locale(this.locale)
      .format('DD-iMMMM-iYYYY');
    console.log('hijriDate', hijriDate, 'formattedHijriDate', formattedHijriDate)
    return formattedHijriDate
  }



  isSelectedDate(date: Date): boolean {
    return
    return this.selectedDate && this.selectedDate?.toDateString() === date?.toDateString();
  }

}
