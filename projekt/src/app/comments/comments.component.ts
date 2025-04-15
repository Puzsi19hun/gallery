import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { ActivatedRoute } from '@angular/router';
import { interval, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  pfp: string | null;
  atlag_ertekeles: number | null;
  etekelesek_szama: number | null;
  created_at: string;
  updated_at: string;
  location: string | null;
  pass_token: string;
  remember_token: string | null;
}
@Component({
  selector: 'app-comments',
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})


export class CommentsComponent implements OnInit {
  user: User[] = []
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('comment', { static: false }) comment!: ElementRef<HTMLInputElement>;
  private readonly MIN_CANVAS_SIZE = 200; // Minimális méret
  private readonly MAX_CANVAS_SIZE = 550; // Eredeti méret
  canvasSize = this.MAX_CANVAS_SIZE; // Dinamikus méret
  id: any = "";
  width = ""
  cardHex: any[] = []
  userId = ""
  userName = ""
  hashtags: any[] = []
  userDrawings: any[] = []
  description = ''
  name = ''
  comments: any[] = []

  constructor(private route: ActivatedRoute, private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;

    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    const formData = new FormData();
    formData.append('kepid', this.id);

    const url1 = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodesbykepid";
    const url2 = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/comment_get";
    let formdata2 = new FormData();
    formdata2.append('kep_id', this.id)



    this.http.post<any[]>(url1, formData, { headers, withCredentials: true }).pipe(
      tap((data) => {
        console.log("Kép adatok:", data);
        const imageData = data[0];

        this.width = imageData.width;
        this.cardHex = imageData.hex_codes;
        this.userName = imageData.user?.name ?? 'Ismeretlen';
        this.userId = imageData.user?.id;
        this.hashtags = imageData.hashtags;
        this.description = imageData.description ?? '';
        this.name = imageData.name;

        this.cdr.detectChanges(); // ha szükséges
        this.updateCanvasSize();
        this.drawCanvas();
      }),
      switchMap(() => {
        return this.http.post(url2, formdata2, { headers, withCredentials: true });
      })
    ).subscribe({
      next: (res: any) => {
        if (Array.isArray(res.message)) {
          this.comments = res.message.reverse();
        }
      },
      error: (err) => {
        console.error("Hiba:", err);
      }
    });


  }



  ngAfterViewInit(): void {
    this.updateCanvasSize();
    this.drawCanvas();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateCanvasSize();
    this.drawCanvas();
  }

  private updateCanvasSize() {
    const screenWidth = window.innerWidth;
    // A vászon mérete az ablak szélességének 50%-a legyen, de legalább 200px, maximum 500px
    this.canvasSize = Math.max(this.MIN_CANVAS_SIZE, Math.min(this.MAX_CANVAS_SIZE, screenWidth * 0.5));
  }

  sendComment(value: any) {
    if (localStorage.getItem('logged') == null) {
      this.dataservice.errorPopup('Please login first')
      return
    }
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/comment";
    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    (document.getElementById('sendBtn') as HTMLButtonElement)!.disabled = true
    const formData = new FormData();
    formData.append('komment', value);
    formData.append('kep_id', this.id);
    formData.append('user_id', String(localStorage.getItem('id')))

    this.http.post(url, formData, { headers: headers, withCredentials: true }).subscribe(
      (res: any) => {
        console.log(res)
        this.refreshComments()
        this.comment.nativeElement.value = "";
        (document.getElementById('sendBtn') as HTMLButtonElement)!.disabled = false
        this.cdr.detectChanges()
      },
      (error: any) => {
        (document.getElementById('sendBtn') as HTMLButtonElement)!.disabled = false
      }
    )
  }

  refreshComments() {
    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    const formData = new FormData();
    formData.append('kepid', this.id);

    const url2 = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/comment_get";
    let formdata2 = new FormData();
    formdata2.append('kep_id', this.id)

    this.http.post(url2, formdata2, { headers, withCredentials: true }).subscribe(
      (res: any) => {
        if (Array.isArray(res.message)) {
          this.comments = res.message.reverse();
        }
      }
    );


  }

  private drawCanvas() {
    if (!this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false; // Kikapcsolt antialiasing

    const gridWidth = parseInt(this.width);
    const gridHeight = Math.ceil(this.cardHex.length / gridWidth);

    // Canvas beállítása
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    // Skálázás kiszámítása
    const pixelSizeX = this.canvasSize / gridWidth;
    const pixelSizeY = this.canvasSize / gridHeight;
    const pixelSize = Math.min(pixelSizeX, pixelSizeY);

    // Kép középre igazítása
    const offsetX = (this.canvasSize - gridWidth * pixelSize) / 2;
    const offsetY = (this.canvasSize - gridHeight * pixelSize) / 2;

    for (let i = 0; i < this.cardHex.length; i++) {
      const x = Math.round((i % gridWidth) * pixelSize + offsetX);
      const y = Math.round(Math.floor(i / gridWidth) * pixelSize + offsetY);

      ctx.fillStyle = this.cardHex[i];
      ctx.strokeStyle = 'transparent'; // Kikapcsolja a rácsvonalakat
      ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));
    }
  }
}
