import * as _ from "lodash";
import "../extends/extendArray";
import {
    OnInit,
    Component,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { BrowserService } from "../services/browserService";
import {
    GlobalConst,
    Subjects,
    CommandTypes
} from "../environments/globalConstTypes";
import { Observable, Subscription } from "rxjs";
import { TabModel } from "../models/tabModel";
import { CommandService } from "../services/commandService";

@Component({
    selector: "ng-tab",
    templateUrl: "./tabComponent.html",
    styleUrls: ["./tabComponent.css"]
})
export class TabComponent implements OnInit, OnDestroy {
    private _subscriptions: Array<Subscription> = [];
    constructor(
        private browserService: BrowserService,
        private commandService: CommandService
    ) {
        this._subscriptions.push(
            this.commandService.commandObservable.subscribe(async info => {
                switch (info.type) {
                    case CommandTypes.multedAllTabs: {
                        this.tabModel._tab.mutedInfo.muted = !this.tabModel
                            .muted;
                        this.tabModel.muted = !this.tabModel.muted;
                        break;
                    }
                    case CommandTypes.togglePinTabs: {
                        _.forEach(this.browserService.targetTabs, tab => {
                            if (tab.id === this.tabModel.id) {
                                this.tabModel._tab.pinned = !this.tabModel
                                    .pinned;
                                this.tabModel.pinned = !this.tabModel.pinned;
                            }
                        });
                        break;
                    }
                }
            })
        );

        this._subscriptions.push(
            this.browserService.tabChangedObservable.subscribe(async info => {})
        );
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
    }

    @Input()
    tabModel;

    public get tab(): Observable<any> {
        return this.tabModel;
    }

    @Output()
    toggleSelectedEvent = new EventEmitter<any>();

    @Output()
    doubleClickedEvent = new EventEmitter<any>();

    ngOnInit(): void {}

    onToggleSelected() {
        this.tabModel.isSelected = !this.tabModel.isSelected;
        this.toggleSelectedEvent.emit(this.tab);
    }

    onDoubleClickTab() {
        this.doubleClickedEvent.emit(this.tab);
    }
}
