import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  constructor(private _router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    if (localStorage.getItem('logged') == "true") {
      this._router.navigateByUrl('/logged-main')
    }
  }
}
