import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// require dependencies
import PDFDocument from './pdfkit.standalone.js';
import blobStream from './blob-stream';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
	title: string = 'Gymnasium';
	constructor(public router: Router) {}

	async ngOnInit() {}

	createPDF() {
		console.info('createPDF');

		// create a document the same way as above
		const doc = new PDFDocument();

		// Embed a font, set the font size, and render some text
		// doc.font('fonts/PalatinoBold.ttf')
		// 	.fontSize(25)
		// 	.text('Some text with an embedded font!', 100, 100);

		// Add an image, constrain it to a given size, and center it vertically and horizontally
		// doc.image('path/to/image.png', {
		// 	fit: [250, 300],
		// 	align: 'center',
		// 	valign: 'center',
		// });
		doc.text('TESTTTTT');

		// Add another page
		doc.addPage().fontSize(25).text('Here is some vector graphics...', 100, 100);

		// Draw a triangle
		doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill('#FF3300');

		// Apply some transforms and render an SVG path with the 'even-odd' fill rule
		doc.scale(0.6)
			.translate(470, -380)
			.path('M 250,75 L 323,301 131,161 369,161 177,301 z')
			.fill('red', 'even-odd')
			.restore();

		// Add some text with annotations
		doc.addPage()
			.fillColor('blue')
			.text('Here is a link!', 100, 100)
			.underline(100, 100, 160, 27, { color: '#0000FF' })
			.link(100, 100, 160, 27, 'http://google.com/');

		// pipe the document to a blob
		const stream = doc.pipe(blobStream());

		// add your content to the document here, as usual

		// get a blob when you're done
		doc.end();
		stream.on('finish', () => {
			// or get a blob URL for display in the browser
			const url = stream.toBlobURL('application/pdf');
			console.info(url);
			this.downloadURI(url, 'test.pdf');
		});
	}

	downloadURI(uri, name) {
		var link = document.createElement('a');
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}
