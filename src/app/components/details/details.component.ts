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

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['date', 'inTime', 'outTime', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbService: DbService, private _notify: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dbService.getData().subscribe(response => {
      response = response.map((item: { date: MomentInput; }) => ({
        ...item,
        date: moment(item.date).format('LL')
      }));
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
}
