import { Injectable } from "@angular/core";

import * as _ from "lodash";

import { BrowserService } from "./browserService";
import { GlobalConst } from "../environments/globalConstTypes";
import "../extends/extendArray";

@Injectable({
    providedIn: "root"
})
export class HistoryService {
    private readonly _crumbMaxLength = GlobalConst.crumbMaxLength;
    private _tabs: any;
    public crumbs: Array<any>;
    constructor(browserSerivce: BrowserService) {
        this.crumbs = [];
        browserSerivce.getCurrentTab().then(tab => {
			if(tab){
				this.crumbs.push(tab);
			}
        });
    }
}
