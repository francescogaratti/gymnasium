import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-upload-photo',
	templateUrl: './upload-photo.component.html',
	styleUrls: ['./upload-photo.component.sass'],
})
export class UploadPhotoComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() title: string = 'Carica Foto';
	@Input() src: string = null;
	@Input() disabled: boolean = false;

	@Output() onNewFile: EventEmitter<File> = new EventEmitter<File>();

	@ViewChild('photo') photo: ElementRef;
	input: HTMLInputElement = null;

	constructor() {}

	ngOnInit(): void {
		this.createInput();
	}

	ngAfterViewInit(): void {
		if (this.src) this.photo.nativeElement.src = this.src;
	}

	ngOnChanges(changes: SimpleChanges) {
		// changes.prop contains the old and the new value...
		if (changes && changes.src && this.photo && this.photo.nativeElement)
			this.photo.nativeElement.src = this.src;
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
		this.onNewFile.emit(file);
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
