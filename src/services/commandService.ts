import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";
import * as _ from "lodash";
import "../extends/extendPromise";

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