import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; // ✅ Import this
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTS } from 'src/app/constant';
import { DbService } from 'src/app/services/db.service';
import { NotificationComponent } from '../notification/notification.component';
import { MomentInput } from 'moment';
import * as moment from 'moment';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from '../common-dialog/common-dialog.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['date', 'inTime', 'outTime', 'location', 'action'];
  dataSource = new MatTableDataSource<any>();
  month = moment().format('MMMM');
  year = moment().format('YYYY');
  workingDays: number = 0;
  officeDays: number = 0;
  wfhDays: number = 0;
  remainingDays: number = 0;
  remainingOfficeDays: number = 0;
  remainingWFHDays: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbService: DbService, private _notify: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.officeDays = 0;
    this.wfhDays = 0;
    this.remainingDays = 0;
    this.remainingOfficeDays = 0;
    this.remainingWFHDays = 0;
    this.workingDays = this.getWorkingDays(moment().year(), moment().month());
    this.remainingOfficeDays = 12 - this.officeDays;
    this.loadData();
  }

  loadData(): void {
    let filterObject = {
      // date: moment(new Date()).format('YYYY-MM-DD'),
      monthYear: moment().format('YYYY-MM'), // JavaScript months are 0-11
      isFilter: true
    };
    this.dbService.getData(filterObject).subscribe(response => {
      response = response.map((item: { date: MomentInput; location: string }) => {
        // Convert date format
        const formattedDate = moment(item.date).format('LL');
    
        // Count office vs WFH days
        if (item.location?.toLowerCase().includes('office')) {
          this.officeDays = this.officeDays + 1;
        } else {
          this.wfhDays = this.wfhDays + 1;
        }
        this.remainingDays = this.workingDays - (this.officeDays + this.wfhDays);
        this.remainingOfficeDays = 12 - this.officeDays;
        this.remainingWFHDays = this.workingDays - 12 - this.wfhDays;
        return {
          ...item,
          date: formattedDate
        };
      });
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editRecord(record: any) {
    console.log('Editing:', record);
    // Implement edit logic here
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { ...record } // Pass a copy of the record
    });

    dialogRef.afterClosed().subscribe(updatedData => {
      if (updatedData) {
        // Update the data source with the new values
        updatedData.outTime = moment(updatedData.inTime, 'LTS').add(6, 'hours').format('LTS');
        this.updateRecord(updatedData);
      }
    });
  }

  // Function to update the record in the database
  updateRecord(updatedData: any): void {
    this.dbService.updateData(updatedData).subscribe(() => {
      this.loadData(); // Reload table data
      this.notify(CONSTANTS.SUCCESS, CONSTANTS.RECORD_UPDATED);
    });
  }

  deleteRecord(deleteData: any): void {
    const dialogRef = this.dialog.open(CommonDialogComponent, {
      data: {
        title: 'Delete Record!',
        message: 'Are you sure to delete the record? For the selected date: ' + moment(deleteData.date).format('LL'),
        type: 'delete',
        actionButton: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dbService.deleteData(deleteData._id).subscribe(() => {
          this.loadData();
          this.notify(CONSTANTS.WARNING, CONSTANTS.RECORD_DELETED);
        });
      }
    }
    );
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

  createRecord(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: {
        isCreate: true,
        title: 'Add New Record',
        date: moment().format('LL')
      }
    });

    dialogRef.afterClosed().subscribe(newData => {
      if (newData) {
        // Add the new record to the database
        this.dbService.addData(newData).subscribe(() => {
          this.loadData(); // Reload table data
          this.notify(CONSTANTS.SUCCESS, CONSTANTS.RECORD_ADDED);
        });
      }
    });
  }

  getWorkingDays(year: number, month: number): number {
    let workingDays = 0;
    const daysInMonth = moment({ year, month }).daysInMonth(); // Total days in the month
  
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = moment({ year, month, day });
      const dayOfWeek = currentDay.isoWeekday(); // 1 (Monday) to 7 (Sunday)
  
      if (dayOfWeek !== 6 && dayOfWeek !== 7) {
        workingDays++; // Count only weekdays (Mon-Fri)
      }
    }
  
    return workingDays;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.ngOnInit(); // Call your logic
  }  
}
