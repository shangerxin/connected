import * as _ from "lodash";

import { Injectable, EventEmitter } from "@angular/core";
import "../extends/extendPromise";
import { DBBrowserKeys } from "../environments/globalConstTypes";
import { PersistentService } from "../services/persistentService";


@Injectable({
    providedIn: "root"
})
export class BrowserService {
    constructor(private persistentService: PersistentService) {
        this.getCurrentTab();
        this.getCurrentWindow();
        persistentService
            .get(DBBrowserKeys.previousClosedTabsInfo)
			.then(v => (this._previousClosedTabsInfo = v));

		this.tabChangedEvent = new EventEmitter<any>();
		this.windowChangedEvent = new EventEmitter<any>();
    }

	allTabs: Array<any>;
    allWindows: Array<any>;
    currentTab: any;
    currentWindow: any;
    targetTabs: Array<any>;
	targetWindows: Array<any>;

	tabChangedEvent:EventEmitter<any>;
	windowChangedEvent:EventEmitter<any>;

    private _previousClosedTabsInfo: any;
    protected get previousClosedTabsInfo() {
        return this._previousClosedTabsInfo;
	}

    protected set previousClosedTabsInfo(v) {
        if (this._previousClosedTabsInfo !== v) {
            this._previousClosedTabsInfo = v;
            this.persistentService.save(
                DBBrowserKeys.previousClosedTabsInfo,
                this._previousClosedTabsInfo
            );
        }
	}

	getURL(relativePath){
		return chrome.runtime.getURL(relativePath);
	}


    //Tab relative
    async getAllTabs() {
        return new Promise((res, rej) => {
            let allTabs = [];
            chrome.windows.getAll({ populate: true }, windows => {
                _.forEach(windows, window => {
                    chrome.tabs.getAllInWindow(window.id, tabs => {
                        _.forEach(tabs, tab => allTabs.push(tab));
                        this.allTabs = allTabs;
                        res(allTabs);
                    });
                });
            });
        });
    }

    async getCurrentTab() {
        return new Promise((res, rej) => {
            chrome.tabs.getCurrent(tab => {
                this.currentTab = tab;
                res(tab);
            });
        });
    }

    async createTab() {}

    async togglePinTabs(tabs = this.targetTabs) {
        if (tabs) {
            let isAllPinned = _.reduce(
                tabs,
                (r, tab) => tab.pinned === true && r === true,
                true
            );
            return Promise.all(
                _.map(tabs, tab => {
                    return new Promise(res => {
                        chrome.tabs.update(
                            tab.id,
                            { pinned: !isAllPinned },
                            () => {
                                res();
                            }
                        );
                    });
                })
            );
        }
    }

    async closeTabs(tabs = this.targetTabs) {
        if (tabs) {
            this.previousClosedTabsInfo = _.map(tabs, tab => {
                return { url: tab.url, windowId: tab.windowId };
            });
            return Promise.all(
                _.map(tabs, tab => {
                    return new Promise(res => {
                        chrome.tabs.remove(tab.id, () => {
                            res();
                        });
                    });
                })
            );
        }
    }

    async reloadTabs(tabs = this.targetTabs) {
        if (tabs) {
            return Promise.all(
                _.map(tabs, tab => {
                    return new Promise(res => {
                        chrome.tabs.reload(
                            tab.id,
                            { bypassCache: true },
                            () => {
                                res();
                            }
                        );
                    });
                })
            );
        }
    }

    async reloadAllTabs() {
        return this.getAllTabs().then(tabs => {
            return new Promise(res => {
                _.forEach(<any>tabs, tab => {
                    chrome.tabs.reload(tab.id, { bypassCache: true }, () => {
                        res();
                    });
                });
            });
        });
    }

    async toggleMutedAllTabs() {
        return this.getAllTabs().then(tabs => {
            return new Promise(res => {
                let isAllMuted = _.reduce(
                    <any>tabs,
                    (r, tab) => tab.mutedInfo.muted === true && r === true,
                    true
                );
                _.forEach(<any>tabs, tab => {
                    chrome.tabs.update(tab.id, { muted: !isAllMuted }, () => {
                        res();
                    });
                });
            });
        });
    }

    async focusTab(tab = null) {
        tab =
            tab ||
            (this.targetTabs &&
                this.targetTabs.length > 0 &&
                this.targetTabs[0]);
        if (tab) {
            return new Promise(res => {
                chrome.tabs.update(tab.id, { active: true }, () => {
                    res();
                });
            });
        }
    }

    async takeSnapshortForTabs() {}

	async zoom(tab, factor) {}

	async undoCloseTabs() {
        if (this.previousClosedTabsInfo) {
            let windowInfo: any = {};
            return Promise.sequenceHandleAll(
                this.previousClosedTabsInfo,
                async (info, callback) => {
                    await this.getWindows();
                    let windowIds = new Set(
                        _.map(this.allWindows, window => window.id)
                    );
                    if (windowIds.has(info.windowId)) {
                        chrome.tabs.create(
                            { url: info.url, windowId: info.windowId },
                            () => {
                                callback();
                            }
                        );
                    } else {
                        if (!windowInfo.window) {
                            chrome.windows.create(window => {
                                windowInfo.window = window;
                                chrome.tabs.update(
                                    window.tabs[0].id,
                                    { url: info.url },
                                    () => {
                                        callback();
                                    }
                                );
                            });
                        } else {
                            chrome.tabs.create(
                                {
                                    url: info.url,
                                    windowId: windowInfo.window.id
                                },
                                () => {
                                    callback();
                                }
                            );
                        }
                    }
                }
            );
        }
    }

    //Window realtive
    async getWindows() {
        return new Promise((res, rej) => {
            chrome.windows.getAll(
                {
                    populate: true,
                    windowTypes: ["normal", "popup", "panel", "app", "devtools"]
                },
                windows => {
                    this.allWindows = windows;
                    res(windows);
                }
            );
        });
    }

    async getCurrentWindow() {
        return new Promise(res => {
            chrome.windows.getCurrent(window => {
                this.currentWindow = window;
                res(window);
            });
        });
    }

    async createWindow() {
        return new Promise(res => {
            chrome.windows.create(window => {
                res();
            });
        });
    }

    async closeWindows(windows = this.targetWindows) {
        if (windows) {
            let closedTabs = [];
            return Promise.all(
                _.map(windows, window => {
                    return new Promise(res => {
                        _.forEach(window.tabs, tab => {
                            closedTabs.push({
                                url: tab.url,
                                windowId: tab.windowId
                            });
                        });
                        chrome.windows.remove(window.id, () => {
                            this.targetWindows = [];
                            res();
                        });
                    });
                })
            ).then(() => {
                this.previousClosedTabsInfo = closedTabs;
            });
        }
    }

    async forcusWindow(window = null) {
        window =
            window ||
            (this.targetWindows &&
                this.targetWindows.length > 0 &&
                this.targetWindows[0]);
        if (window) {
            return new Promise(res => {
                chrome.windows.update(window.id, { focused: true }, () => {
                    res();
                });
            });
        }
    }

    async reloadWindows() {
        if (this.targetWindows) {
            let tabs = [];
            _.forEach(this.targetWindows, window => {
                _.forEach(window.tabs, tab => {
                    tabs.push(tab);
                });
            });
            return this.reloadTabs(tabs);
        }
	}

	async openInNewWindow(tabs = this.targetTabs){
		if(tabs){
			return new Promise((res, rej)=>{
				chrome.windows.create((window)=>{
					let isFirst = true;
					Promise.sequenceHandleAll(tabs, async (tab, callback)=>{
						if(isFirst){
							chrome.tabs.update(window.tabs[0].id, {url:tab.url}, ()=>{
								isFirst = false;
								callback();
							});
						}
						else{
							chrome.tabs.create({url:tab.url, windowId:window.id}, ()=>{
								callback();
							});
						}
					})
					.then(()=>res())
					.catch(e=>rej(e));
				});
			});
		}
	}

	clearAllTargets(){
		this.targetTabs = null;
		this.targetWindows = null;
	}

	clearAllSelected(){
		if(this.allTabs){
			_.forEach(this.allTabs, tab=>{
				tab.isSelected = false;
			});
		}

		if(this.allWindows){
			_.forEach(this.allWindows, window=>{
				window.isSelected = false;
			});
		}
	}

	clearAll(){
		this.clearAllSelected();
		this.clearAllTargets();
	}

	//Browser status monitors
    protected startMonitorBrowser() {
		chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{

		});
		chrome.tabs.onRemoved.addListener((tabId, removeInfo)=>{

		});
		chrome.tabs.onCreated.addListener((tab)=>{

		});
		chrome.tabs.onSelectionChanged.addListener((tabId, selectInfo)=>{

		});
		chrome.windows.onRemoved.addListener((windowId)=>{

		});
		chrome.windows.onCreated.addListener((window)=>{

		});
		chrome.windows.onFocusChanged.addListener((windowId)=>{

		});
	}
}
