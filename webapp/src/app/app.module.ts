import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './pages/login/login.component';

const firebaseConfig = {
	apiKey: 'AIzaSyAX-eB7XUbfgRKxpq3y4nFnSkF2-iBv2Wk',
	authDomain: 'ultra-gymnasium.firebaseapp.com',
	databaseURL: 'https://ultra-gymnasium.firebaseio.com',
	projectId: 'ultra-gymnasium',
	storageBucket: 'ultra-gymnasium.appspot.com',
	messagingSenderId: '13160087679',
	appId: '1:13160087679:web:636c78361cf50f78773f4a',
	measurementId: 'G-N3YW5GFN8D',
};

/** @angular/material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
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

import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonalAreaComponent } from './pages/personal-area/personal-area.component';
import { MenuComponent } from '@components/menu/menu.component';
import { ProgressBarComponent } from '@components/progress-bar/progress-bar.component';
import { CreateWorkoutRoutineComponent } from './pages/create-workout-routine/create-workout-routine.component';
import { ClientComponent } from './pages/client/client.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { NewWorkoutComponent } from './pages/new-workout/new-workout.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { WorkoutComponent } from '@components/workout/workout.component';
import { HttpClientModule } from '@angular/common/http';
import { NewClientComponent } from './pages/new-client/new-client.component';
import { NewTrainerComponent } from './pages/new-trainer/new-trainer.component';
import { NewExerciseComponent } from './pages/new-exercise/new-exercise.component';
import { BookComponent } from './pages/book/book.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MobileSidenavComponent } from './components/mobile-sidenav/mobile-sidenav.component';
import { InfoComponent } from './components/info/info.component';
import { UploadPhotoComponent } from './components/upload-photo/upload-photo.component';
import { WorkoutsComponent } from './components/workouts/workouts.component';
import { DiaryComponent } from './pages/diary/diary.component';
import { ClientDataComponent } from './pages/diary/client-data/client-data.component';
import { FitCheckComponent } from './pages/diary/fit-check/fit-check.component';
import { TrainingCheckComponent } from './pages/diary/training-check/training-check.component';
import { UserSelectComponent } from './components/user-select/user-select.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NotFoundComponent,
		PersonalAreaComponent,
		MenuComponent,
		ProgressBarComponent,
		CreateWorkoutRoutineComponent,
		ClientComponent,
		ClientsComponent,
		NewWorkoutComponent,
		ExercisesComponent,
		WorkoutComponent,
		NewClientComponent,
		NewTrainerComponent,
		NewExerciseComponent,
		BookComponent,
		AdminComponent,
		MobileSidenavComponent,
		InfoComponent,
		UploadPhotoComponent,
		WorkoutsComponent,
		DiaryComponent,
		ClientDataComponent,
		FitCheckComponent,
		TrainingCheckComponent,
		UserSelectComponent,
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
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
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
