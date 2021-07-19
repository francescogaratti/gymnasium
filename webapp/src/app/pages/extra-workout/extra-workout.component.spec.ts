import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraWorkoutComponent } from './extra-workout.component';

describe('ExtraWorkoutComponent', () => {
  let component: ExtraWorkoutComponent;
  let fixture: ComponentFixture<ExtraWorkoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraWorkoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
