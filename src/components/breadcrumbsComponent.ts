import { OnInit, Component } from "@angular/core";
import { Observable } from "rxjs";
import * as _ from "lodash"

import { BrowserService } from "../services/browserService";
import { HistoryService } from "../services/historyService";

@Component({
    selector: "ng-breadcrumbs",
    templateUrl: "./breadcrumbsComponent.html",
    styleUrls: ["./breadcrumbsComponent.css"]
})
export class BreadcrumbsComponent implements OnInit {
    crumbs: Observable<any>;
	constructor(private browserService: BrowserService,
				private historyService:HistoryService) {}
    ngOnInit(): void {
		this.getCrumbs();
	}

    async getCrumbs() {
		_.forEach(this.historyService.crumbs, crumb=>{
			this.crumbs = new Observable(subscriber => {
				subscriber.next(crumb);
				subscriber.complete();
				return {unsubscribe() {}};
			});
		});
	}

	onSelect(crumb){

	}
}
