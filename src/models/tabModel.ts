import { getIconUrl } from "../utils";

export class TabModel {
    id;
    _tab;
    isFilterOut;
    url;
    isSelected;
    pinned;
    muted;
    isActive;
    iconUrl;
    title;

    static create(browserTab) {
        return <TabModel>{
            id: browserTab.id,
            _tab: browserTab,
            isFilterOut: false,
            url: browserTab.url,
            isSelected: false,

            pinned: browserTab.pinned,
            muted: browserTab.mutedInfo.muted,
            iconUrl: getIconUrl(browserTab),
            isActive: browserTab.active,
            title: browserTab.title
        };
    }

    static assign(tabModel: TabModel, browserTab) {
        if (tabModel.id === browserTab.id) {
            tabModel._tab = browserTab;
            tabModel.url = browserTab.url;
            tabModel.pinned = browserTab.pinned;
            tabModel.muted = browserTab.mutedInfo.muted;
            tabModel.iconUrl = getIconUrl(browserTab);

            tabModel.isActive = browserTab.active;
            tabModel.title = browserTab.title;
        }
    }

    static extend(tabModelA: TabModel, tabModelB: TabModel) {
        tabModelA._tab = tabModelB._tab;
        tabModelA.isFilterOut = tabModelB.isFilterOut;
        tabModelA.url = tabModelB.url;
        tabModelA.isSelected = tabModelB.isSelected;
        tabModelA.pinned = tabModelB.pinned;
        
        tabModelA.muted = tabModelB.muted;
        tabModelA.iconUrl = tabModelB.iconUrl;
        tabModelA.isActive = tabModelB.isActive;
        tabModelA.title = tabModelB.title;
    }
}
