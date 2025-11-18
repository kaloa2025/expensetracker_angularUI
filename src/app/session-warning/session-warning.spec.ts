import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWarning } from './session-warning';

describe('SessionWarning', () => {
  let component: SessionWarning;
  let fixture: ComponentFixture<SessionWarning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionWarning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionWarning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
