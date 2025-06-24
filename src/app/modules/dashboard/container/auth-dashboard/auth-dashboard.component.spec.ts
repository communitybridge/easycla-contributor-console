import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDashboardComponent } from './auth-dashboard.component';

describe('AuthDashboardComponent', () => {
  let component: AuthDashboardComponent;
  let fixture: ComponentFixture<AuthDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
