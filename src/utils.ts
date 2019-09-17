import { GlobalConst } from "./environments/globalConstTypes";

export function getIconUrl(browserTab) {
    return browserTab.url &&
        browserTab.url.startsWith(GlobalConst.chromeUrlPrefix)
        ? "assets/images/chrome16.png"
        : browserTab.favIconUrl;
}

export function generateWindowTitle(browserWindow) {
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

export function generateTextContentUrl(content){
    let blob = new Blob([JSON.stringify(content)], {type: "text/plain"});
    return URL.createObjectURL(blob);
}

export function getZipContentUrl(content){

}
