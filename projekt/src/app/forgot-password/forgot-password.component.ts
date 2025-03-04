import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef, private messageService: MessageService) { }
  onSubmit(email: any) {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/forgot_password"
    let headerss = new HttpHeaders();
    headerss.set('X-Requested-With', 'XMLHttpRequest')
    headerss.set('Content-Type', 'application/json')
    let formData: FormData = new FormData();
    formData.append('email', email);

    this.http.post(url, formData, { headers: headerss, withCredentials: true }).subscribe(
      (data: any) => {
        console.log(data)
        document.getElementById('text')!.innerHTML = "Email has been sent!"
        document.getElementById('text')!.style.color = "rgb(81, 255, 0)"
        this.cdr.detectChanges()
      },
      error => {
        document.getElementById('text')!.innerHTML = "No user found!"
        document.getElementById('text')!.style.color = "rgb(255, 0, 0)"
        this.cdr.detectChanges()
      }
    )

    document.getElementById('text')!.innerHTML = "Email has been sent!"
    document.getElementById('text')!.style.color = "rgb(81, 255, 0)"
  }
}
