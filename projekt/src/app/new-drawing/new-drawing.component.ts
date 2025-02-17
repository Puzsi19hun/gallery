import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-new-drawing',
  imports: [],
  templateUrl: './new-drawing.component.html',
  styleUrl: './new-drawing.component.css'
})
export class NewDrawingComponent{
  showDialog = false
  mode = "draw"
  selectedColor = "black"
  private ctx!: CanvasRenderingContext2D | null;
  private canvasSize = 600; 
  private pixelGrid: string[][] = []; 
  gridWidth: number = 16;   
  gridHeight: number = 16;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;


  ngAfterViewInit() {
    this.setupCanvas();
    this.initGrid();
    this.drawGrid();

    if (window.innerWidth < 2000)
    {
      this.canvasSize = 200
    }
  }


  initGrid() {
    this.pixelGrid = Array.from({ length: this.gridHeight}, () =>
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
        ctx.fillStyle = this.pixelGrid[y][x]; 
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  setupCanvas() {
    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    if (this.ctx) {
      canvasEl.width = this.canvasSize;
      canvasEl.height = this.canvasSize;
    }
  }
  openDialog() {
    this.showDialog = true
  }



}
