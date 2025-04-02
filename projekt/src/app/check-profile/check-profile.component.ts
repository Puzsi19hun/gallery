import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawingCardComponent } from '../drawing-card/drawing-card.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-check-profile',
  imports: [DrawingCardComponent, CommonModule, PaginatorModule],
  templateUrl: './check-profile.component.html',
  styleUrl: './check-profile.component.css'
})
export class CheckProfileComponent implements OnInit {
  userId: string | null = '';
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


  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Access route parameter
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log(this.userId)
  }

  paginate(event: any) {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const reversedData = [...this.data].reverse();

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = reversedData.slice(start, end);
  }

  adjustPaginator() {
    this.dynamicPageSize = window.innerWidth < 768 ? 3 : 5;
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

  private updateCanvasSize() {
    const screenWidth = window.innerWidth;
    // A vászon mérete az ablak szélességének 50%-a legyen, de legalább 200px, maximum 500px
    this.canvasSize = Math.max(this.MIN_CANVAS_SIZE, Math.min(this.MAX_CANVAS_SIZE, screenWidth * 0.5));
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateCanvasSize();
    this.drawCanvas();
    this.adjustPaginator();
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
}
