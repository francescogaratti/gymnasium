import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { AdminService } from '@services/admin.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AdminGuard implements CanActivate {
	constructor(private adminService: AdminService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.adminService.admin$.pipe(
			take(1),
			map(admin => !!admin),
			tap(isAdmin => {
				if (!isAdmin) {
					console.log('access denied - not logged as admin');
					this.router.navigate(['/home']);
				}
			})
		);
	}
}
