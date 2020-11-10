import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@guards/admin.guard';
import { AuthGuard } from '@guards/auth.guard';
import { ClientGuard } from '@guards/client.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { ManagerGuard } from '@guards/manager.guard';
import { TrainerGuard } from '@guards/trainer.guard';
import { AdminComponent } from '@pages/admin/admin.component';
import { BookComponent } from '@pages/book/book.component';
import { ClientComponent } from '@pages/client/client.component';
import { DiaryComponent } from '@pages/diary/diary.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { NewClientComponent } from '@pages/new-client/new-client.component';
import { NewExerciseComponent } from '@pages/new-exercise/new-exercise.component';
import { NewTrainerComponent } from '@pages/new-trainer/new-trainer.component';
import { NewWorkoutComponent } from '@pages/new-workout/new-workout.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { PersonalAreaComponent } from '@pages/personal-area/personal-area.component';

const routes: Routes = [
	{ path: 'home', component: HomeComponent },
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	{ path: 'book', component: BookComponent, canActivate: [AuthGuard] },
	{
		path: 'client',
		component: ClientComponent,
		canActivate: [TrainerGuard, ManagerGuard, AdminGuard],
	},
	{
		path: 'new-workout',
		component: NewWorkoutComponent,
		canActivate: [AdminGuard, TrainerGuard],
	},
	{ path: 'new-client', component: NewClientComponent, canActivate: [ManagerGuard, AdminGuard] },
	{
		path: 'new-trainer',
		component: NewTrainerComponent,
		canActivate: [ManagerGuard, AdminGuard],
	},
	{
		path: 'new-exercise',
		component: NewExerciseComponent,
		canActivate: [TrainerGuard, AdminGuard],
	},
	{
		path: 'diario',
		component: DiaryComponent,
		canActivate: [TrainerGuard, AdminGuard],
	},
	{ path: 'area-personale', component: PersonalAreaComponent, canActivate: [AuthGuard] },
	{ path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
