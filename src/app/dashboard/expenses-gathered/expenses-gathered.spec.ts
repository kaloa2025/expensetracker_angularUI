import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesGathered } from './expenses-gathered';

describe('ExpensesGathered', () => {
  let component: ExpensesGathered;
  let fixture: ComponentFixture<ExpensesGathered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesGathered]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpensesGathered);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
