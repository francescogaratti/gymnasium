import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrainerComponent } from './new-trainer.component';

describe('NewTrainerComponent', () => {
  let component: NewTrainerComponent;
  let fixture: ComponentFixture<NewTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
