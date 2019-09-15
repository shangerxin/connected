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
    maxWindowTitleLength: 50
};

export const DBBrowserKeys = {
    previousClosedTabsInfo: "previousClosedTabsInfo"
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
    toggleSessionList: "toggleSessionList",
    donate: "donate",
    options: "options",
    togglePinTabs: "togglePinTabs",
    closeTabs: "closeTabs",
    undoCloseTabs: "undoCloseTabs",
    refreshTabs: "refreshTabs",
    refreshAllTabs: "refreshAllTabs",
    multedAllTabs: "muteAllTabs",
    openNewInWindow: "openNewInWindow",
    moveToNewWindow: "moveToNewWindow"
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
