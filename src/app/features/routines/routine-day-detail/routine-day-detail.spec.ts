import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutineDayDetail } from './routine-day-detail';

describe('RoutineDayDetail', () => {
  let component: RoutineDayDetail;
  let fixture: ComponentFixture<RoutineDayDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutineDayDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutineDayDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
