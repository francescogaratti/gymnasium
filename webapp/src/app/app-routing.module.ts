import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { LoggedGuard } from '@guards/logged.guard';
import { RoleGuard } from '@guards/role.guard';
import { UserTypes } from '@models/user';
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
import { TrainComponent } from '@pages/train/train.component';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [],
		},
	},
	{ path: 'login', component: LoginComponent, canActivate: [LoggedGuard] },
	{
		path: 'book',
		component: BookComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.client, UserTypes.trainer, UserTypes.admin],
		},
	},
	{
		path: 'client',
		component: ClientComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.client, UserTypes.trainer, UserTypes.admin],
		},
	},
	{
		path: 'new-workout',
		component: NewWorkoutComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.trainer, UserTypes.admin],
		},
	},
	{
		path: 'new-client',
		component: NewClientComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.receptionist, UserTypes.admin],
		},
	},
	{
		path: 'new-trainer',
		component: NewTrainerComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.manager, UserTypes.admin],
		},
	},
	{
		path: 'new-exercise',
		component: NewExerciseComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.trainer, UserTypes.admin],
		},
	},
	{
		path: 'diario',
		component: DiaryComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.trainer, UserTypes.admin],
		},
	},
	{ path: 'area-personale', component: PersonalAreaComponent, canActivate: [AuthGuard] },
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [UserTypes.admin],
		},
	},
	{
		path: 'train',
		component: TrainComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [],
		},
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: '**',
		component: NotFoundComponent,
		canActivate: [RoleGuard],
		data: {
			roles: [],
		},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
