import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService) { }
  nev = ""
  email = ""

  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/user";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');
    if (localStorage.getItem('logged') == null) {
      this.dataservice.move_to("/")
    }
    else {
      this.http.get(url, { withCredentials: true }).subscribe(
        (data: any) => {
          console.log(data);
          this.nev = data.name;
          this.email = data.email;
        },
        error => {
          this.dataservice.logout()
        }

      )
    }
  }
}
