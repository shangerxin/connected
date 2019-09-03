import * as _ from "lodash";

import { Injectable, OnDestroy, OnInit } from "@angular/core";
import "../extends/extendPromise";
import {
    DBBrowserKeys,
    GlobalConst,
    Subjects
} from "../environments/globalConstTypes";
import { PersistentService } from "../services/persistentService";
import { Subject, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CommandService implements OnInit, OnDestroy {
	commandSubject:Subject<any>;
	commandObservable:Observable<any>;
	constructor(){
		this.commandSubject = new Subject<any>();
		this.commandObservable = this.commandSubject.asObservable();
	}
	ngOnInit(): void {
	}
	ngOnDestroy(): void {
	}
	dispatch(command){
		this.commandSubject.next(command);
	}
}