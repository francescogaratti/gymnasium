import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonalAreaComponent } from './pages/personal-area/personal-area.component';
import { BookComponent } from '@pages/book/book.component';
import { MenuComponent } from '@components/menu/menu.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { OrderComponent } from './pages/order/order.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { CreateWorkoutRoutineComponent } from './pages/create-workout-routine/create-workout-routine.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		NotFoundComponent,
		PersonalAreaComponent,
		BookComponent,
		MenuComponent,
		OrderComponent,
		OverviewComponent,
		CreateWorkoutRoutineComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireStorageModule,
		MatToolbarModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
