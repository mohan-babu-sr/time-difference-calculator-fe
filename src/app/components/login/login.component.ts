import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  userData: any;

  ngOnInit(): void {
    this.userData = {
      name: 'Mohan Babu S R',
      userName: 'mohan-admin',
      email: 'mohan-admin@gmail.com',
      phoneNumber: '+91 95666 24995',
      accountStatus: 'Active',
      lastLogin: moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }

}
