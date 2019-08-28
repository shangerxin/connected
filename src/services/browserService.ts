import * as _ from "lodash";

import { Injectable } from "@angular/core";
import "../extends/extendPromise";

@Injectable({
    providedIn: "root"
})
export class BrowserService {
    constructor() {
        this.getCurrentTab();
        this.getCurrentWindow();
    }

    currentTab: any;
    currentWindow: any;
    targetTabs: Array<any>;
	targetWindows: Array<any>;

	private _previousClosedTabsInfo:any;
	protected get previousClosedTabsInfo(){
		if(this._previousClosedTabsInfo){
			
		}
		return this._previousClosedTabsInfo;
	}

	protected set previousClosedTabsInfo(v){

	}



    allTabs: Array<any>;
    allWindows: Array<any>;

    //Tab relative
    async getTabs() {
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

    async pinTabs(tabs = this.targetTabs) {
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
                return { url: tab.id, windowId: tab.windowId };
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
        return this.getTabs().then(tabs => {
            return new Promise(res => {
                _.forEach(<any>tabs, tab => {
                    chrome.tabs.reload(tab.id, { bypassCache: true }, () => {
                        res();
                    });
                });
            });
        });
    }

    async mutedAllTabs() {
        return this.getTabs().then(tabs => {
            return new Promise(res => {
                _.forEach(<any>tabs, tab => {
                    chrome.tabs.update(tab.id, { muted: true }, () => {
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
                chrome.tabs.update(
                    tab.id,
                    { active: true },
                    () => {
                        res();
                    }
                );
            });
        }
    }

    async takeSnapshortForTabs() {}

    async zoom(tab, factor) {}

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
            this.previousClosedTabsInfo = [];
            return Promise.all(
                _.map(windows, window => {
                    return new Promise(res => {
                        _.forEach(window.tabs, tab => {
                            this.previousClosedTabsInfo.push({
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
            );
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

    async undoCloseTabs() {
        if (this.previousClosedTabsInfo) {
            let newWindow = null;
            return Promise.sequenceAll(
                _.map(this.previousClosedTabsInfo, async info => {
                    await this.getWindows();
                    let windowIds = new Set(
                        _.map(this.allWindows, window => window.id)
                    );
                    if (windowIds.has(info.windowId)) {
                        return new Promise(res => {
                            chrome.tabs.create({ url: info.url }, () => {
                                res();
                            });
                        });
                    } else {
                        return new Promise(res => {
                            if (!newWindow) {
                                chrome.windows.create(window => {
                                    newWindow = window;
                                    res();
                                });
                            } else {
                                res();
                            }
                        }).then(() => {
                            return new Promise(res => {
                                chrome.tabs.create(
                                    { url: info.url, windowId: newWindow.id },
                                    () => {
                                        res();
                                    }
                                );
                            });
                        });
                    }
                })
            );
        }
    }

    protected startMonitorBrowser() {}
}
