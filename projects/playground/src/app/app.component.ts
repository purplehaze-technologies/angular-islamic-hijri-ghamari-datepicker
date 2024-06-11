import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'playground';
  language: string = 'en'
  input_date: Date = new Date(2024, 5, 11)
  disabled_dates: Date[] = [new Date(2024, 5, 20)]
  dateOutputHandler(event) {
    console.log(event)
  }
}
