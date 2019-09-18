import { OnInit, Component } from "@angular/core";
import { BrowserService } from "../services/browserService";
import { FilterService } from "../services/filterService";
import { KeyCode, CommandTypes } from "../environments/globalConstTypes";
import { CommandService } from "../services/commandService";

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
        private filterService: FilterService,
        private commandService: CommandService
    ) {}
    ngOnInit(): void {
    }

    public async onKey(value: string, event) {
        if(event.keyCode && event.keyCode === KeyCode.enter && this.filter){
            this.commandService.commandSubject.next({
                type: CommandTypes.selectAllTabs,
                args: {}
            });
            return;
        }

        if(value){
            await this.filterService.search(this.filter);
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
