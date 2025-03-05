import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataserviceService } from '../dataservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-pass',
  imports: [FormsModule],
  templateUrl: './new-pass.component.html',
  styleUrl: './new-pass.component.css'
})
export class NewPassComponent {
  token: string | null = null;

  constructor(private route: ActivatedRoute, private dataservice: DataserviceService, private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params['token'] || params['token'].length != 16) {
        this.dataservice.move_to('/')
      }
      this.token = params['token'];
      console.log('Token:', this.token);
    });
  }

  onSubmit(pass1: string, pass2: string)
  {
    if(pass1 == pass2)
    {
      let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/pass_update"
      let headerss = new HttpHeaders();
      headerss.set('X-Requested-With', 'XMLHttpRequest')
      headerss.set('Content-Type', 'application/json')
      let formData: FormData = new FormData();
      formData.append('password', pass1);
      formData.append('pass_token', this.token!)

      this.http.post(url, formData, { headers: headerss, observe: 'response', withCredentials: true }).subscribe(
        (data: any) => {
          let conf = confirm("Are you sure you want to use this password?")
          if(conf)
          {
            console.log(data)
            this.dataservice.SuccessPopup("Your password has ben succesfully changed!")
            this.cdr.detectChanges()
            this.dataservice.move_to("/")
          }
        },
        error => {
          this.dataservice.errorPopup("Error")
        }

    )
    }
    else{
      this.dataservice.errorPopup('A jelszók nem egyeznek')
    }
  }
}
