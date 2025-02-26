import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { NgFor } from '@angular/common';
import { DrawingCardComponent } from '../drawing-card/drawing-card.component';

@Component({
  selector: 'app-gallery',
  imports: [NgFor, DrawingCardComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  data: any[] = []
  user: any[] = []
  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }


  ngAfterViewInit(): void {
    if (localStorage.getItem('logged') == null || this.dataservice.get_navbar() == "guest" || localStorage.getItem('token') == null) {
      this.dataservice.logout()
      this.dataservice.move_to("/")
    }
  }

  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodes";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');
    this.http.get(url, { headers: headers, withCredentials: true }).subscribe(
      (data: any) => {
        this.data = data[0]
      }
    )
  }
}
