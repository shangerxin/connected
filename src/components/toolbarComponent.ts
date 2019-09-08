import { OnInit, Component, Output, EventEmitter } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { CommandService } from "../services/commandService";
import { GlobalConst, CommandTypes } from "../environments/globalConstTypes";

@Component({
    selector: "ng-toolbar",
    templateUrl: "./toolbarComponent.html",
    styleUrls: ["./toolbarComponent.css"]
})
export class ToolbarComponent implements OnInit {
    public isDisplaySessionList = false;
    constructor(
        private browserService: BrowserService,
        private commandService: CommandService
    ) {}
    ngOnInit(): void {}

    public onClickDonate(){
        this.commandService.commandSubject.next({
            type: CommandTypes.donate,
            args: {}
        });
    }

    public onClickPinTabs() {
        this.browserService.togglePinTabs();
    }

    public onClickCloseTabs() {
        this.browserService.closeTabs();
    }

    public onClickUndoCloseTabs() {
        this.browserService.undoCloseTabs();
    }

    public onClickRefreshTabs() {
        this.browserService.reloadTabs();
    }

    public onClickRefreshAllTab() {
        this.browserService.reloadAllTabs();
    }

    public onClickOptions() {
        this.commandService.commandSubject.next({
            type: CommandTypes.options,
            args: {}
        });
    }

    public onClickMutedAll() {
        this.browserService.toggleMutedAllTabs();
    }

    public onClickOpenInNewWindow() {
        this.browserService.openInNewWindow();
    }

    public onClickMoveToNewWindow(){
        this.browserService.moveToNewWindow();
    }

    public onClickToggleSessionList() {
        this.isDisplaySessionList = !this.isDisplaySessionList;
        this.commandService.commandSubject.next({
            type: CommandTypes.toggleSessionList,
            args: { isDisplaySessionList: this.isDisplaySessionList }
        });
        this.browserService.updateSessionList();
    }
}
