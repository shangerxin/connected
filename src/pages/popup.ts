import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TabListComponent } from "../components/tabListComponent";
import { ToolbarComponent } from "../components/toolbarComponent";
import { FilterComponent } from "../components/filterComponent";
import { BreadcrumbsComponent } from "../components/breadcrumbsComponent";
import { SessionListComponent } from "../components/sessionListComponent";
import { InputSessionNameDialogComponent } from "../dialogs/saveSessionDialog";

import "bootstrap/dist/css/bootstrap.min.css";

@NgModule({
    imports: [BrowserModule, FormsModule, NgbModule],
    providers: [],
    declarations: [
        TabListComponent,
        ToolbarComponent,
        FilterComponent,
        InputSessionNameDialogComponent,
        SessionListComponent
    ],
    exports: [],
    bootstrap: [
        TabListComponent,
        ToolbarComponent,
        FilterComponent
    ]
})
export class PopupModule {
}
