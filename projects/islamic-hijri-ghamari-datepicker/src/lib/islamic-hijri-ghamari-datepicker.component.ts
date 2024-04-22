import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment-hijri';

@Component({
  selector: 'islamic-hijri-ghamari-datepicker',
  templateUrl: './islamic-hijri-ghamari-datepicker.html',
  styles: ['./islamic-hijri-ghamari-datepicker.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IslamicHijriGhamariDatepickerComponent),
    multi: true
  }],
})
export class IslamicHijriGhamariDatepickerComponent implements ControlValueAccessor, OnInit {
  @ViewChild('modalCalendar') modalCalendar?: TemplateRef<any>;

  @ViewChild('buttonCallendar') buttonCallendar: any;
  @ViewChild('inputCallendar') inputCallendar: any;
  @ViewChild('bodyCallendar') bodyCallendar: any;
  @ViewChild('menuCallendar') menuCallendar: any;

  @ViewChild('rowCallendar') rowCallendar: any;
  @ViewChild('colCallendar') colCallendar: any;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcElementRect();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.remCalendarBody();
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onGlobalClick(event: any): void {

    if (this.isOpen && !this.buttonCallendar.nativeElement.contains(event.target) && !this.inputCallendar.nativeElement.contains(event.target)) {
      if (this.isOpen && this.isHide && (!this.bodyCallendar.nativeElement.contains(event.target))) {

        this.remCalendarBody();
        this.isOpen = false;
      } else {
        this.isHide = true;
      }
    }

  }

  @Input() disabled?: boolean = false;
  @Input() inputDate?: string;
  @Input() border: boolean = true;
  @Output() onValueChanged = new EventEmitter<string>();

  private embeddedViewRef: any;

  public elementRect: any;
  public width?: string;
  public height?: string;
  public transform?: string;
  public isOpen: boolean = false;
  public isHide: boolean = true;
  public isTop: boolean = true;

  public step: number = 1;

  public listOfDate = new Array<any>();

  public OneTitle: string = "1300";
  public TwoTitle: string = "JAN";

  public dayOfWeek: number = 0;

  public bolDateNow: boolean = false;
  public bolDateSelect: boolean = false;

  public strDateNow: string = "";
  public strDateSelect: string = "";

  private dateNow: string;
  private dateChange?: string;
  private dateSelect?: string;


  private momentNow?: moment.Moment;
  private momentChange?: moment.Moment;
  private momentSelect?: moment.Moment;

  onChange: (_: string) => void = (_: string) => { };
  onTouched: () => void = () => { };


  constructor(
    private viewContainerRef: ViewContainerRef,
    private eRef: ElementRef
  ) {
    this.dateNow = moment().format("iYYYY/iMM/iDD");
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputDate?.currentValue != null) {
      const parsedDate = moment(this.inputDate, 'iYYYY/iM/iD')
      const formattedDate = parsedDate.format('iDD-iMMMM-iYYYY');

      this.inputDate = formattedDate?.toString()
      // const originalDate = (moment(formattedDate, 'iDD-iMMMM-iYYYY')).format('iYYYY/iM/iDD');
    }

  }
  updateChanges() {
    this.onChange(this.inputDate ?? '');
  }

  /**
   * Writes a new item to the element.
   * @param inputDate the value
   */
  writeValue(inputDate: string): void {
    this.inputDate = inputDate;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    // setTimeout( () => {
    //   this.isOpen = false;
    //               }, 20000);
  }

  calcElementRect() {
    this.elementRect = this.inputCallendar.nativeElement.getBoundingClientRect();

    this.width = this.elementRect.width + "px";
    this.height = "1px";


    if ((window.innerHeight / 2) > this.elementRect.y) {
      this.isTop = true;
      this.transform = "translate(" + (this.elementRect.x) + "px, " + (this.elementRect.y + (this.elementRect.height + window.scrollY)) + "px)";
    } else {
      this.isTop = false;
      this.transform = "translate(" + (this.elementRect.x) + "px, " + (this.elementRect.y + (window.scrollY)) + "px)";
    }
  }

  addCalendarBody() {
    if (this.modalCalendar) {
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.modalCalendar);
      this.embeddedViewRef.detectChanges();
      for (let node of this.embeddedViewRef.rootNodes) {
        document.body.appendChild(node);
      }
    }
  }

  remCalendarBody() {
    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
    }
  }

  togglerMenu(e: any) {

    this.inputCallendar.nativeElement.focus();

    if (e !== null) {
      this.calcElementRect();
    }


    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.addCalendarBody()

      this.momentNow = moment(this.dateNow, 'iYYYY/iMM/iDD');

      if (this.inputDate == undefined || this.inputDate == null || this.inputDate == "") {
        this.momentChange = moment(this.dateNow, 'iYYYY/iMM/iDD');
        this.momentSelect = moment(this.dateNow, 'iYYYY/iMM/iDD');

      } else {
        if (moment(this.inputDate, 'iDD-iMMMM-iYYYY').isValid()) {

          const modifiedDate = moment(this.inputDate, 'iDD-iMMMM-iYYYY')?.subtract(1, 'iMonth');
          const modifiedDateString = modifiedDate.format('iYYYY/iMM/iDD');

          this.momentChange = moment(modifiedDateString, 'iYYYY/iMM/iDD');
          this.momentSelect = moment(modifiedDateString, 'iYYYY/iMM/iDD');
        } else {
          this.momentChange = moment(this.dateNow, 'iYYYY/iMM/iDD');
          this.momentSelect = moment(this.dateNow, 'iYYYY/iMM/iDD');
        }
      }

      this.step = 1;
      this.changeList();

    } else {
      this.remCalendarBody();
    }
  }

  cbuttonCallendar() {

    //this.inputCallendar.nativeElement.focus();
    if (this.momentSelect) {
      this.dateSelect = this.momentSelect.format('iYYYY/iMM/iDD');
      this.momentChange = moment(this.dateSelect, 'iYYYY/iMM/iDD');;
      switch (this.step) {
        case 1: // days
          this.step = 3;
          break;
        case 2: // months
          this.step = 1;
          break;
        case 3: // years
          this.step = 1;
          break;
      }
      this.changeList()
    }
  }

  pbuttonCallendar() {
    switch (this.step) {
      case 1:
        if (this.momentChange)
          this.momentChange.add(-1, 'iMonth');
        break;
      case 2:

        break;
      case 3:
        if (this.momentChange)
          this.momentChange.add(-14, 'iYear');
        break;
    }

    this.changeList()
  }

  nbuttonCallendar() {
    switch (this.step) {
      case 1:
        if (this.momentChange)
          this.momentChange.add(1, 'iMonth');
        break;
      case 2:

        break;
      case 3:
        if (this.momentChange)
          this.momentChange.add(14, 'iYear');
        break;
    }

    this.changeList()
  }

  blurInput(e: any) {

  }

  changeInput(e: any) {
    if (moment(this.inputDate, 'iDD-iMMMM-iYYYY').isValid()) {
      if (typeof this.onChange === 'function') {
        this.onChange(this.inputDate ?? '');
      }
    } else {
      this.inputDate = moment(this.dateNow, 'iYYYY/iMM/iDD').format('iDD-iMMMM-iYYYY').toString();

      if (typeof this.onChange === 'function') {
        this.onChange(this.inputDate);
      }
    }
    this.onValueChanged.emit(this.inputDate);
  }

  changeList() {
    this.listOfDate = new Array<any>();
    switch (this.step) {
      case 1:
        this.getDays();
        break;
      case 2:
        this.getMonths();
        break;
      case 3:
        this.getYears();
        break;
    }


  }

  getDays() {
    if ((this.momentNow && this.momentChange) &&
      this.momentNow.iYear() === this.momentChange.iYear() &&
      this.momentNow.iMonth() === this.momentChange.iMonth()) {
      this.bolDateNow = true;
      this.strDateNow = String(this.momentNow.iDate()).padStart(2, '0')
    } else {
      this.bolDateNow = false;
    }

    if ((this.momentSelect && this.momentChange) &&
      this.momentSelect.iYear() === this.momentChange.iYear() &&
      this.momentSelect.iMonth() === this.momentChange.iMonth()) {
      this.bolDateSelect = true;
      this.strDateSelect = String(this.momentSelect.iDate()).padStart(2, '0')
    } else {
      this.bolDateSelect = false;
    }
    if (this.momentChange) {
      this.OneTitle = this.getMonthTitle(this.momentChange.iMonth());
      this.TwoTitle = this.momentChange.iYear().toString();

      // this.momentChange.iDate(1);
      // this.dayOfWeek = this.momentChange.iDay();

      // let sDay = this.momentChange.startOf('iMonth').iDate();
      // let eDay = this.momentChange.endOf('iMonth').iDate();

      // for (let x = 1; x <= this.dayOfWeek; x++) {
      //   this.listOfDate.push({ 'step': this.step, 'title': String("0").padStart(2, '0'), 'value': 0 });
      // }
      // for (let x = sDay; x <= eDay; x++) {
      //   this.listOfDate.push({ 'step': this.step, 'title': String(x).padStart(2, '0'), 'value': x });
      // }

      let firstDay = moment(this.momentChange).startOf('iMonth');

      // Get the last day of the month
      let lastDay = moment(this.momentChange).endOf('iMonth');

      // Initialize the array to hold the days of the month

      // Loop through each day of the month
      for (let date = firstDay.clone(); date.isSameOrBefore(lastDay); date.add(1, 'day')) {
        this.listOfDate.push({
          step: this.step,
          title: date.format('iDD'), // Format the date to get the day of the month
          value: date.date() // Get the day of the month
        });
      }
    }
  }

  getMonths() {

    if (this.momentNow)
      this.strDateNow = this.getMonthTitle(this.momentNow.iMonth());
    if (this.momentSelect)
      this.strDateSelect = this.getMonthTitle(this.momentSelect.iMonth());

    this.OneTitle = this.getMonthTitle(1);
    this.TwoTitle = this.getMonthTitle(12);


    for (let x = 1; x <= 12; x++) {
      this.listOfDate.push({ 'step': this.step, 'title': this.getMonthTitle(x), 'value': x });
    }
  }

  getYears() {
    if (this.momentNow)
      this.strDateNow = String(this.momentNow.iYear());
    if (this.momentSelect)
      this.strDateSelect = String(this.momentSelect.iYear());

    if (this.momentChange) {
      this.OneTitle = this.momentChange.iYear().toString();
      this.TwoTitle = (this.momentChange.iYear() + 19).toString();

      for (let x = this.momentChange.iYear(); x <= (this.momentChange.iYear() + 14); x++) {
        this.listOfDate.push({ 'step': this.step, 'title': String(x), 'value': x });
      }
    }
  }



  setDate(step: number, value: any) {
    switch (step) {
      case 1:
        this.isHide = true;
        if (this.momentChange) {
          this.inputDate = this.momentChange.iYear().toString() + "/" + String(this.momentChange.iMonth() + 1).padStart(2, '0') + "/" + value.title;
          // const parsedDate = moment(inputDate, 'iYYYY/iMM/iDD')
          // const formattedDate = parsedDate.format('iDD-iMM-iYYYY');
          // debugger
          // this.inputDate = formattedDate?.toString()
        }
        if (typeof this.onChange === 'function') {
          if (this.inputDate)
            this.onChange(this.inputDate);
        }
        // debugger
        this.onValueChanged.emit(this.inputDate);

        this.togglerMenu(null);
        break;
      case 2:
        this.isHide = false;
        if (this.momentChange)
          this.momentChange.iMonth(Number(value.value));
        if (this.momentSelect)
          this.momentSelect.iMonth(Number(value.value));

        this.step = 1;
        this.changeList();
        break;
      case 3:
        this.isHide = false;
        if (this.momentChange)
          this.momentChange.iYear(Number(value.value));
        if (this.momentSelect)
          this.momentSelect.iYear(Number(value.value));

        this.step = 2;
        this.changeList();
        break;
    }
  }

  getMonthTitle(value: number) {
    switch (value) {
      case 0:
        return "Muharram";
      case 1:
        return "Safar";
      case 2:
        return "Rabi' al-Awwal";
      case 3:
        return "Rabi' al-Thani";
      case 4:
        return "Jumada al-Awwal";
      case 5:
        return "Jumada al-Thani";
      case 6:
        return "Rajab";
      case 7:
        return "Sha'ban";
      case 8:
        return "Ramadan";
      case 9:
        return "Shawwal";
      case 10:
        return "Dhu al-Qi'dah";
      case 11:
        return "Dhu al-Hijjah";
      default:
        return "";
    }
  }


}

