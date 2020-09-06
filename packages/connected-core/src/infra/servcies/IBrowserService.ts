namespace Connected {
    export interface IBrowserService {
        getTabs(windowIndexes?: Array<number>): Promise<Array<TabModel>>;
        getCurrentTab(): Promise<TabModel>;
        getDuplicateTabs(windowIndexes?: Array<number>);

        createTab(windowId?: number, url?: string): Promise<TabModel>;
        createTabs(
            windowId?: number,
            urls?: Array<string>
        ): Promise<Array<TabModel>>;

        togglePinTabs(tabs: Array<TabModel>): Promise<boolean>;

        closeTabs(tabs: Array<TabModel>): Promise<boolean>;
        closeTabs(tabs: Array<number>): Promise<boolean>;

        reloadTabs(tabs: Array<TabModel>): Promise<boolean>;
        reloadWindow(windowId: number): Promise<boolean>;

        toggleMutedTabs(tabs: Array<TabModel>);

        focusTab(tab: TabModel): Promise<boolean>;
        focusTab(tabId: number): Promise<boolean>;

        moveTabsToWindow(
            tabs: Array<TabModel>,
            windowId: number
        ): Promise<boolean>;
    }
}
