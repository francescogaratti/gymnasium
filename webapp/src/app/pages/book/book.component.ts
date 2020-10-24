import { Component, OnInit } from '@angular/core';
import { BookService } from '@services/book.service';

@Component({
	selector: 'app-book',
	templateUrl: './book.component.html',
	styleUrls: ['./book.component.sass'],
})
export class BookComponent implements OnInit {
	constructor(private book: BookService) {}

	ngOnInit(): void {}
}
