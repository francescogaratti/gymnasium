import { Ingredient } from '../ingredient';
import { Allergenie } from '../allergenie';
/**
 * @interface Item
 * @description an item is the atomic thing that the client can order
 * every item as an unique id, a name, a cost, a list of ingredients and a list of allergenies
 */
export interface Item {
	id: string;
	displayName: string;
	cost: number;
	ingredients: Ingredient[];
	allergenies: Allergenie[];
}
