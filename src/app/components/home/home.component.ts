import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { DbService } from 'src/app/services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { CONSTANTS } from 'src/app/constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  selectedTime = moment().format('LTS');
  endTime: any;
  data: any;
  isCurrentDateExist: boolean = false;

  constructor(private dbService: DbService, private _notify: MatSnackBar) { }

  ngOnInit(): void {
    this.loadData();
    this.checkAndCalculateTime(6);
  }

  /** Fetch all data */
  loadData(): void {
    this.dbService.getData().subscribe(response => {
      this.data = response;
      console.log('Data:', this.data);
    });

  }

  /** Handles time input change */
  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedTime = inputElement.value;
    console.log('Time changed to:', this.selectedTime);
  }

  onDateChange(event: any) {
    this.currentDate = event.value; 
    this.selectedTime = moment().format('LTS');
  }

  /** Checks if current date exists and calculates time */
  checkAndCalculateTime(hoursToAdd: number): void {
    this.getByDate(this.currentDate).subscribe(response => {
      this.isCurrentDateExist = response.length > 0;
      this.endTime = moment(this.selectedTime, 'LTS').add(hoursToAdd, 'hours').format('LTS');

      if (this.isCurrentDateExist) {
        this.currentDate = this.data[0].date;
        this.selectedTime = this.data[0].inTime;
        this.endTime = this.data[0].outTime;
        this.notify(CONSTANTS.INFO, CONSTANTS.OUT_TIME_MESSAGE + this.endTime);

      } else {
        const payload = {
          date: this.currentDate,
          inTime: this.selectedTime,
          outTime: this.endTime
        };
        this.addData(payload);
      }
    });
    this.isCurrentDateExist = false;
  }

  /** Fetches data by date */
  getByDate(date: Date) {
    return this.dbService.getByDate(moment(date).format('YYYY-MM-DD'));
    // .pipe(
    //   map(response => {
    //     if (response.length > 0) {
    //       this.currentDate = response[0].date;
    //       this.selectedTime = response[0].inTime;
    //       this.endTime = response[0].outTime;
    //     }
    //     return response.length > 0;
    //   })
    // );
  }

  /** Adds new data entry */
  addData(payload: any): void {
    this.dbService.addData(payload).subscribe(() => {
      this.loadData();
      this.notify(CONSTANTS.SUCCESS, CONSTANTS.RECORD_ADDED);
      setTimeout(() => {
        this.notify(CONSTANTS.INFO, CONSTANTS.OUT_TIME_MESSAGE + this.endTime);
      }, 5000);
    });
  }

  /** Deletes a record */
  deleteData(id: string): void {
    this.dbService.deleteData(id).subscribe(() => {
      this.loadData();
      this.notify(CONSTANTS.WARNING, CONSTANTS.RECORD_DELETED);

    });
  }

  notify(statusType: string, message: string): void {
    this._notify.openFromComponent(NotificationComponent, {
      duration: 5 * 1000,
      data: {
        type: statusType,
        message: message
      }
    });
  }
}
