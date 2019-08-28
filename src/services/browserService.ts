import * as _ from "lodash";

import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class BrowserService {
    constructor() {}

    currentTab: any;
    currentWindow: any;
    targetTabs: Array<any>;
    targetWindows: Array<any>;

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
            return Promise.all(
                _.map(tabs, tab => {
                    return new Promise(res => {
                        chrome.tabs.update(tab.id, { pinned: true }, () => {
                            res();
                        });
                    });
                })
            );
        }
    }

    async closeTabs(tabs = this.targetTabs) {
        if (tabs) {
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
                    { highlighted: true, active: true },
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

    async createWindow() {}

    async closeWindows() {
        if (this.targetWindows) {
            return Promise.all(
                _.map(this.targetWindows, window => {
                    return new Promise(res => {
                        chrome.windows.remove(window.id, () => {
                            res();
                        });
                    });
                })
            );
        }
    }

    forcusWindow(window) {
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
}
