import * as _ from "lodash";
import { OnInit, Component, OnDestroy } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { GlobalConst } from "../environments/globalConstTypes";
import { Observable, of, Subscription } from "rxjs";

@Component({
    selector: "ng-tab-list",
    templateUrl: "./tabListComponent.html",
    styleUrls: ["./tabListComponent.css"]
})
export class TabListComponent implements OnInit, OnDestroy {
    private _allWindows = null;
    private _subscriptions: Array<Subscription>;

    constructor(private browserService: BrowserService) {
		this._subscriptions = [];
	}
    ngOnInit(): void {
        this.getWindows().then(() => {
            this._subscriptions.push(
                this.browserService.tabChangedObservable.subscribe(info => {

				})
            );
            this._subscriptions.push(
                this.browserService.windowChangedObservable.subscribe(
                    info => {

					}
                )
            );
        });
    }

    ngOnDestroy(): void {
        _.forEach(this._subscriptions, sub=>sub.unsubscribe());
    }

    public get windows(): Observable<Array<any>> {
        // _.forEach(this._allWindows, window => {
		// 	window.tabs = of(window.tabs);
		// });
        // let windows = of(this._allWindows);
        return this._allWindows;
    }

    public onToggleSelected(tab) {
        tab.isSelected = tab.isSelected ? false : true;
        if(this.browserService.targetTabs){
			let targetIndex = _.findIndex(this.browserService.targetTabs, tt=>tt.id===tab.id);
			if(targetIndex !== GlobalConst.notFound){
				if(!tab.isSelected){
					_.remove(this.browserService.targetTabs, tt=>tt.id === tab.id);
				}
			}
			else{
				if(tab.isSelected){
					this.browserService.targetTabs.push(tab._tab);
				}
			}
		}
		else{
			if(tab.isSelected){
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
            let windowModel = {
                id: window.id,
                _window: window,
                title: "",
                tabs: [],
                isSelected: false
            };
            let title = window.tabs[0].title ? window.tabs[0].title : "";
            windowModel.title =
                title.length > GlobalConst.maxWindowTitleLength
                    ? title.substring(0, GlobalConst.maxWindowTitleLength) +
                      "..."
                    : title;
            _.forEach(window.tabs, tab => {
                tab.iconUrl =
                    tab.url && tab.url.startsWith("chrome:")
                        ? "assets/images/chrome16.png"
                        : tab.favIconUrl;
                windowModel.tabs.push({
                    id: tab.id,
                    _tab: tab,
                    isFilterOut: false,
                    url: tab.url,
                    iconUrl: tab.iconUrl,
                    isSelected: false,
                    pinned: tab.pinned,
                    muted: tab.mutedInfo.muted
                });
            });
            return windowModel;
        });
    }

    async onSelectWindow(window) {
		window.isSelected = window.isSelected ? false : true;
        if(this.browserService.targetTabs){
			let targetIndex = _.findIndex(this.browserService.targetWindows, tt=>tt.id===window.id);
			if(targetIndex !== GlobalConst.notFound){
				if(!window.isSelected){
					_.remove(this.browserService.targetWindows, tw=>tw.id === window.id);
				}
			}
			else{
				if(window.isSelected){
					this.browserService.targetTabs.push(window._window);
				}
			}
		}
		else{
			if(window.isSelected){
				this.browserService.targetWindows = [window._window];
			}
		}
    }

    async onClickCloseWindow(window) {
        let targetWindows = [window._window];
        this.browserService.closeWindows(targetWindows);
    }
}
