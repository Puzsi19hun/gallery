import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar_logged/navbar.component';
import { NavbarGuestComponent } from './navbar-guest/navbar-guest.component';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NavbarGuestComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  logged_in = false
  title = 'projekt';
}
