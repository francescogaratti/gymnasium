import { Injectable } from '@angular/core';
import { Client } from '@models/user';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class BookService {
	constructor(private auth: AuthService) {}

	/**
	 * @param month {number}
	 * @param year {number}
	 * @description returns all the bookings for a given month and year
	 */
	async getBookings(month: number, year: number): Promise<any> {}

	/**
	 *
	 * @param date {Date} the date where to insert booking
	 * @param client {Client} who want to book
	 * @description inserts a new booking into the system
	 * If the date is passed returns an error
	 */
	insertNewBooking(day: Date, client: Client) {}

	/**
	 *
	 * @param date {Date} the date of the book to cancel
	 * @param client {Client} the owner of that booking
	 * @description cancel the booking for the client e frees a slot for others to book
	 * If the date is passed returns an error
	 */
	cancelBooking(date: Date, client: Client) {}
}
