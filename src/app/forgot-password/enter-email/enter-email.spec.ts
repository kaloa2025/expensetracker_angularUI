import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterEmail } from './enter-email';

describe('EnterEmail', () => {
  let component: EnterEmail;
  let fixture: ComponentFixture<EnterEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
