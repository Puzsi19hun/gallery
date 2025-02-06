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
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/user"
    let headers = new HttpHeaders()
    headers.set('X-Requested-With', 'XMLHttpRequest')

    this.http.get(url, { headers: headers, observe: "response", withCredentials: true }).subscribe(
      (data: any) => {
        console.log(data)
        this.nev = data.body!.name
        this.email = data.body!.email
      }
    )
  }

  onLogout(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/logout"
    let headers = new HttpHeaders()
    headers.set('X-Requested-With', 'XMLHttpRequest')
    this.http.post(url, { headers: headers, observe: "response" }, { withCredentials: true }).subscribe(
      data => {
        this.dataservice.move_to("/")
      }
    )
  }
}
