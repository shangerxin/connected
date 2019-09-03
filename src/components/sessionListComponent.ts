import * as _ from "lodash";
import { OnInit, Component, Input } from "@angular/core";

import { Observable } from "rxjs";
import { BrowserService } from "../services/browserService";
import { CommunicatorService } from "../services/communicatorService";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit {
	@Input()
	sessions:any;
    constructor(
		private browserService: BrowserService,
		private communicationService:CommunicatorService
    ) {
	}

    ngOnInit(): void {
	}

	onClickRestoreSession(session){
		this.browserService.restoreSession(session);
	}

	onClickExportSession(session){
		this.communicationService.getSessionUrl(session);
	}

	onClickDeleteSession(session){
		this.browserService.deleteSession(session).then(()=>{
			_.remove(this.sessions, s=>(<any>s).id === session.id);
		});
	}
}
