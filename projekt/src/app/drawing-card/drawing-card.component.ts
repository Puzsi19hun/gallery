import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawing-card',
  templateUrl: './drawing-card.component.html',
  styleUrl: './drawing-card.component.css',
  imports: [CommonModule],
})
export class DrawingCardComponent implements AfterViewInit {
  data: any[] = [];
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) user_id = '';
  @Input({ required: true }) image_id = '';
  @Input({ required: true }) width = '';
  @Input({ required: true }) name = '';
  @Input({ required: true }) user_name = '';
  @Input({ required: true }) hexCodes: string[] = [];
  @Input({ required: true }) profil = false;
  @Input({ required: true }) canBeEdited = 0;
  @Input({ required: true }) forked = 0;
  @Input({ required: true }) forkedFrom = '';
  @Input({ required: true }) hashtags: any[] = [];
  @Output() expandCard = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Input({ required: true }) likes = 0
  @Input({ required: true }) user_vote = 0
  hashtagNames: any[] = [];

  private readonly CANVAS_SIZE = 180; // Fix méretű előnézet (200x200 px)

  constructor(
    private http: HttpClient,
    private dataservice: DataserviceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log(this.user_id)
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    });
    console.log(this.user_vote)
  }

  readLocalStorageValue(key: any) {
    return localStorage.getItem(key);
  }

  ngAfterViewInit(): void {
    this.drawCanvas();
  }


  upVote(likeElement: HTMLElement, dislikeElement: HTMLElement) {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    });
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/rate"
    let formData: FormData = new FormData();
    formData.append('kep_id', this.image_id);
    formData.append('user_id', String(localStorage.getItem('id')));
    formData.append('action', "like");

    this.http.post(url, formData, { headers: headers, withCredentials: true }).subscribe(
      (res: any) => {
        if (res.message == "Sikeresen visszavontad az értékelést.") {
          this.dataservice.SuccessPopup(res.message)
          this.refreshLikes()
          dislikeElement.classList.remove('active-down');
          likeElement.classList.remove('active-up');
        }
        else {
          this.dataservice.SuccessPopup(res.message)
          this.refreshLikes()
          likeElement.classList.add('active-up');
          dislikeElement.classList.remove('active-down');
        }
      },
      (error) => {
        this.dataservice.errorPopup(error.message)
      }
    )
  }

  downVote(likeElement: HTMLElement, dislikeElement: HTMLElement) {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    });
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/rate"
    let formData: FormData = new FormData();
    formData.append('kep_id', this.image_id);
    formData.append('user_id', String(localStorage.getItem('id')));
    formData.append('action', "dislike");
    this.http.post(url, formData, { headers: headers, withCredentials: true }).subscribe(
      (res: any) => {
        if (res.message == "Sikeresen visszavontad az értékelést.") {
          this.dataservice.SuccessPopup(res.message)
          this.refreshLikes()
          dislikeElement.classList.remove('active-down');
          likeElement.classList.remove('active-up');
        }
        else {
          this.dataservice.SuccessPopup(res.message)
          this.refreshLikes()
          dislikeElement.classList.add('active-down');
          likeElement.classList.remove('active-up');
        }
      },
      (error) => {
        this.dataservice.errorPopup(error.message)
      }
    )
  }

  refreshLikes() {
    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
    });
    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/likeok/" + this.image_id

    this.http.get(url, { headers: headers, withCredentials: true }).subscribe(
      (res: any) => {
        this.likes = res.count
      }
    )
  }

  onClick() {
    this.expandCard.emit({
      name: this.name,
      hex_codes: this.hexCodes,
      width: this.width,
      forkedFrom: this.forkedFrom,
    });
  }

  onDelete() {
    let conf = confirm('Are you sure you want to delete this drawing?');
    if (conf) {
      const headers = new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
      });

      const url = 'https://nagypeti.moriczcloud.hu/PixelArtSpotlight/delete';
      let formData: FormData = new FormData();
      formData.append('kepid', this.image_id);
      this.http
        .post(url, formData, { headers: headers, withCredentials: true })
        .subscribe(
          (data: any) => {
            window.location.reload();
            this.dataservice.SuccessPopup('Sikeres törlés!');
          },
          (error: any) => {
            this.dataservice.errorPopup('Sikertelen törlés, hiba: ' + error);
          }
        );
    }
  }

  onEdit() {
    let conf = confirm('are you sure you want to edit this drawing?');
    if (conf) {
      this.dataservice.setData({
        hex_codes: this.hexCodes,
        width: this.width,
        forked_from: this.user_name,
      });
      this.cdr.detectChanges();
      this.dataservice.move_to('/new-drawing');
    }
  }

  checkComments() {
    this.router.navigate(['/comments', this.image_id]);
  }

  checkProfile() {
    this.router.navigate(['/checkProfile', this.user_id]);
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

  moveToProfil() {
    this.dataservice.move_to('/profil');
  }
}
