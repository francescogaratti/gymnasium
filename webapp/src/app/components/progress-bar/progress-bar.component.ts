import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
	selector: 'app-progress-bar',
	templateUrl: './progress-bar.component.html',
	styleUrls: ['./progress-bar.component.sass'],
})
@Injectable({
	providedIn: 'root',
})
export class ProgressBarComponent implements OnInit {
	visible: boolean = true;
	constructor(private auth: AuthService) {
		this.auth.asyncOperation.subscribe((value: boolean) => (this.visible = value));
	}
	ngOnInit(): void {}
}
