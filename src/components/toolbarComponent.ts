import { OnInit, Component } from "@angular/core";

import { BrowserService } from "../services/browserService";


@Component({
	selector:"ng-toolbar",
	templateUrl:'./toolbarComponent.html',
	styleUrls:['./toolbarComponent.css']
})
export class ToolbarComponent implements OnInit{
	constructor(private browserService:BrowserService){

	}
	ngOnInit(): void {
	}

	public onClickPinTabs(){
		this.browserService.pinTabs();
	}

	public onClickCloseTabs(){
		this.browserService.closeTabs();
	}

	public onClickUndoCloseTabs(){
		this.browserService.undoCloseTabs();
	}

	public onClickCloseWindows(){
		this.browserService.closeWindows();
	}

	public onClickRefreshTabs(){
		this.browserService.reloadTabs();
	}

	public onClickRefreshAllTab(){
		this.browserService.reloadAllTabs();
	}

	public onClickOptions(){

	}

	public onClickMutedAll(){
		this.browserService.mutedAllTabs();
	}
}