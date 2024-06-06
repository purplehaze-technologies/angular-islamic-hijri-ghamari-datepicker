import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment-hijri';

@Component({
  selector: 'lib-islamic-hijri-ghamari-datepicker',
  templateUrl: './islamic-hijri-ghamari-datepicker.component.html',
  styleUrls: ['./islamic-hijri-ghamari-datepicker.component.css'],

})
export class IslamicHijriGhamariDatepickerComponent implements OnInit {
  showDatepicker = false;
  selectedDate: Date;
  currentMonth: moment.Moment;
  dates: { gregorianDate: Date, hijriDate: string }[] = [];
  days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  ngOnInit() {
    this.currentMonth = moment().startOf('iMonth');
    this.generateCalendar();
  }

  get currentMonthName(): string {
    return this.currentMonth.format('iMMMM');
  }

  get currentYear(): string {
    return this.currentMonth.format('iYYYY');
  }

  generateCalendar() {
    this.dates = [];
    const startOfMonth = this.currentMonth.clone().startOf('iMonth').startOf('week');
    const endOfMonth = this.currentMonth.clone().endOf('iMonth').endOf('week');
    const date = startOfMonth.clone().subtract(1, 'day');

    while (date.isBefore(endOfMonth, 'day')) {
      this.dates.push({
        gregorianDate: date.toDate(),
        hijriDate: date.add(1, 'day').format('iD')
      });
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

    this.selectedDate = date.gregorianDate;
    console.log("selectedDate", date, this.selectedDate)
    this.showDatepicker = false;
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDate && this.selectedDate.toDateString() === date.toDateString();
  }

}
