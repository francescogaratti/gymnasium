import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { AdminComponent } from '@pages/admin/admin.component';
import { ClientComponent } from '@pages/client/client.component';
import { CreateWorkoutRoutineComponent } from '@pages/create-workout-routine/create-workout-routine.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { PersonalAreaComponent } from '@pages/personal-area/personal-area.component';

// export function bookMatch(url: UrlSegment[]) {
// 	return url.length > 0 && url[0].path.match('book') ? { consumed: url } : null;
// }

const routes: Routes = [
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	// { matcher: bookMatch, component: BookComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'admin', component: AdminComponent },
	{ path: 'personal-area', component: PersonalAreaComponent, canActivate: [AuthGuard] },
	{ path: 'client', component: ClientComponent },
	{
		path: 'create-workout-routine',
		component: CreateWorkoutRoutineComponent,
		canActivate: [AuthGuard],
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
