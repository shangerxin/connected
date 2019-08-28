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
		return _.filter(this._allWindows, window=>{
			return window.tabs && window.tabs.length > 0;
		});
	}

	public onSelect(tab){
		tab.isSelected = tab.isSelected? false:true;
		if(tab.isSelected){
			this.selectedTabs.push(tab);
			this.browserService.targetTabs = this.selectedTabs;
		}
	}

	async getTabs(){
		this._allTabs = await this.browserService.getTabs();
	}

	async getWindows(){
		this._allWindows = await this.browserService.getWindows();
	}
};