import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-basic',
  imports: [],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.css'
})
export class BasicComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService) { }
  nev = ""
  email = ""

  onForgotPass() {
    this.dataservice.move_to('/forgot-password');
  }

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
