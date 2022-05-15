import { Injectable, NgModuleFactoryLoader } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
	constructor(private _snackBar: MatSnackBar) {}
	openSnackBar(message: string, action: string, duration?: number) {
		this._snackBar.open(message, action, {
			duration: duration ? duration : 2000,
		});
	}
}
