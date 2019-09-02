import * as _ from "lodash";
import { OnInit, Component } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { GlobalConst } from "../environments/globalConstTypes";
import { PersistentService } from "src/services/persistentService";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit {
    constructor(
        private browserService: BrowserService,
        private persistentService: PersistentService
    ) {

	}

	public sessionList:Array<any>;

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}
