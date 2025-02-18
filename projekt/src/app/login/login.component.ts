import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataserviceService } from '../dataservice.service';
import { Route } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService) { }
  url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/login"
  onSubmit(email: string, pass: string) {
    let headerss = new HttpHeaders();
    headerss.set('X-Requested-With', 'XMLHttpRequest')
    headerss.set('Content-Type', 'application/json')
    let formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', pass);

    this.http.post(this.url, formData, { headers: headerss, observe: 'response', withCredentials: true }).subscribe(
      data => {
        console.log(data)
        this.dataservice.login();
        this.dataservice.move_to('/logged-main')
      },
      error => document.getElementById("hiba")!.innerText = "Invalid credentials!"
    )

  }
}
