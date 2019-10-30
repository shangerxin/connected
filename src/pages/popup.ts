import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

import { TabListComponent } from "../components/tabListComponent";
import { ToolbarComponent } from "../components/toolbarComponent";
import { FilterComponent } from "../components/filterComponent";
import { TabComponent } from "../components/tabComponent";
import { SessionListComponent } from "../components/sessionListComponent";
import { VersionComponent } from "../components/versionComponent";

import { InputSessionNameDialogComponent } from "../dialogs/saveSessionDialog";
import { DonateDialogComponent } from "../dialogs/donateDialog";

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserService } from "../services/browserService";
import { CommandService } from "../services/commandService";
import { CommunicatorService } from "../services/communicatorService";
import { FilterService } from "../services/filterService";
import { HistoryService } from "../services/historyService";
import { LogService } from "../services/logService";
import { PersistentService } from "../services/persistentService";
import { StatisticService } from "../services/statisticService";
import { ToastService } from "../services/toastService";
import { EnvironmentService } from "../services/environmentService";

@NgModule({
    imports: [BrowserModule, FormsModule, CommonModule, NgbModule],
    exports: [],
    entryComponents: [
        TabComponent,
        SessionListComponent,
        InputSessionNameDialogComponent
    ],
    providers: [
        BrowserService,
        CommandService,
        CommunicatorService,
        FilterService,
        HistoryService,
        LogService,
        PersistentService,
        StatisticService,
        ToastService,
        EnvironmentService
    ],
    declarations: [
        DonateDialogComponent,
        FilterComponent,
        InputSessionNameDialogComponent,
        SessionListComponent,
        TabListComponent,
        ToolbarComponent,
        TabComponent,
        VersionComponent
    ],
    bootstrap: [
        FilterComponent,
        TabListComponent,
        ToolbarComponent,
        VersionComponent
    ]
})
export class PopupModule {}
