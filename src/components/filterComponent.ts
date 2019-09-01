import { OnInit, Component } from "@angular/core";
import { BrowserService } from "../services/browserService";

@Component({
	selector:"ng-filter",
	templateUrl:'./filterComponent.html',
	styleUrls:['./filterComponent.css']
})
export class FilterComponent implements OnInit{
	public filter:any
	filterResult:any;

	constructor(private browserService:BrowserService){

	}
	ngOnInit(): void {
	}

	public onKey(value:string){

	}

	public onClickResetFilter(){
		this.filter = "";
		this.browserService.clearAll();
	}
}