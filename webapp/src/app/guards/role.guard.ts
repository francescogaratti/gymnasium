import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { User, UserTypes } from '@models/user';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RoleGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.auth.getFirebaseUser().then(user => {
			const roles: string[] = next.data.roles as string[];
			if (!roles || roles.length == 0) return true;
			let found: boolean = !!roles.find(role => role == user.type);
			if (!found) {
				console.log('access denied - not logged as trainer');
				this.router.navigate(['/home']);
			}
			return found;
		});
	}
}
