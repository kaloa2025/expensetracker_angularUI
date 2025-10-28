import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerification } from './otp-verification';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
