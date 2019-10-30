import { Injectable, OnInit, OnDestroy } from "@angular/core";
import * as _ from "lodash";

@Injectable({ providedIn: "root" })
export class EnvironmentService implements OnInit, OnDestroy {
	ngOnDestroy(): void {
	}
	ngOnInit(): void {
	}

	public get browserAPI(){
		return chrome;
	}

	public get extensionVersion(){
		return this.browserAPI.runtime.getManifest().version;
	}
}