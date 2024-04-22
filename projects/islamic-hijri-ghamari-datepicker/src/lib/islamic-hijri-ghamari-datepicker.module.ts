import { NgModule } from '@angular/core';
import { IslamicHijriGhamariDatepickerComponent } from './islamic-hijri-ghamari-datepicker.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    IslamicHijriGhamariDatepickerComponent
  ],
  imports: [
    FormsModule,
    CommonModule
  ],
  exports: [
    IslamicHijriGhamariDatepickerComponent
  ]
})
export class IslamicHijriGhamariDatepickerModule { }
