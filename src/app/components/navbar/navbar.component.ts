import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { timeout, catchError, of } from 'rxjs';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = true; // Change this based on auth status
  isMobileMenuOpen = false;

  private snackBarRef: MatSnackBarRef<any> | null = null;

  constructor(private dbService: DbService, private _notify: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkServerStatus();
  }

  checkServerStatus() {
    this.dbService.getData()
      .pipe(
        timeout(10000), // Wait for 10 seconds
        catchError(() => {
          this.snackBarRef = this._notify.open("Server is booting, please wait!", 'Okay', {
            panelClass: ['error-snackbar']
          });
          return of(null); // Return an empty observable to continue execution
        })
      )
      .subscribe(response => {
        if (response && this.snackBarRef) {
          this.snackBarRef.dismiss(); 
          this.snackBarRef = null;
        }
      });
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('isMobileMenuOpen: ', !this.isMobileMenuOpen);
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }
}
