import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArchivedRoutineDetail } from './archived-routine-detail';

describe('ArchivedRoutineDetail', () => {
  let component: ArchivedRoutineDetail;
  let fixture: ComponentFixture<ArchivedRoutineDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedRoutineDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedRoutineDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
