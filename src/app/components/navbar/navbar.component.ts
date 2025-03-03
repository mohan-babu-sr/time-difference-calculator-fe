import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = true; // Change this based on auth status
  isMobileMenuOpen = false;

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('isMobileMenuOpen: ',!this.isMobileMenuOpen);
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }
}
