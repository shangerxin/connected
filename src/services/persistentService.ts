import * as _ from "lodash";
import * as localforage from "localforage";

import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class PersistentService {
	constructor(){
		this.init();
	}

	async save(key, data){
		return localforage.setItem(key, data);
	}

	async isHas(key){
		return null === await localforage.getItem(key);
	}

	async get(key){
		return localforage.getItem(key);
	}

	async delete(key){
		return localforage.removeItem(key);
	}

	protected init(){
		localforage.config({
			driver:localforage.INDEXEDDB,
			description:'Save data for web extension Connected'
		});
	}
}