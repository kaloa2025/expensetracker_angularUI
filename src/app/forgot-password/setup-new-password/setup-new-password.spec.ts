import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupNewPassword } from './setup-new-password';

describe('SetupNewPassword', () => {
  let component: SetupNewPassword;
  let fixture: ComponentFixture<SetupNewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupNewPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupNewPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
