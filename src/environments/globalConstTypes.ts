export const GlobalConst = {
    chromeUrlPrefix: "chrome",
    tabUpdateStatusComplete: "complete",
    sessionIdPrefix: "session:",
    notFound: -1,
    crumbMaxLength: 10,
    success: 0,
    failed: -1,
    pass: 0,
    failure: -1,
    maxWindowTitleLength: 50,
    maxRecordStatisticCount: 2,
    aboutblank: "about:blank"
};

export const DonateVendors = {
    paypal: "paypal",
    alipay: "alipay",
    wechat: "wechat"
};

export const KeyCode = {
    enter: 13
};

export const DBBrowserKeys = {
    previousClosedTabsInfo: "previousClosedTabsInfo",
    commandStatisticInfo: "commandStatisticInfo"
};

export const Subjects = {
    tabs_onUpdated: "tabs.onUpdated",
    tabs_onRemoved: "tabs.onRemoved",
    tabs_onCreated: "tabs.onCreated",
    tabs_onActivated: "tabs.onActivated",
    windows_onRemoved: "windows.onRemoved",
    windows_onCreated: "windows.onCreated",
    windows_onFocusChanged: "windows.onFocusChanged"
};

export const CommandTypes = {
    closeTabs: "closeTabs",
    closeWindow: "closeWindow",
    clearFilter: "clearFilter",
    deleteSession: "deleteSession",
    donate: "donate",
    downloadSessionAsJSON: "downloadSessionAsJSON",
    focusTab: "focusTab",
    focusWindow: "focusWindow",
    moveToNewWindow: "moveToNewWindow",
    multedAllTabs: "muteAllTabs",
    importSession: "importSession",
    openNewInWindow: "openNewInWindow",
    options: "options",
    refreshTabs: "refreshTabs",
    refreshWindow: "refreshWindow",
    refreshAllTabs: "refreshAllTabs",
    restoreSession: "restoreSession",
    saveSession: "saveSession",
    togglePinTabs: "togglePinTabs",
    toggleSessionList: "toggleSessionList",
    reopenClosedTabs: "reopenClosedTabs",
    selectAllTabs: "selectAllTabs"
};

export const WindowStates = {
    maximized: "maximized",
    normal: "normal",
    minimized: "minimized",
    fullscreen: "fullscreen"
};

export const WindowType = {
    normal: "normal",
    popup: "popup",
    panel: "panel",
    app: "app",
    devtools: "devtools",
    allTypes: ["normal", "popup", "panel", "app", "devtools"]
};
