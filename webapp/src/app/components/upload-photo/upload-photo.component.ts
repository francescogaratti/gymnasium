import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
	selector: 'app-upload-photo',
	templateUrl: './upload-photo.component.html',
	styleUrls: ['./upload-photo.component.sass'],
})
export class UploadPhotoComponent implements OnInit, AfterViewInit {
	@Input() title: string = 'Carica Foto';
	@Input() src: string = null;
	@Input() disabled: boolean = false;

	@ViewChild('photo') photo: ElementRef;
	input: HTMLInputElement = null;

	constructor() {}

	ngOnInit(): void {
		this.createInput();
	}

	ngAfterViewInit(): void {
		if (this.src) this.photo.nativeElement.src = this.src;
	}

	createInput(): void {
		if (this.input) this.input.remove();
		this.input = document.createElement('input');
		this.input.setAttribute('type', 'file');
		this.input.onchange = () => this.getFiles();
	}

	uploadPhoto() {
		if (this.input) this.input.click();
		else console.warn('this.input empty');
	}

	getFiles() {
		const file = this.input.files[0];
		const url = URL.createObjectURL(file);
		this.photo.nativeElement.src = url;
		this.src = url;
	}

	removePhoto() {
		this.src = '';
		this.photo.nativeElement.src = '';
		this.createInput();
	}
}
