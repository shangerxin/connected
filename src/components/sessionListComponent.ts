import * as _ from "lodash";
import { OnInit, Component, Input, OnDestroy } from "@angular/core";
import { BrowserService } from "../services/browserService";
import { FilterService } from "../services/filterService";
import { SessionModel } from "../models/sessionModel";
import { GlobalConst, CommandTypes } from "../environments/globalConstTypes";
import { Observable } from "rxjs";
import {generateTextContentUrl} from "../utils";
import "../extends/extendArray";
import { CommandService } from "../services/commandService";

@Component({
    selector: "ng-session-list",
    templateUrl: "./sessionListComponent.html",
    styleUrls: ["./sessionListComponent.css"]
})
export class SessionListComponent implements OnInit, OnDestroy {
    private _session;
    private _filter;
    public get sessions(): Observable<Array<any>>{
		return this._session;
    }
    public downloadSessionUrl;
    public downloadSessionZipUrl;
    protected _allSessions;
    private _subscriptions = [];
    constructor(
        private browserService: BrowserService,
        private commandService:CommandService,
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
                this._filter = filter;
                if (filter) {
                    this.applyfilter(filter);
                } else {
                    this._session = this._allSessions.shadowClone();
                }
            })
        );
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
    }

    public async onClickRestoreSession(session) {
        this.commandService.commandSubject.next({
            type:CommandTypes.restoreSession,
            args:{}
        });
        this.browserService.restoreSession(session);
    }

    public async onClickExportSession(session) {
    }

    public async onClickDownloadSessionAsJSON(session){
        this.commandService.commandSubject.next({
            type:CommandTypes.downloadSessionAsJSON,
            args:{}
        });
        this.downloadSessionUrl = generateTextContentUrl(session);
        this.browserService.download(this.downloadSessionUrl, `${session.name}.json`);
    }

    public async onClickDeleteSession(session) {
        this.commandService.commandSubject.next({
            type:CommandTypes.deleteSession,
            args:{}
        });
        this.browserService.deleteSession(session).then(() => {
            _.remove(this._session, s => (<any>s).id === session.id);
            _.remove(this._allSessions, s=>(<any>s).id === session.id);
            this.applyfilter(this._filter);
        });
    }

    protected applyfilter(filter){
        if(!filter){
            return;
        }

        _.remove(
            this._session,
            (session: SessionModel) =>
                session.name &&
                session.name.toLowerCase().indexOf(filter) ===
                    GlobalConst.notFound
        );
    }
}
