import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  isCreate: boolean = false;
  isValid: boolean = true;
  location: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.isCreate = data.isCreate;
    }
  }

  onDateChange(event: any) {
    this.data.date = event.value;
  }

  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;

    this.isValid = timeRegex.test(inputElement.value);
    console.log(this.isValid);
  }

  onSave(): void {
    let createData = {
      inTime: '',
      outTime: '',
      location: this.data.location,
      date: this.data.date
    }
    console.log('Saving:', this.isCreate ? createData : this.data);
  
    this.dialogRef.close(this.isCreate ? createData : this.data); // Return updated data
  }

  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without changes
  }
}
