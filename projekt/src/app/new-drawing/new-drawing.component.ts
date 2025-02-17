import { Component } from '@angular/core';

@Component({
  selector: 'app-new-drawing',
  imports: [],
  templateUrl: './new-drawing.component.html',
  styleUrl: './new-drawing.component.css'
})
export class NewDrawingComponent {
  showDialog = false

  openDialog()
  {
    this.showDialog = true
  }
}
