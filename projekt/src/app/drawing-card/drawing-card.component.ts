import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
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
    @Input({ required: true }) hexCodes: string[] = [];
    userName = "";
    private readonly CANVAS_SIZE = 200; // Fix méretű előnézet (200x200 px)

    constructor(private http: HttpClient, private dataservice: DataserviceService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        const headers = new HttpHeaders({
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
        });

        let user_url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/getUser/" + this.user_id
        this.http.get(user_url, { headers, withCredentials: true }).subscribe(
            (data: any) => {
                this.userName = data.data.name
            }
        );

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
        const pixelSize = Math.floor(Math.min(this.CANVAS_SIZE / gridWidth, this.CANVAS_SIZE / gridHeight));

        // Kép középre igazítása
        const offsetX = Math.floor((this.CANVAS_SIZE - gridWidth * pixelSize) / 2);
        const offsetY = Math.floor((this.CANVAS_SIZE - gridHeight * pixelSize) / 2);

        for (let i = 0; i < this.hexCodes.length; i++) {
            const x = (i % gridWidth) * pixelSize + offsetX;
            const y = Math.floor(i / gridWidth) * pixelSize + offsetY;

            ctx.fillStyle = this.hexCodes[i];
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }

}
