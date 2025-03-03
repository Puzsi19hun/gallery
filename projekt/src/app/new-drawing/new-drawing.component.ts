import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DataserviceService } from '../dataservice.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-new-drawing',
  imports: [ColorPickerModule, FormsModule, NgClass],
  templateUrl: './new-drawing.component.html',
  styleUrls: ['./new-drawing.component.css']
})
export class NewDrawingComponent {
  showDialog = false;
  savingDialog = false;
  mode = "draw";
  color: string = "black";
  private ctx!: CanvasRenderingContext2D | null;
  private pixelGrid: string[][] = [];
  private drawing = false;
  private erasing = false;
  private pipette = false;
  bucketMode: boolean = false;
  private history: string[][][] = [];
private redoStack: string[][][] = [];
  gridWidth: number = 16;
  gridHeight: number = 16;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  private canvasSize: number = 600;
  private hoverX: number | null = null;
  private hoverY: number | null = null;
  private dirtyGrid: boolean[][] = [];

  constructor(private http: HttpClient, private dataservice: DataserviceService) { }



  ngAfterViewInit() {
    if (localStorage.getItem('logged') == null || this.dataservice.get_navbar() == "guest" || localStorage.getItem('token') == null) {
      this.dataservice.logout()
      this.dataservice.move_to("/")
    }
    this.initializeCanvas();
    this.resizeCanvas();
  }

  initializeCanvas() {
    this.setCanvasSize();
    this.setupCanvas();
    this.initGrid();  // Ensure grid is initialized
    this.initDirtyGrid(); // Ensure dirty grid is initialized
  }

  // Initialize the pixel grid with the current size
  initGrid() {
    this.pixelGrid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill('white')
    );
  }

  // Initialize the dirty grid
  initDirtyGrid() {
    this.dirtyGrid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill(true)
    );
  }

  // Draw grid method
  drawGrid() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const cellWidth = this.canvas.nativeElement.width / this.gridWidth;
    const cellHeight = this.canvas.nativeElement.height / this.gridHeight;

    // Rajzoljuk ki a kitöltött cellákat, de szegélyek nélkül
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.dirtyGrid[y][x]) {
          ctx.fillStyle = this.pixelGrid[y][x]; // A cella színe
          ctx.fillRect(
            Math.floor(x * cellWidth),  // Bal felső sarok pontos helye
            Math.floor(y * cellHeight),
            Math.ceil(cellWidth),  // Biztosítsd, hogy a teljes terület ki legyen töltve
            Math.ceil(cellHeight)
          );

        }
      }
    }

    // Hover effektus, ha van hoverelt cella
    if (this.hoverX !== null && this.hoverY !== null && !this.showDialog && !this.savingDialog) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.hoverX * cellWidth, this.hoverY * cellHeight, cellWidth, cellHeight);
    }
  }

  // tools

  handlePipetteClick(event: MouseEvent) {
    if (!this.ctx || !this.pipette) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const scaleX = this.canvas.nativeElement.width / rect.width;
    const scaleY = this.canvas.nativeElement.height / rect.height;

    const clickX = Math.floor((event.clientX - rect.left) * scaleX / (this.canvas.nativeElement.width / this.gridWidth));
    const clickY = Math.floor((event.clientY - rect.top) * scaleY / (this.canvas.nativeElement.height / this.gridHeight));

    if (clickX >= 0 && clickX < this.gridWidth && clickY >= 0 && clickY < this.gridHeight) {
      // Get the color from pixelGrid
      let pickedColor = this.pixelGrid[clickY][clickX];

      // Ensure the color is in proper hex format if needed
      if (pickedColor === 'white') {
        pickedColor = '#ffffff';
      }

      // Update the color
      this.color = pickedColor;
      console.log('Picked color:', pickedColor);

      // Force redraw of the canvas to update the hover color
      // Temporarily reset hover position
      const tempHoverX = this.hoverX;
      const tempHoverY = this.hoverY;

      // Clear hover state
      this.hoverX = null;
      this.hoverY = null;

      // Redraw grid to clear previous hover
      this.drawGrid();

      // Restore hover position
      this.hoverX = tempHoverX;
      this.hoverY = tempHoverY;

      // Redraw grid with updated hover color
      this.drawGrid();

      // Turn off pipette mode
      this.pipette = false;
      document.querySelector('#pipette')?.classList.remove('pipetteActive');
    }
  }


  togglePipetteMode() {
    this.pipette = !this.pipette;
    if (this.pipette) {
      document.querySelector("#pipette")?.classList.add('pipetteActive')
      document.querySelector("#bucket")?.classList.remove('bucketActive')
      this.bucketMode = false
    }
    else {
      document.querySelector('#pipette')?.classList.remove('pipetteActive')
      this.drawing = false; // Rajzolás letiltása pipetta mód kikapcsolásakor
      this.erasing = false; // Törlés letiltása pipetta mód kikapcsolásakor
    }
  }


  // Modify the clear method to capture state before clearing
clear() {
  if (!this.ctx) return;

  // Capture state before clearing
  this.captureState();

  this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

  // Clean up pixelGrid and dirtyGrid arrays
  this.initGrid();
  this.initDirtyGrid();

  // Update the drawing
  this.drawGrid();
}

  toggleBucketMode() {
    this.bucketMode = !this.bucketMode;

    if (this.bucketMode) {
      document.querySelector("#bucket")?.classList.add('bucketActive')
      document.querySelector("#pipette")?.classList.remove('pipetteActive')
      this.pipette = false
    }
    else {
      document.querySelector('#bucket')?.classList.remove('bucketActive')
    }
  }

  fillAreaRecursive(x: number, y: number, targetColor: string) {
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return;
    if (this.pixelGrid[y][x] !== targetColor) return;
    if (this.pixelGrid[y][x] === this.color) return;

    this.pixelGrid[y][x] = this.color;
    this.dirtyGrid[y][x] = true;

    this.fillAreaRecursive(x - 1, y, targetColor);
    this.fillAreaRecursive(x + 1, y, targetColor);
    this.fillAreaRecursive(x, y - 1, targetColor);
    this.fillAreaRecursive(x, y + 1, targetColor);
  }

  fillArea(event: MouseEvent) {
    if (!this.ctx) return;
  
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const scaleX = this.canvas.nativeElement.width / rect.width;
    const scaleY = this.canvas.nativeElement.height / rect.height;
  
    const x = Math.floor((event.clientX - rect.left) * scaleX / (this.canvas.nativeElement.width / this.gridWidth));
    const y = Math.floor((event.clientY - rect.top) * scaleY / (this.canvas.nativeElement.height / this.gridHeight));
  
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return;
  
    const targetColor = this.pixelGrid[y][x];
    if (targetColor === this.color) return;
  
    // Capture state before making changes
    this.captureState();
  
    this.fillAreaRecursive(x, y, targetColor);
    this.drawGrid();
  }




  // The method to change size of the grid
  changeSize(newHeight: any, newWidth: any) {
    this.gridWidth = parseInt(newWidth);
    this.gridHeight = parseInt(newHeight);

    // Re-initialize the grid arrays to match the new size
    this.initGrid();
    this.initDirtyGrid();

    // Resize canvas accordingly
    this.resizeCanvas();

    // Redraw the grid after resizing
    this.drawGrid();
    this.showDialog = false
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeCanvas();
  }



  resizeCanvas() {
    if (!this.canvas) return;

    const screenWidth = window.innerWidth;

    let newCanvasSize = 600;


    if (screenWidth < 500) {
      newCanvasSize = 300
    }
    else if (screenWidth < 768) {
      newCanvasSize = 400;
    } else if (screenWidth < 1024) {
      newCanvasSize = 500;
    }

    this.canvasSize = newCanvasSize;

    const cellWidth = this.canvasSize / this.gridWidth;
    const cellHeight = this.canvasSize / this.gridHeight;

    const newWidth = this.gridWidth * Math.min(cellWidth, cellHeight);
    const newHeight = this.gridHeight * Math.min(cellWidth, cellHeight);

    this.canvas.nativeElement.width = newWidth;
    this.canvas.nativeElement.height = newHeight;

    this.drawGrid();
  }

  setCanvasSize() {
    const cellWidth = this.canvasSize / this.gridWidth;
    const cellHeight = this.canvasSize / this.gridHeight;

    const newWidth = this.gridWidth * Math.min(cellWidth, cellHeight);
    const newHeight = this.gridHeight * Math.min(cellWidth, cellHeight);

    this.canvas.nativeElement.width = newWidth;
    this.canvas.nativeElement.height = newHeight;

    this.drawGrid();
  }

  setupCanvas() {
    const canvasEl = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    if (this.ctx) {
      canvasEl.width = this.canvas.nativeElement.width;
      canvasEl.height = this.canvas.nativeElement.height;

    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!this.savingDialog) {
      if (this.pipette) {
        this.handlePipetteClick(event);
        return;
      }

      if (this.bucketMode) {
        this.fillArea(event);
      } else {
        // Drawing or erasing (left or right button)
        if (event.button === 0) {
          this.drawing = true;
        } else if (event.button === 2) {
          this.erasing = true;
        }
        this.drawPixel(event);
      }
    }

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

  // Update hoverCell logic
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
      if (this.hoverX !== gridX || this.hoverY !== gridY) {
        this.hoverX = gridX;
        this.hoverY = gridY;
        this.drawGrid();
      }
    } else {
      if (this.hoverX !== null && this.hoverY !== null) {
        this.hoverX = null;
        this.hoverY = null;
        this.drawGrid();
      }
    }
  }


  drawPixel(event: MouseEvent) {
    if (!this.ctx || this.pipette) return;
  
    if (this.hoverX !== null && this.hoverY !== null && !this.showDialog && !this.savingDialog) {
      // Capture state before making changes
      this.captureState();
  
      if (this.drawing) {
        this.pixelGrid[this.hoverY][this.hoverX] = this.color;
      } else if (this.erasing) {
        this.pixelGrid[this.hoverY][this.hoverX] = 'white';
      }
  
      this.dirtyGrid[this.hoverY][this.hoverX] = true;
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
    this.showDialog = true;
  }


  // Saving

  savePixelArt(name: any, canBeEdited: any) {
    if (!this.ctx) return;

    const canvasEl = this.canvas.nativeElement;
    const cellSizeX = canvasEl.width / this.gridWidth; // 600 / 16 = 37.5
    const cellSizeY = canvasEl.height / this.gridHeight; // 600 / 16 = 37.5

    let pixelList: string[] = [];

    for (let row = 0; row < this.gridHeight; row++) {
      for (let col = 0; col < this.gridWidth; col++) {
        const sampleX = Math.floor((col + 0.5) * cellSizeX); // cella közepe X
        const sampleY = Math.floor((row + 0.5) * cellSizeY); // cella közepe Y

        const imageData = this.ctx.getImageData(sampleX, sampleY, 1, 1);
        const pixels = imageData.data;

        const r = pixels[0];
        const g = pixels[1];
        const b = pixels[2];
        const a = pixels[3];

        if (a === 0) {
          pixelList.push("transparent");
        } else {
          pixelList.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
        }
      }
    }

    console.log("Pixel list:", pixelList);
    this.sendToApi(pixelList, name, canBeEdited)
  }



  sendToApi(pixelList: string[], name: any, canBeEdited: any) {
    const apiUrl = 'https://nagypeti.moriczcloud.hu/PixelArtSpotlight/save'; // API URL
    console.log(name, canBeEdited)
    let canEdit = 0

    if (canBeEdited == true) {
      canEdit = 1
    }
    else {
      canEdit = 0
    }

    let headerss = new HttpHeaders();
    headerss.set('X-Requested-With', 'XMLHttpRequest')
    headerss.set('Content-Type', 'application/json')
    let formData: FormData = new FormData();
    formData.append('hex_codes', JSON.stringify(pixelList));
    formData.append('width', String(this.gridWidth));
    formData.append('name', name);
    formData.append('canBeEdited', String(canEdit))


    if (confirm("Are you sure you want to save your drawing?")) {
      this.http.post(apiUrl, formData, { headers: headerss, observe: 'response', withCredentials: true }).subscribe(
        data => {
          console.log(data)

        },
        error => console.log(error)

      )
    }

    this.savingDialog = false
  }

  openSaveDialog() {
    this.savingDialog = true
  }

  onSave(name: any, canBeEdited: any) {
    this.savePixelArt(name, canBeEdited)
  }

  // Add these methods to your NewDrawingComponent class

// Capture the current state before making changes
captureState() {
  // Make a deep copy of the current pixel grid state
  const stateCopy = this.pixelGrid.map(row => [...row]);
  
  // Push to history, limiting history size to prevent memory issues
  this.history.push(stateCopy);
  
  // Clear redo stack when a new action is performed
  this.redoStack = [];
  
  // Limit history size to prevent memory issues (optional)
  if (this.history.length > 20) {
    this.history.shift(); // Remove oldest state
  }
}

// Undo the last action
undo() {
  if (this.history.length === 0) return;
  
  // Save current state to redo stack before undoing
  const currentState = this.pixelGrid.map(row => [...row]);
  this.redoStack.push(currentState);
  
  // Restore previous state
  const previousState = this.history.pop();
  if (previousState) {
    this.pixelGrid = previousState;
    
    // Mark all cells as dirty to ensure complete redraw
    this.dirtyGrid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill(true)
    );
    
    // Redraw the canvas
    this.drawGrid();
  }
}

// Redo the last undone action
redo() {
  if (this.redoStack.length === 0) return;
  
  // Save current state to history before redoing
  const currentState = this.pixelGrid.map(row => [...row]);
  this.history.push(currentState);
  
  // Restore the next state
  const nextState = this.redoStack.pop();
  if (nextState) {
    this.pixelGrid = nextState;
    
    // Mark all cells as dirty to ensure complete redraw
    this.dirtyGrid = Array.from({ length: this.gridHeight }, () =>
      Array(this.gridWidth).fill(true)
    );
    
    // Redraw the canvas
    this.drawGrid();
  }
}

// Keyboard event listener for Ctrl+Z (undo) and Ctrl+Y (redo)
@HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  // Undo with Ctrl+Z
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    this.undo();
  }
  
  // Redo with Ctrl+Y or Ctrl+Shift+Z
  if ((event.ctrlKey && event.key === 'y') || 
      (event.ctrlKey && event.shiftKey && event.key === 'z')) {
    event.preventDefault();
    this.redo();
  }
}

}
