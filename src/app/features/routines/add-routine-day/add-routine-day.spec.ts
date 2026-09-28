import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRoutineDay } from './add-routine-day';

describe('AddRoutineDay', () => {
  let component: AddRoutineDay;
  let fixture: ComponentFixture<AddRoutineDay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoutineDay],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRoutineDay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
