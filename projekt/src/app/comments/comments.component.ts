import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;

    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    const formData = new FormData();
    formData.append('kepid', this.id);

    const url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodesbykepid";

    this.http.post<any[]>(url, formData, { headers, withCredentials: true }).subscribe(
      (data) => {
        console.log("Kép adatok:", data);

        const imageData = data[0];

        this.width = imageData.width;
        this.cardHex = imageData.hex_codes;
        this.userName = imageData.user?.name ?? 'Ismeretlen';
        this.userId = imageData.user?.id;
        this.hashtags = imageData.hashtags
        this.description = imageData.description ?? ''
        this.name = imageData.name

        this.cdr.detectChanges(); // ha kell

        this.updateCanvasSize();
        this.drawCanvas();
      },
      (err) => {
        console.error("Hiba:", err);
      }
    );


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
