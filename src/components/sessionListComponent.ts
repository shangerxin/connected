import * as _ from "lodash";
import { OnInit, Component } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { GlobalConst } from "../environments/globalConstTypes";
import { PersistentService } from "src/services/persistentService";
import { Observable } from "rxjs";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit {

    constructor(
        private browserService: BrowserService,
        private persistentService: PersistentService
    ) {

	}

	private _sessionList;
	get sessionList():Observable<any[]>{
		return this._sessionList;
	}

    ngOnInit(): void {
	}

	onClickRestoreSession(session){
		this.browserService.restoreSession(session);
	}
}
