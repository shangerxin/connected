import * as _ from "lodash";

import { Injectable } from "@angular/core";
import { BrowserService } from "./browserService";
import { GlobalConst } from "../environments/globalconstTypes";
import "../extends/extendArray";

@Injectable({
    providedIn: "root"
})
export class HistoryService {
    private readonly _crumbMaxLength = GlobalConst.crumbMaxLength;
    private _tabs: any;
    public crumbs: Array<any>;
    constructor(browserSerivce: BrowserService) {
        this.initListeners();
        this.crumbs = [];
        browserSerivce.getCurrentTab().then(tab => {
			if(tab){
				this.crumbs.push(tab);
			}
        });
        browserSerivce.getTabs().then(tabs => {
            this._tabs = tabs;
        });
    }

    //TODO: move into BrowserService
    protected initListeners() {
        chrome.tabs.onActivated.addListener(activeInfo => {
            let crumbIndex = _.findIndex(
                this.crumbs,
                crumb => (<any>crumb).id === activeInfo.tabId
			);

			if(crumbIndex === -1){
				if(this.crumbs.length >= this._crumbMaxLength){
					this.crumbs.pop();
				}
				let tabIndex = _.findIndex(this._tabs, tab=> activeInfo.tabId === (<any>tab).id)
				this.crumbs.unshift(this._tabs[tabIndex]);
			}
			else{
				this.crumbs.swapToHead(crumbIndex);
			}
        });
    }
}
