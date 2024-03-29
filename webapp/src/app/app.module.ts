import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

/** @angular/material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonalAreaComponent } from './pages/personal-area/personal-area.component';
import { MenuComponent } from '@components/menu/menu.component';
import { ProgressBarComponent } from '@components/progress-bar/progress-bar.component';
import { NewWorkoutComponent } from './pages/new-workout/new-workout.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { WorkoutComponent } from '@components/workout/workout.component';
import { HttpClientModule } from '@angular/common/http';
import { MobileSidenavComponent } from './components/mobile-sidenav/mobile-sidenav.component';
import { InfoComponent } from './components/info/info.component';
import { UploadPhotoComponent } from './components/upload-photo/upload-photo.component';
import { WorkoutsComponent } from './pages/workouts/workouts.component';
import { UserSelectComponent } from './components/user-select/user-select.component';
import { DialogInfoComponent } from './components/dialog-info/dialog-info.component';
import { TrainComponent } from './pages/train/train.component';
import { LiveWorkoutComponent } from './components/live-workout/live-workout.component';
import { SessionStatsComponent } from './components/session-stats/session-stats.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { WeightTrackerComponent } from './pages/weight-tracker/weight-tracker.component';
import { ExtraWorkoutComponent } from './pages/extra-workout/extra-workout.component';
import { HistoryComponent } from './components/history/history.component';

import { initializeApp } from 'firebase/app';
import { ServiceWorkerModule } from '@angular/service-worker';

initializeApp(environment.firebaseConfig);

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NotFoundComponent,
		PersonalAreaComponent,
		MenuComponent,
		ProgressBarComponent,
		NewWorkoutComponent,
		ExercisesComponent,
		WorkoutComponent,
		MobileSidenavComponent,
		InfoComponent,
		UploadPhotoComponent,
		WorkoutsComponent,
		UserSelectComponent,
		DialogInfoComponent,
		TrainComponent,
		LiveWorkoutComponent,
		SessionStatsComponent,
		ExerciseComponent,
		WeightTrackerComponent,
		ExtraWorkoutComponent,
		HistoryComponent,
	],
	imports: [
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatFormFieldModule,
		FormsModule,
		MatInputModule,
		MatNativeDateModule,
		MatDatepickerModule,
		MatStepperModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatProgressBarModule,
		MatRadioModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatChipsModule,
		MatDialogModule,
		MatBadgeModule,
		MatDividerModule,
		MatGridListModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatAutocompleteModule,
		MatExpansionModule,
		MatSidenavModule,
		MatSlideToggleModule,
		MatTabsModule,
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
	],
	providers: [
		MatDatepickerModule,
		MatInputModule,
		FormsModule,
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
		{ provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
