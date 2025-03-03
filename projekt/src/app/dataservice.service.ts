import { HttpClient } from '@angular/common/http';
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

  private get_logged_in_state(): boolean {
    return !!localStorage.getItem('logged');  // Or check cookies if you're storing it there
  }

  login() {
    localStorage.setItem('logged', "true")
    this.isAuthenticatedSubject.next(true);
    this.navbar = "logged"
  }

  logout() {
    localStorage.removeItem('logged');
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
