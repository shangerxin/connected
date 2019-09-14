import * as _ from "lodash";

import { Injectable, OnDestroy } from "@angular/core";
import "../extends/extendPromise";
import {
    DBBrowserKeys,
    GlobalConst,
    Subjects,
    WindowStates
} from "../environments/globalConstTypes";
import { PersistentService } from "../services/persistentService";
import { Subject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class BrowserService implements OnDestroy {
    protected allTabs: Array<any>;
    allWindows: Array<any>;
    currentTab: any;
    currentWindow: any;
    targetTabs: Array<any>;
    targetWindows: Array<any>;

    sessionChangedSubject: Subject<any>;
    sessionChangedObservable: Observable<any>;
    tabChangedSubject: Subject<any>;
    tabChangedObservable: Observable<any>;
    windowChangedSubject: Subject<any>;
    windowChangedObservable: Observable<any>;

    private _browserListeners: Map<string, Function>;

    private _previousClosedTabsInfo: any;
    constructor(private persistentService: PersistentService) {
        this.getCurrentTab();
        this.getCurrentWindow();
        this.getWindows().then(() => this.getAllTabs());
        persistentService
            .get(DBBrowserKeys.previousClosedTabsInfo)
            .then(v => (this._previousClosedTabsInfo = v));

        this.sessionChangedSubject = new Subject<any>();
        this.sessionChangedObservable = this.sessionChangedSubject.asObservable();
        this.tabChangedSubject = new Subject<any>();
        this.tabChangedObservable = this.tabChangedSubject.asObservable();
        this.windowChangedSubject = new Subject<any>();
        this.windowChangedObservable = this.windowChangedSubject.asObservable();
        this._browserListeners = new Map<string, Function>();
        this.startMonitorBrowser();
    }

    ngOnDestroy(): void {
        this.clearAll();
        this.stopMonitorBrowser();
    }

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

    getURL(relativePath) {
        return chrome.runtime.getURL(relativePath);
    }

    //Tab relative
    public async getAllTabs() {
        if (!this.allTabs) {
            return (this.allTabs = _.concat(
                [],
                ..._.map(this.allWindows, window => window.tabs)
            ));
        } else {
            return this.allTabs;
        }
    }

    async getCurrentTab() {
        if (!this.currentTab) {
            return new Promise((res, rej) => {
                chrome.tabs.getCurrent(tab => {
                    this.currentTab = tab;
                    res(tab);
                });
            });
        } else {
            return this.currentTab;
        }
    }

    async createTab(window = this.currentWindow) {
        if (window) {
            return new Promise((res, rej) => {
                chrome.tabs.create(
                    { windowId: window.id, active: true },
                    tab => {
                        res(tab);
                    }
                );
            });
        } else {
            return this.getCurrentWindow().then(window => {
                chrome.tabs.create(
                    { windowId: (<any>window).id, active: true },
                    tab => {
                        return tab;
                    }
                );
            });
        }
    }

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
                            this.openNewMaxmizedWindow().then(window => {
                                windowInfo.window = window;
                                chrome.tabs.update(
                                    (<any>window).tabs[0].id,
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
        if (!this.allWindows) {
            return new Promise((res, rej) => {
                chrome.windows.getAll(
                    {
                        populate: true,
                        windowTypes: [
                            "normal",
                            "popup",
                            "panel",
                            "app",
                            "devtools"
                        ]
                    },
                    windows => {
                        this.allWindows = windows;
                        res(windows);
                    }
                );
            });
        } else {
            return this.allWindows;
        }
    }

    async getCurrentWindow() {
        if (!this.currentWindow) {
            return new Promise(res => {
                chrome.windows.getCurrent(window => {
                    this.currentWindow = window;
                    res(window);
                });
            });
        } else {
            return this.currentWindow;
        }
    }

    async createWindow() {
        return this.openNewMaxmizedWindow();
    }

    async getAllSessions() {
        return this.persistentService.getAllValues((v, k: string) => {
            return k && k.startsWith(GlobalConst.sessionIdPrefix);
        });
    }

    async updateSessionList() {
        return this.getAllSessions().then(sessions => {
            this.sessionChangedSubject.next(sessions);
        });
    }

    async restoreSession(session) {
        return this.openInNewWindow(session.tabs);
    }

    async deleteSession(session) {
        await this.persistentService.delete(session.id);
        return this.updateSessionList();
    }

    async saveSession(session) {
        if (session) {
            await this.persistentService.save(session.id, session);
            return this.updateSessionList();
        }
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

    async reloadWindows(windows=this.targetWindows) {
        if (windows) {
            let tabs = [];
            _.forEach(windows, window => {
                _.forEach(window.tabs, tab => {
                    tabs.push(tab);
                });
            });
            return this.reloadTabs(tabs);
        }
    }

    async openInNewWindow(tabs = this.targetTabs) {
        if (tabs) {
            return new Promise((res, rej) => {
                this.openNewMaxmizedWindow().then(window => {
                    let isFirst = true;
                    Promise.sequenceHandleAll(tabs, async (tab, callback) => {
                        if (isFirst) {
                            chrome.tabs.update(
                                (<any>window).tabs[0].id,
                                { url: tab.url },
                                () => {
                                    isFirst = false;
                                    callback();
                                }
                            );
                        } else {
                            chrome.tabs.create(
                                { url: tab.url, windowId: (<any>window).id },
                                () => {
                                    callback();
                                }
                            );
                        }
                    })
                        .then(() => res())
                        .catch(e => rej(e));
                });
            });
        }
    }

    async moveToNewWindow(tabs = this.targetTabs) {
        if (tabs) {
            return new Promise((res, rej) => {
                this.openNewMaxmizedWindow().then(window => {
                    let isFirst = true;
                    Promise.sequenceHandleAll(tabs, (tab, callback) => {
                        if (isFirst) {
                            isFirst = false;
                            chrome.tabs.update(
                                (<any>window).tabs[0].id,
                                { url: tab.url },
                                callback
                            );
                        } else {
                            chrome.tabs.create(
                                { url: tab.url, windowId: (<any>window).id },
                                callback
                            );
                        }
                    }).then(() => this.closeTabs(tabs));
                });
            });
        }
    }

    clearAllTargets() {
        this.targetTabs = null;
        this.targetWindows = null;
    }

    clearAllSelected() {
        if (this.allTabs) {
            _.forEach(this.allTabs, tab => {
                tab.isSelected = false;
            });
        }

        if (this.allWindows) {
            _.forEach(this.allWindows, window => {
                window.isSelected = false;
            });
        }
    }

    clearAll() {
        this.clearAllSelected();
        this.clearAllTargets();
    }

    //Browser status monitors, TODO:fix allWindows may be not properly updated tabs
    protected startMonitorBrowser() {
        this._browserListeners.set(
            Subjects.tabs_onUpdated,
            (tabId, changeInfo) => {
                let tab = _.find(this.allTabs, tab => tab.id === tabId);
                if (tab) {
                    _.assign(tab, changeInfo);
                }
                this.tabChangedSubject.next({
                    type: Subjects.tabs_onUpdated,
                    data: { tab }
                });
            }
        );
        this._browserListeners.set(
            Subjects.tabs_onRemoved,
            (tabId, removeInfo) => {
                _.remove(this.allTabs, tab => {
                    return tab.id === tabId;
                });
                this.tabChangedSubject.next({
                    type: Subjects.tabs_onRemoved,
                    data: { tabId, windowId: removeInfo.windowId }
                });
            }
        );
        this._browserListeners.set(Subjects.tabs_onCreated, tab => {
            this.allTabs.push(tab);
            this.tabChangedSubject.next({
                type: Subjects.tabs_onCreated,
                data: { tab }
            });
        });
        this._browserListeners.set(Subjects.tabs_onActivated, activeInfo => {
            let tab = _.find(
                this.allTabs,
                tab =>
                    tab.id === activeInfo.tabId &&
                    tab.windowId === activeInfo.windowId
            );
            if (tab) {
                tab.active = true;
                this.tabChangedSubject.next({
                    type: Subjects.tabs_onActivated,
                    data: { tab }
                });
            }
        });

        this._browserListeners.set(Subjects.windows_onRemoved, windowId => {
            _.remove(this.allWindows, window => window.id === windowId);
            this.windowChangedSubject.next({
                type: Subjects.windows_onRemoved,
                data: { windowId }
            });
        });
        this._browserListeners.set(Subjects.windows_onCreated, window => {
            this.allWindows.push(window);
            this.windowChangedSubject.next({
                type: Subjects.windows_onCreated,
                data: { window }
            });
        });
        this._browserListeners.set(
            Subjects.windows_onFocusChanged,
            windowId => {
                if (windowId !== chrome.windows.WINDOW_ID_NONE) {
                    if (this.currentWindow) {
                        this.currentWindow.focused = false;
                    }
                    let window = _.find(
                        this.allWindows,
                        window => window.id === windowId
                    );
                    this.currentWindow = window;
                } else {
                    if (this.currentWindow) {
                        this.currentWindow.focused = false;
                    }
                    this.currentWindow = null;
                }

                this.windowChangedSubject.next({
                    type: Subjects.windows_onFocusChanged,
                    data: { windowId }
                });
            }
        );

        this._browserListeners.forEach((listener, eventKeys) => {
            let keys = eventKeys.split(".");
            let apiEntry = chrome;
            for (let k of keys) {
                apiEntry = apiEntry[k];
            }
            (<any>apiEntry).addListener(listener);
        });
    }

    protected stopMonitorBrowser() {
        this._browserListeners.forEach((listener, eventKeys) => {
            let keys = eventKeys.split(".");
            let apiEntry = chrome;
            for (let k of keys) {
                apiEntry = apiEntry[k];
            }
            (<any>apiEntry).removeListener(listener);
        });
    }

    protected openNewMaxmizedWindow() {
        return new Promise((res, rej) => {
            chrome.windows.create({ state: WindowStates.maximized }, window => {
                if (chrome.runtime.lastError) {
                    rej(chrome.runtime.lastError);
                } else {
                    res(window);
                }
            });
        });
    }
}
