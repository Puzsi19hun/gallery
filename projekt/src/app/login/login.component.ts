import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataserviceService } from '../dataservice.service';
import { Route } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  imports: [FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef, private messageService: MessageService) { }

  error = ""
  loginPopup() {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "You succesfully logged in",
    });
  }

  errorPopup(text: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: text,
    });
  }
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
        this.dataservice.loginPopup()
        this.dataservice.login();
        this.dataservice.set_token(data.message)
        this.cdr.detectChanges()
        this.dataservice.move_to('/logged-main')
      },
      error => {
        this.dataservice.errorPopup("Invalid credentials!")
      }

    )
  }

  onForgotPass()
  {
    this.dataservice.move_to('/forgot-password');
  }
}
