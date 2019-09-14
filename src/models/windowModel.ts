import * as _ from "lodash";
import { TabModel } from "./tabModel";
import { getWindowTitle } from "../utils";

function createTabModels(browserWindow) {
    if (browserWindow.tabs) {
        return _.map(browserWindow.tabs, tab => TabModel.create(tab));
    } else {
        return [];
    }
}

export class WindowModel {
    id;
    _window;
    title;
    tabs;
    isSelected;
    isFocused;
    static create(browserWindow) {
        return <WindowModel>{
            id: browserWindow.id,
            _window: browserWindow,
            title: getWindowTitle(browserWindow),
            tabs: createTabModels(browserWindow),
            isSelected: false,
            isFocused: browserWindow.focused
        };
    }

    static assign(windowModel: WindowModel, browserWindow) {
        if (windowModel.id === browserWindow.id) {
            windowModel._window = browserWindow;
            windowModel.title = getWindowTitle(browserWindow);
            windowModel.tabs = createTabModels(browserWindow);
            windowModel.isFocused = browserWindow.focused;
        }
    }

    static extend(windowModelA: WindowModel, windowModelB:WindowModel){
        windowModelA._window = windowModelB._window;
        windowModelA.title = windowModelB.title;
        _.forEach(windowModelB.tabs, tabB=>{
            let tabA = _.find(windowModelA.tabs, tabA=>tabA.id === tabB.id);
            if(tabA){
                TabModel.extend(tabA, tabB);
            }
        });
        windowModelA.isSelected = windowModelB.isSelected;
        windowModelA.isFocused = windowModelB.isFocused;
    }
}
