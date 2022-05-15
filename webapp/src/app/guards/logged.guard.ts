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

@Injectable({
	providedIn: 'root',
})
export class LoggedGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth
			.isLogged()
			.then(isLogged => !isLogged)
			.catch(err => {
				console.error(err);
				return false;
			});
	}
}
