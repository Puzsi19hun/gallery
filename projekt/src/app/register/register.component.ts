import { Component } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private dataservice: DataserviceService, private http: HttpClient) { }
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
          document.getElementById('hiba')!.innerHTML = "Registration successful!"
          document.getElementById('hiba')!.style.color = "green"
        },
        error => {
          document.getElementById('hiba')!.innerHTML = error
        }
      )

    }
    else {
      document.getElementById('hiba')!.innerHTML = "The passwords do not match!"
    }
  }
}
