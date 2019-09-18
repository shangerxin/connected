import * as _ from "lodash";
import "../extends/extendArray";
import { OnInit, Component, OnDestroy, Input } from "@angular/core";

import { BrowserService } from "../services/browserService";
import {
    GlobalConst,
    Subjects,
    CommandTypes
} from "../environments/globalConstTypes";
import { Observable, of, Subscription, from } from "rxjs";
import { FilterService } from "../services/filterService";
import { TabModel } from "../models/tabModel";
import { WindowModel } from "../models/windowModel";
import { SessionModel } from "../models/sessionModel";
import { CommandService } from "../services/commandService";
import { StatisticService } from "../services/statisticService";

@Component({
    selector: "ng-tab-list",
    templateUrl: "./tabListComponent.html",
    styleUrls: ["./tabListComponent.css"]
})
export class TabListComponent implements OnInit, OnDestroy {
    activeIds = [];
    private _subscriptions: Array<Subscription>;

    constructor(
        private browserService: BrowserService,
        private filterService: FilterService,
        private commandService: CommandService,
        private statisticService:StatisticService
    ) {
        this._subscriptions = [];
    }

    private _allTabs = [];
    isDisplaySessionList = false;

    protected get allTabs() {
        if (this._allWindows) {
            this._allTabs = _.concat(
                [],
                ..._.map(this._allWindows, window => window.tabs)
            );
        }
        return this._allTabs;
    }

    ngOnInit(): void {
        this.updateWindows().then(() => {
            this._subscriptions.push(
                this.browserService.tabChangedObservable.subscribe(
                    async info => {
                        let data = info.data;
                        switch (info.type) {
                            case Subjects.tabs_onRemoved: {
                                this._allWindows.updateWithCondition(
                                    window => window.id === data.windowId,
                                    window => {
                                        _.remove(
                                            window.tabs,
                                            tab => (<any>tab).id === data.tabId
                                        );
                                    }
                                );
                                _.remove(
                                    this._allWindows,
                                    window => (<any>window).tabs.length === 0
                                );
                                break;
                            }
                            case Subjects.tabs_onCreated: {
                                let curWindow = _.find(
                                    this._allWindows,
                                    window => window.id === data.tab.windowId
                                );
                                if (curWindow) {
                                    curWindow.tabs.push(
                                        TabModel.create(data.tab)
                                    );
                                }
                                break;
                            }
                        }
                    }
                )
            );

            this._subscriptions.push(
                this.browserService.windowChangedObservable.subscribe(info => {
                    let data = info.data;
                    switch (info.type) {
                        case Subjects.windows_onRemoved: {
                            if (this._allWindows) {
                                _.remove(
                                    this._allWindows,
                                    window =>
                                        (<WindowModel>window).id ===
                                        data.windowId
                                ).forEach(window => {
                                    _.pullAllWith(
                                        this._allTabs,
                                        (<any>window).tabs,
                                        (tabModel, browserTab) => {
                                            return (
                                                (<any>tabModel).id ===
                                                (<any>browserTab).id
                                            );
                                        }
                                    );
                                });
                            }
                            break;
                        }
                        case Subjects.windows_onCreated: {
                            this._allWindows.push(
                                WindowModel.create(data.window)
                            );
                            break;
                        }
                    }
                })
            );

            this._subscriptions.push(
                this.filterService.lowerFilterObservable.subscribe(filter => {
                    if (filter) {
                        let tabs = this.filterService.filterTabsResult;
                        let tabIndexes = new Set(_.map(tabs, tab => tab.id));
                        _.forEach(this._allWindows, window => {
                            _.remove(
                                window.tabs,
                                tab => !tabIndexes.has((<any>tab).id)
                            );
                        });
                    } else {
                        this.updateWindows(true);
                    }
                })
            );

            this._subscriptions.push(
                this.commandService.commandObservable.subscribe(command => {
                    if (command.type === CommandTypes.toggleSessionList) {
                        this.isDisplaySessionList =
                            command.args.isDisplaySessionList;
                    }
                    else if(command.type === CommandTypes.selectAllTabs){
                        _.forEach(this.allTabs, (tab:TabModel)=>{
                            tab.isSelected = true;
                        });
                    }
                })
            );
        });
        this.statisticService.startMonitor();
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
        this.statisticService.stopMonitor();
    }

    private _allWindows;
    public get windows(): Observable<Array<any>> {
        return this._allWindows;
    }

    public onToggleSelected(tab) {
        if (this.browserService.targetTabs) {
            let targetIndex = _.findIndex(
                this.browserService.targetTabs,
                tt => tt.id === tab.id
            );
            if (targetIndex !== GlobalConst.notFound) {
                if (!tab.isSelected) {
                    _.remove(
                        this.browserService.targetTabs,
                        tt => tt.id === tab.id
                    );
                }
            } else {
                if (tab.isSelected) {
                    this.browserService.targetTabs.push(tab._tab);
                }
            }
        } else {
            if (tab.isSelected) {
                this.browserService.targetTabs = [tab._tab];
            }
        }
    }

    public async onDoubleClickTab(tab) {
        await this.browserService.focusTab(tab._tab);
    }

    public async onDoubleClickWindow(window) {
        this.commandService.commandSubject.next({
            type:CommandTypes.focusWindow,
            args:{}
        });
        await this.browserService.focusWindow(window._window);
    }

    public onFreshCurrentWindow(window) {
        this.commandService.commandSubject.next({
            type:CommandTypes.refreshWindow,
            args:{}
        });
        this.browserService.reloadWindows([window]);
    }

    async updateWindows(isForceReset = false) {
        let previousWindows: Map<number, WindowModel> =
            this._allWindows &&
            !isForceReset &&
            new Map(_.map(this._allWindows, window => [window.id, window]));
        let allWindows = await this.browserService.getWindows();
        allWindows = _.map(<any>allWindows, window => {
            let wm = WindowModel.create(window);
            if (
                !isForceReset &&
                previousWindows &&
                previousWindows.has(window.id)
            ) {
                let pw = previousWindows.get(window.id);
                wm.isSelected = pw.isSelected;
                _.forEach(pw.tabs, (tabPre: TabModel) => {
                    let tab: TabModel = _.find(
                        wm.tabs,
                        tab => tab.id === tabPre.id
                    );
                    if (tab) {
                        TabModel.extend(tab, tabPre);
                    }
                });
            }
            return wm;
        });

        if (this._allWindows) {
            _.remove(this._allWindows, () => true);
        } else {
            this._allWindows = [];
        }
        _.forEach(<any>allWindows, window => {
            this._allWindows.push(window);
        });
        this.activeIds = [];
        for (let i = 0; i < this._allWindows.length; i++) {
            this.activeIds.push(`panel-${i}`);
        }
    }

    async onSelectWindow(window) {
        window.isSelected = window.isSelected ? false : true;
        if (this.browserService.targetWindows) {
            let targetIndex = _.findIndex(
                this.browserService.targetWindows,
                tt => tt.id === window.id
            );
            if (targetIndex !== GlobalConst.notFound) {
                if (!window.isSelected) {
                    _.remove(
                        this.browserService.targetWindows,
                        tw => tw.id === window.id
                    );
                }
            } else {
                if (window.isSelected) {
                    this.browserService.targetWindows.push(window._window);
                }
            }
        } else {
            if (window.isSelected) {
                this.browserService.targetWindows = [window._window];
            }
        }
    }

    async onClickSaveSession(sessionInfo, window) {
        this.commandService.commandSubject.next({
            type:CommandTypes.saveSession,
            args:{}
        });
        let session = SessionModel.create(
            sessionInfo.name,
            sessionInfo.description
        );
        session.tabs = _.map(window.tabs, tab => {
            return { url: tab.url, pinned: tab.pinned, windowId: tab.windowId };
        });
        this.browserService.saveSession(session);
    }

    async onClickCloseWindow(window) {
        this.commandService.commandSubject.next({
            type:CommandTypes.closeWindow,
            args:{}
        });
        let targetWindows = [window._window];
        _.remove(this._allWindows, w => (<any>w).id === window.id);
        this.browserService.closeWindows(targetWindows);
    }

    protected refresh() {
        if (this._allWindows) {
            let tmp = this._allWindows;
            this._allWindows = null;
            this._allWindows = tmp;
        }
    }
}
