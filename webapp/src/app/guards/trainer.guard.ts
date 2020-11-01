import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { TrainerService } from '@services/trainer.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TrainerGuard implements CanActivate {
	constructor(private trainerService: TrainerService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.trainerService.trainer$.pipe(
			take(1),
			map(trainer => !!trainer),
			tap(isTrainer => {
				if (!isTrainer) {
					console.log('access denied - not logged as trainer');
					this.router.navigate(['/home']);
				}
			})
		);
	}
}
