import * as _ from 'lodash';

import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class FilterService {
	public async search(searchInfo, context){
		return new Promise((res, rej)=>{
			if(context){
				res(context);
			}
			else{
				res(null);
			}
		});
	}
}