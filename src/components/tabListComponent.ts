import * as _ from "lodash";
import "../extends/extendArray";
import { OnInit, Component, OnDestroy, Input } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { GlobalConst, Subjects, CommandTypes} from "../environments/globalConstTypes";
import { Observable, of, Subscription } from "rxjs";
import { FilterService } from "../services/filterService";
import { TabModel } from "../models/tabModel";
import { WindowModel } from "../models/windowModel";
import { SessionModel } from "../models/sessionModel";
import { CommandService } from "../services/commandService";
import { getWindowTitle as generateWindowTitle } from "../utils";

@Component({
    selector: "ng-tab-list",
    templateUrl: "./tabListComponent.html",
    styleUrls: ["./tabListComponent.css"]
})
export class TabListComponent implements OnInit, OnDestroy {
	private _subscriptions: Array<Subscription>;

    constructor(
        private browserService: BrowserService,
		private filterService: FilterService,
		private commandService: CommandService
    ) {
        this._subscriptions = [];
    }

	private _allTabs = [];
	isDisplaySessionList = false;

    protected get allTabs() {
        if (this._allTabs.length === 0 && this._allWindows) {
            this._allTabs = _.concat(
                [],
                ..._.map(this._allWindows, window => window.tabs)
            );
        }
        return this._allTabs;
    }

    ngOnInit(): void {
        this.getWindows().then(() => {
            this._subscriptions.push(
                this.browserService.tabChangedObservable.subscribe(info => {
                    switch (info.type) {
                        case Subjects.tabs_onRemoved: {
                            this._allWindows.updateWithCondition(
                                window => window.id === info.data.windowId,
                                window => {
                                    _.remove(
                                        window.tabs,
                                        tab => (<any>tab).id === info.data.tabId
                                    );
                                }
                            );
                            _.remove(
                                this._allWindows,
                                window => (<any>window).tabs.length === 0
                            );
                            break;
                        }
                        case Subjects.tabs_onUpdated: {
                            let newTab = info.data.tab;
                            if (
                                this.allTabs &&
                                newTab &&
                                newTab.status ===
                                    GlobalConst.tabUpdateStatusComplete
                            ) {
                                let windowModel = _.find(
                                    this._allWindows,
                                    window =>
                                        (<any>window).id === newTab.windowId
                                );
                                if (windowModel) {
                                    TabModel.assign(
                                        _.find(
                                            this.allTabs,
                                            tab => tab.id === info.data.tab.id
                                        ),
                                        info.data.tab
                                    );
                                } else {
                                    let browserWindow = _.find(
                                        this.browserService.allWindows,
                                        window => window.id === newTab.windowId
                                    );
                                    if (browserWindow) {
                                        windowModel = WindowModel.create(
                                            browserWindow
                                        );
                                        let tabModel = _.find(
                                            windowModel.tabs,
                                            tab => (<any>tab).id === newTab.id
                                        );
                                        if (tabModel) {
                                            this._allTabs.push(tabModel);
                                        } else {
                                            tabModel = TabModel.create(newTab);
                                            windowModel.tabs.push(tabModel);
                                            windowModel.title = generateWindowTitle(
                                                windowModel
                                            );
                                            this._allTabs.push(tabModel);
                                            this._allWindows.push(windowModel);
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                })
            );
            this._subscriptions.push(
                this.browserService.windowChangedObservable.subscribe(info => {
                    switch (info.type) {
                        case Subjects.windows_onRemoved: {
                            if (this._allWindows) {
                                _.remove(
                                    this._allWindows,
                                    window =>
                                        (<WindowModel>window).id ===
                                        info.data.windowId
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
                    }
                })
            );
            this._subscriptions.push(
                this.filterService.filterObservable.subscribe(filterResult => {
                    if (filterResult) {
                        let tabIndexes = new Set(
                            _.map(filterResult, tab => tab.id)
                        );
                        _.forEach(this._allWindows, window => {
                            _.remove(
                                window.tabs,
                                tab => !tabIndexes.has((<any>tab).id)
                            );
                        });
                    } else {
                        this.getWindows();
                    }
                })
            );
		});
		this._subscriptions.push(
			this.commandService.commandObservable.subscribe(command=>{
				if(command.type === CommandTypes.toggleSessionList){
					this.isDisplaySessionList = command.args.isDisplaySessionList;
				}
			})
		);
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub => sub.unsubscribe());
    }

	private _allWindows;
    public get windows(): Observable<Array<any>> {
        return this._allWindows;
    }

    public onToggleSelected(tab) {
        tab.isSelected = tab.isSelected ? false : true;
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

    public onDoubleClickTab(tab) {
        this.browserService.targetTabs = [tab._tab];
        this.browserService.focusTab(tab._tab);
    }

    public onDoubleClickWindow(window) {
        this.browserService.targetWindows = [window._window];
        this.browserService.forcusWindow(window._window);
    }

    async getWindows() {
        this._allWindows = await this.browserService.getWindows();
        this._allWindows = _.map(this._allWindows, window => {
            return WindowModel.create(window);
        });
	}

    async onSelectWindow(window) {
        window.isSelected = window.isSelected ? false : true;
        if (this.browserService.targetTabs) {
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
                    this.browserService.targetTabs.push(window._window);
                }
            }
        } else {
            if (window.isSelected) {
                this.browserService.targetWindows = [window._window];
            }
        }
    }

    async onClickSaveSession(sessionInfo, window) {
        let session = SessionModel.create(
            sessionInfo.name,
            sessionInfo.description
        );
        session.tabs = _.map(window.tabs, tab => {
            return { url: tab.url };
        });
        this.browserService.saveSession(session);
    }

    async onClickCloseWindow(window) {
		let targetWindows = [window._window];
		_.remove(this._allWindows, w=> (<any>w).id === window.id);
        this.browserService.closeWindows(targetWindows);
	}
}
