import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged-main',
  imports: [],
  templateUrl: './logged-main.component.html',
  styleUrl: './logged-main.component.css'
})
export class LoggedMainComponent implements OnInit {
  constructor(private http: HttpClient)
  {}
  nev = ""
  email = ""

  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/user"
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest')

    this.http.get(url, {headers: headers, observe: "response"}).subscribe(
      data => {
        console.log(data)
      }
    )
  }

  onLogout(): void{
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/logout"
    this.http.post(url, {observe: "response"}).subscribe(
      data => {
        console.log(data)
      }
    )
  }
}
