import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  constructor(private _router: Router, private http: HttpClient, private dataservice: DataserviceService) { }

  ngOnInit(): void {
    if (localStorage.getItem('logged') && this.dataservice.navbar == "logged") {
      this._router.navigateByUrl('/logged-main')
    }
  }
}
