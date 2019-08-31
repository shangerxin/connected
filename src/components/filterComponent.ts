import { OnInit, Component } from "@angular/core";
import { Observable } from "rxjs";
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

import {FilterService} from '../services/filterService';
import { BrowserService } from "../services/browserService";


@Component({
	selector:"ng-filter",
	templateUrl:'./filterComponent.html',
	styleUrls:['./filterComponent.css']
})
export class FilterComponent implements OnInit{
	public filter:any
	context:any;
	filterResult:any;

	constructor(private filterService:FilterService,
				private browserService:BrowserService){

	}
	ngOnInit(): void {
		this.updateContext();
	}

	async updateContext(){
		this.context = await this.browserService.getAllTabs();
	}

	public onKey(value:string){

	}

	public onClickResetFilter(){
		this.filter = "";
	}
}