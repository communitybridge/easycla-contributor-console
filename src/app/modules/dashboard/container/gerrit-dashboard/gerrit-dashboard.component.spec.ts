import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerritDashboardComponent } from './gerrit-dashboard.component';

describe('GerritDashboardComponent', () => {
  let component: GerritDashboardComponent;
  let fixture: ComponentFixture<GerritDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerritDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerritDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
