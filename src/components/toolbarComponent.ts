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

	}

	public onClickCloseTabs(){

	}

	public onClickUndoCloseTabs(){

	}

	public onClickCloseWindows(){

	}

	public onClickRefreshTabs(){

	}

	public onClickRefreshAllTab(){

	}

	public onClickOptions(){

	}

	public onClickMutedAll(){

	}
}