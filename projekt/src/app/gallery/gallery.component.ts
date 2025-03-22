import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { NgFor } from '@angular/common';
import { DrawingCardComponent } from '../drawing-card/drawing-card.component';
import { PaginatorModule } from 'primeng/paginator';


@Component({
  selector: 'app-gallery',
  imports: [NgFor, DrawingCardComponent, PaginatorModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  data: any[] = []
  user: any[] = []
  dynamicPageSize: number = 5;
  cardName = "";
  userName = "";
  cardHex: any[] = [];
  cardWidth = "";
  ExpandCard = false;

  private readonly MIN_CANVAS_SIZE = 200; // Minimális méret
  private readonly MAX_CANVAS_SIZE = 500; // Eredeti méret
  canvasSize = this.MAX_CANVAS_SIZE; // Dinamikus méret
  paginatedData: any[] = [];
  pageSize = 10;
  currentPage = 0;


  @ViewChild('canvass', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodes";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');
    this.http.get(url, { headers: headers, withCredentials: true }).subscribe(
      (data: any) => {
        console.log(data)
        this.data = data[0]
        this.updatePaginatedData();

      }
    );
    this.adjustPaginator();
    this.updateCanvasSize(); // Inicializáláskor is méretezzük át
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.data.slice(start, end);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateCanvasSize();
    this.drawCanvas();
    this.adjustPaginator();
  }


  adjustPaginator() {
    this.dynamicPageSize = window.innerWidth < 768 ? 3 : 5;
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

    ctx.imageSmoothingEnabled = false;

    const gridWidth = parseInt(this.cardWidth);
    const gridHeight = Math.ceil(this.cardHex.length / gridWidth);

    // Dinamikus méret beállítása
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    const pixelSizeX = this.canvasSize / gridWidth;
    const pixelSizeY = this.canvasSize / gridHeight;
    const pixelSize = Math.min(pixelSizeX, pixelSizeY);

    const offsetX = (this.canvasSize - gridWidth * pixelSize) / 2;
    const offsetY = (this.canvasSize - gridHeight * pixelSize) / 2;

    for (let i = 0; i < this.cardHex.length; i++) {
      const x = Math.round((i % gridWidth) * pixelSize + offsetX);
      const y = Math.round(Math.floor(i / gridWidth) * pixelSize + offsetY);

      ctx.fillStyle = this.cardHex[i];
      ctx.strokeStyle = 'transparent';
      ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));
    }
  }

  onExpand(value: any) {
    this.ExpandCard = true;
    this.cardName = value.name;
    this.cardHex = value.hex_codes;
    this.cardWidth = value.width;

    this.updateCanvasSize(); // Frissíteni kell a méretet
    this.cdr.detectChanges();
    this.drawCanvas();
  }
}