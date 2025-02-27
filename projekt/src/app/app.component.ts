import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataserviceService } from './dataservice.service';
import { NavbarComponent } from './navbar/navbar.component';
import { Subscription } from 'rxjs';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, NavbarComponent, ToastModule],
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
        if (logged == true) {
          this.dataservice.navbar = "logged"
        }
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
