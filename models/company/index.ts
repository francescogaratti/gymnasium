/**
 * @interface Company
 * @description every company should have an unique id and a common name
 */
export interface Company {
	id: string;
	displayName: string;
	avgRating: number;
}
