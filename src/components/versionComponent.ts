import { OnInit, Component } from "@angular/core";

import { EnvironmentService } from "../services/environmentService";

@Component({
    selector: "ng-version",
    templateUrl: "./versionComponent.html",
    styleUrls: ["./versionComponent.css"]
})
export class VersionComponent implements OnInit {
	protected _version;

	constructor(private environmentSerivce:EnvironmentService){
		this._version = this.environmentSerivce.extensionVersion;
	}
	ngOnInit(): void {
	}

	public get version(){
		return this._version;
	}
}