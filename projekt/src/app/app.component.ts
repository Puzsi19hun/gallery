import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar_logged/navbar.component';
import { NavbarGuestComponent } from './navbar-guest/navbar-guest.component';
import { HttpClientModule } from '@angular/common/http';
import { DataserviceService } from './dataservice.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NavbarGuestComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private dataservice: DataserviceService) { }
  logged_in = false
  ngOnInit(): void {
    this.logged_in = this.dataservice.logged_in
  }
  title = 'projekt';
}
