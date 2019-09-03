import * as _ from "lodash";
import { OnInit, Component, Input, OnDestroy } from "@angular/core";

import { Observable } from "rxjs";
import { BrowserService } from "../services/browserService";
import { CommunicatorService } from "../services/communicatorService";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit, OnDestroy {
	sessions:any;
	private _subscriptions = [];
    constructor(
		private browserService: BrowserService,
		private communicationService:CommunicatorService
    ) {
		this.browserService.getAllSessions().then(v=>this.sessions = v);
	}

    ngOnInit(): void {
		this._subscriptions.push(this.browserService.sessionChangedObservable.subscribe(sessions=>{
			this.sessions = sessions;
		}));
	}

	ngOnDestroy(): void {
		throw new Error("Method not implemented.");
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
