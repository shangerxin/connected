import { OnInit, Component } from "@angular/core";
import { BrowserService } from "../services/browserService";
import { FilterService } from "../services/filterService";
import { from, Observable, Subscriber } from "rxjs";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
    selector: "ng-filter",
    templateUrl: "./filterComponent.html",
    styleUrls: ["./filterComponent.css"]
})
export class FilterComponent implements OnInit {
    public filter;
    filterResult: any;
    public filterPlaceholder = "Search";

    constructor(
        private browserService: BrowserService,
        private filterService: FilterService
    ) {}
    ngOnInit(): void {
    }

    public onKey(value: string) {
		if(value){
            this.filterService.search(this.filter);
		}
		else{
			this.filterService.reset();
		}
	}

    public onClickResetFilter() {
        this.filter = "";
		this.browserService.clearAll();
		this.filterService.reset();
    }
}
