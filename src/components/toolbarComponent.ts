import { OnInit, Component, Output, EventEmitter } from "@angular/core";

import { BrowserService } from "../services/browserService";
import { CommandService } from "../services/commandService";
import { GlobalConst, CommandTypes } from "../environments/globalConstTypes";
import * as _ from "lodash";
import { PersistentService } from "src/services/persistentService";

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

    public async onClickDonate() {
        this.commandService.commandSubject.next({
            type: CommandTypes.donate,
            args: {}
        });
    }

    public async onClickTogglePinTabs() {
        this.commandService.commandSubject.next({
            type: CommandTypes.togglePinTabs,
            args: {}
        });
        await this.browserService.togglePinTabs();
    }

    public async onClickCloseTabs() {
        this.browserService.closeTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.closeTabs,
            args: {}
        });
    }

    public async onClickUndoCloseTabs() {
        this.browserService.undoCloseTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.undoCloseTabs,
            args: {}
        });
    }

    public async onClickRefreshTabs() {
        this.browserService.reloadTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.refreshTabs,
            args: {}
        });
    }

    public async onClickRefreshAllTab() {
        this.browserService.reloadAllTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.refreshAllTabs,
            args: {}
        });
    }

    public async onClickOptions() {
        this.commandService.commandSubject.next({
            type: CommandTypes.options,
            args: {}
        });
    }

    public async onClickMutedAll() {
        this.browserService.toggleMutedAllTabs();
        this.commandService.commandSubject.next({
            type: CommandTypes.multedAllTabs,
            args: {}
        });
    }

    public async onClickOpenInNewWindow() {
        this.browserService.openInNewWindow();
        this.commandService.commandSubject.next({
            type: CommandTypes.openNewInWindow,
            args: {}
        });
    }

    public async onClickMoveToNewWindow() {
        this.browserService.moveToNewWindow();
        this.commandService.commandSubject.next({
            type: CommandTypes.moveToNewWindow,
            args: {}
        });
    }

    public async onClickToggleSessionList() {
        this.isDisplaySessionList = !this.isDisplaySessionList;
        this.commandService.commandSubject.next({
            type: CommandTypes.toggleSessionList,
            args: { isDisplaySessionList: this.isDisplaySessionList }
        });
        this.browserService.updateSessionList();
    }

    public async onClickImportSession(uploadSessionFile){
        if(!uploadSessionFile.changedListener){
            uploadSessionFile.changedListener = (evt)=>{
                let files = evt.target.files;
                _.forEach(files, file=>{
                    let reader = new FileReader();
                    reader.onload = ()=>{
                        try{
                            let session = JSON.parse(<string>reader.result);
                            this.browserService.saveSession(session);
                        }
                        catch{}
                    };
                    reader.readAsText(file);
                });
            };
            uploadSessionFile.addEventListener("change", uploadSessionFile.changedListener);
        }
        uploadSessionFile.click();
    }
}
