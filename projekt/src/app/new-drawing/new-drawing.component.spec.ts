import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrawingComponent } from './new-drawing.component';

describe('NewDrawingComponent', () => {
  let component: NewDrawingComponent;
  let fixture: ComponentFixture<NewDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDrawingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
