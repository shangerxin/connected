import * as _ from "lodash";
import { OnInit, Component, Input, OnDestroy } from "@angular/core";
import { BrowserService } from "../services/browserService";
import { CommunicatorService } from "../services/communicatorService";
import { FilterService } from "../services/filterService";
import { SessionModel } from "../models/sessionModel";
import { GlobalConst } from "../environments/globalConstTypes";
import { Observable } from "rxjs";
import "../extends/extendArray";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit, OnDestroy {
	private _session;
    public get sessions(): Observable<Array<any>>{
		return this._session;
	}
    protected _allSessions;
    private _subscriptions = [];
    constructor(
        private browserService: BrowserService,
        private communicationService: CommunicatorService,
        private filterService: FilterService
    ) {
        this.browserService.getAllSessions().then(v => (this._session = v));
    }

    ngOnInit(): void {
        this._subscriptions.push(
            this.browserService.sessionChangedObservable.subscribe((sessions:Array<any>) => {
                this._session = sessions;
                this._allSessions = sessions.shadowClone();
            })
        );
        this._subscriptions.push(
            this.filterService.lowerFilterObservable.subscribe(filter => {
                if (filter) {
                    _.remove(
                        this._session,
                        (session: SessionModel) =>
                            session.name &&
                            session.name.toLowerCase().indexOf(filter) ===
                                GlobalConst.notFound
                    );
                } else {
                    this._session = this._allSessions.shadowClone();
                }
            })
        );
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
    }

    onClickRestoreSession(session) {
        this.browserService.restoreSession(session);
    }

    onClickExportSession(session) {
        this.communicationService.getSessionUrl(session);
    }

    onClickDeleteSession(session) {
        this.browserService.deleteSession(session).then(() => {
            _.remove(this._session, s => (<any>s).id === session.id);
        });
    }
}
