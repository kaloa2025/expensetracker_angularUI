import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverview } from './dashboard-overview';

describe('DashboardOverview', () => {
  let component: DashboardOverview;
  let fixture: ComponentFixture<DashboardOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
