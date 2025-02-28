import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }
}
