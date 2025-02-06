import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataserviceService } from './dataservice.service';
import { NavbarComponent } from './navbar/navbar.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private dataservice: DataserviceService) {

  }
  private login_subscription?: Subscription
  logged_in = false
  title = 'projekt';

  ngOnInit(): void {
    this.login_subscription = this.dataservice.isAuthenticated$.subscribe(
      (logged: boolean) => {
        this.logged_in = logged
      })

    // if (localStorage.getItem('logged') == "true") {
    //   this.logged_in = true
    // }
    // else {
    //   this.logged_in = false
    // }
    console.log(this.logged_in)
  }
}
