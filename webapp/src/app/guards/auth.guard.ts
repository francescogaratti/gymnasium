import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { tap, map, take } from 'rxjs/operators';
import { UserTypes } from '@models/user';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.grantAccessNew().then(loggedIn => {
			if (!loggedIn) {
				console.log('access denied');
				this.router.navigate(['/login']);
			}
			return loggedIn;
		});
	}
}
