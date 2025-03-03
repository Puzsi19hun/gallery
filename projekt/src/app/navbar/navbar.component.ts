import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef, private messageService: MessageService, private router: Router) { }


  @Input({ required: true }) logged_in: boolean = false
  
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  

  navigateGuest()
  {
    this.router.navigateByUrl('/guest')
  }

  navigateMain()
  {
    this.router.navigateByUrl('/logged-main')
  }

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

    this.dataservice.logoutPopup()
  }
}

