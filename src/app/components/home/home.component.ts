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
  }

  /** Fetch all data */
  loadData(): void {
    this.dbService.getData().subscribe(response => {
      this.data = response;
      console.log('Data:', this.data);
    });

    this.checkAndCalculateTime(6);
  }

  /** Handles time input change */
  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedTime = inputElement.value;
    console.log('Time changed to:', this.selectedTime);
  }

  /** Checks if current date exists and calculates time */
  checkAndCalculateTime(hoursToAdd: number): void {
    this.getByDate(this.currentDate).subscribe(isExist => {
      this.isCurrentDateExist = isExist;
      console.log('selectedTime:', this.selectedTime);
      this.endTime = moment(this.selectedTime, 'LTS').add(hoursToAdd, 'hours').format('LTS');

      if (!this.isCurrentDateExist) {
        const payload = {
          date: this.currentDate,
          inTime: this.selectedTime,
          outTime: this.endTime
        };
        this.addData(payload);
      } else {
        this.notify(CONSTANTS.INFO, CONSTANTS.OUT_TIME_MESSAGE + this.endTime);
      }
    });
  }

  /** Fetches data by date */
  getByDate(date: Date) {
    return this.dbService.getByDate(date).pipe(
      map(response => {
        if (response.length > 0) {
          this.currentDate = response[0].date;
          this.selectedTime = response[0].inTime;
          this.endTime = response[0].outTime;
        }
        return response.length > 0;
      })
    );
  }

  /** Adds new data entry */
  addData(payload: any): void {
    this.dbService.addData(payload).subscribe(() => {
      this.loadData();
      this.notify(CONSTANTS.SUCCESS, CONSTANTS.RECORD_ADDED);
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
