import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-new-pass',
  imports: [],
  templateUrl: './new-pass.component.html',
  styleUrl: './new-pass.component.css'
})
export class NewPassComponent {
  token: string | null = null;

  constructor(private route: ActivatedRoute, private dataservice: DataserviceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params['token'] || params['token'].length != 16) {
        this.dataservice.move_to('/')
      }
      this.token = params['token'];
      console.log('Token:', this.token);
    });
  }
}
