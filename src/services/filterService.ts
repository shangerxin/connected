import { Injectable } from "@angular/core";

import * as _ from "lodash";
import { Subject, Observable } from "rxjs";

import { BrowserService } from "./browserService";
import { GlobalConst } from "../environments/globalConstTypes";

@Injectable({
    providedIn: "root"
})
export class FilterService {
    lowerFilterSubject: Subject<any>;
    lowerFilterObservable: Observable<any>;
    filterTabsResult: any;
    constructor(private browserService: BrowserService) {
        this.lowerFilterSubject = new Subject<any>();
        this.lowerFilterObservable = this.lowerFilterSubject.asObservable();
    }
    public async search(filter:string) {
		this.reset();
        return this.browserService.getAllTabs().then(tabs => {
            if (tabs && filter) {
                this.filterTabsResult = [];
                filter = filter.toLowerCase();
                _.forEach(<any>tabs, tab => {
                    let url = tab.url && tab.url.toLowerCase();
                    let title = tab.title && tab.title.toLowerCase();
                    if (
                        url.indexOf(filter) !== GlobalConst.notFound ||
                        title.indexOf(filter) !== GlobalConst.notFound
                    ) {
                        this.filterTabsResult.push(tab);
                    }
                });
				if(this.browserService.targetTabs){
                    _.forEach(this.filterTabsResult, tab=>{
                        _.remove(this.browserService.targetTabs, tt=>tt.id===tab.id);
					});
				}
                this.lowerFilterSubject.next(filter);
                return this.filterTabsResult;
            }
        });
	}

	public reset(){
		this.lowerFilterSubject.next(null);
	}
}
