import * as _ from "lodash";
import { OnInit, Component } from "@angular/core";

import {BrowserService} from '../services/browserService';


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
		// return _.filter(this._allWindows, window=>{
		// 	return window.tabs && window.tabs.length > 0;
		// });
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
	}
};