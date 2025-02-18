import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, HostListener, OnInit, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-drawing',
  imports: [],
  templateUrl: './new-drawing.component.html',
  styleUrl: './new-drawing.component.css'
})
export class NewDrawingComponent {
  showDialog = false
  mode = "draw"
  selectedColor = "black"
  private ctx!: CanvasRenderingContext2D | null;
  private canvasSize = 600;
  private pixelGrid: string[][] = [];
  private drawing = false;
  private erasing = false;

  gridWidth: number = 16;
  gridHeight: number = 16;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private hoverX: number | null = null;
  private hoverY: number | null = null;

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gridWidth'] || changes['gridHeight']) {
      this.initializeCanvas();
    }
  }

  initializeCanvas() {
    this.setCanvasSize();
    this.setupCanvas();
    this.initGrid();
    this.drawGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (!this.canvas) return;

    const canvasElement = this.canvas.nativeElement as HTMLCanvasElement;

    // Limitáljuk a méretet, hogy ne legyen túl nagy
    const maxCanvasSize = 600;
    const newSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, maxCanvasSize);

    // Ha a méret nem változik, nem kell újrarajzolni
    if (this.canvasSize === newSize) return;

    this.canvasSize = newSize;
    canvasElement.width = this.canvasSize;
    canvasElement.height = this.canvasSize;

    // Újrarajzolás az elmentett pixelGrid alapján
    this.drawGrid();
  }



  setCanvasSize() {
    const screenWidth = window.innerWidth;
    this.canvasSize = screenWidth < 600 ? 250 : screenWidth < 1024 ? 400 : 600;
  }

  setupCanvas() {
    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    if (this.ctx) {
      canvasEl.width = this.canvasSize;
      canvasEl.height = this.canvasSize;
    }
  }

  initGrid() {
    this.pixelGrid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill('white')
    );
  }

  drawGrid() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const cellWidth = this.canvasSize / this.gridWidth;
    const cellHeight = this.canvasSize / this.gridHeight;

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.hoverX === x && this.hoverY === y) {
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Szürke átlátszó hover szín
        } else {
          ctx.fillStyle = this.pixelGrid[y][x];
        }
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.drawing = true;
    } else if (event.button === 2) {
      this.erasing = true;
    }
    this.drawPixel(event);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.drawing = false;
    this.erasing = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.updateHoverCell(event);
    if (this.drawing || this.erasing) {
      this.drawPixel(event);
    }
  }

  updateHoverCell(event: MouseEvent) {
    if (!this.ctx) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const scaleX = this.canvas.nativeElement.width / rect.width;
    const scaleY = this.canvas.nativeElement.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const cellWidth = this.canvas.nativeElement.width / this.gridWidth;
    const cellHeight = this.canvas.nativeElement.height / this.gridHeight;
    const gridX = Math.floor(x / cellWidth);
    const gridY = Math.floor(y / cellHeight);

    if (gridX >= 0 && gridX < this.gridWidth && gridY >= 0 && gridY < this.gridHeight) {
      this.hoverX = gridX;
      this.hoverY = gridY;
    } else {
      this.hoverX = null;
      this.hoverY = null;
    }
    this.drawGrid();
  }

  drawPixel(event: MouseEvent) {
    if (!this.ctx) return;

    if (this.hoverX !== null && this.hoverY !== null) {
      if (this.drawing) {
        this.pixelGrid[this.hoverY][this.hoverX] = 'black';
      } else if (this.erasing) {
        this.pixelGrid[this.hoverY][this.hoverX] = 'white';
      }
      this.drawGrid();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hoverX = null;
    this.hoverY = null;
    this.drawGrid();
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }


  openDialog() {
    this.showDialog = true
  }

}
