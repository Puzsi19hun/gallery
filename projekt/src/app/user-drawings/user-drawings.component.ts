import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { CommonModule } from '@angular/common';
import { DrawingCardComponent } from '../drawing-card/drawing-card.component';

@Component({
  selector: 'app-user-drawings',
  imports: [CommonModule, DrawingCardComponent],
  templateUrl: './user-drawings.component.html',
  styleUrl: './user-drawings.component.css'
})
export class UserDrawingsComponent implements OnInit {
  constructor(private http: HttpClient, private dataservice: DataserviceService) { }

  data: any[] = []
  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodesbyid";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');
    let formData: FormData = new FormData();
    formData.append('user_id', String(localStorage.getItem('id')));

    this.http.post(url, formData, { headers: headers, withCredentials: true }).subscribe(
      (data: any) => {
        console.log(data)
        this.data = data.reverse()
      }
    )
  }
}
