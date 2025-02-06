import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-logged-main',
  imports: [],
  templateUrl: './logged-main.component.html',
  styleUrl: './logged-main.component.css'
})
export class LoggedMainComponent implements OnInit {
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
