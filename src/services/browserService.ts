import { Injectable, OnDestroy, OnInit } from "@angular/core";
import * as _ from "lodash";
import "../extends/extendPromise";
import {
    DBBrowserKeys,
    GlobalConst,
    Subjects,
    WindowStates,
    WindowType
} from "../environments/globalConstTypes";
import { PersistentService } from "../services/persistentService";
import { Subject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class BrowserService implements OnInit, OnDestroy {
    //TODO:Check targetTabs states are not sync with view model. Using the tabId
    //is safe. Check this issue in the future.
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

    ngOnInit(): void {}

    ngOnDestroy(): void {
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
    public async getAllTabs(): Promise<Array<any>> {
        let allTabs = [];
        return new Promise(res => {
            chrome.windows.getAll(
                { windowTypes: WindowType.allTypes, populate: true },
                windows => {
                    Promise.sequenceHandleAll(windows, (window, callback) => {
                        chrome.tabs.query({ windowId: window.id }, tabs => {
                            _.forEach(tabs, tab => allTabs.push(tab));
                            callback();
                        });
                    }).then(() => res(allTabs));
                }
            );
        });
    }

    public async getCurrentTab() {
        return new Promise(res => {
            chrome.tabs.getCurrent(tab => {
                res(tab);
            });
        });
    }

    public async createTab(window) {
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

    public async togglePinTabs(tabs = this.targetTabs) {
        if (tabs) {
            return Promise.sequenceHandleAll(
                _.map(tabs, tab => tab.id),
                (tabId, callback, result) => {
                    chrome.tabs.get(tabId, tab => {
                        callback(tab.pinned === true && result === true);
                    });
                },
                true
            ).then(isAllPinned => {
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
                });
            });
        }
    }

    public async closeTabs(tabs = this.targetTabs) {
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

    public async reloadTabs(tabs = this.targetTabs) {
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

    public async reloadAllTabs() {
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

    public async toggleMutedAllTabs() {
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

    public async focusTab(tab = null) {
        tab =
            tab ||
            (this.targetTabs &&
                this.targetTabs.length > 0 &&
                this.targetTabs[0]);
        if (tab) {
            return new Promise(res => {
                chrome.windows.get(tab.windowId, async window => {
                    await this.focusWindow(window);
                    chrome.tabs.update(tab.id, { active: true }, () => {
                        res();
                    });
                });
            });
        }
    }

    public async takeSnapshortForTabs() {}

    public async zoom(tab, factor) {}

    public async reopenClosedTabs() {
        if (this.previousClosedTabsInfo) {
            let windowInfo: any = {};
            return Promise.sequenceHandleAll(
                this.previousClosedTabsInfo,
                async (info, callback) => {
                    let allWindows = await this.getWindows();
                    let windowIds = new Set(
                        _.map(allWindows, window => window.id)
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
    public async getWindows(): Promise<Array<any>> {
        return new Promise(res => {
            chrome.windows.getAll(
                {
                    populate: true,
                    windowTypes: WindowType.allTypes
                },
                windows => res(windows)
            );
        });
    }

    public async getCurrentWindow() {
        return new Promise(res => {
            chrome.windows.getCurrent(window => {
                res(window);
            });
        });
    }

    public async createWindow() {
        return this.openNewMaxmizedWindow();
    }

    public async getAllSessions() {
        return this.persistentService.getAllValues((v, k: string) => {
            return k && k.startsWith(GlobalConst.sessionIdPrefix);
        });
    }

    public async updateSessionList() {
        return this.getAllSessions().then(sessions => {
            this.sessionChangedSubject.next(sessions);
        });
    }

    public async restoreSession(session) {
        return this.openTabsInNewWindow(session.tabs);
    }

    public async deleteSession(session) {
        await this.persistentService.delete(session.id);
        return this.updateSessionList();
    }

    public async saveSession(session) {
        if (session) {
            await this.persistentService.save(session.id, session);
            return this.updateSessionList();
        }
    }

    public async closeWindows(windows = this.targetWindows) {
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

    public async focusWindow(window = null) {
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

    public async reloadWindows(windows = this.targetWindows) {
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

    public async openUrlInNewWindow(url){
        return this.openNewMaxmizedWindow(url);
    }

    public async openTabsInNewWindow(tabs = this.targetTabs) {
        if (tabs) {
            return new Promise((res, rej) => {
                this.openNewMaxmizedWindow().then(window => {
                    let isFirst = true;
                    Promise.sequenceHandleAll(tabs, async (tab, callback) => {
                        if (isFirst) {
                            chrome.tabs.update(
                                (<any>window).tabs[0].id,
                                { url: tab.url, pinned: !!tab.pinned },
                                () => {
                                    isFirst = false;
                                    callback();
                                }
                            );
                        } else {
                            chrome.tabs.create(
                                {
                                    url: tab.url,
                                    windowId: (<any>window).id,
                                    pinned: !!tab.pinned
                                },
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

    public async moveToNewWindow(tabs = this.targetTabs) {
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

    public async download(url, filename) {
        return new Promise(res => {
            chrome.downloads.download(
                {
                    url,
                    filename,
                    saveAs: true
                },
                () => res()
            );
        });
    }

    public async clearAllTargets() {
        this.targetTabs = null;
        this.targetWindows = null;
    }

    public async clearAll() {
        await this.clearAllTargets();
    }

    protected async startMonitorBrowser() {
        this._browserListeners.set(
            Subjects.tabs_onUpdated,
            async (tabId, changeInfo) => {
                chrome.tabs.get(tabId, tab => {
                    if (tab) {
                        _.assign(tab, changeInfo);
                    }
                    this.tabChangedSubject.next({
                        type: Subjects.tabs_onUpdated,
                        data: { tab, changeInfo }
                    });
                });
            }
        );
        this._browserListeners.set(
            Subjects.tabs_onRemoved,
            async (tabId, removeInfo) => {
                this.tabChangedSubject.next({
                    type: Subjects.tabs_onRemoved,
                    data: { tabId, windowId: removeInfo.windowId }
                });
            }
        );
        this._browserListeners.set(Subjects.tabs_onCreated, async tab => {
            this.tabChangedSubject.next({
                type: Subjects.tabs_onCreated,
                data: { tab }
            });
        });
        this._browserListeners.set(Subjects.tabs_onActivated, activeInfo => {
            chrome.tabs.get(activeInfo.tabId, tab => {
                tab.active = true;
                this.tabChangedSubject.next({
                    type: Subjects.tabs_onActivated,
                    data: { tab }
                });
            });
        });

        this._browserListeners.set(Subjects.windows_onRemoved, windowId => {
            this.windowChangedSubject.next({
                type: Subjects.windows_onRemoved,
                data: { windowId }
            });
        });
        this._browserListeners.set(Subjects.windows_onCreated, window => {
            this.windowChangedSubject.next({
                type: Subjects.windows_onCreated,
                data: { window }
            });
        });
        this._browserListeners.set(
            Subjects.windows_onFocusChanged,
            windowId => {
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

    protected openNewMaxmizedWindow(url=GlobalConst.aboutblank) {
        return new Promise((res, rej) => {
            chrome.windows.create({ state: WindowStates.maximized, url }, window => {
                if (chrome.runtime.lastError) {
                    rej(chrome.runtime.lastError);
                } else {
                    res(window);
                }
            });
        });
    }
}
