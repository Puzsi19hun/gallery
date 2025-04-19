import { ChangeDetectorRef, Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef, private messageService: MessageService) { }


  ngOnInit(): void {
    if (localStorage.getItem('logged') == "true") {
      this.dataservice.move_to("/logged-main")
    }
  }
  onSubmit(name: string, email: string, pass1: string, pass2: string) {
    if (pass1 == pass2) {
      let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/register"

      let headerss = new HttpHeaders();
      headerss.set('X-Requested-With', 'XMLHttpRequest')
      headerss.set('Content-Type', 'application/json')
      let formData: FormData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', pass1);

      this.http.post(url, formData, { headers: headerss, observe: "response" }).subscribe(
        data => {
          console.log(data)
          this.dataservice.registerPopup()
          this.dataservice.move_to("login")
        },
        error => {
          this.dataservice.errorPopup("Your e-mail is already taken.")
        }
      )

    }
    else {
      this.dataservice.errorPopup("The passwords do not match!")
    }
  }
}
