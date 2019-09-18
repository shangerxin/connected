import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TabListComponent } from "../components/tabListComponent";
import { ToolbarComponent } from "../components/toolbarComponent";
import { FilterComponent } from "../components/filterComponent";
import { TabComponent } from "../components/tabComponent";
import { SessionListComponent } from "../components/sessionListComponent";
import { InputSessionNameDialogComponent } from "../dialogs/saveSessionDialog";
import { DonateDialogComponent } from "../dialogs/donateDialog";

import "bootstrap/dist/css/bootstrap.min.css";

@NgModule({
    imports: [BrowserModule, FormsModule, NgbModule],
    providers: [],
    declarations: [
        DonateDialogComponent,
        FilterComponent,
        InputSessionNameDialogComponent,
        SessionListComponent,
        TabListComponent,
        ToolbarComponent,
        TabComponent,
    ],
    exports: [],
    bootstrap: [
        FilterComponent,
        TabListComponent,
        ToolbarComponent,
    ],
    entryComponents:[]
})
export class PopupModule {}

