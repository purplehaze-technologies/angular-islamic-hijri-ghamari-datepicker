# Islamic Hijri Ghamari Datepicker

The Islamic Hijri Ghamari Datepicker is an Angular component for selecting dates based on the Islamic Hijri calendar. It supports both English and Arabic locales and allows customization of disabled dates, future and past dates, and specific date ranges.

## Installation

To install the component, use npm:

```
npm install islamic-hijri-ghamari-datepicker
```

## Usage
### Importing the Module

First, import the IslamicHijriGhamariDatepickerModule into your Angular application module:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IslamicHijriGhamariDatepickerModule } from 'islamic-hijri-ghamari-datepicker';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IslamicHijriGhamariDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Using the Component

In your component template, add the <lib-islamic-hijri-ghamari-datepicker> selector:
```
<lib-islamic-hijri-ghamari-datepicker
  [disabled]="false"
  [defaultDate]="defaultDate"
  [placeholder]="'Select date'"
  [disabledDates]="disabledDates"
  [disableFutureDates]="disableFutureDates"
  [disablePastDates]="disablePastDates"
  [disableDatesFrom]="disableDatesFrom"
  [disableDatesTo]="disableDatesTo"
  [showYearNavigator]="true"
  [showMonthNavigator]="true"
  (date)="onDateSelected($event)">
</lib-islamic-hijri-ghamari-datepicker>
```

### Component Properties

@Input() disabled: boolean: Disable the datepicker.
@Input() defaultDate: Date | null: Set the default date.
@Input() placeholder: string: Set the placeholder text.
@Input() disabledDates: Date[]: List of specific dates to disable.
@Input() disableFutureDates: boolean: Disable future dates.
@Input() disablePastDates: boolean: Disable past dates.
@Input() disableDatesFrom: Date | null: Start date for the range of dates to disable.
@Input() disableDatesTo: Date | null: End date for the range of dates to disable.
@Input() showYearNavigator: boolean: Show the year navigator.
@Input() showMonthNavigator: boolean: Show the month navigator.
@Output() date: EventEmitter<IDate>: Event emitter for the selected date.

### Handling Date Selection

In your component, handle the selected date with the onDateSelected method:

```
import { Component } from '@angular/core';
import { IDate } from 'islamic-hijri-ghamari-datepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  defaultDate: Date | null = new Date();
  disabledDates: Date[] = [new Date(2024, 6, 10)];
  disableFutureDates = false;
  disablePastDates = false;
  disableDatesFrom: Date | null = null;
  disableDatesTo: Date | null = null;

  onDateSelected(date: IDate) {
    console.log('Selected date:', date);
  }
}

```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
