import { Item } from '../item';

/**
 * @interface Menu
 * @description every menù should contains a list of list of items that the client can order
 * In addition it should store the last update and the extra cost
 */
export interface Menu {
	lists: MenuList[];
	lastUpdate: Date;
	extraCosts: number;
}

export interface MenuList {
	name: string;
	items: Item[];
}
