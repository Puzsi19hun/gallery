import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DataserviceService } from '../dataservice.service';
import { CommonModule, NgClass } from '@angular/common';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-new-drawing',
  imports: [ColorPickerModule, FormsModule, NgClass, CommonModule],
  templateUrl: './new-drawing.component.html',
  styleUrls: ['./new-drawing.component.css']
})
export class NewDrawingComponent implements OnDestroy {
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
  gridWidth: number = 16;
  gridHeight: number = 16;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hashtags') hashtags!: ElementRef<HTMLInputElement>;
  private canvasSize: number = 600;
  private hoverX: number | null = null;
  private hoverY: number | null = null;
  private dirtyGrid: boolean[][] = [];
  private forked = false
  searchTimeout: any = null;

  options: any[] = [];
  selected: string | null = null;
  private selectedOptions: any[] = []
  showDropdown: boolean = false;
  private lastQuery = '';
  private cache = new Map<string, any[]>();
  cachedHashtags: { name: string }[] = [];


  constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }

  selectOption(option: any, newtag: any) {
    this.selected = option;
    const currentDiv = document.getElementById("hashtagss");

    // Ellenőrizzük, hogy már létezik-e a DOM-ban
    if (currentDiv) {
      const existingTags = Array.from(currentDiv.children);
      const tagText = (newtag === 1 ? option : option.name).toLowerCase().trim();

      const alreadyExists = existingTags.some(child => {
        const span = child.querySelector("span");
        const childText = span?.textContent?.toLowerCase().trim();
        return childText === tagText;
      });

      if (alreadyExists) {
        console.log("Hashtag már létezik a DOM-ban:", tagText);
        return;
      }
    }

    this.showDropdown = false;
    this.hashtags.nativeElement.value = "";

    // Ha új hashtag (newtag == 1), akkor küldjünk POST kérést
    if (newtag == 1) {
      if (!this.selectedOptions.includes(option)) {
        const url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/hashtags";
        const headers = new HttpHeaders({
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'  // JSON típus, nem FormData
        });

        const body = {
          name: option  // Az adat JSON formátumban
        };

        this.http.post<any>(url, body, { headers: headers, withCredentials: true })
          .pipe(
            tap((res: any) => {
              this.cdr.detectChanges()
              // Ha sikeres válasz érkezik, adjuk hozzá az id-t a selectedOptions-hoz
              this.selectedOptions.push(res.data.id);
              console.log('Sikeresen hozzáadva:', res.data.id);

              // Most jöhet a DOM manipulálása
              this.addTagToDom(option, res.id, newtag);

            })
          )
          .subscribe((response) => {
            console.log('Response:', response);
          }, (error) => {
            console.error('Error:', error); // Hiba kezelés, ha valami probléma történik
          });
      }
    }
    // Ha nem új hashtag, akkor csak a már létező opcióval dolgozunk
    else {
      if (!this.selectedOptions.includes(option.name)) {
        this.selectedOptions.push(option.id);
      }

      // Már létező hashtag hozzáadása a DOM-hoz
      this.addTagToDom(option, option.id, newtag);
    }

    console.log(this.selectedOptions);
  }

  // Segédmetódus a DOM frissítésére
  addTagToDom(option: any, id: any, newtag: any) {
    const currentDiv = document.getElementById("hashtagss");

    const newDiv = document.createElement("div");
    newDiv.style.backgroundColor = '#0073e6';
    newDiv.style.color = "white";
    newDiv.style.padding = '0.5rem';
    newDiv.style.borderRadius = '0.5rem';
    newDiv.style.fontSize = '0.75rem';
    newDiv.style.width = 'fit-content';
    newDiv.style.height = 'fit-content';
    newDiv.style.textAlign = 'center';
    newDiv.style.display = 'flex';
    newDiv.style.alignItems = 'center';
    newDiv.style.justifyContent = 'center';
    newDiv.style.margin = '0';
    newDiv.style.gap = '6px'; // Szöveges rész és az X gomb közötti távolság

    // Hashtag szövege
    const textSpan = document.createElement("span");
    const newContent = document.createTextNode(newtag == 1 ? option : option.name);
    textSpan.appendChild(newContent);
    newDiv.appendChild(textSpan);

    // X gomb hozzáadása
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "X"; // × karakter az X-hez
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.color = "red";
    deleteBtn.style.fontWeight = "bold";
    deleteBtn.style.marginLeft = "3px";
    deleteBtn.style.fontSize = "1.33rem";
    deleteBtn.style.lineHeight = "1";
    deleteBtn.style.display = "inline-flex";
    deleteBtn.style.alignItems = "center";
    deleteBtn.style.justifyContent = "center";

    // X gomb eseménykezelő
    deleteBtn.addEventListener("click", (event) => {
      // Buborékozás megállítása
      event.stopPropagation();

      // Hashtag törlése a DOM-ból
      newDiv.remove();

      // Hashtag törlése a selectedOptions tömbből is
      const index = this.selectedOptions.indexOf(newtag == 1 ? option : option.name);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    });

    newDiv.appendChild(deleteBtn);

    // Hozzáadás a konténerhez
    currentDiv?.appendChild(newDiv);
  }


  saveHashtags() {

  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    // Ha nem az input mezőn vagy a dropdown menün kattintottak, akkor elrejtjük a dropdown-t
    const dropdown = document.querySelector('.dropdown-wrapper');
    const input = document.querySelector('.saveInput') as HTMLElement;

    if (dropdown && input) {
      if (!dropdown.contains(event.target as Node) && !input.contains(event.target as Node)) {
        this.showDropdown = false;
      }
    }
  }



  ngAfterViewInit() {
    if (localStorage.getItem('logged') == null || this.dataservice.get_navbar() == "guest" || localStorage.getItem('token') == null) {
      this.dataservice.logout()
      this.dataservice.move_to("/")
    }
    this.initializeCanvas();
    this.resizeCanvas();
    this.edit()


  }

  trackByFn(index: number, item: any): string {
    return item.name;
  }

  checkHashtag(value: string) {
    const query = value?.trim().toLowerCase();
    if (!query || query.length < 1) {
      this.showDropdown = false;
      return;
    }

    // Ha épp most választottunk opciót, akkor csak akkor nyitunk újra dropdown-t, ha az új adat visszajött

    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    });

    const url = `https://nagypeti.moriczcloud.hu/PixelArtSpotlight/hashtags/search/${encodeURIComponent(query)}`;

    this.http.get<any[]>(url, { headers, withCredentials: true }).subscribe((data: any[]) => {
      const selectedSet = new Set(this.selectedOptions);
      this.options = data
        .filter(item => !selectedSet.has(item.id)) // csak azokat mutatja, amik még nincsenek selectedOptions-ben
        .slice(0, 10);

      // Ha nem vagyunk "várakozós" állapotban, azonnal megmutatjuk
      // Ha igen, akkor csak most engedélyezzük újra a dropdown-t
      this.showDropdown = true;
    });
  }











  ngOnDestroy(): void {
    this.dataservice.setData(null)
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
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

  edit() {
    if (this.dataservice.getData() != null) {
      this.forked = true
      console.log(this.dataservice.getData().forked_from)
      let hex_codes = this.dataservice.getData().hex_codes;
      let width = this.dataservice.getData().width;
      if (!this.canvas) return;

      const canvas = this.canvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false; // Kikapcsolt antialiasing

      const gridWidth = parseInt(width);
      const gridHeight = Math.ceil(hex_codes.length / gridWidth);

      // Canvas beállítása
      this.gridWidth = gridWidth;
      this.gridHeight = gridHeight;
      this.initGrid();  // Új inicializálás, hogy megfelelő méretű legyen a pixelGrid

      canvas.width = this.canvasSize;
      canvas.height = this.canvasSize;

      // Skálázás kiszámítása
      const pixelSizeX = this.canvasSize / gridWidth;
      const pixelSizeY = this.canvasSize / gridHeight;
      const pixelSize = Math.min(pixelSizeX, pixelSizeY);

      // Kép középre igazítása
      const offsetX = (this.canvasSize - gridWidth * pixelSize) / 2;
      const offsetY = (this.canvasSize - gridHeight * pixelSize) / 2;

      for (let i = 0; i < hex_codes.length; i++) {
        const x = Math.floor((i % gridWidth) * pixelSize + offsetX);
        const y = Math.floor(Math.floor(i / gridWidth) * pixelSize + offsetY);

        ctx.fillStyle = hex_codes[i];
        ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));

        // Frissítsük a pixelGrid tömböt is
        const gridX = i % gridWidth;
        const gridY = Math.floor(i / gridWidth);
        this.pixelGrid[gridY][gridX] = hex_codes[i]; // Beállítjuk a színt a pixelGrid-ben
      }

      // Az új állapotot is felrajzoljuk, hogy ne tűnjön el az egér mozgatásakor
      this.drawGrid();
    }
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


  // Modify the clear method to capture state before clearing
  clear() {
    if (!this.ctx) return;

    // Capture state before clearing

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Clean up pixelGrid and dirtyGrid arrays
    this.initGrid();
    this.initDirtyGrid();

    // Update the drawing
    this.drawGrid();
    this.forked = false
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

    this.fillAreaIterative(x, y, targetColor);
    this.drawGrid();
    this.bucketMode = false
    document.querySelector('#bucket')?.classList.remove('bucketActive');

  }


  fillAreaIterative(x: number, y: number, targetColor: string) {
    const stack: [number, number][] = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;

      if (cx < 0 || cx >= this.gridWidth || cy < 0 || cy >= this.gridHeight) continue;
      if (this.pixelGrid[cy][cx] !== targetColor) continue;
      if (this.pixelGrid[cy][cx] === this.color) continue;

      this.pixelGrid[cy][cx] = this.color;
      this.dirtyGrid[cy][cx] = true;

      stack.push([cx - 1, cy]);
      stack.push([cx + 1, cy]);
      stack.push([cx, cy - 1]);
      stack.push([cx, cy + 1]);
    }
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
    this.forked = false
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
      if (this.drawing) {
        this.pixelGrid[this.hoverY][this.hoverX] = this.color;
      } else if (this.erasing) {
        this.pixelGrid[this.hoverY][this.hoverX] = 'white';
      }

      this.dirtyGrid[this.hoverY][this.hoverX] = true;
      this.drawGrid();
    }
  }

  convertToInt(value: any) {
    return parseInt(value)
  }



  @HostListener('mouseleave')
  onMouseLeave() {
    this.hoverX = null;
    this.hoverY = null;
    this.drawGrid();
    console.log('asd')
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  openDialog() {
    this.showDialog = true;
  }


  // Saving




  sendToApi(pixelList: string[], name: any, canBeEdited: any) {
    console.log(this.forked)
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
    formData.append('hashtags', JSON.stringify(this.selectedOptions))
    if (this.forked) {
      formData.append('forked', String(1))
      formData.append('forkedFrom', this.dataservice.getData().forked_from)
    }

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


  forceHeight() {
    let height = document.getElementById('height')!
    if (parseInt((height as HTMLInputElement).value) > 150) {
      (height as HTMLInputElement).value = "150"
    }

    if (parseInt((height as HTMLInputElement).value) < 1) {
      (height as HTMLInputElement).value = "1"
    }
  }

  forceWidth() {
    let width = document.getElementById('width')!
    if (parseInt((width as HTMLInputElement).value) > 150) {
      (width as HTMLInputElement).value = "150"
    }

    if (parseInt((width as HTMLInputElement).value) < 1) {
      (width as HTMLInputElement).value = "1"
    }
  }
  // Add these methods to your NewDrawingComponent class

  // Keyboard event listener for Ctrl+Z (undo) and Ctrl+Y (redo)


}
