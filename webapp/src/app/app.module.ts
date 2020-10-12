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
import { MatNativeDateModule } from '@angular/material/core';
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

import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonalAreaComponent } from './pages/personal-area/personal-area.component';
import { BookComponent } from '@pages/book/book.component';
import { MenuComponent } from '@components/menu/menu.component';
import {ProgressBarComponent} from "@components/progress-bar/progress-bar.component";
import { OrderComponent } from './pages/order/order.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { CreateWorkoutRoutineComponent } from './pages/create-workout-routine/create-workout-routine.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ClientComponent } from './pages/client/client.component';
import { ClientsComponent } from './pages/clients/clients.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NotFoundComponent,
		PersonalAreaComponent,
		BookComponent,
		MenuComponent,
		ProgressBarComponent,
		OrderComponent,
		OverviewComponent,
		CreateWorkoutRoutineComponent,
		AdminComponent,
		ClientComponent,
		ClientsComponent,
	],
	imports: [
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
	],
	providers: [
		MatDatepickerModule,
		MatInputModule,
		FormsModule,
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
