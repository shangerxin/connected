import * as _ from "lodash";
import { OnInit, Component } from "@angular/core";

import {BrowserService} from "../services/browserService";
import {GlobalConst} from "../environments/globalConstTypes";


@Component({
	selector:"ng-tab-list",
	templateUrl:'./tabListComponent.html',
	styleUrls:['./tabListComponent.css']
})
export class TabListComponent implements OnInit{
	public selectedTabs = [];
	public selectedWindows = [];
	private _allTabs = null;
	private _allWindows = null;
	constructor(private browserService:BrowserService){
	}
	ngOnInit(): void {
		this.getTabs();
		this.getWindows();
	}


	public get tabs(){
		return this._allTabs;
	}

	public get windows(){
		return this._allWindows;
	}

	public onToggleSelected(tab){
		tab.isSelected = tab.isSelected? false:true;
		if(tab.isSelected){
			this.selectedTabs.push(tab);
			this.browserService.targetTabs = this.selectedTabs;
		}
	}

	public onDoubleClickTab(tab){
		this.selectedTabs = [tab];
		this.browserService.targetTabs = this.selectedTabs;
		this.browserService.focusTab(tab);
	}

	public onDoubleClickWindow(window){
		this.selectedWindows = [window];
		this.browserService.targetWindows = this.selectedWindows;
		this.browserService.forcusWindow(window);
	}

	async getTabs(){
		this._allTabs = await this.browserService.getTabs();
	}

	async getWindows(){
		this._allWindows = await this.browserService.getWindows();
		this._allWindows = _.map(this._allWindows, window =>{
			let title = window.tabs[0].title? window.tabs[0].title:'';
			window.title = title.length > GlobalConst.maxWindowTitleLength? title.substring(0, GlobalConst.maxWindowTitleLength) + '...':title;
			return window;
		});
	}

	async onSelectWindow(window){
		window.isSelected = window.isSelected? false:true;
		if(window.isSelected){
			this.selectedWindows.push(window);
			this.browserService.targetWindows = this.selectedWindows;
		}
	}

	async onClickCloseWindow(window){
		let targetWindows = [window];
		_.pull(this.selectedWindows, targetWindows);
		this.browserService.closeWindows(targetWindows);
	}
};