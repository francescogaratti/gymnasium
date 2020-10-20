import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { AdminComponent } from '@pages/admin/admin.component';
import { ClientComponent } from '@pages/client/client.component';
import { ClientsComponent } from '@pages/clients/clients.component';
import { CreateWorkoutRoutineComponent } from '@pages/create-workout-routine/create-workout-routine.component';
import { ExercisesComponent } from '@pages/exercises/exercises.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { NewClientComponent } from '@pages/new-client/new-client.component';
import { NewWorkoutComponent } from '@pages/new-workout/new-workout.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { PersonalAreaComponent } from '@pages/personal-area/personal-area.component';
import { WorkoutComponent } from '@pages/workout/workout.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	{ path: 'new-workout', component: NewWorkoutComponent, canActivate: [AuthGuard] },
	{ path: 'workout', component: WorkoutComponent, canActivate: [AuthGuard] },
	{ path: 'home', component: HomeComponent },
	{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
	{ path: 'personal-area', component: PersonalAreaComponent, canActivate: [AuthGuard] },
	{ path: 'new-client', component: NewClientComponent, canActivate: [AuthGuard] },
	{ path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
	{ path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
	{ path: 'exercises', component: ExercisesComponent, canActivate: [AuthGuard] },
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
