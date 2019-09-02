import { GlobalConst } from "./environments/globalConstTypes";

export function getIconUrl(browserTab) {
    return browserTab.url &&
        browserTab.url.startsWith(GlobalConst.extensionUrlPrefix)
        ? "assets/images/chrome16.png"
        : browserTab.favIconUrl;
}

export function getWindowTitle(browserWindow) {
    if (browserWindow.tabs) {
        let title = browserWindow.tabs[0].title
            ? browserWindow.tabs[0].title
            : "";
        title =
            title.length > GlobalConst.maxWindowTitleLength
                ? title.substring(0, GlobalConst.maxWindowTitleLength) + "..."
                : title;
        return title;
    } else {
        return "";
    }
}