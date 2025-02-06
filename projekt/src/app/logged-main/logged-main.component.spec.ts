import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedMainComponent } from './logged-main.component';

describe('LoggedMainComponent', () => {
  let component: LoggedMainComponent;
  let fixture: ComponentFixture<LoggedMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
