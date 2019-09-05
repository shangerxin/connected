import * as _ from "lodash";

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { BrowserService } from "./browserService";
import { GlobalConst } from "../environments/globalConstTypes";

@Injectable({
    providedIn: "root"
})
export class FilterService {
    filterSubject: Subject<any>;
    filterObservable: Observable<any>;
    filterResult: any;
    constructor(private browserService: BrowserService) {
        this.filterSubject = new Subject<any>();
        this.filterObservable = this.filterSubject.asObservable();
    }
    public async search(filter:string) {
		this.reset();
        return this.browserService.getAllTabs().then(tabs => {
            if (tabs && filter) {
                this.filterResult = [];
                filter = filter.toLowerCase();
                _.forEach(tabs, tab => {
                    let url = tab.url && tab.url.toLowerCase();
                    let title = tab.title && tab.title.toLowerCase();
                    if (
                        url.indexOf(filter) !== GlobalConst.notFound ||
                        title.indexOf(filter) !== GlobalConst.notFound
                    ) {
                        this.filterResult.push(tab);
                    }
                });
				this.filterSubject.next(this.filterResult);
				if(this.browserService.targetTabs){
					_.forEach(this.filterResult, tab=>{
						_.remove(this.browserService.targetTabs, tt=>tt.id===tab.id);
					});
				}
                return this.filterResult;
            }
        });
	}

	public reset(){
		this.filterSubject.next(null);
	}
}
