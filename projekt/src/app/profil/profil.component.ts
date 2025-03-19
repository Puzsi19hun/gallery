import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BasicComponent } from '../basic/basic.component';
import { UserDrawingsComponent } from '../user-drawings/user-drawings.component';

@Component({
  selector: 'app-profil',
  imports: [BasicComponent, UserDrawingsComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService) { }
  profilOpen = true
  drawingsOpen = false

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  ngAfterViewInit(): void {
    if (localStorage.getItem('logged') == null || this.dataservice.get_navbar() == "guest" || localStorage.getItem('token') == null) {
      this.dataservice.logout()
      this.dataservice.move_to("/")
    }
  }

  onForgotPass() {
    this.dataservice.move_to('/forgot-password');
  }

  reset() {
    this.profilOpen = false
    this.drawingsOpen = false
  }

  onDrawings() {
    this.reset()
    this.drawingsOpen = true
  }

  onProfil() {
    this.reset()
    this.profilOpen = true
  }


  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/user";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');
    if (localStorage.getItem('logged') == null) {
      this.dataservice.move_to("/")
    }
  }
}
