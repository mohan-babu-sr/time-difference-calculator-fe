import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { DbService } from 'src/app/services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { CONSTANTS } from 'src/app/constant';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentDate = new Date();
  selectedTime = moment().format('LTS');
  endTime: any;
  isCurrentDateExist: boolean = false;
  isAction: boolean = false;

  constructor(private dbService: DbService, private _notify: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    // this.openDialog();

    this.checkAndCalculateTime(6);
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
        this.currentDate = response[0].date;
        this.selectedTime = response[0].inTime;
        this.endTime = hoursToAdd != 8 ? response[0].outTime : this.endTime;
        if (this.endTime <= moment().format('LTS') && moment(this.currentDate).format('L') === moment().format('L')) {
          let dialogData = {
            title: 'Out-Time Reached!',
            message: 'Out time reached you can leave office now!',
            type: 'info',
            noAction: true
          }
          this.openDialog(dialogData, false);
        } else {
          this.notify(CONSTANTS.INFO, CONSTANTS.OUT_TIME_MESSAGE + this.endTime);
        }
      } else {
        let dialogCreateData = {
          title: 'No record found for the selected date!',
          message: 'Do you want to create a new record? For the selected date: ' + moment(this.currentDate).format('LL'),
          type: 'info',
          actionButton: 'Create'
        }
        this.openDialog(dialogCreateData, true);
      }
    });
    this.isCurrentDateExist = false;
  }

  /** Fetches data by date */
  getByDate(date: Date) {
    return this.dbService.getByDate(moment(date).format('YYYY-MM-DD'));
  }

  /** Adds new data entry */
  addData(payload: any): void {
    this.dbService.addData(payload).subscribe(() => {
      this.notify(CONSTANTS.SUCCESS, CONSTANTS.RECORD_ADDED);
      setTimeout(() => {
        this.notify(CONSTANTS.INFO, CONSTANTS.OUT_TIME_MESSAGE + this.endTime);
      }, 5000);
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

  openDialog(data: any, isAction: boolean): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && isAction) {
        const payload = {
          date: this.currentDate,
          inTime: this.selectedTime,
          outTime: this.endTime
        };
        this.addData(payload);
      }
    });
  }
}
