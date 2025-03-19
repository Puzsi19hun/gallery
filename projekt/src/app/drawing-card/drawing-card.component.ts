import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

@Component({
    selector: 'app-drawing-card',
    templateUrl: './drawing-card.component.html',
    styleUrl: './drawing-card.component.css'
})
export class DrawingCardComponent implements AfterViewInit {
    data: any[] = [];
    @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    @Input({ required: true }) user_id = "";
    @Input({ required: true }) image_id = "";
    @Input({ required: true }) width = "";
    @Input({ required: true }) name = "";
    @Input({ required: true }) user_name = "";
    @Input({ required: true }) hexCodes: string[] = [];
    @Output() expandCard = new EventEmitter<any>()
    private readonly CANVAS_SIZE = 200; // Fix méretű előnézet (200x200 px)

    constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        const headers = new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        });

        const url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getHexCodes";


        this.http.get(url, { headers, withCredentials: true }).subscribe(
            (data: any) => {
                this.data = data[0];
            }
        );
    }


    ngAfterViewInit(): void {
        this.drawCanvas();
    }

    onClick() {
        this.expandCard.emit({ name: this.name, hex_codes: this.hexCodes })
    }

    private drawCanvas() {
        if (!this.canvasRef) return;

        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = false; // Kikapcsolt antialiasing

        const gridWidth = parseInt(this.width);
        const gridHeight = Math.ceil(this.hexCodes.length / gridWidth);

        // Canvas beállítása
        canvas.width = this.CANVAS_SIZE;
        canvas.height = this.CANVAS_SIZE;

        // Skálázás kiszámítása
        const pixelSizeX = this.CANVAS_SIZE / gridWidth;
        const pixelSizeY = this.CANVAS_SIZE / gridHeight;
        const pixelSize = Math.min(pixelSizeX, pixelSizeY);


        // Kép középre igazítása
        const offsetX = (this.CANVAS_SIZE - gridWidth * pixelSize) / 2;
        const offsetY = (this.CANVAS_SIZE - gridHeight * pixelSize) / 2;

        for (let i = 0; i < this.hexCodes.length; i++) {
            const x = Math.round((i % gridWidth) * pixelSize + offsetX);
            const y = Math.round(Math.floor(i / gridWidth) * pixelSize + offsetY);

            ctx.fillStyle = this.hexCodes[i];
            ctx.strokeStyle = 'transparent'; // Kikapcsolja a rácsvonalakat
            ctx.fillRect(x, y, Math.ceil(pixelSize), Math.ceil(pixelSize));
        }
    }

}
