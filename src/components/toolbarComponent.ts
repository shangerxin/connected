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

    public onClickTogglePinTabs() {
        this.browserService.togglePinTabs().then(()=>{
            this.commandService.commandSubject.next({
                type: CommandTypes.togglePinTabs,
                args: {}
            });
        });
    }

    public onClickCloseTabs() {
        this.browserService.closeTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.closeTabs,
            args: {}
        });
    }

    public onClickUndoCloseTabs() {
        this.browserService.undoCloseTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.undoCloseTabs,
            args: {}
        });
    }

    public onClickRefreshTabs() {
        this.browserService.reloadTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.refreshTabs,
            args: {}
        });
    }

    public onClickRefreshAllTab() {
        this.browserService.reloadAllTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.refreshAllTabs,
            args: {}
        });
    }

    public onClickOptions() {
        this.commandService.commandSubject.next({
            type: CommandTypes.options,
            args: {}
        });
    }

    public onClickMutedAll() {
        this.browserService.toggleMutedAllTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.multedAllTabs,
            args: {}
        });
    }

    public onClickOpenInNewWindow() {
        this.browserService.openInNewWindow();
        this.commandService.commandSubject.next({
            type: CommandTypes.openNewInWindow,
            args: {}
        });
    }

    public onClickMoveToNewWindow(){
        this.browserService.moveToNewWindow();
        this.commandService.commandSubject.next({
            type: CommandTypes.moveToNewWindow,
            args: {}
        });
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
