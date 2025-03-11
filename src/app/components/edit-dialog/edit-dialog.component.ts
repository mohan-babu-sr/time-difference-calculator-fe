import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  isCreate: boolean = false;
  isValid: boolean = true;
  location: string | undefined;
  dateControl = new FormControl(null, [Validators.required]);
  timeControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbService: DbService
  ) {
    if (data) {
      this.isCreate = data.isCreate;
    }
  }

  onDateChange() {
    this.dbService.getByDate(this.dateControl.value).subscribe(data => {
      this.isValid = !(data.length > 0);
      this.dateControl.setErrors(this.isValid ? null : { dateExists: true });
    })
  }

  onTimeChange(): void {
    const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;

    this.isValid = timeRegex.test(this.timeControl.value || '');
    this.timeControl.setErrors(this.isValid ? null : { invalidTime: true });
  }

  onSave(): void {
    let createData = {
      inTime: '',
      outTime: '',
      location: this.data.location,
      date: this.data.date
    }
    console.log('Saving:', this.isCreate ? createData : this.data);
  
    // this.dialogRef.close(this.isCreate ? createData : this.data); // Return updated data
  }

  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without changes
  }
}
