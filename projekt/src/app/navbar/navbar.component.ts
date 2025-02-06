import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private dataservice: DataserviceService, private http: HttpClient) { }

  @Input({ required: true }) logged_in: boolean = false


  onLogout() {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/logout"
    this.http.post(url, { observe: "response" }, { withCredentials: true }).subscribe(
      data => {
        console.log(data)
        this.dataservice.logout()
        this.dataservice.move_to("/")
      },
      error => {
        if (error.message == "Unauthenticated.") {
          this.dataservice.logout();
        }
      }
    )
  }
}

