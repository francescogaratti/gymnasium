import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { UserTypes } from '@models/user';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.user$.pipe(
			take(1),
			map(() => this.auth.grantAccess(UserTypes.admin)),
			tap(isAdmin => {
				if (!isAdmin) {
					console.log('access denied - not logged as admin');
					this.router.navigate(['/home']);
				}
			})
		);
	}
}
