import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { BookComponent } from '@pages/book/book.component';
import { ClientComponent } from '@pages/client/client.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { NewClientComponent } from '@pages/new-client/new-client.component';
import { NewExerciseComponent } from '@pages/new-exercise/new-exercise.component';
import { NewTrainerComponent } from '@pages/new-trainer/new-trainer.component';
import { NewWorkoutComponent } from '@pages/new-workout/new-workout.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { WorkoutComponent } from '@pages/workout/workout.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	{ path: 'book', component: BookComponent, canActivate: [AuthGuard] },
	{ path: 'workout', component: WorkoutComponent, canActivate: [AuthGuard] },
	{ path: 'client', component: ClientComponent, canActivate: [AuthGuard] },
	{ path: 'new-workout', component: NewWorkoutComponent, canActivate: [AuthGuard] },
	{ path: 'new-client', component: NewClientComponent, canActivate: [AuthGuard] },
	{ path: 'new-trainer', component: NewTrainerComponent, canActivate: [AuthGuard] },
	{ path: 'new-exercise', component: NewExerciseComponent, canActivate: [AuthGuard] },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
