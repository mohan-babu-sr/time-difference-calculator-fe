import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CONSTANTS } from 'src/app/constant';
import { DbService } from 'src/app/services/db.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['date', 'inTime', 'outTime', 'action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dbService: DbService, private _notify: MatSnackBar) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dbService.getData().subscribe(response => {
      this.dataSource = response;
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
  }

  /** Deletes a record */
  deleteRecord(id: string): void {
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
