import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataserviceService } from '../dataservice.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }



  url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/login"

  ngAfterViewInit(): void {
    if (localStorage.getItem('logged') && this.dataservice.navbar == "logged") {
      this.dataservice.move_to("/logged-main")
    }
  }
  onSubmit(email: string, pass: string) {
    let headerss = new HttpHeaders();
    headerss.set('X-Requested-With', 'XMLHttpRequest')
    headerss.set('Content-Type', 'application/json')
    let formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', pass);

    this.http.post(this.url, formData, { headers: headerss, observe: 'response', withCredentials: true }).subscribe(
      (data: any) => {
        console.log(data)
        this.dataservice.login();
        this.dataservice.set_token(data.message)
        this.dataservice.move_to('/logged-main')
        this.cdr.detectChanges()
      },
      error => document.getElementById("hiba")!.innerText = "Invalid credentials!"
    )

  }
}
