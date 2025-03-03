import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  isValid: boolean = true;
  
  onTimeChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/;

    this.isValid = timeRegex.test(inputElement.value);
    console.log(this.isValid);
  }  

  onSave(): void {
    this.dialogRef.close(this.data); // Return updated data
  }

  onCancel(): void {
    this.dialogRef.close(null); // Close dialog without changes
  }
}
