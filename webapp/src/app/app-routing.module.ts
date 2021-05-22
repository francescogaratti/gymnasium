import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { ExercisesComponent } from '@pages/exercises/exercises.component';
import { CustomExercisesComponent } from '@pages/custom-exercises/custom-exercises.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { NewWorkoutComponent } from '@pages/new-workout/new-workout.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { PersonalAreaComponent } from '@pages/personal-area/personal-area.component';
import { TrainComponent } from '@pages/train/train.component';
import { WeightTrackerComponent } from '@pages/weight-tracker/weight-tracker.component';
import { WorkoutsComponent } from '@pages/workouts/workouts.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuard],
	},
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	{
		path: 'new-workout',
		component: NewWorkoutComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'exercises',
		component: ExercisesComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'custom-exercises',
		component: CustomExercisesComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'workouts',
		component: WorkoutsComponent,
		canActivate: [AuthGuard],
	},
	{ path: 'personal-area', component: PersonalAreaComponent, canActivate: [AuthGuard] },
	{
		path: 'train',
		component: TrainComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'weight-tracker',
		component: WeightTrackerComponent,
		canActivate: [AuthGuard],
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: '**',
		component: NotFoundComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
