import { ChangeDetectorRef, Component, Input, OnInit, computed } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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
export class NavbarComponent implements OnInit {
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef, private messageService: MessageService, private router: Router) { }
  drawingOpen = false
  galleryOpen = false
  profilOpen = false
  loginOpen = false
  registerOpen = false
  @Input({ required: true }) logged_in: boolean = false

  menuOpen = false;

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.drawingOpen = event.url === "/new-drawing"
        this.galleryOpen = event.url === "/gallery"
        this.profilOpen = event.url === "/profil"
        this.loginOpen = event.url === "/login" || event.url === "/"
        this.registerOpen = event.url === "/register"
      }
    })
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }



  navigateGuest() {
    this.router.navigateByUrl('/guest')
  }

  navigateMain() {
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

