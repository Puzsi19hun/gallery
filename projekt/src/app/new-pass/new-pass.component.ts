import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-pass',
  imports: [],
  templateUrl: './new-pass.component.html',
  styleUrl: './new-pass.component.css'
})
export class NewPassComponent {
  token: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token:', this.token);
    });
  }
}
