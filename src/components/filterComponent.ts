import { OnInit, Component } from "@angular/core";
import { BrowserService } from "../services/browserService";
import { FilterService } from "../services/filterService";

@Component({
    selector: "ng-filter",
    templateUrl: "./filterComponent.html",
    styleUrls: ["./filterComponent.css"]
})
export class FilterComponent implements OnInit {
    public filter: any;
    filterResult: any;

    constructor(
        private browserService: BrowserService,
        private filterService: FilterService
    ) {}
    ngOnInit(): void {}

    public onKey(value: string) {
		if(value && value.length > 2){
			this.filterService.search(this.filter);
		}
	}

    public onClickResetFilter() {
        this.filter = "";
		this.browserService.clearAll();
		this.filterService.reset();
    }
}
