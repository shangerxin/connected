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
import { tsThisType } from "@babel/types";

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
                        this.tabModel.muted = !this.tabModel.muted;
                        break;
                    }
                    case CommandTypes.togglePinTabs: {
                        _.forEach(this.browserService.targetTabs, tab => {
                            if (tab.id === this.tabModel.id) {
                                this.tabModel.pinned = !this.tabModel.pinned;
                            }
                        });
                        break;
                    }
                }
            })
        );

        this._subscriptions.push(
            this.browserService.tabChangedObservable.subscribe(async info => {
                switch (info.type) {
                    case Subjects.tabs_onUpdated: {
                        let data = info.data;
                        let changeInfo = data.changeInfo;
                        let tab = data.tab;
                        if (tab && changeInfo) {
                            if (this.tabModel.id === tab.id) {
                                TabModel.assign(this.tabModel, tab);
                            }
                        }
                        break;
                    }
                }
            })
        );
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
    }

    @Input()
    tabModel;

    public get tab(){
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
        this.commandService.commandSubject.next({
            type:CommandTypes.focusTab,
            args:{}
        });
        this.doubleClickedEvent.emit(this.tab);
    }
}
