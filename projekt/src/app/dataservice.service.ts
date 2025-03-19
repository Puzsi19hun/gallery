import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private _router: Router, private http: HttpClient, private messageService: MessageService) { }
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.get_logged_in_state());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public navbar = "guest";
  public token = "";
  public id = 0;

  private get_logged_in_state(): boolean {
    return !!localStorage.getItem('logged');  // Or check cookies if you're storing it there
  }

  login() {
    localStorage.setItem('logged', "true")
    this.isAuthenticatedSubject.next(true);
    this.navbar = "logged"

    let url = "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/user";
    let headers = new HttpHeaders();
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Content-Type', 'application/json');

    this.http.get(url, { withCredentials: true }).subscribe(
      (data: any) => {
        localStorage.setItem('id', data.id)
      }
    )
  }

  logout() {
    localStorage.removeItem('logged');
    localStorage.removeItem('id');
    this.isAuthenticatedSubject.next(false);
    this.navbar = "guest"
    this.token = ""
    this.move_to('/guest')
  }

  get_navbar() {
    return this.navbar;
  }

  set_token(token: any) {
    localStorage.setItem('token', token)
  }

  loginPopup() {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "You succesfully logged in",
    });
  }

  logoutPopup() {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "You succesfully logged out",
    });
  }
  errorPopup(text: string) {
    this.messageService.add({
      severity: "error",
      summary: "Error",
      detail: text,
    });
  }

  SuccessPopup(text: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: text,
    });
  }

  registerPopup() {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: "You succesfully registered",
    });
  }

  move_to(redirect_to: string) {
    this._router.navigateByUrl(redirect_to);
  }



}
