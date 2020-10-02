import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkoutRoutineComponent } from './create-workout-routine.component';

describe('CreateWorkoutRoutineComponent', () => {
  let component: CreateWorkoutRoutineComponent;
  let fixture: ComponentFixture<CreateWorkoutRoutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkoutRoutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkoutRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
