import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private _router: Router, private http: HttpClient) { }
  logged_in = false
  
  set_login(value: boolean)
  {
    this.logged_in = value;
  }

  move_to(redirect_to: string)
  {
    this._router.navigateByUrl(redirect_to);
  }

  

}
