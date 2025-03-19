import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDrawingsComponent } from './user-drawings.component';

describe('UserDrawingsComponent', () => {
  let component: UserDrawingsComponent;
  let fixture: ComponentFixture<UserDrawingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDrawingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDrawingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
