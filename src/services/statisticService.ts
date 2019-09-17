import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { PersistentService } from "./persistentService";
import { CommandService } from "./commandService";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { DBBrowserKeys, GlobalConst } from "../environments/globalConstTypes";

@Injectable({ providedIn: "root" })
export class StatisticService implements OnInit, OnDestroy {
    protected statisticInfo;
    protected isInited = false;
    protected isStartMonitor = false;
    protected recordedCount = 0;

    private _subscriptions: Array<Subscription> = [];
    constructor(
        private persistentService: PersistentService,
        private commandService: CommandService
    ) {
        this.persistentService
            .get(DBBrowserKeys.commandStatisticInfo)
            .then(info => {
                this.statisticInfo = info;
                this.isInited = true;
            });
    }
    startMonitor() {
        if (!this.isStartMonitor) {
            this._subscriptions.push(
                this.commandService.commandObservable.subscribe(command =>
                    this.record(command)
                )
            );
            this.isStartMonitor = true;
            if (!this.isInited) {
                this.statisticInfo = {};
                this.isInited = true;
            }
        }
    }

    stopMonitor() {
        if (this.isStartMonitor) {
            _.forEach(this._subscriptions, sub => sub.unsubscribe());
            this.persistentService.save(
                DBBrowserKeys.commandStatisticInfo,
                this.statisticInfo
            );
            this.isStartMonitor = false;
        }
    }

    ngOnInit(): void {
        this.persistentService
            .get(DBBrowserKeys.commandStatisticInfo)
            .then(info => {
                if (info) {
                    this.statisticInfo = info;
                    this.isInited = true;
                }
            });
    }

    ngOnDestroy(): void {
        this.stopMonitor();
    }

    protected record(command) {
        if (this.statisticInfo[command.type]) {
            this.statisticInfo[command.type] += 1;
        } else {
            this.statisticInfo[command.type] = 1;
        }
        this.recordedCount += 1;
        if (this.recordedCount > GlobalConst.maxRecordStatisticCount) {
            this.persistentService.save(
                DBBrowserKeys.commandStatisticInfo,
                this.statisticInfo
            );
            this.recordedCount = 0;
        }
    }
}
