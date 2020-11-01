import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
	Router,
} from '@angular/router';
import { ClientService } from '@services/client.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ClientGuard implements CanActivate {
	constructor(private clientService: ClientService, private router: Router) {}
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.clientService.client$.pipe(
			take(1),
			map(client => !!client),
			tap(isClient => {
				if (!isClient) {
					console.log('access denied - not logged as client');
					this.router.navigate(['/home']);
				}
			})
		);
	}
}
