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
	apiKey: 'AIzaSyCfIewpp1YDPGodxTimFiLqmI4u5KwfQbc',
	authDomain: 'now-you-book.firebaseapp.com',
	databaseURL: 'https://now-you-book.firebaseio.com',
	projectId: 'now-you-book',
	storageBucket: 'now-you-book.appspot.com',
	messagingSenderId: '861332451705',
	appId: '1:861332451705:web:723d46375c09a91f987fa8',
	measurementId: 'G-8VHNST93GD',
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
